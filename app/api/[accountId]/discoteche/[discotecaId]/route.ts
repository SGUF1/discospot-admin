import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      indirizzo,
      provinciaId,
      cap,
      imageUrl,
      civico,
      city,
      caparra,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!indirizzo) {
      return new NextResponse("Indirizzo is required", { status: 400 });
    }
    if (!provinciaId) {
      return new NextResponse("Provincia is required" + provinciaId, {
        status: 400,
      });
    }
    if (!cap) {
      return new NextResponse("Cap is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("ImageURL is required", { status: 400 });
    }
    if (!civico) {
      return new NextResponse("Civico is required", { status: 400 });
    }
    if (!city) {
      return new NextResponse("Città is required", { status: 400 });
    }
    if (!caparra) {
      return new NextResponse("Caparra is required", { status: 400 });
    }

    if (!params.accountId)
      return new NextResponse("Account Id is required", { status: 400 });

    const discoteca = await prismadb.discoteca.update({
      where: {
        id: params.discotecaId,
      },
      data: {
        name,
        city,
        indirizzo,
        provinciaId,
        cap,
        imageUrl,
        civico,
        caparra,
      },
    });

    return NextResponse.json(discoteca);
  } catch (error) {
    console.log("[DISCOTECA PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const discoteca = await prismadb.discoteca.delete({
      where: {
        id: params.discotecaId,
      },
    });

    return NextResponse.json(discoteca);
  } catch (error) {
    console.log("[discoteca DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const discoteca = await prismadb.discoteca.findUnique({
      where: {
        id: params.discotecaId,
      },
    });

    return NextResponse.json(discoteca);
  } catch (error) {
    console.log("[discoteca GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
