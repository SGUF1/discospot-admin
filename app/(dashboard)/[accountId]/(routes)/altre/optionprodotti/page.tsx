import prismadb from '@/lib/prismadb'
import React from 'react'
import { OptionProdottoColumn } from './components/columns'
import { format } from 'date-fns'
import OptionProdottoClient from './components/client'

const OptionProdottiPage = async ({ params }: { params: { accountId: string } }) => {

  const optionProdotti = await prismadb.optionProdotto.findMany()

  const formattedOptionProdotti: OptionProdottoColumn[] = optionProdotti.map((item) => ({
    id: item.id,
    nome: item.nome,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OptionProdottoClient data={formattedOptionProdotti} />
      </div>
    </div>
  )
}

export default OptionProdottiPage