import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import PianiPage from './piani/page'
import TipoInformazioniPage from './tipiinformazione/page'
import PosizioniPage from './posizioni/page'
import StatiPage from './stati/page'

const AltreCosePage = async ({ params }: { params: { accountId: string } }) => {

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <TipoInformazioniPage params={params}/>
        <Separator/>
        <PosizioniPage params={params}/>
        <Separator />
        <PianiPage params={params}/>
        <Separator />
        <StatiPage params={params}/>
      </div>
    </div>
  )
}

export default AltreCosePage