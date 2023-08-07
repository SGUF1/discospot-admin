import prismadb from "@/lib/prismadb"

export const getDiscotecaPriority = async (discotecaId: string) => {
    const discoteca = await prismadb.discoteca.findUnique({
        where: {
            id: discotecaId
        }
    })


    return discoteca?.priority!
}