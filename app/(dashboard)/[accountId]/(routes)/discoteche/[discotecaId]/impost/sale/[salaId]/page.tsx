import prismadb from '@/lib/prismadb'
import React from 'react'
import SalaForm from './components/sala-form'
import { Prisma } from '@prisma/client';

const SalaPage = async ({ params }: { params: { discotecaId: string, salaId: string } }) => {
  

  const sala = await prismadb.sala.findUnique({
    where: {
      id: params.salaId,
    },
    include: {
      date: {
        where: {
          data: {
          },
        },
        orderBy: {
          data: 'asc',
        },
      },
    },
  });


  const piani = await prismadb.piano.findMany()
  const stati = await prismadb.stato.findMany()
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SalaForm initialData={sala} piani={piani} stati={stati}/>
      </div>
    </div>
  )
}

export default SalaPage