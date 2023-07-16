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
import { Accounts, Discoteca, Piano, Posizione, Posto, Provincia, Stato, Tavolo } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface TavoloFormProps {
    initialData: Tavolo | null,
    piani: Piano[],
    posizioni: Posizione[],
    stati: Stato[],
}

const formSchema = z.object({
    numeroTavolo: z.string().min(1),
    posizioneId: z.string().min(1),
    descrizione: z.string().min(1),
    prezzo: z.string().min(1),
    prezzoPosto: z.string().min(1),
    statoId: z.string().min(1),
    imageUrl: z.string().min(1),
})

type TavoloFormValues = z.infer<typeof formSchema>
const TavoloForm = ({ initialData, piani, posizioni, stati,   }: TavoloFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit tavolo" : "Create tavolo";
    const description = initialData ? "Edit a tavolo" : "Create a tavolo";
    const toastMessage = initialData ? "Tavolo updated" : "Tavolo created"
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<TavoloFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            numeroTavolo: "",
            posizioneId: "",
            descrizione: "",
            prezzo: "",
            prezzoPosto: "",
            statoId: "",
            imageUrl: "",
        }
    })
    

    const onSubmit = async (data: TavoloFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}/tavoli`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}/tavoli/${params.tavoloId}`, data)
            }
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}/tavoli`)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/sale/${params.salaId}/tavoli/${params.tavoloId}`)
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
            toast.success("Tavolo deleted");
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
                    <div className='grid grid-cols-4 space-x-5'>
                        <div className='flex flex-col space-y-5'>
                            <FormField
                                control={form.control}
                                name="numeroTavolo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numero Tavolo:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                type='number'
                                                placeholder="numero tavolo"
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
                                        <FormLabel>Descrizione tavolo:</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={loading}
                                                placeholder="Write a description of a table"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col space-y-5'>
                            <FormField
                                control={form.control}
                                name="posizioneId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Posizione tavolo:</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Seleziona la provincia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {posizioni.map((posizione) => (
                                                    <SelectItem key={posizione.id} value={posizione.id}>{posizione.nome}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="statoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stato tavolo:</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Seleziona la provincia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {stati.map((stato) => (
                                                    <SelectItem key={stato.id} value={stato.id}>{stato.nome}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col space-y-5'>
                            <FormField
                                control={form.control}
                                name="prezzo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prezzo tavolo:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}

                                                type='number'
                                                placeholder="prezzo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="prezzoPosto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prezzo per posto:</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                disabled={loading}
                                                placeholder="prezzo posto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tavolo image</FormLabel>
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
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default TavoloForm