import prismadb from '@/lib/prismadb'
import React from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import InformazioniPage from './informazioni/page'
import EventiPage from './eventi/page'
import SalePage from './sale/page'
import MenusPage from './menus/page'

const DiscotecaImpostazioniPage = async ({ params }: { params: { accountId: string, discotecaId: string } }) => {
    const discoteca = await prismadb.discoteca.findUnique({
        where: {
            id: params.discotecaId
        }
    })

    return (
        <div>
            <div className='p-8'>
                <Heading title={discoteca?.name!} description='Gesttisci le varie impostazioni della discoteca' />
                <Separator />
            </div>
            <SalePage params={params}/>
            <Separator />

            <InformazioniPage params={params} />
            <Separator />
            <EventiPage params={params}/>
            <Separator/>
            <MenusPage params={params}/>
        </div>
    )
}

export default DiscotecaImpostazioniPage