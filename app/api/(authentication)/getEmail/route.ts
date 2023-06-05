import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  //Token decoding and extracting email from it
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const payload = jwt.decode(token!);

  //   @ts-ignore
  if (!payload.email) {
    return NextResponse.json({ error: "Unauthorized request", token }, { status: 401 });
  }

  return NextResponse.json(
    //   @ts-ignore
    { email: payload.email },
    { status: 200 }
  );
}
