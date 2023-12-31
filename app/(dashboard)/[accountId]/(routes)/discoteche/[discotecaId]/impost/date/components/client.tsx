"use client"
import React from 'react'
import { DateColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface DateClientProps {
  data: DateColumn[],
}

const DateClient = ({ data }: DateClientProps) => {
  const router = useRouter();
  const params = useParams();


  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Date (${data.length})` : `Data (${data.length})`} description='Gestisci le date' />
        <Button onClick={() => router.push(`/${params.accountId}/discoteche/${params.discotecaId}/impost/date/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Aggiungi
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='data' />
    </>
  )
}

export default DateClient