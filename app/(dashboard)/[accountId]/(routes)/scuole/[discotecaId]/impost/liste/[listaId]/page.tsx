import prismadb from '@/lib/prismadb'
import React from 'react'
import ListaForm from './components/lista-form'

const ListaPage = async ({ params }: { params: {accountId: string, discotecaId: string, listaId: string } }) => {

  const lista = await prismadb.lista.findUnique({
    where: {
      id: params.listaId,
    },
    include: {
      informazioni: {
        orderBy: {
          numeroInformazione: 'asc'
        }
      }
    }
  })
  const account = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    }
  })

  const tipoInformazioni = await prismadb.tipoInformazione.findMany()
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ListaForm initialData={lista} isSuperior={account?.superior!} tipoInformazione={tipoInformazioni}/>
      </div>
    </div>
  )
}

export default ListaPage