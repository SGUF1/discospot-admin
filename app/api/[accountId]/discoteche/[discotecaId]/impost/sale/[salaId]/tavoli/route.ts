import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string, salaId: string } }
) {
  try {
    const body = await req.json();
    const {
      numeroTavolo,
      posizioneId,
      descrizione,
      prezzo,
      prezzoPosto,
      statoId,
      imageUrl,
    } = body;

    if (!descrizione) {
      return new NextResponse("Descrizione is required", { status: 400 });
    }
    if (!numeroTavolo) {
      return new NextResponse("Numero del tavolo is required", {
        status: 400,
      });
    }
    if (!prezzo) {
      return new NextResponse("Prezzo is required", { status: 400 });
    }
    if (!prezzoPosto) {
      return new NextResponse("Prezzo a posto is required", { status: 400 });
    }
    if (!statoId) {
      return new NextResponse("Stato ID is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }
    if (!posizioneId) {
      return new NextResponse("Posizione Id is required", { status: 400 });
    }

    const tavolo = await prismadb.tavolo.create({
      data: {
        descrizione,
        numeroTavolo,
        prezzo,
        prezzoPosto,
        statoId,
        imageUrl,
        salaId: params.salaId,
        posizioneId,
      },
    });

    return NextResponse.json(tavolo);
  } catch (error) {
    console.log("[TAVOLO POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string, salaId: string } }
) {
  try {
    const tavolo = await prismadb.tavolo.findMany({
      where: {
        salaId: params.salaId,
      },
    });

    return NextResponse.json(tavolo);
  } catch (error) {
    console.log("[TAVOLO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
