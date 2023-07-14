import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
	req: Request,
	{ params }: { params: { accountId: string; discotecaId: string; tavoloId: string } }
) {
	try {
		const body = await req.json();
		const { numero1, statoId } = body;

		if (!numero1) {
			return new NextResponse('Numero posti is required', { status: 400 });
		}
		if (!statoId) {
			return new NextResponse('Stato dei posti is required', {
				status: 400
			});
		}

		var postii = []
		for (let i = 0; i < numero1; i++) {
			const posti = await prismadb.posto.createMany({
				data: {
					numero: i,
					statoId,
					tavoloId: params.tavoloId
				}
			});
			postii.push(posti)
		}
		return NextResponse.json(postii);
	} catch (error) {
		console.log('[POSTI POST]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: { accountId: string; discotecaId: string } }) {
	try {
		const posti = await prismadb.posto.findMany({
			where: {
				tavoloId: params.discotecaId
			}
		});

		return NextResponse.json(posti);
	} catch (error) {
		console.log('[POSTI GET]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}
