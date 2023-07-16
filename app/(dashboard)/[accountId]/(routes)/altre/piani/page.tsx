import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { PianoColumn } from './components/columns'
import PianoClient from './components/client'

const PianiPage = async ({ params }: { params: { accountId: string } }) => {
    const piani = await prismadb.piano.findMany({
        include: {
            discoteca: true,
            sale: true,
        }
    })

    const admin = await prismadb.accounts.findUnique({
        where: {
            id: params.accountId
        },
    })

    const formattedDiscoteche: PianoColumn[] = piani.map((item) => ({
        id: item.id,
        name: item.nome,
        sale: item.sale.length,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        superior: admin?.superior,
    }))
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <PianoClient data={formattedDiscoteche} />
            </div>
        </div>
    )
}

export default PianiPage