import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; statoId: string } }
) {
  try {
    const body = await req.json();
    const { nome, colore } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }
    if (!colore) {
      return new NextResponse("Colore is required", { status: 400 });
    }
    const stato = await prismadb.stato.update({
      where: {
        id: params.statoId,
      },
      data: {
        nome,
        colore,
      },
    });
    return NextResponse.json(stato);
  } catch (error) {
    console.log("[STATO PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; statoId: string } }
) {
  try {
    const stato = await prismadb.stato.delete({
      where: {
        id: params.statoId,
      },
    });

    return NextResponse.json(stato);
  } catch (error) {
    console.log("[STATO DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; statoId: string } }
) {
  try {
    const stato = await prismadb.stato.findUnique({
      where: {
        id: params.statoId,
      },
    });

    return NextResponse.json(stato);
  } catch (error) {
    console.log("[STATO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
