import getGlobalHours from '@/actions/getGlobalHours';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { accountId: string; discotecaId: string } }) {
	try {
		const body = await req.json();
		const {
			nome,
			imageUrl,
			informations,
			quantity,
			bigliettiInfiniti,
			prezzoBiglietto,
			priority,
			dataLimite,
		} = body;

		if (!informations) {
			return new NextResponse('informazioni is required', { status: 400 });
		}
		if (!nome) {
			return new NextResponse("Nome dell'lista is required", {
				status: 400
			});
		}
		if (!dataLimite) {
			return new NextResponse('Data di inizio is required', { status: 400 });
		}
		if (!imageUrl) {
			return new NextResponse('Image URL is required', { status: 400 });
		}
		if (!priority) {
			return new NextResponse('Priorità is required', { status: 400 });
		}

		if (!prezzoBiglietto) {
			return new NextResponse('Prezzo biglietto is required', { status: 400 });
		}

		const data = new Date(dataLimite)
		if(bigliettiInfiniti) quantity === 9999999;
		const lista = await prismadb.lista.create({
			data: {
				nome,
				imageUrl,
				priority,
				discotecaId: params.discotecaId,
				bigliettiInfiniti,
				prezzoBiglietto,
				quantity,
				dataLimite: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours() + getGlobalHours, 0),
				bigliettiRimanenti: quantity,
				informazioni: {
					createMany: {
						data: informations.map((item: any) => ({
							descrizione: item.descrizione,
							numeroInformazione: item.numeroInformazione,
							tipoInformazioneId: item.tipoInformazioneId,
						})),
					},
				},
			},
		});

		return NextResponse.json(lista);
	} catch (error) {
		console.log('[LISTA POST]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: { accountId: string; discotecaId: string } }) {
	try {
		const lista = await prismadb.lista.findMany({
			orderBy: {
				dataLimite: 'asc'
			},
			include: {
				informazioni: true,
			}
		});

		return NextResponse.json(lista);
	} catch (error) {
		console.log('[LISTA GET]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}
