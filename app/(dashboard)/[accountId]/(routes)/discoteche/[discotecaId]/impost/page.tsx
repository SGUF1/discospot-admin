import prismadb from '@/lib/prismadb'
import React from 'react'
import TavoliPage from './tavoli/page'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import InformazioniPage from './informazioni/page'
import EventiPage from './eventi/page'

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

            <TavoliPage params={params} />
            <Separator />

            <InformazioniPage params={params} />
            <Separator />
            <EventiPage params={params}/>
        </div>
    )
}

export default DiscotecaImpostazioniPage