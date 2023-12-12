import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; informazioneId: string };
  }
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

    const informazione = await prismadb.informazione.update({
      where: {
        id: params.informazioneId,
      },
      data: {
        descrizione,
        numeroInformazione,
        tipoInformazioneId,
      },
    });

    return NextResponse.json(informazione);
  } catch (error) {
    console.log("[INFORMAZIONE PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; informazioneId: string };
  }
) {
  try {
    const informazione = await prismadb.informazione.delete({
      where: {
        id: params.informazioneId,
      },
    });

    return NextResponse.json(informazione);
  } catch (error) {
    console.log("[INFORMAZIONE DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; informazioneId: string };
  }
) {
  try {
    const informazione = await prismadb.informazione.findUnique({
      where: {
        id: params.informazioneId,
      },
      
    });

    return NextResponse.json(informazione);
  } catch (error) {
    console.log("[INFORMAZIONE GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
