'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export type EventoColumn = {
	id: string;
	nome: string;
	startDate: string;
	endDate: string;
	tipologiaEvento: string,
	eventoSala: boolean,
	sala?: string
};

export const columns: ColumnDef<EventoColumn>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome'
	},
	{
		accessorKey: 'startDate',
		header: 'Start Date'
	},
	{
		accessorKey: 'endDate',
		header: 'End Date'
	},
		{
		accessorKey: 'tipologiaEvento',
		header: 'Tipologia Evento'
	},
	{
		accessorKey: "eventoSala",
		header: "Sala",
		cell: ({ row }) => <div>{row.original.eventoSala ? row.original.sala : <X className="h-4 w-4 bg-red-600" />}</div>
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />
	}
];
