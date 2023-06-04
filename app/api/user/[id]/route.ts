import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  const accessToken = request.headers.get("Authorization");

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPost = await prisma.post.findMany({
    where: {
      authorId: Number(params.id),
    },
    include: {
      author: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
  return NextResponse.json(userPost, { status: 200 });
}
