import prismadb from '@/lib/prismadb'
import React from 'react'
import { ProvinciaColumn } from './components/columns'
import { format } from 'date-fns'
import ProvinceClient from './components/client'

const ProvincePage = async ({ params }: { params: { accountId: string } }) => {
  const province = await prismadb.provincia.findMany({
    orderBy: {
      name: 'desc'
    },
    include: {
      discoteche: true
    }
  })
  
  const admin = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    },
    
  })

  const formattedDiscoteche: ProvinciaColumn[] = province.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    discoteche: item.discoteche.length,
    superior: admin?.superior
  }))
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProvinceClient data={formattedDiscoteche} />
      </div>
    </div>
  )
}

export default ProvincePage