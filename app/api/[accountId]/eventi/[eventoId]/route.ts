import getGlobalHours from "@/actions/getGlobalHours";
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
        
        endDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() - 15, 0),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 10, new Date().getDate(), new Date().getHours() + getGlobalHours, 0)
        }
      },
      include: {
        discoteca: true,
        tipologiaEvento: true,
        sala: true,
        informazioni: {
            orderBy: {
                numeroInformazione: "asc"
            },
            include: {
              tipoInformazione: true
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
