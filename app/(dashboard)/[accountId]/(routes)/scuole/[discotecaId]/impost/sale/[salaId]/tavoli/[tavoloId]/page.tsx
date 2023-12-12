import prismadb from '@/lib/prismadb'
import React from 'react'
import TavoloForm from './components/tavolo-form'

const TavoloPage = async ({ params }: { params: { discotecaId: string, tavoloId: string } }) => {

  const tavolo = await prismadb.tavolo.findUnique({
    where: {
      id: params.tavoloId,

    }
  })

  const piani = await prismadb.piano.findMany()
  const posizioni = await prismadb.posizione.findMany()
  const stati = await prismadb.stato.findMany()

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <TavoloForm initialData={tavolo} piani={piani} posizioni={posizioni} stati={stati} />
      </div>
    </div>
  )
}

export default TavoloPage