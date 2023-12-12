import prismadb from '@/lib/prismadb'
import React from 'react'
import EventoForm from './components/evento-form'

const EventoPage = async ({ params }: { params: {accountId: string, discotecaId: string, eventoId: string } }) => {

  const evento = await prismadb.evento.findUnique({
    where: {
      id: params.eventoId,
    },
    include: {
      informazioni: {
        orderBy: {
          numeroInformazione: 'asc'
        }
      }
    }
  })

  const sale = await prismadb.sala.findMany({
    where: {
      discotecaId: params.discotecaId,
    }
  })

  const tipoInformazioni = await prismadb.tipoInformazione.findMany()
  const account = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    }
  })
  const tipologie = await prismadb.tipologiaEvento.findMany()
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <EventoForm superior={account?.superior!} initialData={evento} tipologieEvento={tipologie} sale={sale!} tipoInformazione={tipoInformazioni}/>
      </div>
    </div>
  )
}

export default EventoPage