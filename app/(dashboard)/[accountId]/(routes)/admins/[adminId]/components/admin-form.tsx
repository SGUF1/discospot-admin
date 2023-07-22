"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accounts, Discoteca } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface AdminPageProps {
    initialData: Accounts | null,
    discoteche: Discoteca[]
}

const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(5),
    superior: z.boolean(),
    discotecaId: z.string()
})

type AdminFormValues = z.infer<typeof formSchema>
const AdminForm = ({ initialData, discoteche }: AdminPageProps) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Modifica l'admin" : "Crea un admin";
    const description = initialData ? "" : "";
    const toastMessage = initialData ? "L'admin è stato modificato" : "L'admin è stato creato"
    const action = initialData ? "Salva le modifiche" : "Crea";

    const form = useForm<AdminFormValues>({
        resolver: zodResolver(formSchema),
        // @ts-ignore
        defaultValues: initialData || {
            username: "",
            password: "",
            superior: false,
            discotecaId: ""
        }
    })

    const onSubmit = async (data: AdminFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/admins`, data);
            } else {
                await axios.patch(`/api/${params.accountId}/admins/${params.adminId}`, data)
            }
            router.refresh();
            router.replace(`/${params.accountId}/admins`)
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
            await axios.delete(`/api/${params.accountId}/admins/${params.adminId}`)
            router.refresh();
            router.replace(`/${params.accountId}`)
            toast.success("L'admin è stato eliminato");
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="password"
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-center items-center ' >
                            <FormField control={form.control} name='superior' render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between '>
                                    <div className='space-x-0.5 w-2/3'>
                                        <FormLabel>Superior</FormLabel>
                                        <FormDescription>
                                            Con la modalità Superior l'admin ha la piena libertà di fare quello che vuole
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </div>
                        {!form.getValues().superior && (
                            <FormField
                                control={form.control}
                                name="discotecaId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Seleziona la discoteca di appartenenza:</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Seleziona la discoteca" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {discoteche?.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default AdminForm