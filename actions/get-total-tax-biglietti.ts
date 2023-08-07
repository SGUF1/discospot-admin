import prismadb from "@/lib/prismadb";

export const getTotalTaxBiglietti = async () => {
    const paidOrders = await prismadb.orderBiglietto.findMany({
        where: {
            isPaid: true,
        },
    });

    const totalRevenue: number = paidOrders.reduce((total, order) => {
        return total + ((order.prezzo * 5.2) / 100 + 0.68)
    }, 0);


    return totalRevenue.toFixed(2);
};
