import prismadb from '@/lib/prismadb'
import React from 'react'
import ProvinciaForm from './components/provincia-form'

const DiscotecaPage = async ({ params }: { params: { accountId: string, provinciaId: string } }) => {
    const provincia = await prismadb.provincia.findUnique({
        where: {
            id: params.provinciaId
        }
    })


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProvinciaForm initialData={provincia} />
            </div>
        </div>
    )
}

export default DiscotecaPage