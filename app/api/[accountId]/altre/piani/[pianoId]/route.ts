import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; pianoId: string } }
) {
  try {
    const body = await req.json();
    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }

    const piano = await prismadb.piano.update({
      where: {
        id: params.pianoId,
      },
      data: {
        nome,
      },
    });
    return NextResponse.json(piano);
  } catch (error) {
    console.log("[PIANO PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; pianoId: string } }
) {
  try {
    const piano = await prismadb.piano.delete({
      where: {
        id: params.pianoId,
      },
    });

    return NextResponse.json(piano);
  } catch (error) {
    console.log("[PIANO DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; pianoId: string } }
) {
  try {
    const piano = await prismadb.piano.findUnique({
      where: {
        id: params.pianoId,
      },
    });

    return NextResponse.json(piano);
  } catch (error) {
    console.log("[PIANO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
