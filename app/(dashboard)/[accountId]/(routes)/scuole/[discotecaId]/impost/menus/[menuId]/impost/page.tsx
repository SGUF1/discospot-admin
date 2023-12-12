import prismadb from '@/lib/prismadb'
import React from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import PortatePage from './portate/page'


const MenuImpostazioniPage = async ({ params }: { params: { accountId: string, menuId: string } }) => {
    const menu = await prismadb.menu.findUnique({
        where: {
            id: params.menuId,
        }
    })

    return (
        <div>
            <div className='p-8'>
                <Heading title={menu?.nome!} description='Gesttisci le varie impostazioni del menu' />
                <Separator />
            </div>
            <PortatePage params={params}/>
        </div>
    )
}

export default MenuImpostazioniPage