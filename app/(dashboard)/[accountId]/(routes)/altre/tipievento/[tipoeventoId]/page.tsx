import prismadb from '@/lib/prismadb'
import React from 'react'
import TipoEventoForm from './components/tipoevento-form'

const TipologiaEvento = async ({ params }: { params: { accountId: string, tipoeventoId: string } }) => {
    const tipologiaEvento = await prismadb.tipologiaEvento.findUnique({
        where: {
            id: params.tipoeventoId
        }
    })


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <TipoEventoForm initialData={tipologiaEvento} />
            </div>
        </div>
    )
}

export default TipologiaEvento