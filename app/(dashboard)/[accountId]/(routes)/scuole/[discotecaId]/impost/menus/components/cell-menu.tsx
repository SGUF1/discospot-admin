import React from 'react';
import { MenuColumn } from './columns';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CellMenuProps {
	data: MenuColumn;
}
const CellMenu = ({ data }: CellMenuProps) => {
	const params = useParams();
	const router = useRouter();

	return (
		<Button
			variant="link"
			onClick={() =>
				router.push(`/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${data.id}/impost`)}
		>
			{data.nome}
		</Button>
	);
};

export default CellMenu;
