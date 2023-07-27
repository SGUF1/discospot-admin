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
import prismadb from '@/lib/prismadb';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accounts, Data, Discoteca, Informazione, Piano, Posizione, Posto, Provincia, Sala, Stato, Tavolo, TipoInformazione } from '@prisma/client'
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface SalaFormProps {
    initialData: Sala & {
        date: Data[]
    }| null,
    piani: Piano[],
    stati: Stato[]
}

const formSchema = z.object({
    nome: z.string().min(1),
    descrizione: z.string().min(1),
    imageUrl: z.string().min(1),
    pianoId: z.string().min(1),
    statoId: z.string().min(1),
    date: z.object({
        data: z.date()
    }).array()
})

type SalaFormValues = z.infer<typeof formSchema>
const SalaForm = ({ initialData, piani, stati }: SalaFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Modifica la sala" : "Crea una sala";
    const description = initialData ? "Modifica la sala che verrà visualizzata nella discoteca" : "Crea una sala che verrà visualizzata nella discoteca";
    const toastMessage = initialData ? "La sala è stata modificata" : "La sala è stata creata"
    const action = initialData ? "Salva le modifiche" : "Crea";

    const form = useForm<SalaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData, date: initialData?.date
        } :{
            nome: "",
            descrizione: "",
            imageUrl: "",
            pianoId: "",
            statoId: "",
            date: []
        }
    })

    const onSubmit = async (data: SalaFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/sale`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}`, data)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}`)
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
            toast.success("La sala è stata eliminata");
        } catch (error) {
            toast.error("Elimina tutti i tavoli prima");
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
                    <div className='grid grid-cols-4 space-x-5'>
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome sala:</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="descrizione"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrizione sala:</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a description"
                                            className="resize-none"
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
                                    <FormLabel>Sala image</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="pianoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Piano sala:</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Seleziona il piano" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {piani.map((piano) => (
                                                <SelectItem key={piano.id} value={piano.id}>{piano.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                    </div>
                   <div className='w-[30%]'>
                        <FormField
                            control={form.control}
                            name="statoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stato sala:</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Seleziona lo stato" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {stati.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                   </div>
                    <div className='w-[30%]'>
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date di fine dell'evento</FormLabel>
                                    <div className="space-y-4">
                                        {field.value.map((date, index) => (
                                            <div key={index} className="flex items-center">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Input
                                                            type="date"
                                                            value={format(date.data, "yyyy-MM-dd")}
                                                            onChange={(e) => {
                                                                const newDates = [...field.value];
                                                                newDates[index] = { data: new Date(e.target.value) };
                                                                field.onChange(newDates);
                                                            }}
                                                        />
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date.data}
                                                            onSelect={(selectedDate) => {
                                                                const newDates = [...field.value];
                                                                newDates[index] = { data: selectedDate! };
                                                                field.onChange(newDates);
                                                            }}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newDates = [...field.value];
                                                        newDates.splice(index, 1);
                                                        field.onChange(newDates);
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        disabled={loading}
                                        size="sm"
                                        type='button'
                                        onClick={() => field.onChange([...field.value, { data: new Date() }])}
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

export default SalaForm