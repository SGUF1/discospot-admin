import prismadb from "@/lib/prismadb";

export const getTaxPrezzoRevenue = async () => {
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
        return total + order.taxPrezzo * order.numeroPersonePagato
    }, 0);


    return totalRevenue.toFixed(2);
};
