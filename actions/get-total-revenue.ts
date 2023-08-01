import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async () => {
  const paidOrders = await prismadb.order.findMany({
    where: {
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
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.prodotto.prezzo;
    }, Number(order.tavolo.prezzo));
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
