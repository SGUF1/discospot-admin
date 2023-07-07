import { useParams, useRouter } from "next/navigation";
import { TavoloColumn } from "./columns";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Copy } from "lucide-react";
import axios from "axios";

interface CellActionProps {
    data: TavoloColumn;
}

const CellAction = ({ data, }: CellActionProps) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Tavolo Id copied")
    }
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${data.id}`)
            router.refresh()
            toast.success("Tavolo deleted")
        } catch (error) {
            toast.error("Qualcosa è andato storto")

        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} loading={false} onClose={() => setOpen(false)} onConfirm={onDelete} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className='h-8 w-8 p-0'>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellAction;