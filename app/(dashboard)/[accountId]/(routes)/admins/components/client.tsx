"use client"
import React from 'react'
import { AdminColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface AdminSettingClient {
  data: AdminColumn[],

}

const AdminSettingClient = ({ data }: AdminSettingClient) => {
  const router = useRouter();
  const params = useParams();
  
  
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Admins ${data.length}` : `Admin ${data.length}`} description='Manage admin accounts' />
        {data[0].isSuperior && <Button onClick={() => router.replace(`/${params.accountId}/admins/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>}
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='username' />
    </>
  )
}

export default AdminSettingClient