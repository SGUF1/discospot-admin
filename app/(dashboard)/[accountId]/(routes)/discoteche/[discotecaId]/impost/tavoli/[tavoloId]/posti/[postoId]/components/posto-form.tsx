"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Posizione, Posto, Stato, TipoInformazione } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface PostoFormProps {
    initialData: Posto | null,
    stati: Stato[]
}

const formSchema = z.object({
    id: z.string().min(1),
    statoId: z.string().min(1),
})

type PostoFormValues = z.infer<typeof formSchema>
const PostoForm = ({ initialData, stati }: PostoFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit posto" : "Create posti";
    const description = initialData ? "Edit a posto" : "Crea i posti del tavolo selezionato";
    const toastMessage = initialData ? "Posto updated" : "Posti created"
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<PostoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            id:  "",
            statoId: "",
        }
    })

    const onSubmit = async (data: PostoFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${params.tavoloId}/posti`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${params.tavoloId}/posti/${params.postoId}`, data)
            }
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${params.tavoloId}/posti`)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${params.tavoloId}/posti/${params.postoId}`)
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost/tavoli/${params.tavoloId}/posti`)
            toast.success("Posto deleted");
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
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Posti:</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading || initialData && true}
                                            placeholder="numero"
                                            type="number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                                control={form.control}
                                name="statoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stato posto:</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Seleziona la stato" />
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
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default PostoForm