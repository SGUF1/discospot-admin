"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { OptionProdotto } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface OptionProdottoFormProps {
    initialData: OptionProdotto | null,
}

const formSchema = z.object({
    nome: z.string().min(1),
})

type OptionProdottoFormValues = z.infer<typeof formSchema>
const OptionProdottoForm = ({ initialData }: OptionProdottoFormProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit option prodotto" : "Create option prodotto";
    const description = initialData ? "Edit a option prodotto" : "Create a option prodotto";
    const toastMessage = initialData ? "Option prodotto updated" : "Option prodotto created"
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<OptionProdottoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ||  {
            nome: "",
        }
    })

    const onSubmit = async (data: OptionProdottoFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/altre/optionprodotti`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/altre/optionprodotti/${params.optionprodottoId}`, data)
            }
            router.refresh();
            router.replace(`/${params.accountId}/altre`)
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
            await axios.delete(`/api/${params.accountId}/altre/optionprodotti/${params.optionprodottoId}`)
            router.refresh();
            router.replace(`/${params.accountId}/altre`)
            toast.success("Option Prodotto deleted");
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
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome prodotto:</FormLabel>
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
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default OptionProdottoForm