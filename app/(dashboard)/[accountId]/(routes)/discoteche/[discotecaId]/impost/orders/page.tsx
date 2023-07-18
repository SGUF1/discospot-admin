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
    include: {
      discoteca: true,
      orderItems: {
        include: {
          prodotto: {
            include: {
              portata: true,
            }
          },
          tavolo: true
        }
      }
    },
  })

  const formattedOrder: OrdersColumn[] = orders.map((item) => (
    {
      id: item.id,
      createdAt: format(item.createdAt, "Pp"),
      isPaid: item.isPaid,
      phone: item.phone,
      prodotti: item.orderItems.map((orderItem) => orderItem.prodotto.portata.numeroPortata + ") " + orderItem.prodotto.nome ),
      tavolo: item.orderItems[0].tavolo.numeroTavolo,
      totalPrice: item.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.prodotto.prezzo) / item.numeroPersone
      }, Number(item.orderItems[0].tavolo.prezzo) / item.numeroPersone),
      codice: item.codice,
      numeroPersone: item.numeroPersone
    }))
  orders.map((item) => (
    console.log(item.orderItems.map((orderItem) => orderItem.prodotto.nome + " " + orderItem.prodotto.portata.nome).join(","))
  ))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrdersClient data={formattedOrder} />
      </div>
    </div>
  )
}

export default OrdersPage