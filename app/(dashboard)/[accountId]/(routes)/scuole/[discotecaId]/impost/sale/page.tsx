import prismadb from '@/lib/prismadb'
import React from 'react'
import { SaleColumn } from './components/columns'
import { format } from 'date-fns'
import SaleClient from './components/client'

const SalePage = async ({ params }: { params: { discotecaId: string } }) => {

  const sale = await prismadb.sala.findMany({
    where: {
      discotecaId: params.discotecaId
    },
    include: {
      tavoli: true,
      piano: true,
      stato: true
    }
  })
  const formattedSale: SaleColumn[] = sale.map((item) => ({
    id: item.id,
    nome: item.nome,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    tavoli: item.tavoli.length,
    piano: item.piano.nome,
    stato: item.stato.nome 
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SaleClient data={formattedSale}  />
      </div>
    </div>
  )
}

export default SalePage