"use client"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter, } from "next/navigation";
import { Button } from "./ui/button";


export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams()
    const router = useRouter()
    const routes = [
        {
            href: `/${params.accountId}`,
            label: "Overview",
            active: pathname === `/${params.accountId}`
        },
        {
            href: `/${params.accountId}/admins`,
            label: "Admins",
            active: pathname === `/${params.accountId}/admins`
        }
    ]

    return(
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {routes.map((route) => (
                <Button variant={"link"} key={route.href} onClick={() => router.replace(route.href)} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                    {route.label}
                </Button>
            ))}
        </nav>
    )
}