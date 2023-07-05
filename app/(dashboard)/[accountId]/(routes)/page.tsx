import prismadb from '@/lib/prismadb';
import React from 'react'

interface DashboardPageProps {
    params: { accountId: string }
}
const DashboardPage = async ({ params }: DashboardPageProps) => {

    const account = await prismadb.accounts.findFirst({
        where: {
            id: params.accountId
        }
    })

    return (
        <div>DashboardPage {account?.username}</div>
    )
}

export default DashboardPage
