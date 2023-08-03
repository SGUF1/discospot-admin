import prismadb from "@/lib/prismadb"

export const getSalesCount = async (discotecaId: string) => {
    const salesCount = await prismadb.order.count({
        where: {
            discotecaId,
            isPaid: true,
        },
    
    })
    
    return salesCount;
}