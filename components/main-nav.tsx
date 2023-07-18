"use client"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter, } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { ThemeToggle } from "./ui/theme-toggle";

interface MainNavProps{
    imageUrl: string | null,
    className?: React.HTMLAttributes<HTMLElement>,
}
export function MainNav({imageUrl, className}: MainNavProps ) {
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
            href: `/${params.accountId}/province`,
            label: "Province",
            active: pathname === `/${params.accountId}/province`
        },
        {
            href: `/${params.accountId}/discoteche`,
            label: "Discoteche",
            active: pathname === `/${params.accountId}/discoteche`
        },
        {
            href: `/${params.accountId}/altre`,
            label: "Altre Cose",
            active: pathname === `/${params.accountId}/altre`
        },
        {
            href: `/${params.accountId}/admins`,
            label: "Admins",
            active: pathname === `/${params.accountId}/admins`
        },
        
    ]
    const fakeImage = "https://asset.cloudinary.com/dg2hpjtdh/b7a513fd4bd30a908ce82e7960026a6e"
    const realImage = "https://res.cloudinary.com/dg2hpjtdh/image/upload/v1688595030/cqi5mouupo1g8vs7y6ql.jpg"
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-2 w-full ", className)} >
            {routes.map((route) => (
                <Button variant={"link"} key={route.href} onClick={() => router.replace(route.href)} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                    {route.label}
                </Button>
            ))}
            <div className='absolute right-10 self-end rounded-full w-9 h-9 overflow-hidden flex justify-center items-center '>
                {imageUrl && 
                    <Image src={imageUrl === fakeImage ? realImage : imageUrl} width={120} height={50} alt='image' className="hover:cursor-pointer" onClick={() => router.replace(`/${params.accountId}/account`)} />
                }
            </div>
        </nav>
    )
}