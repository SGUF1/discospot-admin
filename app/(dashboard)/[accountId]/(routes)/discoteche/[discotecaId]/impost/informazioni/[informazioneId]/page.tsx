import prismadb from '@/lib/prismadb'
import React from 'react'
import InformazioneForm from './components/informazione-form'

const TavoloPage = async ({ params }: { params: { discotecaId: string, informazioneId: string } }) => {
  
  const informazione = await prismadb.informazione.findUnique({
    where: {
      id: params.informazioneId
    }
  })

  const tipiInformazione = await prismadb.tipoInformazione.findMany()

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <InformazioneForm initialData={informazione} tipoinformazione={tipiInformazione} />
      </div>
    </div>
  )
}

export default TavoloPage