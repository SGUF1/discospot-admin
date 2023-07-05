
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { Check, X } from "lucide-react"
import CellUsername from "./cell-username"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AdminColumn = {
    id: string
    username: string
    createdAt: string
    superior: boolean,
    imageUrl: string,
    isSuperior?: boolean
}

export const columns: ColumnDef<AdminColumn>[] = [
    {
        accessorKey: "username",
        header: "Username",
        cell: ({row}) => <CellUsername data={row.original}/>
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        accessorKey: "superior",
        header: "Superior",
        cell: ({ row }) => <div className="ml-5">{row.original.superior ? <Check className="h-4 w-4 bg-green-300" /> : <X className="h-4 w-4 bg-red-300" />}</div>
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original}/>
    }
]
