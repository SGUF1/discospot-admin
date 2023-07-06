import prismadb from "@/lib/prismadb"
import { Accounts } from "@prisma/client"

export default async function AuthLayout({
    children
}: {children: React.ReactNode}){
    
    return(
        <div className="h-full">
            {children}
        </div>
    )
}