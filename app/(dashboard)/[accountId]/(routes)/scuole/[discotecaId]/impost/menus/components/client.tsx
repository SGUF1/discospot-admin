"use client"
import React from 'react'
import { MenuColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface MenuClientProps {
  data: MenuColumn[],
}

const MenuClient = ({ data }: MenuClientProps) => {
  const router = useRouter();
  const params = useParams();


  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={data.length > 1 ? `Menu (${data.length})` : `Menu (${data.length})`} description='Gestisci i menu' />
        <Button onClick={() => router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/new`)} className='bg-blue-600'>
          <Plus className='mr-2 h-4 w-4' />
          Aggiungi
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='nome' />
    </>
  )
}

export default MenuClient