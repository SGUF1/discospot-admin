import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { StatoColumn } from './components/columns'
import StatoClient from './components/client'

const StatiPage = async ({ params }: { params: { accountId: string } }) => {
    const stati = await prismadb.stato.findMany({
        include: {
            tavoli: true,
        }
    })

    const admin = await prismadb.accounts.findUnique({
        where: {
            id: params.accountId
        },
    })

    const formattedStato: StatoColumn[] = stati.map((item) => ({
        id: item.id,
        name: item.nome,
        tavoli: item.tavoli.length,
        colore: item.colore,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        superior: admin?.superior,
    }))
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <StatoClient data={formattedStato} />
            </div>
        </div>
    )
}

export default StatiPage