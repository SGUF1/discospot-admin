'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export type ListeColumn = {
	id: string;
	nome: string;
	limiteData: string;
	quantity: number;
	prezzoBiglietto: number,
	infinite: boolean
};

export const columns: ColumnDef<ListeColumn>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome'
	},
	{
		accessorKey: 'limiteData',
		header: 'Ultima data'
	},
	{
		accessorKey: 'quantity',
		header: 'N. Biglietti Rimanenti'
	},
	{
		accessorKey: 'prezzoBiglietto',
		header: 'Prezzo Biglietto'
	},
	{
		accessorKey: 'infinite',
		header: 'Biglietti infiniti'
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />
	}
];
