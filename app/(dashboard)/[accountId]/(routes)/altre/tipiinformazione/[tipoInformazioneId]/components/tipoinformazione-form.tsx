"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { TipoInformazione } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface TipoInformazioneFormProps {
    initialData: TipoInformazione | null,
}

const formSchema = z.object({
    nome: z.string().min(1)
})

type TipoInformazioneFormValues = z.infer<typeof formSchema>
const TipoInformazioneForm = ({ initialData }: TipoInformazioneFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Modifica la tipologia di informazione" : "Crea una tipologia d'informazione";
    const description = initialData ? "Modifica la tipologia d'informazione che sarà opzione delle informazioni" : "Crea una tipologia d'informazione che sarà opzione delle informazioni";
    const toastMessage = initialData ? "La tipologia di informazione è stata modificata" : "La tipologia di informazione è stata creata"
    const action = initialData ? "Salva le modifiche" : "Crea";

    const form = useForm<TipoInformazioneFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nome: ""
        }
    })

    const onSubmit = async (data: TipoInformazioneFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/altre/tipiinformazione`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/altre/tipiinformazione/${params.tipoInformazioneId}`, data)
            }
            router.refresh();
            router.push(`/${params.accountId}/altre`)
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
            await axios.delete(`/api/${params.accountId}/altre/tipiinformazione/${params.tipoInformazioneId}`)
            router.refresh();
            router.push(`/${params.accountId}/altre`)
            toast.success("La tipologia di informazione è stata eliminata");
        } catch (error) {
            toast.error("Qualcosa è andato storto");
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
    const [superior, setSuperior] = useState(false);


    const getAdmins = async () => {
        const admins = await axios.get(`/api/${params.accountId}/admins`)
        for (let i = 0; i < admins.data.length; i++) {
            if (admins.data[i].id === params.accountId)
                if (admins.data[i].superior) {
                    setSuperior(true)
                }
        }
    }
    useEffect(() => {
        getAdmins()
    }, [])

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />
                {initialData && superior && (
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
                                    <FormLabel>Nome della tipologia di informazione:</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="nome"
                                            {...field}
                                        />
                                    </FormControl>
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

export default TipoInformazioneForm