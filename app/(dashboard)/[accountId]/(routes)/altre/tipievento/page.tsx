import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { TipoEventoColumn } from './components/columns'
import StatoClient from './components/client'

const TipiEvento = async ({ params }: { params: { accountId: string } }) => {
    const tipoEventi = await prismadb.tipologiaEvento.findMany({
        include: {
            eventi: true
        }
    })

    const formattedEvento: TipoEventoColumn[] = tipoEventi.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        numeroEventi: item.eventi.length
    }))
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <StatoClient data={formattedEvento} />
            </div>
        </div>
    )
}

export default TipiEvento