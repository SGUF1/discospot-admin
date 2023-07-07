"use client"
import React from 'react'
import { StatoColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface StatoClientProps {
  data: StatoColumn[],
}

const StatoClient = ({ data }: StatoClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Stato (${data.length})` : `Stati (${data.length})`} description='Manage piani' />
        <Button onClick={() => router.replace(`/${params.accountId}/altre/stati/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
    </>
  )
}

export default StatoClient