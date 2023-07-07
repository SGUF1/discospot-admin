import prismadb from '@/lib/prismadb'
import React from 'react'
import StatoForm from './components/stato-form'

const StatoPage = async ({ params }: { params: { accountId: string, statoId: string } }) => {
    const stato = await prismadb.stato.findUnique({
        where: {
            id: params.statoId
        }
    })


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <StatoForm initialData={stato} />
            </div>
        </div>
    )
}

export default StatoPage