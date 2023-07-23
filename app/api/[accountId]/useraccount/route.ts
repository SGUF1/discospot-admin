import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new NextResponse("Username is required", { status: 400 });
    }
   
    if (!params.accountId)
      return new NextResponse("Account ID is required", { status: 400 });

    const userAccounts = await prismadb.userAccount.findUnique({
        where: {
            id: userId
        }
    })
    
    if(!userAccounts)
    {
        const userAccount = await prismadb.userAccount.create({
            data: {
                id: userId
            }
        })    
        return NextResponse.json(userAccount);
    }
        
    return new NextResponse("Account già esistente", { status: 402 });

  } catch (error) {
    console.log("[ADMIN-SETTING POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
