import prismadb from '@/lib/prismadb'
import React from 'react'
import { TavoloColumn } from './components/columns'
import { format } from 'date-fns'
import TavoliClient from './components/client'

const TavoliPage = async ({ params }: { params: { discotecaId: string, salaId: string } }) => {

  const tavoli = await prismadb.tavolo.findMany({
    where: {
      salaId: params.salaId
    },
    include: {
      stato: true,
      posizione: true
    }
  })
  const formattedTavoli: TavoloColumn[] = tavoli.map((item) => ({
    id: item.id,
    numerotavolo: item.numeroTavolo,
    posizione: item.posizione.nome,
    posti: item.numeroMassimo!,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    prezzo: item.prezzo,
    stato: item.stato.nome,
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <TavoliClient data={formattedTavoli} />
      </div>
    </div>
  )
}

export default TavoliPage