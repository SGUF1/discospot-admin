'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, MoreHorizontal, RewindIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export type OrdersColumn = {
	id: string;
	phone: string | null;
	isPaid: Boolean;
	completeName: string | null,
	totalPrice: number;
	createdAt: string;
	orderData: string;
	codice: string,
};

export const columns: ColumnDef<OrdersColumn>[] = [
	{
		accessorKey: "completeName",
		header: "Nome & Cognome"
	},

	{
		accessorKey: 'totalPrice',
		header: 'Prezzo Totale'
	},{
		accessorKey: "codice",
		header: "Codice Biglietto",
	},
	{
		accessorKey: "orderData",
		header: "Ordine per il:"
	},
	{
		accessorKey: "isPaid",
		header: "Pagato",
		cell: ({ row }) => <div>{row.original.isPaid ? <Check className='h-4 w-4 bg-green-500'/> : <X className="h-4 w-4 bg-red-600" />}</div>
	},
	{
		accessorKey: "createdAt",
		header: "Ordine fatto il:"
	}
];
