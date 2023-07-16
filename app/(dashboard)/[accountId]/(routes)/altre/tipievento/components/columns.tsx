"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TipoEventoColumn = {
    id: string;
    name: string;
    numeroEventi: number;
    createdAt: string;
}

export const columns: ColumnDef<TipoEventoColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "numeroEventi",
        header: "Eventi"

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
