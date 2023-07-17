import prismadb from '@/lib/prismadb'
import React from 'react'
import PortataForm from './components/portata-form'

const PortataPage = async ({ params }: { params: { discotecaId: string,menuId: string, portataId: string } }) => {
  
  const portata = await prismadb.portata.findUnique({
    where: {
      id: params.portataId
    },
    include: {
      prodotti: true
    }
  })

  const optionProdotti = await prismadb.optionProdotto.findMany()

  
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <PortataForm initialData={portata} optionProdotti={optionProdotti}/>
      </div>
    </div>
  )
}

export default PortataPage