import prismadb from '@/lib/prismadb'
import React from 'react'
import DataForm from './components/data-form'

const DataPage = async ({ params }: { params: { discotecaId: string, dataId: string } }) => {
  
  const date = await prismadb.data.findUnique({
    where: {
      id: params.dataId
    }
  })

  const evento = await prismadb.evento.findMany()

  const tipiInformazione = await prismadb.tipoInformazione.findMany()

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <DataForm initialData={date}  evento={evento} />
      </div>
    </div>
  )
}

export default DataPage