"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Menu } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface MenuFormProps {
    initialData: Menu | null,
}

const formSchema = z.object({
    nome: z.string().min(1),
    isVisible: z.boolean(),
})

type MenuFormValues = z.infer<typeof formSchema>
const MenuForm = ({ initialData }: MenuFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Modifica il menu" : "Crea il menu"
    const description = initialData ? "Modifica il menu per gestire le varie portate" : "Crea il menu per gestire le varie portate";
    const toastMessage = initialData ? "Il menu è stato modificato" : "Il menu è stato creato"
    const action = initialData ? "Salva le modifiche" : "Crea il menu";

    const form = useForm<MenuFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nome: "",
            isVisible: false
        }
    })

    const onSubmit = async (data: MenuFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/menus`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}`, data)
            }
            router.refresh();
            router.push(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}`)
            router.refresh();
            router.push(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
            toast.success("Il menu è stato eliminato");
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
                    <div className='grid grid-cols-3 space-x-5'>
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome del menu:</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>Questo nome non verrà visualizzato nell'applicazione ma serve solo per ordine</FormDescription>
                                </FormItem>
                            )}
                        />
                            <FormField control={form.control} name='isVisible' render={({ field }) => (
                                <FormItem className='flex flex-row items-center self-start '>
                                    <div className='space-x-0.5 w-2/3'>
                                        <FormLabel>Visibile?</FormLabel>
                                        <FormDescription>
                                            Attivando questa opzione, il menu verrà reso visibile nell'applicazione. Attenzione a non attivarne più insieme.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )} />
                       
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default MenuForm