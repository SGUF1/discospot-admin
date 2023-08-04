"use client"
import getGlobalHours from '@/actions/getGlobalHours';
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Evento, Informazione, Lista, Sala, TipoInformazione, TipologiaEvento } from '@prisma/client'
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface ListaFormProps {
  initialData: Lista & {
    informazioni: Informazione[]
  } | null,
  tipoInformazione: TipoInformazione[]
  isSuperior: boolean
}

const formSchema = z.object({
  nome: z.string().min(1),
  informations: z.object({
    descrizione: z.string().min(1),
    numeroInformazione: z.coerce.number().min(1),
    tipoInformazioneId: z.string().min(1)
  }).array(),
  priority: z.coerce.number().default(1),
  imageUrl: z.string().min(1),
  dataLimite: z.date(),
  quantity: z.coerce.number().min(1).default(1),
  bigliettiInfiniti: z.boolean().default(false),
  prezzoBiglietto: z.coerce.number().min(1),

})

type ListaFormValues = z.infer<typeof formSchema>
const ListaForm = ({ initialData, isSuperior, tipoInformazione }: ListaFormProps) => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Modifica la lista" : "Crea una lista";
  const description = initialData ? "Modifica la lista per attiratare più gente nella tua discoteca" : "Crea una lista per attirare più gente nella tua discoteca";
  const toastMessage = initialData ? "La lista è stata modificata" : "La lista è stata creata"
  const action = initialData ? "Salva le modifiche" : "Crea la lista";

  const form = useForm<ListaFormValues>({
    resolver: zodResolver(formSchema),
    // @ts-ignore
    defaultValues: initialData
      ? {
        ...initialData,
        informations: initialData?.informazioni
      }
      : {
        nome: "",
        informations: [],
        priority: 1,
        imageUrl: "",
        dataLimite: new Date(),
        quantity: 1,
        bigliettiInfiniti: false,
        prezzoBiglietto: 0,
      }
  })

  const onSubmit = async (data: ListaFormValues) => {
    try {
      setLoading(true);
      if (!initialData) {
        await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/liste`, data);
      } else {
        await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/liste/${params.listaId}`, data)
      }
      router.refresh();
      router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Qualcosa è andato storto")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/liste/${params.listaId}`)
      router.refresh();
      router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
      toast.success("La lista è stata eliminata");
    } catch (error) {
      toast.error("Qualcosa è andato storto");
    }
    finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant={"destructive"} size={"sm"} onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form className='space-y-8 w-full ' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-5 grid-row-2 space-x-5'>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Lista:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="nome evento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorità Lista:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading && !isSuperior}
                      type="number"
                      placeholder="priorità"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prezzoBiglietto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prezzo biglietto singolo:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading }
                      type="number"
                      placeholder="Prezzo biglietto singolo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lista image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>
          
          <div className='flex flex-col space-y-8'>
            <div className='space-y-5'>
           <div className='flex space-x-10'>
                <FormField
                  control={form.control}
                  name="bigliettiInfiniti"
                  render={({ field }) => (
                    <FormItem className="flex flex-row w-[400px] items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Biglietti infiniti?</FormLabel>
                        <FormDescription>
                          Attivando questa opzioni i biglietti sanno infiniti e li si potrà acquistare fino a che non arriva il giorno di fine
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!form.getValues().bigliettiInfiniti && <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero Biglietti:</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="number"
                          placeholder="Numero biglietti"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />}
           </div>

              <FormField
                control={form.control}
                name="dataLimite"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data di fine</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          // @ts-ignore
                          onSelect={field.onChange}
                          disabled={(date) =>
                           date <= new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Seleziona la data in cui la lista non sarà più disponibile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-4 '>
            </div>



            <FormField
              control={form.control}
              name="informations"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Aggiungi descrizione:</FormLabel>
                  {field.value?.map((informazione, index) => (
                    <div className="flex  w-[900px] space-x-2 space-y-2 items-start" key={index}>
                      <div className="flex flex-col mt-2 w-[400px] space-y-4">
                        <FormLabel>Descrizione:</FormLabel>
                        <Textarea
                          disabled={loading}
                          value={informazione.descrizione}
                          onChange={(e) =>
                            field.onChange(
                              field.value.map((p, i) =>
                                i === index ? { ...p, descrizione: e.target.value } : p
                              )
                            )
                          }
                          placeholder="Scrivi l'informazione"
                        />
                      </div>
                      <div className="flex flex-col mt-3 w-[400px] space-y-4">
                        <FormLabel>Numero informazione:</FormLabel>
                        <Input
                          disabled={loading}
                          type="number"
                          value={informazione.numeroInformazione}
                          onChange={(e) =>
                            field.onChange(
                              field.value.map((p, i) =>
                                i === index ? { ...p, numeroInformazione: parseInt(e.target.value) } : p
                              )
                            )
                          }
                          placeholder="informazione 1, 2..."
                        />
                      </div>
                      <div>
                        <FormLabel>Tipo descrizione</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={(value) =>
                            field.onChange(
                              field.value.map((p, i) => (i === index ? { ...p, tipoInformazioneId: value } : p))
                            )
                          }
                          value={informazione.tipoInformazioneId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue defaultValue={informazione.tipoInformazioneId} placeholder="Seleziona la tipologia di informazione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tipoInformazione.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    disabled={loading}
                    size="sm"
                    onClick={() => field.onChange([...field.value, { descrizione: '', numeroInformazione: 1, tipoInformazioneId: "" }])}
                  >
                    Aggiungi
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>

  )
}
export default ListaForm