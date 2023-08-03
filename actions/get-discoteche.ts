import prismadb from "@/lib/prismadb"

export const getDiscoteche = async () => {
    const discoteche = await prismadb.discoteca.count({})

    return discoteche;
}