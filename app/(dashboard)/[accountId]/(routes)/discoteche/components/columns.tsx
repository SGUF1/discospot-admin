
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { Check, X } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DiscotecaColumn = {
    id: string
    name: string
    city: string,
    provincia: string,
    createdAt: string
    isSuperior?: boolean
}

export const columns: ColumnDef<DiscotecaColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
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
        accessorKey: "createdAt",
        header: "Date",
    },

    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
