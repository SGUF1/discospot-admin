'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { Button } from '@/components/ui/button';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PostiColumn = {
	id: number;
	stato: string;
	date: string;
};

export const columns: ColumnDef<PostiColumn>[] = [
	{
		accessorKey: 'id',
		header: 'Numero posto'
	},
	{
		accessorKey: 'stato',
		header: 'Stato'
	},
	{
		accessorKey: 'date',
		header: 'Data'
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />
	}
];
