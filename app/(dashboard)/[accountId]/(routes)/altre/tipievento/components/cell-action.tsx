import { useParams, useRouter } from "next/navigation";
import { TipoEventoColumn } from "./columns";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Copy } from "lucide-react";
import axios from "axios";

interface CellActionProps {
    data: TipoEventoColumn;
}

const CellAction = ({ data, }: CellActionProps) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Tipologia dell'evento Id è stato copiato")
    }
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.accountId}/altre/tipievento/${data.id}`)
            router.refresh()
            toast.success("La tipologia dell'evento è stata eliminata")
        } catch (error) {
            toast.error("Elimina tutti gli eventi prima")
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
                        <span className="sr-only">Apri menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copia
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.accountId}/altre/tipievento/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Elimina
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellAction;