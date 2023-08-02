import prismadb from "@/lib/prismadb";

export const getTotalDiscotecheRevenue = async (discotecaId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      discotecaId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          prodotto: true,
        },
      },
      tavolo: true,
    },
  });

  const totalRevenue: number = paidOrders.reduce((total, order) => {
    const tavoloPrezzoPerPersona = Number(order.tavolo.prezzo) / order.numeroPersone;
    const orderTotal = order.orderItems.reduce((orderTotal, orderItem) => {
      return orderTotal + (orderItem.prodotto.prezzo * orderItem.quantity) / order.numeroPersone;
    }, 0);
    return total + orderTotal + tavoloPrezzoPerPersona;
  }, 0);

  return totalRevenue.toFixed(2);
};
