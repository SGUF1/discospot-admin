import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; adminId: string } }
) {
  try {
    const body = await req.json();
    const { username, password, superior } = body;

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }
    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    const admin = await prismadb.accounts.update({
      where: {
        id: params.adminId,
      },
      data: {
        username,
        password,
        superior,
      },
    });
    return NextResponse.json(admin);
  } catch (error) {
    console.log("[ADMIN PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: {accountId: string, adminId: string } }
) {
      try {
        if(params.accountId === params.adminId){
            return new NextResponse("Impossibile eliminare se stessi da qui", {status: 405})
        }

        const admin = await prismadb.accounts.delete({
            where: {
                id: params.adminId
            }
        });

        return NextResponse.json(admin);
      } catch (error) {
        console.log("[ADMIN DELETE]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
      }
}

export async function GET(req: Request, {params}: {params: {accountId: string, adminId: string}}){
    try {

      const admin = await prismadb.accounts.findUnique({
        where: {
          id: params.adminId,
        },
      });

      return NextResponse.json(admin);
    } catch (error) {
      console.log("[ADMIN GET]", error);
      return new NextResponse("Internal Error" + error, { status: 500 });
    }
}