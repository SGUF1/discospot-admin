"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { ArrowUpDown, Check, MoreHorizontal, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import CellDiscoteche from "./cell-discoteche"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DiscotecaColumn = {
    id: string
    name: string
    city: string,
    provincia: string,
    createdAt: string
    caparra: boolean,
    visible: boolean,
    maximumOrderDate: number,
    isSuperior?: boolean
}

export const columns: ColumnDef<DiscotecaColumn>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nome Discoteca
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => <CellDiscoteche data={row.original} />

    },
    {
        accessorKey: "city",
        header: "Città",
    },
    {
        accessorKey: "provincia",
        header: "Provincia"

    },
    {
        accessorKey: "maximumOrderDate",
        header: "Limite giorni ordine"
    },
    {
        accessorKey: "caparra",
        header: "Caparra",
        cell: ({ row }) => <div className="ml-5">{row.original.caparra ? <Check className="h-4 w-4 bg-green-500" /> : <X className="h-4 w-4 bg-red-500" />}</div>
    },
    {
        accessorKey: "visibile",
        header: "Visibile",
        cell: ({ row }) => <div className="ml-5">{row.original.visible ? <Check className="h-4 w-4 bg-green-500" /> : <X className="h-4 w-4 bg-red-500" />}</div>
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
