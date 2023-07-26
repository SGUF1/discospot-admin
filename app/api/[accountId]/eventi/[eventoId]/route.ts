import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; eventoId: string };
  }
) {
  try {
    const evento = await prismadb.evento.findUnique({
      where: {
        id: params.eventoId,
      },
      include: {
        discoteca: true,
        tipologiaEvento: true,
        sala: true,
        informazioni: {
            orderBy: {
                numeroInformazione: "asc"
            }
        }
      },
      
    });

    return NextResponse.json(evento);
  } catch (error) {
    console.log("[EVENTO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
