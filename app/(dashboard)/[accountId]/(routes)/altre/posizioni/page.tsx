import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { PosizioneColumn } from './components/columns'
import PosizioneClient from './components/client'

const PosizioniPage = async ({ params }: { params: { accountId: string } }) => {
    const posizione = await prismadb.posizione.findMany({
        include: {
            tavoli: true
        }
    })

    const admin = await prismadb.accounts.findUnique({
        where: {
            id: params.accountId
        },
    })

    const formattedPosizione: PosizioneColumn[] = posizione.map((item) => ({
        id: item.id,
        name: item.nome,
        tavoli: item.tavoli.length,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        superior: admin?.superior
    }))
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <PosizioneClient data={formattedPosizione} />
            </div>
        </div>
    )
}

export default PosizioniPage