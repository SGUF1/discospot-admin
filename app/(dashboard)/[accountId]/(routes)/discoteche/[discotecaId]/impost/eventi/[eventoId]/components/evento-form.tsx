"use client"
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
import { Evento, Sala, TipoInformazione, TipologiaEvento } from '@prisma/client'
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface EventoFormProps {
  initialData: Evento | null,
  tipologieEvento: TipologiaEvento[],
  tipoInformazione: TipoInformazione[]
  sale: Sala[]
}

const formSchema = z.object({
  nome: z.string().min(1),
  tipologiaEventoId: z.string().min(1),
  informations: z.object({
    descrizione: z.string().min(1),
    numeroInformazione: z.coerce.number().min(1),
    tipoInformazioneId: z.string().min(1)
  }).array(),
  prioriti: z.string().min(1),
  imageUrl: z.string().min(1),
  startDate: z.date(),
  oraInizio: z.string().min(1),
  endDate: z.date(),
  oraFine: z.string().min(1),
  eventoSala: z.boolean(),
  salaId: z.string()
})

type EventoFormValues = z.infer<typeof formSchema>
const EventoForm = ({ initialData, tipologieEvento, sale, tipoInformazione }: EventoFormProps) => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Modifica l'evento" : "Crea un evento";
  const description = initialData ? "Modifica l'evento" : "Crea un evento da far visualizzare tra gli eventi";
  const toastMessage = initialData ? "L'evento è stato modificato" : "L'evento è stato creato"
  const action = initialData ? "Salva le modifiche" : "Crea l'evento";

  const form = useForm<EventoFormValues>({
    resolver: zodResolver(formSchema),
    // @ts-ignore
    defaultValues: initialData || {
      nome: "",
      tipologiaEventoId: "",
      informations: [],
      prioriti: "",
      imageUrl: "",
      startDate: new Date(),
      endDate: new Date(),
      oraInizio: "",
      oraFine: "",
      eventoSala: false,
      salaId: "",
    }
  })

  const onSubmit = async (data: EventoFormValues) => {
    try {
      setLoading(true);
      const [hoursInizio, minutesInizio] = data.oraInizio.split(':')
      const [hoursFine, minutesFine] = data.oraFine.split(':')
      data.startDate = (new Date(data.startDate.getFullYear(), data.startDate.getMonth(), data.startDate.getDate(), +hoursInizio + 2, +minutesInizio))
      data.endDate = (new Date(data.endDate.getFullYear(), data.endDate.getMonth(), data.endDate.getDate(), +hoursFine + 2, +minutesFine ))
      console.log(data.startDate)
      if (!initialData) {
        await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/eventi`, data);
      } else {
        await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/eventi/${params.eventoId}`, data)
      }
      router.refresh();
      router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/eventi/${params.eventoId}`)
      router.refresh();
      router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
      toast.success("L'evento è stato eliminato");
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
                  <FormLabel>Nome evento:</FormLabel>
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
              name="prioriti"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorità evento:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
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
              name="tipologiaEventoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo informazione:</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona il tipo di informazione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipologieEvento.map((item) => (
                        <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento image</FormLabel>
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

              <div className='flex flex-row space-x-3'>
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data di inizio dell'evento</FormLabel>
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oraInizio"

                  render={({ field }) => (
                    <FormItem className='mt-[-10px]'>
                      <FormLabel>Inizio ora:</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Inizio ora"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-row space-x-3'>
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data di fine dell'evento</FormLabel>
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
                            initialFocus
                            disabled={(date) => date < form.getValues().startDate}

                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oraFine"

                  render={({ field }) => (
                    <FormItem className='mt-[-10px]'>
                      <FormLabel>Fine alle:</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="12:10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='grid grid-cols-4 '>
              <FormField control={form.control} name='eventoSala' render={({ field }) => (
                <FormItem className='flex flex-row items-center self-start '>
                  <div className='space-x-0.5 w-2/3'>
                    <FormLabel>Evento per sala?</FormLabel>
                    <FormDescription>
                      Permette di assegnare l'evento alla sala della discoteca
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              {form.getValues().eventoSala && 
<FormField
                control={form.control}
                name="salaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sala:</FormLabel>
                    <Select
                      // @ts-ignore
                      onValueChange={field.onChange}
                      // @ts-ignore
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona la sala" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sale.map((item) => (
                          <SelectItem value={item.id} key={item.id}>
                            {item.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
                  }
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
                    onClick={() => field.onChange([...field.value, { descrizione: '', numeroInformazione: 1, tipoInformazioneId: ""}])}
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
export default EventoForm