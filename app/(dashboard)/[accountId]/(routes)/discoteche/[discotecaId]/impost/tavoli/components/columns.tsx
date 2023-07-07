"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
export type TavoloColumn = {
    id: string
    numerotavolo: string
    posti: string,
    prezzo: string,
    stato: string,
    posizione: string
    createdAt: string
}

export const columns: ColumnDef<TavoloColumn>[] = [
    {
        accessorKey: "numerotavolo",
        header: ({ column }) => {
            return <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Numero Tavolo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
    },

    {
        accessorKey: "prezzo",
        header: ({ column }) => {
            return <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Prezzo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
    },
    {
        accessorKey: "posti",
        header: ({ column }) => {
            return <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Posti
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
    },
    {
        accessorKey: "stato",
        header: "Stato",
    },
    {
        accessorKey: "posizione",
        header: "Posizione",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
