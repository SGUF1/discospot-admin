import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prismadb from '@/lib/prismadb'
import React from 'react'
import AccountForm from './components/account-form'

const AccountPage = async ({ params }: { params: { accountId: string } }) => {
    const account = await prismadb.accounts.findUnique({
        where: {
            id: params.accountId
        }
    })
    return (
        <div className='p-8 '>
            <Heading title={`${account?.username}`} description='Modifica qui il tuo account' />
            <Separator />
            <AccountForm data={account} />
        </div>
    )
}

export default AccountPage