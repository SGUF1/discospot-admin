import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { userId, discotecaId } = await req.json();

  if (!userId) {
    return new NextResponse("userId is required", { status: 400 });
  }

  if (!discotecaId) {
    return new NextResponse("Discoteca Id is required", { status: 400 });
  }

  // Verifica se la discoteca esiste nel database
  const discoteca = await prismadb.discoteca.findUnique({
    where: {
      id: discotecaId,
    },
    include: {
      userAccounts: true,
    },
  });

  if (!discoteca) {
    return new NextResponse("Discoteca not found", { status: 404 });
  }

  // Aggiorna il conteggio "like" della discoteca
  if (!discoteca.userAccounts.find((item) => item.id === userId)) {
    const discotecaLike = await prismadb.discoteca.update({
      where: {
        id: discotecaId,
      },
      data: {
        like: discoteca.like + 1,
      },
    });

    // Associa la discoteca all'account dell'utente
    const userAccount = await prismadb.userAccount.update({
      where: {
        id: userId,
      },
      data: {
        discoteche: {
          connect: {
            id: discotecaId,
          },
        },
      },
    });
  }else{
    const discotecaLike = await prismadb.discoteca.update({
      where: {
        id: discotecaId,
      },
      data: {
        like: discoteca.like - 1,
      },
    });
    const userAccount = await prismadb.userAccount.update({
      where: {
        id: userId,
      },
      data: {
        discoteche: {
          disconnect: {
            id: discotecaId,
          },
        },
      },
    });
  }
  return NextResponse.json({
    headers: corsHeaders,
  });
  //   return new NextResponse("Discoteca added successfully", { status: 200 });
}
