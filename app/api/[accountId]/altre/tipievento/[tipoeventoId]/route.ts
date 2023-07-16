import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; tipoeventoId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const tipologiaEvento = await prismadb.tipologiaEvento.update({
      where: {
        id: params.tipoeventoId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(tipologiaEvento);
  } catch (error) {
    console.log("[TIPOLOGIA EVENTO PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; tipoeventoId: string } }
) {
  try {
    const tipologiaEvento = await prismadb.tipologiaEvento.delete({
      where: {
        id: params.tipoeventoId,
      },
    });

    return NextResponse.json(tipologiaEvento);
  } catch (error) {
    console.log("[TIPOLOGIA EVENTO DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; tipoeventoId: string } }
) {
  try {
    const tipologiaEvento = await prismadb.tipologiaEvento.findUnique({
      where: {
        id: params.tipoeventoId,
      },
    });

    return NextResponse.json(tipologiaEvento);
  } catch (error) {
    console.log("[TIPOLOGIA EVENTO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
