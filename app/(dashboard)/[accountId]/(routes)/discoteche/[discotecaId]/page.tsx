import prismadb from '@/lib/prismadb'
import React from 'react'
import DiscotecaForm from './components/discoteca-form'

const DiscotecaPage = async ({ params }: { params: { accountId: string, discotecaId: string } }) => {
    const discoteca = await prismadb.discoteca.findUnique({
        where: {
            id: params.discotecaId
        }
    })

    const province = await prismadb.provincia.findMany()
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <DiscotecaForm initialData={discoteca} province={province}/>
            </div>
        </div>
    )   
}

export default DiscotecaPage