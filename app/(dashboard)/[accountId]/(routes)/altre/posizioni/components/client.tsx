"use client"
import React from 'react'
import { PosizioneColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface PosizioneClientProps {
  data: PosizioneColumn[],
}

const PosizioneClient = ({ data }: PosizioneClientProps) => {
  const router = useRouter();
  const params = useParams();


  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Posizioni (${data.length})` : `Posizione (${data.length})`} description='Gestisci le posizioni' />
        <Button onClick={() => router.push(`/${params.accountId}/altre/posizioni/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Aggiungi
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
    </>
  )
}

export default PosizioneClient