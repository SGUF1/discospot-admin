import prismadb from '@/lib/prismadb'
import React from 'react'

export const getTotalDiscotecheBiglietti = async (discotecaId: string) => {
    const orders = await prismadb.orderBiglietto.count(
        {
            where: {
                lista: {
                    discotecaId,
                },
                isPaid: true
            }
        }
    )

    return orders
}
