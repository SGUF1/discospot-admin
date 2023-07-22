"use client"
import React from 'react'
import { PostiColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface PostiClientProps {
  data: PostiColumn[],
}

const PostiClient = ({ data }: PostiClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Posti (${data.length})` : `Posto (${data.length})`} description='Gestisci i posti' />
        <Button onClick={() => router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}/tavoli/${params.tavoloId}/posti/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Aggiungi
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='numero' />
    </>
  )
}

export default PostiClient