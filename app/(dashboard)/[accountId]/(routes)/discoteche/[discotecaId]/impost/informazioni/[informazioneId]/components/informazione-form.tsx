"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import prismadb from '@/lib/prismadb';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accounts, Discoteca, Informazione, Piano, Posizione, Posto, Provincia, Stato, Tavolo, TipoInformazione } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface InformazioneFormProps {
    initialData: Informazione | null,
    tipoinformazione: TipoInformazione[]
}

const formSchema = z.object({
    descrizione: z.string().min(1),
    numeroInformazione: z.string().min(1),
    tipo: z.string().min(1)
})

type InformazioneFormValues = z.infer<typeof formSchema>
const InformazioneForm = ({ initialData, tipoinformazione }: InformazioneFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit informazione" : "Create informazione";
    const description = initialData ? "Edit a informazione" : "Create a informazione";
    const toastMessage = initialData ? "Informazione updated" : "Informazione created"
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<InformazioneFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            descrizione: "",
            tipo: ""
        }
    })

    const onSubmit = async (data: InformazioneFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/informazioni`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/informazioni/${params.infomrazioneId}`, data)
            }
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/informazioni`)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/informazioni/${params.informazioneId}`)
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/informazioni`)
            toast.success("Informazione deleted");
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
                <Button disabled={loading} variant={"destructive"} size={"sm"} onClick={() => setOpen(true)}>
                    <Trash className='h-4 w-4' />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form className='space-y-8 w-full ' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-4 space-x-5'>
                        <FormField
                            control={form.control}
                            name="descrizione"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrizione discoteca:</FormLabel>
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
                            name="numeroInformazione"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numero informazione:</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="numero informazione"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo informazione:</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona il tipo di informazione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {tipoinformazione.map((item) => (
                                                <SelectItem value={item.id} key={item.id}>{item.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

export default InformazioneForm