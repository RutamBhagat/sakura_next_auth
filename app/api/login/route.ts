import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";
import { use } from "react";

type RequestBody = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();

  // Data validation
  const validationSchema = [
    {
      valid: validator.isEmail(body.email),
      errorMessage: "Email is not valid",
    },
    {
      valid: validator.isStrongPassword(body.password),
      errorMessage: "Password is invalid",
    },
  ];

  let hasError = false;
  let errorMessage = "";
  for (let check of validationSchema) {
    if (check.valid === false) {
      hasError = true;
      errorMessage = check.errorMessage;
      break;
    }
  }
  if (hasError) {
    // return NextResponse.json({ errorMessage: errorMessage }, { status: 400 });
    return new Response(JSON.stringify(null));
  }

  // Check if user exists and check user credentials
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPassword } = user;
    const accessToken = signJwtAccessToken(userWithoutPassword);
    const result = {
      ...userWithoutPassword,
      accessToken,
    };
    return NextResponse.json(result, { status: 200 });
  } else {
    return new Response(JSON.stringify(null));
  }
}
