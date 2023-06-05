import { signJwtAccessToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { userWithoutToken } = body;
  const accessToken = signJwtAccessToken(userWithoutToken);
  return NextResponse.json(accessToken, { status: 200 });
}
