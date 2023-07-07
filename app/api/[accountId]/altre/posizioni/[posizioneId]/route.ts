import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; posizioneId: string } }
) {
  try {
    const body = await req.json();
    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }

    const posizione = await prismadb.posizione.update({
      where: {
        id: params.posizioneId,
      },
      data: {
        nome,
      },
    });
    return NextResponse.json(posizione);
  } catch (error) {
    console.log("[POSIZIONE PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; posizioneId: string } }
) {
  try {
    const posizione = await prismadb.posizione.delete({
      where: {
        id: params.posizioneId,
      },
    });

    return NextResponse.json(posizione);
  } catch (error) {
    console.log("[POSIZIONE DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; posizioneId: string } }
) {
  try {
    const posizione = await prismadb.posizione.findUnique({
      where: {
        id: params.posizioneId,
      },
    });

    return NextResponse.json(posizione);
  } catch (error) {
    console.log("[POSIZIONE GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
