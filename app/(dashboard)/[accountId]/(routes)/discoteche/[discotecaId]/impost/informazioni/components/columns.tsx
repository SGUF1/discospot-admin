"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type InformazioneColumn = {
    id: string
    descrizione: string,
    tipo: string,
    createdAt: string,
    numeroInformazione: string
}

export const columns: ColumnDef<InformazioneColumn>[] = [
    {
        accessorKey: "descrizione",
        header: "Informazione",
    },
    {
        accessorKey: "numeroInformazione",
        header: "Ordine",
    },
    {
        accessorKey: "tipo",
        header: "Tipo"
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
