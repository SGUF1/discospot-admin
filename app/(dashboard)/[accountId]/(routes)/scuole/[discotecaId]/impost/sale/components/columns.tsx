"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import CellSale from "./cell-sale";

export type SaleColumn = {
    id: string;
    nome: string;
    tavoli: number;
    createdAt: string;
    piano: string;
    stato: string;
}

export const columns: ColumnDef<SaleColumn>[] = [
    {
        accessorKey: "nome",
        header: "Nome sala",
        cell: ({row}) => <CellSale data={row.original}/>
    },
    {
        accessorKey: "tavoli",
        header: "Numero tavoli",
    },
    {
        accessorKey: "piano",
        header: "Piano"
    },
    {
        accessorKey: "stato",
        header: "Stato sala",
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
