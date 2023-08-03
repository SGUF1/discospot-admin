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
    return total + order.prezzoTotale * order.numeroPersonePagato
  }, 0);


  return totalRevenue.toFixed(2);
};
