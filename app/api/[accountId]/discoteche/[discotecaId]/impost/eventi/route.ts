import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { accountId: string; discotecaId: string } }) {
	try {
		const body = await req.json();
		const {
			nome,
			imageUrl,
			startDate,
			endDate,
			prioriti,
			tipologiaEventoId,
			informations,
			oraInizio,
			oraFine,
			eventoSala,
			salaId
		} = body;

		if (!informations) {
			return new NextResponse('informazioni is required', { status: 400 });
		}
		if (!nome) {
			return new NextResponse("Nome dell'evento is required", {
				status: 400
			});
		}
		if (!startDate) {
			return new NextResponse('Data di inizio is required', { status: 400 });
		}
		if (!endDate) {
			return new NextResponse('Data di fine is required', { status: 400 });
		}
		if (!imageUrl) {
			return new NextResponse('Image URL is required', { status: 400 });
		}
		if (!prioriti) {
			return new NextResponse('Priorità is required', { status: 400 });
		}
		if (!tipologiaEventoId) {
			return new NextResponse('Tipologia Id is required', { status: 400 });
		}
		if (!oraInizio) {
			return new NextResponse('Ora inizio is required', { status: 400 });
		}
		if (!oraFine) {
			return new NextResponse('Ora fine is required', { status: 400 });
		}
			
		const evento = await prismadb.evento.create({
      data: {
        nome,
        imageUrl,
        startDate,
        endDate,
        prioriti,
        tipologiaEventoId,
        discotecaId: params.discotecaId,
        oraInizio,
        oraFine,
        eventoSala,
        salaId,
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

		return NextResponse.json(evento);
	} catch (error) {
		console.log('[EVENTO POST]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: { accountId: string; discotecaId: string } }) {
	try {
		const evento = await prismadb.evento.findMany({
			orderBy: {
				startDate: 'asc'
			},
			include: {
				discoteca: true,
				sala: true,
				tipologiaEvento: true,
				informazioni: true,
			}
		});

		return NextResponse.json(evento);
	} catch (error) {
		console.log('[EVENTO GET]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}
