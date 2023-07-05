import prismadb from '@/lib/prismadb'
import React from 'react'
import AdminForm from './components/admin-form'
import { redirect } from 'next/navigation'

const AdminPage = async ({ params }: { params: { accountId: string, adminId: string } }) => {
    const admin = await prismadb.accounts.findUnique({
        where: {
            id: params.adminId
        }
    })

    if (!admin && params.adminId != "new")
        redirect(`/${params.accountId}/admins`)
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <AdminForm initialData={admin} />
            </div>
        </div>
    )
}

export default AdminPage