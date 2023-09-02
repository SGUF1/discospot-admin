import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function GET(
  req: Request,
  { params }: { params: { userAccountId: string } }
) {
  try {
    const userAccount = await prismadb.userAccount.findUnique({
      where: {
        id: params.userAccountId
      },
      include: {
        discoteche: true
      }
    }
    );
    return NextResponse.json(userAccount);
  } catch (error) { }
}

export async function PUT(req: Request, { params }: { params: { userAccountId: string } }) {
  try {
  const body = await req.json();
  const { firstDomanda, secondDomanda, eta } = body
    const userAccount = await prismadb.userAccount.update({
      where: {
        id: params.userAccountId,
      },
      data: {
        generi: {
          create: firstDomanda.map((item: string) => ({
            nome: item,
          })),
        },
        domanda2: secondDomanda,
        eta,
      },
    });
    return NextResponse.json({}, { headers: corsHeaders });

  } catch (error) { }
}