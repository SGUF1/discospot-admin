import prismadb from "@/lib/prismadb"

export const getScuole = async (discotecaId: string) => {
    const scuole = await prismadb.discoteca.findMany({
        where: {
            scuola: true
        }
    })

    return scuole
}