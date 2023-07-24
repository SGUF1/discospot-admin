import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userAccountId: string } }
) {
  try {
    const userAccount = await prismadb.userAccount.findUnique({
        where: {
            id: params.userAccountId
        }
    }
    );
    return NextResponse.json(userAccount);
  } catch (error) {}
}
