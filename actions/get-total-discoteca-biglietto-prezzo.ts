import prismadb from '@/lib/prismadb'
import React from 'react'

export const getTotalDiscotecheBigliettiPrezzo = async (discotecaId: string) => {
    const orders = await prismadb.orderBiglietto.findMany(
        {
            where: {
                lista: {
                    discotecaId,
                },
                isPaid: true
            }
        }
    )

    const totalRevenue: number = orders.reduce((total, order) => {
        return total + order.prezzo
    }, 0);


    return totalRevenue
}
