import prismadb from '@/lib/prismadb'
import React from 'react'

export const getTotaleBigliettiVenduti = async () => {
    const orders = await prismadb.orderBiglietto.count(
        {
            where: {
                isPaid: true
            }
        }
    )

    return orders
}
