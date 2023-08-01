import prismadb from '@/lib/prismadb'
import React from 'react'
import { EventoColumn } from './components/columns'
import { format, formatISO } from 'date-fns'
import TavoliClient from './components/client'
import moment from 'moment'
const EventiPage = async ({ params }: { params: { discotecaId: string } }) => {

  const eventi = await prismadb.evento.findMany({
    where: {
      discotecaId: params.discotecaId,
    },
    include: {
      tipologiaEvento: true,
      sala: true
    },
  })
  
  const formattedEvento: EventoColumn[] = eventi.map((item) => (
    {
      id: item.id,
      nome: item.nome,
      startDate: format(new Date(item.startDate), "MMMM do, yyyy HH:mm"),
      endDate: format(new Date(item.endDate), "MMMM do, yyyy HH:mm"), 
      tipologiaEvento: item.tipologiaEvento.name,
      eventoSala: item.eventoSala,
      sala: item.sala?.nome
    }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <TavoliClient data={formattedEvento} />
      </div>
    </div>
  )
}

export default EventiPage