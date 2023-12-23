import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; listaId: string };
  }
) {
  try {
    const body = await req.json();
    const {
      nome,
      imageUrl,
      informations,
      quantity,
      bigliettiInfiniti,
      prezzoBiglietto,
      priority,
      dataLimite,
      unisex,
      prezzoDonna
    } = body;

    if (!informations) {
      return new NextResponse('informazioni is required', { status: 400 });
    }
    if (!nome) {
      return new NextResponse("Nome dell'lista is required", {
        status: 400
      });
    }
    if (!dataLimite) {
      return new NextResponse('Data di inizio is required', { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }
    if (!priority) {
      return new NextResponse('Priorità is required', { status: 400 });
    }
    if (!prezzoBiglietto) {
      return new NextResponse('Prezzo biglietto is required', { status: 400 });
    }
    const data = new Date(dataLimite)
    
    if(unisex){
    const lista = await prismadb.lista.update({
      where: {
        id: params.listaId,
      },
      data: {
        nome,
        unisex,
        imageUrl,
        priority,
        quantity,
        dataLimite: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours() === 22 ? data.getHours() + getGlobalHours : data.getHours(), 0),
        prezzoBiglietto,
        bigliettiInfiniti,
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
    return NextResponse.json(lista);
    }else{
      const lista = await prismadb.lista.update({
        where: {
          id: params.listaId,
        },
        data: {
          nome,
          imageUrl,
          priority,
          quantity,
          dataLimite: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours() === 22 ? data.getHours() + getGlobalHours : data.getHours(), 0),
          unisex,
          prezzoDonna,
          prezzoBiglietto,
          bigliettiInfiniti,
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
      return NextResponse.json(lista);

    }

  } catch (error) {
    console.log("[LISTA PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; listaId: string };
  }
) {
  try {
    const lista = await prismadb.lista.delete({
      where: {
        id: params.listaId,
      },
    });

    return NextResponse.json(lista);
  } catch (error) {
    console.log("[LISTA DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; listaId: string };
  }
) {
  try {
    const lista = await prismadb.lista.findUnique({
      where: {
        id: params.listaId,
      },
    });

    return NextResponse.json(lista);
  } catch (error) {
    console.log("[LISTA GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
