import { ThemeProvider } from "@/components/theme-provider"
import prismadb from "@/lib/prismadb"
import { Accounts } from "@prisma/client"

export default async function AuthLayout({
    children
}: { children: React.ReactNode }) {

    return (
        <div className="h-full">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </div>
    )
}