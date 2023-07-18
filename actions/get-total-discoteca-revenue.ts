import prismadb from "@/lib/prismadb";

export const getTotalDiscotecheRevenue = async (discotecaId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      discotecaId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          prodotto: true,
          tavolo: true,
        }
      }
    }
  });

  const totalRevenue:number = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.prodotto.prezzo;
    }, Number(order.orderItems[0].tavolo.prezzo));
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
