import React from 'react';
import { TavoloColumn } from './columns';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CellTavoliProps {
	data: TavoloColumn;
}
const CellTavoli = ({ data }: CellTavoliProps) => {
	const params = useParams();
	const router = useRouter();

	return (
		<Button
			variant="link"
			onClick={() =>
				router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}/tavoli/${data.id}/posti`)}
		>
			{data.numerotavolo}
		</Button>
	);
};

export default CellTavoli;
