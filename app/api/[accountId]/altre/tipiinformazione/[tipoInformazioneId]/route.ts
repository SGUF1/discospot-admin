import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; tipoInformazioneId: string } }
) {
  try {
    const body = await req.json();
    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }
    
    const tipo = await prismadb.tipoInformazione.update({
      where: {
        id: params.tipoInformazioneId,
      },
      data: {
        nome
      },
    });
    return NextResponse.json(tipo);
  } catch (error) {
    console.log("[TIPO INFORMAZIONE PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; tipoInformazioneId: string } }
) {
  try {

    const tipo = await prismadb.tipoInformazione.delete({
      where: {
        id: params.tipoInformazioneId,
      },
    });

    return NextResponse.json(tipo);
  } catch (error) {
    console.log("[TIPO INFORMAZIONE DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; tipoInformazioneId: string } }
) {
  try {
    const tipo = await prismadb.tipoInformazione.findUnique({
      where: {
        id: params.tipoInformazioneId,
      },
    });

    return NextResponse.json(tipo);
  } catch (error) {
    console.log("[TIPO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
