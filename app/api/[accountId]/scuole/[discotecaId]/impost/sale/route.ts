import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const body = await req.json();
    const { nome, informations, imageUrl, pianoId, statoId, date } = body;

    if (!informations) {
      return new NextResponse("Descrizione is required", { status: 400 });
    }
    if (!nome) {
      return new NextResponse("Nome della sala is required", {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new NextResponse("Immagine della sala is required", {
        status: 400,
      });
    }
    if (!pianoId) {
      return new NextResponse("Piano della sala is required", { status: 400 });
    }
    if (!statoId) {
      return new NextResponse("Sala Id is required", { status: 400 });
    }

    const sala = await prismadb.sala.create({
      data: {
        nome,
        imageUrl,
        discotecaId: params.discotecaId,
        pianoId,
        statoId,
        date: {
          createMany: {
            data: date.map((item: any) => ({
              data: item.data,
              discotecaId: params.discotecaId,
            })),
          },
        },
        informazioni: {
          createMany: {
            data: informations.map((item: any) => ({
              descrizione: item.descrizione,
              numeroInformazione: item.numeroInformazione,
              tipoInformazioneId: item.tipoInformazioneId,
            })),
          },
        },
      },
    });
      const piano = await prismadb.piano.update({
        where: {
          id: pianoId,
        },
        data: {
          discoteca: {
			connect: {
				id: params.discotecaId
			}
		  }
        },
      });
    return NextResponse.json(sala);
  } catch (error) {
    console.log("[SALA POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const sala = await prismadb.sala.findMany({
      where: {
        discotecaId: params.discotecaId,
      },
    });

    return NextResponse.json(sala);
  } catch (error) {
    console.log("[SALA GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
