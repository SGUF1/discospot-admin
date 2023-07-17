import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{
		params
	}: {
		params: { accountId: string; discotecaId: string; portataId: string };
	}
) {
	try {
		const body = await req.json();
		const { nome, numeroPortata, lastPortata, products } = body;

		if (!nome) {
			return new NextResponse('Nome is required', { status: 400 });
		}

		if (!numeroPortata || numeroPortata === 0) {
			return new NextResponse('Numero portata is required', { status: 400 });
		}

		if (!products.length || !products) {
			return new NextResponse('Prodotti is required', { status: 400 });
		}

		const portata = await prismadb.portata.update({
			where: {
				id: params.portataId
			},
			data: {
				nome,
				numeroPortata,
				lastPortata,
				prodotti: {
					deleteMany: {},
					createMany: {
						data: products.map((product: any) => ({
							descrizione: product.descrizione,
							prezzo: product.prezzo,
							nome: product.nome
						}))
					}
				}
			}
		});

		return NextResponse.json(portata);
	} catch (error) {
		console.log('[PORTATA PATCH]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{
		params
	}: {
		params: { accountId: string; discotecaId: string; portataId: string };
	}
) {
	try {
		const prodotti = await prismadb.prodotto.deleteMany({
			where: {
				portataId: params.portataId
			}
		});
		const portata = await prismadb.portata.delete({
			where: {
				id: params.portataId
			},
			include: {
				prodotti: true
			}
		});

		return NextResponse.json(portata);
	} catch (error) {
		console.log('[PORTATA DELETE]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}

export async function GET(
	req: Request,
	{
		params
	}: {
		params: { accountId: string; discotecaId: string; portataId: string };
	}
) {
	try {
		const portata = await prismadb.portata.findUnique({
			where: {
				id: params.portataId
			}
		});

		return NextResponse.json(portata);
	} catch (error) {
		console.log('[PORTATA GET]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}
