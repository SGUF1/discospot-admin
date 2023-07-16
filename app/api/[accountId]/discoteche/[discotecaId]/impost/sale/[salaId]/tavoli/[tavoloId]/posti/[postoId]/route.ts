import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; tavoloId: string, postoId: string };
  }
) {
  try {
    const body = await req.json();
    const {
      numero1,
      statoId,
    } = body;

    if (!numero1) {
      return new NextResponse("Numero posto is required", { status: 400 });
    }
    if (!statoId) {
      return new NextResponse("Stato del posto is required", {
        status: 400,
      });
    }

    const posto = await prismadb.posto.update({
      where: {
        id: params.postoId,
      },
      data: {
        numero: numero1,
        statoId
      },
    });

    return NextResponse.json(posto);
  } catch (error) {
    console.log("[POSTO PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; tavoloId: string, postoId: string };
  }
) {
  try {
    const posto = await prismadb.posto.delete({
      where: {
        id: params.postoId,
      },
    });

    return NextResponse.json(posto);
  } catch (error) {
    console.log("[POSTO DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; dicotecaId: string; tavoloId: string, postoId: string };
  }
) {
  try {
    const posto = await prismadb.posto.findUnique({
      where: {
        id: params.postoId,
      },
    });

    return NextResponse.json(posto);
  } catch (error) {
    console.log("[POSTO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
