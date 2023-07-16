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
import { Accounts, Discoteca, Informazione, Piano, Posizione, Posto, Provincia, Sala, Stato, Tavolo, TipoInformazione } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface SalaFormProps {
    initialData: Sala | null,
    piani: Piano[]
}

const formSchema = z.object({
    nome: z.string().min(1),
    descrizione: z.string().min(1),
    imageUrl: z.string().min(1),
    pianoId: z.string().min(1)
})

type SalaFormValues = z.infer<typeof formSchema>
    const SalaForm = ({ initialData, piani }: SalaFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit sala" : "Create sala";
    const description = initialData ? "Edit a sala" : "Create a sala";
    const toastMessage = initialData ? "Informazione updated" : "Informazione created"
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<SalaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nome: "",
            descrizione: "",
            imageUrl: "",
            pianoId: ""
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
            toast.error("Something went wrong")
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
            toast.success("Sala deleted");
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
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default SalaForm