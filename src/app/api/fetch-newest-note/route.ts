import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";

  const newestNote = await prisma.note.findFirst({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      text: true,
    },
  });

  return NextResponse.json({ newestNoteId: newestNote?.id });
}
