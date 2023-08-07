"use client"
import React from 'react'
import { OrdersColumn, columns } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

interface OrdersBigliettiClientProps {
  data: OrdersColumn[],
}

const OrdersBigliettiClient = ({ data }: OrdersBigliettiClientProps) => {

  return (
    <>
      <Heading title={data.length > 1 ? `Ordini Biglietti (${data.length})` : `Ordine Biglietto (${data.length})`} description='Guarda gli ordini dei biglietti' />
      <Separator />
      <DataTable columns={columns} data={data} searchKey='codice' />
    </>
  )
}

export default OrdersBigliettiClient