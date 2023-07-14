'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type EventoColumn = {
	id: string;
	nome: string;
	startDate: string;
	endDate: string;
	tipologiaEvento: string
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
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />
	}
];
