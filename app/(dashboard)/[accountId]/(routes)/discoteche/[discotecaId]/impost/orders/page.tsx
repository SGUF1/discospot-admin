import prismadb from '@/lib/prismadb'
import React from 'react'
import { OrdersColumn } from './components/columns'
import { format } from 'date-fns'
import OrdersClient from './components/client'

const OrdersPage = async ({ params }: { params: { discotecaId: string } }) => {

  const orders = await prismadb.order.findMany({
    where: {
      discotecaId: params.discotecaId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      discoteca: true,
      orderItems: {
        include: {
          prodotto: {
            include: {
              portata: true,
            }
          },
        },
      },
      stato: true,
      tavolo: true
    },
  })

  const formattedOrder: OrdersColumn[] = orders.map((item) => (
    {
      id: item.id,
      createdAt: format(item.createdAt, "Pp"),
      isPaid: item.isPaid,
      completeName: item.completeName,
      phone: item.phone,
      // prodotti: item.orderItems.map((orderItem) => orderItem.prodotto.portata.numeroPortata + ") " + orderItem.prodotto.nome ),
      // tavolo: item.orderItems[0]?.tavolo.numeroTavolo,
      // totalPrice: item.orderItems.reduce((total, orderItem) => {
      //   return total + Number(orderItem.prodotto.prezzo) / item.numeroPersone
      // }, Number(item.orderItems[0]?.tavolo.prezzo) / item.numeroPersone),
      prodotti: item.orderItems.map((order) => order.prodotto.portata.nome + ") " + order.prodotto.nome + " x" + order.quantity),
      tavolo: item.tavolo.numeroTavolo,
      orderData: format(item.orderDate, "MMMM do, yyyy"),
      totalPrice: item.prezzoTotale,
      codice: item.codice ?? "",
      numeroPersone: item.numeroPersone,
      stato: item.stato.nome,
      numeroPersonePagato: item.numeroPersonePagato,
    }))

    
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrdersClient data={formattedOrder} />
      </div>
    </div>
  )
}

export default OrdersPage