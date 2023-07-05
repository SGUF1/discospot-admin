import prismadb from '@/lib/prismadb'
import React, { useState } from 'react'
import { AdminColumn } from './components/columns'
import { format } from 'date-fns'
import AdminSettingClient from './components/client'

const AdminsPage =  async ({params}: {params: {accountId: string}}) => {
  const accounts = await prismadb.accounts.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  const admin = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    }
  })

  const formattedAccounts: AdminColumn[] = accounts.map((item) => ({
    id: item.id,
    username: item.username,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    superior: item.superior,
    isSuperior: admin?.superior
  }))
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <AdminSettingClient data={formattedAccounts} />
      </div>
    </div>
  )
}

export default AdminsPage