import prismadb from '@/lib/prismadb'
import React from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import InformazioniPage from './informazioni/page'
import EventiPage from './eventi/page'
import SalePage from './sale/page'
import MenusPage from './menus/page'
import OrdersPage from './orders/page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from '@/components/overview'
import { getGraphRevenue } from '@/actions/get-graph-revenue'
import { CreditCard, EuroIcon, Heart, User } from 'lucide-react'
import { getSalesCount } from '@/actions/get-sales-count'
import { getTotalDiscotecheRevenue } from '@/actions/get-total-discoteca-revenue'
import DatePage from './date/page'
import { getTotalPersonePagate } from '@/actions/get-total-discoteca-persone-tavoli'
import { getDiscotecaLike } from '@/actions/get-discoteca-like'
import ListePage from './liste/page'
import OrdersBigliettiPage from './order-biglietti/page'
import { getTotalDiscotecheBigliettiPrezzo } from '@/actions/get-total-discoteca-biglietto-prezzo'
import { getTotalDiscotecheBiglietti } from '@/actions/get-total-discoteca-biglietti-venduti'
import { getDiscotecaPriority } from '@/actions/getPriority-discoteca'

const DiscotecaImpostazioniPage = async ({ params }: { params: { accountId: string, discotecaId: string } }) => {
    const discoteca = await prismadb.discoteca.findUnique({
        where: {
            id: params.discotecaId
        }
    })

    const graphRevenue = await getGraphRevenue(params.discotecaId);
    const salesCount = await getSalesCount(params.discotecaId)
    const totalRevenue = await getTotalDiscotecheRevenue(params.discotecaId)
    return (
      <div>
        <div className="p-8">
          <div className="flex-1 space-y-4">
            <Heading
              title={`Dashboard ${discoteca?.name}`}
              description={
                discoteca?.scuola
                  ? "Overview of your scuola"
                  : "Overview of your discoteca"
              }
            />
            <Separator />
            <div className="grid grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Guadagno Tavoli
                  </CardTitle>
                  <EuroIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRevenue}€</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Guadagno Biglietti
                  </CardTitle>
                  <EuroIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{getTotalDiscotecheBigliettiPrezzo(discoteca?.id!)}€
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    N. Tavoli Venduti
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{salesCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    N. Biglietti Venduti
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{getTotalDiscotecheBiglietti(discoteca?.id!)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    N. Transazioni di tavoli
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{getTotalPersonePagate(discoteca?.id!)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Like</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{getDiscotecaLike(discoteca?.id!)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Discoteca Priority
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getDiscotecaPriority(discoteca?.id!)}
                  </div>
                </CardContent>
                <CardDescription>
                  Chiedi a un amministratore di aumentare
                </CardDescription>
              </Card>
            </div>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphRevenue} />
              </CardContent>
            </Card>
          </div>
        </div>
        <SalePage params={params} />
        <Separator />

        <InformazioniPage params={params} />
        <Separator />
        <ListePage params={params} />
        <Separator />

        <OrdersBigliettiPage params={params} />
        <Separator />

        <EventiPage params={params} />
        <Separator />
        <MenusPage params={params} />
        <Separator />
        <OrdersPage params={params} />
        <Separator />
        <DatePage params={params} />
      </div>
    );
}

export default DiscotecaImpostazioniPage