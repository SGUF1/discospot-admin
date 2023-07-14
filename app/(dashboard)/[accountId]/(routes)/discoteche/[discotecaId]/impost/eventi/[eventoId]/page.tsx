import prismadb from '@/lib/prismadb'
import React from 'react'
import EventoForm from './components/evento-form'

const EventoPage = async ({ params }: { params: { discotecaId: string, eventoId: string } }) => {

  const evento = await prismadb.evento.findUnique({
    where: {
      id: params.eventoId,
    },
  })

  const tipologie = await prismadb.tipologiaEvento.findMany()
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <EventoForm initialData={evento} tipologieEvento={tipologie}/>
      </div>
    </div>
  )
}

export default EventoPage