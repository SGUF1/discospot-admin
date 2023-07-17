"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { ArrowUpDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type OptionProdottoColumn = {
    id: string;
    nome: string;
    createdAt: string;
}

export const columns: ColumnDef<OptionProdottoColumn>[] = [
    {
        accessorKey: "nome",
        header: "Nome prodotto",
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
