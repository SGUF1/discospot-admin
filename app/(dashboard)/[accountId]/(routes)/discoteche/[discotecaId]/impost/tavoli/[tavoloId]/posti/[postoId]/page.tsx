import prismadb from '@/lib/prismadb';
import React from 'react';
import PostoForm from './components/posto-form';

const PianoPage = async ({ params }: { params: { accountId: string; tavoloId: string; postoId: string } }) => {
	var posto = null;
	if (params.postoId === 'new') {
		posto = null;
	} else {
		posto = await prismadb.posto.findFirst({
			where: {
				tavoloId: params.tavoloId,
				id: +params.postoId
			}
		});
	}

	const stati = await prismadb.stato.findMany({});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<PostoForm initialData={posto} stati={stati} />
			</div>
		</div>
	);
};

export default PianoPage;
