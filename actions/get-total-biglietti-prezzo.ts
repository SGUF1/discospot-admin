import prismadb from '@/lib/prismadb'
import React from 'react'

export const getTotaleBigliettiPrezzo = async () => {
    const orders = await prismadb.orderBiglietto.findMany({
        where: {
            isPaid: true
        }
    })

    const totalRevenue: number = orders.reduce((total, order) => {
        return total + order.prezzo
    }, 0);

    
    return totalRevenue
}
