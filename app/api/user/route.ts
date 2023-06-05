import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

type RequestBody = {
  name: string;
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();

  // Data validation
  const validationSchema = [
    {
      valid: validator.isEmpty(body.name) === false,
      errorMessage: "Email is not valid",
    },
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
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  user = await prisma.user.create({
    data: { name: body.name, email: body.email, password: await bcrypt.hash(body.password, 10) },
  });

  const { password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword, { status: 200 });
}
