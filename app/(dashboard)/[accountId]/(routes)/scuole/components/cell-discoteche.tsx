import React from 'react'
import { DiscotecaColumn } from './columns'
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CellDiscotecheProps {
    data: DiscotecaColumn
}
const CellDiscoteche = ({ data }: CellDiscotecheProps) => {

    const params = useParams();
    const router = useRouter()


  return (
        <Button variant="link" onClick={() => router.push(`/${params.accountId}/scuole/${data.id}/impost`)}>
            {data.name}
        </Button>
    )
}

export default CellDiscoteche