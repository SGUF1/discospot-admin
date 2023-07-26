import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const evento = await prismadb.evento.findMany({
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
