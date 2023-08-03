import prismadb from "@/lib/prismadb"

export const getDiscotecaLike = async (discotecaId: string) => {
    const discoteca = await prismadb.discoteca.findUnique({
        where: {
            id: discotecaId
        }
    })

    return discoteca?.like
}