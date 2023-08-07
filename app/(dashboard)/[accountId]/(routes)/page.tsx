import prismadb from '@/lib/prismadb'
import React from 'react'
import { format } from 'date-fns'
import { DiscotecaColumn } from './discoteche/components/columns'
import DiscotecaClient from './discoteche/components/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTotalGraphRevenue } from '@/actions/get-total-graph-revenue'
import { Overview } from '@/components/overview'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { BarChart2, BarChart2Icon, CreditCard, DiscIcon, EuroIcon } from 'lucide-react'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { getTotalSalesCount } from '@/actions/get-total-sales-count'
import { getDiscoteche } from '@/actions/get-discoteche'
import { getTaxPrezzoRevenue } from '@/actions/get-tax-total'
import { getTotaleBigliettiVenduti } from '@/actions/get-total-biglietti-venduti'
import { getTotaleBigliettiPrezzo } from '@/actions/get-total-biglietti-prezzo'
import { getTotalTaxBiglietti } from '@/actions/get-total-tax-biglietti'
import { getSalesCount } from '@/actions/get-sales-count'

const DiscotechePage = async ({ params }: { params: { accountId: string } }) => {
  const account = await prismadb.accounts.findUnique({
    where: {
      id: params.accountId
    },
  })

  const graphRevenue = await getTotalGraphRevenue()
  const totalRevenue = await getTotalRevenue();
  const salesCount = await getTotalSalesCount();

  return (
    <div>
      {account?.superior ? (
        <div className='pt-6 px-8' >
          <Heading title={`Dashboard`} description="Visualizza il totale di tutte le discoteche" />
          <Separator />
          <div className='grid grid-cols-2 mt-5'>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Guadagno Totale Tavoli
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
                  Guadagno Totale Commissioni Tavoli
                </CardTitle>
                <EuroIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTaxPrezzoRevenue()}€</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Guadagno Totale Biglietti
                </CardTitle>
                <EuroIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotaleBigliettiPrezzo()}€</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Guadagno Totale Commissioni Biglietti
                </CardTitle>
                <EuroIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalTaxBiglietti()}€</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  N. Tavoli venduti
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{getTotalSalesCount()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  N. Biglietti venduti
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{getTotaleBigliettiVenduti()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discoteche totali</CardTitle>
                <DiscIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getDiscoteche()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4 mt-5">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={graphRevenue} />
            </CardContent>
          </Card>
        </div >)
        : <div className='flex absolute flex-row justify-center items-center'><h1 className='text-5xl mt-32'>QUESTA AREA E' ACCESSIBILE SOLAMENTE DAI SUPERIORI</h1></div>}
    </div>
  )
}

export default DiscotechePage