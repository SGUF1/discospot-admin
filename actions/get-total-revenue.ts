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
    return total + order.prezzoTotale * order.numeroPersonePagato
  }, 0);

  return totalRevenue;
};
