"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type DateColumn = {
    id: string
    date?: string,
    sala?: string,
    type?: string,
    giorni?: string,
    rangeDate?: string
}

export const columns: ColumnDef<DateColumn>[] = [
    {
        accessorKey: "type",
        header: "Tipo",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "giorni",
        header: "Giorni",
    },
    {
        accessorKey: "rangeDate",
        header: "Range date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
