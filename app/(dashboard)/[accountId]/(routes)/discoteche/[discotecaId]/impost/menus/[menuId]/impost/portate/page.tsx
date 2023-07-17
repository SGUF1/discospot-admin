import prismadb from '@/lib/prismadb'
import React from 'react'
import { PortataColumn } from './components/columns'
import { format } from 'date-fns'
import PortataClient from './components/client'

const PortatePage = async ({ params }: { params: { menuId: string } }) => {


  const portate = await prismadb.portata.findMany({
    where: {
      menuId: params.menuId,
    }
  })
  const formattedPortate: PortataColumn[] = portate.map((item) => ({
    id: item.id,
    nome: item.nome,
    lastPortata: item.lastPortata,
    numeroPortata: item.numeroPortata,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <PortataClient data={formattedPortate}  />
      </div>
    </div>
  )
}

export default PortatePage