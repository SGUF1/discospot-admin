import prismadb from '@/lib/prismadb'
import React from 'react'

export const getTotalPersonePagate = async (discotecaId: string) => {
    const orders = await prismadb.order.findMany(
        {
            where: {
                discotecaId,
                isPaid: true
            }
        }
    )

    const total: number = orders.reduce((t, item) => {
        return t + item.numeroPersonePagato
    }, 0)

    return total
}
