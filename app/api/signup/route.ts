import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import { isTemporaryEmail } from "temporary-email-validator";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";

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
      valid: validator.isLength(body.name, { min: 2, max: 30 }),
      errorMessage: "Name must be between 2 and 30 characters",
    },
    {
      valid: validator.isEmail(body.email),
      errorMessage: "Email is not valid",
    },
    {
      valid: isTemporaryEmail(body.email) === false,
      errorMessage: "Do not use a temporary email address",
    },
    {
      valid: validator.isStrongPassword(body.password),
      errorMessage: "Weak password",
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
    return NextResponse.json({ errorMessage: errorMessage }, { status: 400 });
  }

  // Check if user exists
  const userByEmail = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  // Send error if user exists
  if (userByEmail) {
    return NextResponse.json({ errorMessage: "Email already exists, please sign in" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  //create user in db using prisma client
  //Note try upsert instead of create next time
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = user;
  const accessToken = signJwtAccessToken(userWithoutPassword);
  const result = {
    ...userWithoutPassword,
    accessToken,
  };
  return NextResponse.json(result, { status: 200 });
}
