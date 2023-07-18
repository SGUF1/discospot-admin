import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import prismadb from "@/lib/prismadb";
import { ModalProvider } from "@/providers/modal-provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { accountId: string };
}) {

    const account = await prismadb.accounts.findFirst({
        where: { id: params.accountId },
    });


    if (!account) {
        redirect("/");
    }

    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar imageUrl={account ? account?.imageUrl : "https://res.cloudinary.com/dg2hpjtdh/image/upload/v1688595030/cqi5mouupo1g8vs7y6ql.jpg}"}/>
            <ModalProvider/>
            {children}
            </ThemeProvider>
        </>
    );
}
