import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Data validation
  const validationSchema = [
    {
      valid: validator.isEmail(body.email),
      errorMessage: "Email is not valid",
    },
    {
      valid: validator.isStrongPassword(body.password),
      errorMessage: "Weak password",
    },
    {
      valid: body.password === body.confirm_password,
      errorMessage: "Passwords do not match",
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

  // Check if user exists
  const userByEmail = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  // Send error if user exists
  if (!userByEmail) {
    return NextResponse.json({ error: "Email does not exists, please sign up" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  //update user password in db using prisma client
  const user = await prisma.user.update({
    where: { email: body.email },
    data: { password: hashedPassword },
  });

  const { password, ...userWithoutPassword } = user;
  const accessToken = signJwtAccessToken(userWithoutPassword);
  const result = {
    ...userWithoutPassword,
    accessToken,
  };
  return NextResponse.json(result, { status: 200 });
}
