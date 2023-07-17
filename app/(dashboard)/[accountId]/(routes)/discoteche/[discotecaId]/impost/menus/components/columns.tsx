"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { Check, X } from "lucide-react"
import CellMenu from "./cell-menu"

export type MenuColumn = {
    id: string
    nome: string
    portate: number;
    isVisible: boolean;
    createdAt: string
}

export const columns: ColumnDef<MenuColumn>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
        cell: ({row}) => <CellMenu data={row.original}/>
    },
    {
        accessorKey: "portate",
        header: "Numero portate",
    },
    {
        accessorKey: "isVisible",
        header: "Visible",
        cell: ({ row }) => <div className="ml-5">{row.original.isVisible ? <Check className="h-4 w-4 bg-green-300" /> : <X className="h-4 w-4 bg-red-300" />}</div>
    },
    {
        accessorKey: "createdAt",
        header: "Date"
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
