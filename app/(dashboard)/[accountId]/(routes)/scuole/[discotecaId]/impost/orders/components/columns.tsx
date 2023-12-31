'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, MoreHorizontal, RewindIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export type OrdersColumn = {
	id: string;
	phone: string;
	isPaid: Boolean;
	totalPrice: number;
	tavolo: string;
	prodotti: string[]
	createdAt: string
	completeName: string
	orderData: string;
	codice: string,
	numeroPersone: number;
	stato: string,
	numeroPersonePagato: number
};

export const columns: ColumnDef<OrdersColumn>[] = [
	{
		accessorKey: "completeName",
		header: 'Nome'
	},
	{
		accessorKey: 'tavolo',
		header: 'Tavolo'
	},
	{
		accessorKey: 'prodotti',
		header: "Prodotti",
		cell: ({row}) => row.original.prodotti.map((prodotto) => <div className='w-[200px]'>{prodotto}</div>)
	},

	{
		accessorKey: 'phone',
		header: 'Telefono'
	},
	{
		accessorKey: 'totalPrice',
		header: 'Prezzo Totale'
	},{
		accessorKey: "codice",
		header: "Codice Tavolo",
	},
	{
		accessorKey: "numeroPersone",
		header: "Numero persone"
	},
	{
		accessorKey: "orderData",
		header: "Ordine per il:"
	},

	{
		accessorKey: "numeroPersonePagato",
		header: "Pagato in:"
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
