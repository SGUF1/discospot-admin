import prismadb from '@/lib/prismadb'
import React from 'react'
import { DateColumn } from './components/columns'
import { format, parseISO } from 'date-fns'
import InformazioniClient from './components/client'
import DateClient from './components/client'

const DatePage = async ({ params }: { params: { discotecaId: string } }) => {


  const date = await prismadb.data.findMany({
    include: {
      sala: true
    },
    where: {
      discotecaId: params.discotecaId
    }
  })

  // @ts-ignore
  const formattedDate: DateColumn[] = date.map((item) => ({
    id: item.id,
    type: item?.type || "evento",
    giorni: item?.giorni || " ",
    date: item?.data ? format(item.data, "MMMM do, yyyy") : "",
    // @ts-ignore
    rangeDate: (item.dateRange?.from ? "Da " + format(parseISO(item.dateRange.from), "MMMM do, yyyy") : " ") + (item.dateRange?.to ? " -> A " + format(parseISO(item.dateRange.to), "MMMM do, yyyy") : " "),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <DateClient data={formattedDate} />
      </div>
    </div>
  )
}

export default DatePage