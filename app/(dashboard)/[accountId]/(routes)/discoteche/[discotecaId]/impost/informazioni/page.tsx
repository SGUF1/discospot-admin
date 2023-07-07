import prismadb from '@/lib/prismadb'
import React from 'react'
import { InformazioneColumn } from './components/columns'
import { format } from 'date-fns'
import InformazioniClient from './components/client'

const InformazioniPage = async ({ params }: { params: { discotecaId: string } }) => {

  const discoteca = await prismadb.discoteca.findUnique({
    where: {
      id: params.discotecaId,
    },
  })

  const informazioni = await prismadb.informazione.findMany({
    include: {
      tipoInformazione: true
    }
  })
  const formattedTavoli: InformazioneColumn[] = informazioni.map((item) => ({
    id: item.id,
    descrizione: item.descrizione,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    tipo: item.tipoInformazione.nome,
    numeroInformazione: item.numeroInformazione,
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <InformazioniClient data={formattedTavoli} discotecaName={discoteca?.name!} />
      </div>
    </div>
  )
}

export default InformazioniPage