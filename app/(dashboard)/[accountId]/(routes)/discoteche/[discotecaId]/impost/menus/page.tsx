import prismadb from '@/lib/prismadb'
import React from 'react'
import { MenuColumn } from './components/columns'
import { format } from 'date-fns'
import MenuClient from './components/client'

const MenusPage = async ({ params }: { params: { discotecaId: string } }) => {


  const menus = await prismadb.menu.findMany({
    where: {
      discotecaId: params.discotecaId
    },
    include:{
      portate: true
    }
  })
  const formattedMenus: MenuColumn[] = menus.map((item) => ({
    id: item.id,
    isVisible: item.isVisible,
    nome: item.nome,
    portate: item.portate.length,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <MenuClient data={formattedMenus}  />
      </div>
    </div>
  )
}

export default MenusPage