import React from 'react';
import { SaleColumn } from './columns';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CellTavoliProps {
	data: SaleColumn;
}
const CellSale = ({ data }: CellTavoliProps) => {
	const params = useParams();
	const router = useRouter();

	return (
		<Button
			variant="link"
			onClick={() =>
				router.push(`/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${data.id}/tavoli`)}
		>
			{data.nome}
		</Button>
	);
};

export default CellSale;
