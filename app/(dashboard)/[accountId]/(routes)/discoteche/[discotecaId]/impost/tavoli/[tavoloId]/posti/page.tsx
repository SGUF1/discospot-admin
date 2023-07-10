import prismadb from '@/lib/prismadb';
import React from 'react';
import { format } from 'date-fns';
import { PostiColumn } from './components/columns';
import PianoClient from './components/client';
import { Posto } from '@prisma/client';
const PianiPage = async ({ params }: { params: { accountId: string; discotecaId: string; tavoloId: string } }) => {
	const posti = await prismadb.posto.findMany({
		where: {
			tavoloId: params.tavoloId
		},
		include: {
			stato: true
		}
	});
	const formattedPosti: PostiColumn[] = posti.map((item: Posto) => ({
		id: item.id,
		stato: item.stato.nome,
		date: format(item.createdAt, 'MMMM do, yyyy')
	}));
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<PianoClient data={formattedPosti} />
			</div>
		</div>
	);
};

export default PianiPage;
