import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();
    const { name, indirizzo, provincia, cap, imageUrl, civico, city } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!indirizzo) {
      return new NextResponse("Indirizzo is required", { status: 400 });
    }
    if (!provincia) {
      return new NextResponse("Provincia is required", { status: 400 });
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
    if(!city){
      return new NextResponse("Città is required", {status: 400})
    }

    if (!params.accountId)
      return new NextResponse("Account Id is required", { status: 400 });

    const discoteca = await prismadb.discoteca.create({
      data: {
        name,
        city,
        indirizzo,
        provincia,
        cap,
        imageUrl,
        civico,
      },
    });

    return NextResponse.json(discoteca);
  } catch (error) {
    console.log("[DISCOTECA POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
