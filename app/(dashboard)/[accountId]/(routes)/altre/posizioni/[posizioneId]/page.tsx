import prismadb from '@/lib/prismadb'
import React from 'react'
import PosizioneForm from './components/posizione-form'

const PosizionePage = async ({ params }: { params: { accountId: string, posizioneId: string } }) => {
    const posizione = await prismadb.posizione.findUnique({
        where: {
            id: params.posizioneId
        }
    })


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <PosizioneForm initialData={posizione} />
            </div>
        </div>
    )
}

export default PosizionePage