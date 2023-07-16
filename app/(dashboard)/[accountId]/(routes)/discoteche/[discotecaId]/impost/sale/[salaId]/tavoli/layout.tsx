import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { ModalProvider } from "@/providers/modal-provider";
import { ToasterProvider } from "@/providers/taost-provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { accountId: string, discotecaId: string };
}) {

    const account = await prismadb.accounts.findFirst({
        where: { id: params.accountId },
    });

    const discoteca = await prismadb.discoteca.findUnique({
        where: {
            id: params.discotecaId
        }
    })

    if (!account ) {
        redirect("/");
    }
    if(!discoteca){
        redirect(`/${params.accountId}/discoteche`)
    }

    return (
        <>
            <ModalProvider />
            {children}
        </>
    );
}
