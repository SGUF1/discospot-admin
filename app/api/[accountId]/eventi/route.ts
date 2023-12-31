import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const evento = await prismadb.evento.findMany({
      where: {
        discoteca: {
          visibile: true
        },
        endDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() - 24, 0),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 10, new Date().getDate(), new Date().getHours() + getGlobalHours, 0)
        }
      },
      orderBy: {
        startDate: "asc",
      },
      include: {
        discoteca: true,
        sala: true,
        tipologiaEvento: true,
      },
    });

    return NextResponse.json(evento);
  } catch (error) {
    console.log("[EVENTO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
