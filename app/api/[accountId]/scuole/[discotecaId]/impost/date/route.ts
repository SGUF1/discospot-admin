import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const body = await req.json();
    const { type, items, date } = body;
    if (type === "ferie") {
      if (!date) {
        return new NextResponse("Date is required", { status: 400 });
      }
      const startDate = new Date(new Date(date.from).getFullYear(), new Date(date.from).getMonth(), new Date(date.from).getDate(), new Date(date.from).getHours() + getGlobalHours, 0)
      const endDate = new Date(new Date(date.to).getFullYear(), new Date(date.to).getMonth(), new Date(date.to).getDate(), new Date(date.to).getHours() + getGlobalHours, 0)
      const data = await prismadb.data.create({
        data: {
          dateRange: { from: startDate, to: endDate},
          discotecaId: params.discotecaId,
          type
        },
      });

      return NextResponse.json(data);
    } else if (type === "aperto") {
      if (!items) {
        return new NextResponse("I giorni della settimana are required", {
          status: 400,
        });
      }
      const data = await prismadb.data.create({
        data: {
          giorni: items,
          discotecaId: params.discotecaId,
          type
        },
      });

      return NextResponse.json(data);
    }
  } catch (error) {
    console.log("[DATE POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const date = await prismadb.data.findMany({
      include: {
        tavolo: true,
        stato: true,
      }
    });

    return NextResponse.json(date);
  } catch (error) {
    console.log("[DATE GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
