"use client"
import React from 'react'
import { EventoColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface EventiClientProps {
  data: EventoColumn[],
}

const EventiClient = ({ data }: EventiClientProps) => {
  const router = useRouter();
  const params = useParams();

  console.log(data.map((item) => item.startDate))
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Eventi (${data.length})` : `Evento (${data.length})`} description='Gestigli gli eventi' />
        <Button onClick={() => router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/eventi/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Aggiungi
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='nome' />
    </>
  )
}

export default EventiClient