import prismadb from '@/lib/prismadb'
import React from 'react'
import { ListeColumn } from './components/columns'
import { format, formatISO, parseISO } from 'date-fns'
import ListeClient from './components/client'

const ListePage = async ({ params }: { params: { discotecaId: string } }) => {
  const liste = await prismadb.lista.findMany({
    where: {
      discotecaId: params.discotecaId,
    },
  })
  
  const formattedListe: ListeColumn[] = liste.map((item) => (
    {
      id: item.id,
      nome: item.nome,
      limiteData: format(item.dataLimite, "MMMM do, yyyy"),
      prezzoBiglietto: item.prezzoBiglietto,
      quantity: item.bigliettiRimanenti ?? Number(),
      infinite: item.bigliettiInfiniti
    }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ListeClient data={formattedListe} />
      </div>
    </div>
  )
}

export default ListePage