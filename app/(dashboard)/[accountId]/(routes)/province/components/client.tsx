"use client"
import React from 'react'
import { ProvinciaColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface ProvinceClientProps {
  data: ProvinciaColumn[],
}

const ProvinceClient = ({ data }: ProvinceClientProps) => {
  const router = useRouter();
  const params = useParams();


  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Province (${data.length})` : `Provincia (${data.length})`} description='Manage province' />
        <Button onClick={() => router.replace(`/${params.accountId}/province/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
    </>
  )
}

export default ProvinceClient