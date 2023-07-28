import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; dataId: string };
  }
) {
  try {
    const body = await req.json();
    const { type, items, date } = body;
    if (type === "ferie") {
      if (!date) {
        return new NextResponse("Date is required", { status: 400 });
      }
      const data = await prismadb.data.update({
        where: {
          id: params.dataId
        },
        data: {
          dateRange: date,
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
      const data = await prismadb.data.update({
        where: {
          id: params.dataId
        },
        data: {
          giorni: items,
          type
        },
      });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log("[DATA PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; dataId: string };
  }
) {
  try {
    const data = await prismadb.data.delete({
      where: {
        id: params.dataId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[DATA DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; dataId: string };
  }
) {
  try {
    const data = await prismadb.data.findUnique({
      where: {
        id: params.dataId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[DATA GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
