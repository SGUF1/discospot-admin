import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; salaId: string };
  }
) {
  try {
    const body = await req.json();
    const { nome, informations, imageUrl, pianoId, statoId, date } = body;
    if (!informations) {
      return new NextResponse("informations is required", { status: 400 });
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

    const sala = await prismadb.sala.update({
      where: {
        id: params.salaId,
      },
      data: {
        nome,
        imageUrl,
        pianoId,
        statoId,
        date: {
          deleteMany: {},
          createMany: {
            data: date.map((item: any) => ({
              data: item.data,
              discotecaId: params.discotecaId,
            })),
          },
        },
        informazioni: {
          deleteMany: {},
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
              id: params.discotecaId,
            },
          },
        },
      });
    return NextResponse.json(sala);
  } catch (error) {
    console.log("[SALA PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; salaId: string };
  }
) {
  try {
    const sala = await prismadb.sala.delete({
      where: {
        id: params.salaId,
      },
      include: {
        tavoli: true,
      },
    });

    return NextResponse.json(sala);
  } catch (error) {
    console.log("[SALA DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; salaId: string };
  }
) {
  try {
    const sala = await prismadb.sala.findUnique({
      where: {
        id: params.salaId,
      },
    });

    return NextResponse.json(sala);
  } catch (error) {
    console.log("[SALA GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
