import prismadb from '@/lib/prismadb'
import React from 'react'
import SalaForm from './components/sala-form'

const SalaPage = async ({ params }: { params: { discotecaId: string, salaId: string } }) => {
  
  const sala = await prismadb.sala.findUnique({
    where: {
      id: params.salaId
    }
  })

  const piani = await prismadb.piano.findMany()

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SalaForm initialData={sala} piani={piani} />
      </div>
    </div>
  )
}

export default SalaPage