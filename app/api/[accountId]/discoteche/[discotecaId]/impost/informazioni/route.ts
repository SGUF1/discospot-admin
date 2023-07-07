import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const body = await req.json();
    const { descrizione, numeroInformazione, tipoInformazioneId } = body;

    if (!descrizione) {
      return new NextResponse("Descrizione is required", { status: 400 });
    }
    if (!numeroInformazione) {
      return new NextResponse("Numero dell'informazione is required", {
        status: 400,
      });
    }
    if (!tipoInformazioneId) {
      return new NextResponse("Tipo is required", { status: 400 });
    }

    const informazione = await prismadb.informazione.create({
      data: {
        descrizione,
        numeroInformazione,
        discotecaId: params.discotecaId,
        tipoInformazioneId
      },
    });

    return NextResponse.json(informazione);
  } catch (error) {
    console.log("[INFORMAZIONE POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const informazioni = await prismadb.informazione.findMany({
      where: {
        discotecaId: params.discotecaId,
      },
    });

    return NextResponse.json(informazioni);
  } catch (error) {
    console.log("[INFORMAZIONE GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
