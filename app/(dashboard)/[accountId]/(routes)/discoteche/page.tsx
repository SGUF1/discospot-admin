import prismadb from '@/lib/prismadb'
import React from 'react'
import { DiscotecaColumn } from './components/columns'
import { format } from 'date-fns'
import DiscotecaClient from './components/client'

const DiscotechePage = async ({ params }: { params: { accountId: string } }) => {
  const discoteche = await prismadb.discoteca.findMany({
    orderBy: {
      name: 'desc'
    },
    include: {
      provincia: true
    }
  })
  
  const admin = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    },
    include: {
      discoteca: true
    }
  })
  var formattedDiscoteche: DiscotecaColumn[] = []
  if(admin?.superior){

    formattedDiscoteche = discoteche.map((item) => ({
      id: item.id,
      name: item.name,
      city: item.city,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      isSuperior: admin?.superior,
      provincia: item.provincia.name,
      caparra: item.caparra,
      visible: item.visibile,
      maximumOrderDate: item.maximumOrderDate
    }))
  }else{
    formattedDiscoteche = [{
      // @ts-ignore
      id: admin?.discoteca?.id,
      // @ts-ignore
      name: admin?.discoteca?.name,
      // @ts-ignore
      city: admin?.discoteca?.city,
      // @ts-ignore
      createdAt: format(admin?.discoteca?.createdAt, "MMMM do, yyyy"),
      // @ts-ignore
      isSuperior: admin?.superior,
      // @ts-ignore
      provincia: admin?.discoteca?.name,
      // @ts-ignore
      caparra: admin?.discoteca?.caparra ,
      // @ts-ignore
      visible: admin?.discoteca?.visibile,
      // @ts-ignore
      maximumOrderDate: admin?.discoteca?.maximumOrderDate
    }]
  }
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        
        <DiscotecaClient data={formattedDiscoteche} />
      </div>
    </div>
  )
}

export default DiscotechePage