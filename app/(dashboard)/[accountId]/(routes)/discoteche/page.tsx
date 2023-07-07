import prismadb from '@/lib/prismadb'
import React from 'react'
import { DiscotecaColumn } from './components/columns'
import { format } from 'date-fns'
import DiscotecaClient from './components/client'

const DiscotechePage = async ({ params }: { params: { accountId: string } }) => {
  const discoteche = await prismadb.discoteca.findMany({
    orderBy: {
      name: 'desc'
    },
    include: {
      provincia: true
    }
  })
  
  const admin = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    }
  })

  const formattedDiscoteche: DiscotecaColumn[] = discoteche.map((item) => ({
    id: item.id,
    name: item.name,
    city: item.city,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    isSuperior: admin?.superior,
    provincia: item.provincia.name,
    caparra: item.caparra
  }))
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <DiscotecaClient data={formattedDiscoteche} />
      </div>
    </div>
  )
}

export default DiscotechePage