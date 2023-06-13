import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";

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
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Check if user exists and check user credentials
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  if (user && !user.password) {
    return NextResponse.json({ error: "Please login using your OAuth account" }, { status: 400 });
  }

  const isMatchingPassword = await bcrypt.compare(body.password, user.password as string);

  if (isMatchingPassword) {
    const { password, ...userWithoutPassword } = user;
    const accessToken = signJwtAccessToken(userWithoutPassword);
    const result = {
      ...userWithoutPassword,
      accessToken,
    };
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json({ error: "Incorrect Password" }, { status: 400 });
  }
}
