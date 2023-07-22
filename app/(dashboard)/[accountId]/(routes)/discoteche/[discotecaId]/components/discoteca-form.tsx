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
import { Accounts, Discoteca, Provincia } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface DiscotecaFormProps {
    initialData: Discoteca | null,
    province: Provincia[]
}

const formSchema = z.object({
    name: z.string().min(3),
    city: z.string().min(2),
    indirizzo: z.string().min(3),
    provinciaId: z.string().min(2),
    cap: z.string().min(5, { message: "Il cap ha solo 5 numeri" }).max(5, { message: "Il cap ha solo 5 numeri" }),
    civico: z.string().min(1),
    imageUrl: z.string().min(1),
    caparra: z.boolean(),
    visibile: z.boolean(),
    priority: z.coerce.number().min(1),
    maximumOrderDate: z.coerce.number()
})

type DiscotecaFormValues = z.infer<typeof formSchema>
const DiscotecaForm = ({ initialData, province }: DiscotecaFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Modifica discoteca" : "Crea discoteca";
    const description = initialData ? "Modifica a discoteca" : "Crea a discoteca";
    const toastMessage = initialData ? "Discoteca updated" : "Discoteca Cread"
    const action = initialData ? "Save changes" : "Crea";

    const form = useForm<DiscotecaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData, priority: parseInt(String(initialData?.priority))
        } : {
            name: "",
            indirizzo: "",
            provinciaId: "",
            city: "",
            cap: "",
            imageUrl: "",
            civico: "",
            caparra: false,
            visibile: false,
            priority: 1,
            maximumOrderDate: 0
        }
    })

    const onSubmit = async (data: DiscotecaFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}`, data)
            }
            router.refresh();
            router.replace(`/${params.accountId}/discoteche`)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}`)
            router.refresh();
            router.replace(`/${params.accountId}/discoteche`)
            toast.success("La discoteca è stata eliminata");
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
                    <div className='grid grid-cols-5 space-x-5'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome discoteca:</FormLabel>
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

                        <div className='flex flex-col gap-5'>
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Città:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="città..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="indirizzo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indirizzo discoteca:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="indirizzo..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="civico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Civico:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="civico..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="provinciaId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provincia discoteca:</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Seleziona la provincia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {province.map((provincia) => (
                                                    <SelectItem key={provincia.id} value={provincia.id}>{provincia.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cap"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cap:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="cap..."
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
                                    <FormLabel>Discoteca image</FormLabel>
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
                        <div className='grid grid-cols-1 grid-row-2 justify-center items-center w-[102%]' >
                            <FormField control={form.control} name='caparra' render={({ field }) => (
                                <FormItem className='flex flex-row items-center self-start '>
                                    <div className='space-x-0.5 w-2/3'>
                                        <FormLabel>Caparra</FormLabel>
                                        <FormDescription>
                                            Attivando la caparra tutti i tavoli avranno la caparra
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='visibile' render={({ field }) => (
                                <FormItem className='flex flex-row items-center self-start '>
                                    <div className='space-x-0.5 w-2/3'>
                                        <FormLabel>Visibile?</FormLabel>
                                        <FormDescription>
                                            Permette alla discoteca di essere visibile nell'applicazione
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priorità:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maximumOrderDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data limite per la prenotazione tavoli:</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Dopo aver superato il numero di giorni inserito dopo la prenotazione del tavolo, il tavolo diventerà automaticamente "Non prenotato" se non viene confermato dal cliente</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default DiscotecaForm