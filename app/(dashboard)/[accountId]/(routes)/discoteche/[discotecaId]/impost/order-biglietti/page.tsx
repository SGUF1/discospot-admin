import prismadb from "@/lib/prismadb";
import React from "react";
import { OrdersColumn } from "./components/columns";
import { format } from "date-fns";
import OrdersClient from "./components/client";

const OrdersBigliettiPage = async ({
  params,
}: {
  params: { discotecaId: string };
}) => {
  const orders = await prismadb.orderBiglietto.findMany({
    where: {
      lista: {
        discotecaId: params.discotecaId,
      },
    },
    include: {
      userAccount: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrder: OrdersColumn[] = orders.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "Pp"),
    isPaid: item.isPaid,
    phone: item.phone,
    completeName: item.completeName,
    // prodotti: item.orderItems.map((orderItem) => orderItem.prodotto.portata.numeroPortata + ") " + orderItem.prodotto.nome ),
    // tavolo: item.orderItems[0]?.tavolo.numeroTavolo,
    // totalPrice: item.orderItems.reduce((total, orderItem) => {
    //   return total + Number(orderItem.prodotto.prezzo) / item.numeroPersone
    // }, Number(item.orderItems[0]?.tavolo.prezzo) / item.numeroPersone),
    orderData: format(item.data, "MMMM do, yyyy"),
    totalPrice: item.prezzo,
    codice: item.codice ?? "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient data={formattedOrder} />
      </div>
    </div>
  );
};

export default OrdersBigliettiPage;
