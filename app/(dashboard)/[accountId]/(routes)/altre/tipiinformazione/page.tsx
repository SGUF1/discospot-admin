import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { TipoInformazioneColumn } from './components/columns'
import TipoInformazioneClient from './components/client'

const TipoInformazioniPage = async ({ params }: { params: { accountId: string } }) => {
    const tipo = await prismadb.tipoInformazione.findMany({
        include: {
            informazioni: true
        }
    })

    const admin = await prismadb.accounts.findUnique({
        where: {
            id: params.accountId
        },


    })

    const formattedTipoInformazione: TipoInformazioneColumn[] = tipo.map((item) => ({
        id: item.id,
        name: item.nome,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        informazioni: item.informazioni.length,
        superior: admin?.superior
    }))
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <TipoInformazioneClient data={formattedTipoInformazione} />
            </div>
        </div>
    )
}

export default TipoInformazioniPage