import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; optionprodottoId: string } }
) {
  try {
    const body = await req.json();
    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }

    const optionProdotto = await prismadb.optionProdotto.update({
      where: {
        id: params.optionprodottoId,
      },
      data: {
        nome,
      },
    });
    return NextResponse.json(optionProdotto);
  } catch (error) {
    console.log("[OPTION PRODOTTO PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; optionprodottoId: string } }
) {
  try {
    const optionProdotto = await prismadb.optionProdotto.delete({
      where: {
        id: params.optionprodottoId,
      },
    });

    return NextResponse.json(optionProdotto);
  } catch (error) {
    console.log("[OPTION PRODOTTO DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; optionprodottoId: string } }
) {
  try {
    const optionProdotto = await prismadb.optionProdotto.findUnique({
      where: {
        id: params.optionprodottoId,
      },
    });

    return NextResponse.json(optionProdotto);
  } catch (error) {
    console.log("[OPTION PRODOTTO GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
