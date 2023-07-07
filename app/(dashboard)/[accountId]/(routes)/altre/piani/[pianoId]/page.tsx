import prismadb from '@/lib/prismadb'
import React from 'react'
import PianoForm from './components/piano-form'

const PianoPage = async ({ params }: { params: { accountId: string, pianoId: string } }) => {
    const piano = await prismadb.piano.findUnique({
        where: {
            id: params.pianoId
        }
    })


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <PianoForm initialData={piano} />
            </div>
        </div>
    )
}

export default PianoPage