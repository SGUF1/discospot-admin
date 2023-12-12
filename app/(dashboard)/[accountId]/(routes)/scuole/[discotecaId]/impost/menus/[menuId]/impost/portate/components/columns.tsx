"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { Check, X } from "lucide-react";

export type PortataColumn = {
    id: string;
    nome: string;
    numeroPortata: number;
    lastPortata: boolean;
    createdAt: string;
}

export const columns: ColumnDef<PortataColumn>[] = [
    {
        accessorKey: "nome",
        header: "Nome portata",
    },
    {
        accessorKey: "numeroPortata",
        header: "Numero Portata",
    },
    {
        accessorKey: "lastPortata",
        header: "Ultima portata?",
        cell: ({ row }) => <div className="ml-5">{row.original.lastPortata ? <Check className="h-4 w-4 bg-green-300" /> : <X className="h-4 w-4 bg-red-300" />}</div>
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
