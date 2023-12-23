"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import CellTavoli from "./cell-tavoli"
export type TavoloColumn = {
    id: string
    numerotavolo: string
    posti: number | null,
    prezzo: string,
    stato: string,
    posizione: string
    createdAt: string
}

export const columns: ColumnDef<TavoloColumn>[] = [
    {
        accessorKey: "numerotavolo",
        header: ({ column }) => {
            return <div className="">
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Numero Tavolo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>

        },

    },

    {
        accessorKey: "prezzo",
        header: ({ column }) => {
            return <div className="text-center">
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Prezzo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        },
        cell: ({ row }) => (<div className="text-center">{row.original.prezzo}</div>)

    },
    {
        accessorKey: "posti",
        header: ({ column }) => {
            return <div className="text-center">
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Posti
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        },
        cell: ({ row }) => (<div className="text-center">{row.original.posti}</div>)

    },
    {
        accessorKey: "stato",
        header: ({ column }) => {
            return <div className="text-center">
                Stato
            </div>
        },
        cell: ({ row }) => (<div className="text-center">{row.original.stato}</div>)

    },
    {
        accessorKey: "posizione",
        header: ({ column }) => {
            return <div className="text-center">
                Posizione
            </div>
        },
        cell: ({ row }) => (<div className="text-center">{row.original.posizione}</div>)
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
