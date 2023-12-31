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
import prismadb from '@/lib/prismadb';
import { zodResolver } from '@hookform/resolvers/zod';
import { Provincia } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface ProvinciaFormProps {
    initialData: Provincia | null,
}

const formSchema = z.object({
    name: z.string().min(2).max(2),
})

type ProvinciaFormValues = z.infer<typeof formSchema>
const ProvinciaForm = ({ initialData }: ProvinciaFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Modifica la provincia" : "Crea una provincia";
    const description = initialData ? "Modifica la provincia per gestire le discoteche" : "Crea una provincia per gestire le discoteche";
    const toastMessage = initialData ? "La provinca è stata modificata" : "La provincia è stata creata"
    const action = initialData ? "Salva le modifiche" : "Crea";

    const form = useForm<ProvinciaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
        }
    })

    const onSubmit = async (data: ProvinciaFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/province`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/province/${params.provinciaId}`, data)
            }
            router.refresh();
            router.push(`/${params.accountId}/province`)
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
            await axios.delete(`/api/${params.accountId}/province/${params.provinciaId}`)
            router.refresh();
            router.push(`/${params.accountId}/province`)
            toast.success("La provincia è stata eliminata");
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome provincia:</FormLabel>
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

export default ProvinciaForm