"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TipoInformazioneColumn = {
    id: string
    name: string,
    informazioni: number,
    createdAt: string,
    superior?: boolean
}

export const columns: ColumnDef<TipoInformazioneColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "informazioni",
        header: ({ column }) => {
            return (
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    N. Informazioni
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }

    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
