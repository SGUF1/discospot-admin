// Assicurati di avere importato correttamente il tipo NextResponse
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// Modifica la firma delle funzioni POST e GET per includere la variabile `params`
export async function POST(req: Request, { params }: { params: { accountId: string; menuId: string } }) {
  try {
    const body = await req.json();
    const { nome, numeroPortata, lastPortata, products, singolaSelezione, numeroBibiteDiverse, numeroBibiteTotale } = body;

    if (!nome) {
      return new NextResponse('Nome is required', { status: 400 });
    }

    if (!numeroPortata || numeroPortata === 0) {
      return new NextResponse('Numero portata is required', { status: 400 });
    }

    if (!products.length || !products) {
      return new NextResponse('Prodotti is required', { status: 400 });
    }

    const portata = await prismadb.portata.create({
      data: {
        menuId: params.menuId,
        nome,
        lastPortata,
        numeroPortata,
        singolaSelezione,
        numeroBibiteDiverse,
        numeroBibiteTotale,
        prodotti: {
          createMany: {
            data: products.map((product: any) => ({
              descrizione: product.descrizione,
              prezzo: product.prezzo,
              limite: product.limite,
              imageUrl: product.imageUrl, 
              nome: product.nome,
            })),
          },
        },
      },
    });

    return NextResponse.json(portata);
  } catch (error) {
    console.log('[PORTATE POST]', error);
    return new NextResponse('Internal Error' + error, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { accountId: string; menuId: string } }) {
  try {
    const portata = await prismadb.portata.findMany({
      where: {
        menuId: params.menuId,
      },
    });

    return NextResponse.json(portata);
  } catch (error) {
    console.log('[PORTATE GET]', error);
    return new NextResponse('Internal Error' + error, { status: 500 });
  }
}
