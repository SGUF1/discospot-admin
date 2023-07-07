import prismadb from '@/lib/prismadb'
import React from 'react'
import TipoInformazioneForm from './components/tipoinformazione-form'

const TipoInformazionePage = async ({ params }: { params: { accountId: string, tipoInformazioneId: string } }) => {
    const tipo = await prismadb.tipoInformazione.findUnique({
        where: {
            id: params.tipoInformazioneId
        }
    })


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <TipoInformazioneForm initialData={tipo} />
            </div>
        </div>
    )
}

export default TipoInformazionePage