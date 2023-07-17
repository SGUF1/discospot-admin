import prismadb from '@/lib/prismadb'
import React from 'react'
import OptionProdottoForm from './components/option-prodotto-form'

const OptionProdottoPage = async ({ params }: { params: { discotecaId: string, optionprodottoId: string } }) => {
  
  const optionProdotto = await prismadb.optionProdotto.findUnique({
    where: {
      id: params.optionprodottoId
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OptionProdottoForm initialData={optionProdotto} />
      </div>
    </div>
  )
}

export default OptionProdottoPage