
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AdminColumn = {
    id: string
    username: string
    createdAt: string
    superior: boolean,
    isSuperior?: boolean
}

export const columns: ColumnDef<AdminColumn>[] = [
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        accessorKey: "superior",
        header: "Superior"
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original}/>
    }
]
