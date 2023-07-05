"use client"
import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import ImageUpload from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Accounts } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
    username: z.string().min(2, { message: "Inserisci il nome" }),
    password: z.string().min(5),
    imageUrl: z.string()
})

interface AccountFormProps {
    data: Accounts | null
}

type AccountFormValues = z.infer<typeof formSchema>

const AccountForm = ({ data }: AccountFormProps) => {
    
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: data?.username,
            password: data?.password,
            imageUrl: data?.imageUrl
        }
    })
    const params = useParams();
    const router = useRouter();

    const onSubmit = async (values: AccountFormValues) => {
        try{
            setLoading(true);
            await axios.patch(`/api/${params.accountId}/account`, values);
            router.refresh();
            router.replace(`/${params.accountId}`)
            toast.success("Account aggiornato con successo")
        }catch(error){
            toast.error("Errore durante la richiesta")
        }
        finally{
            setLoading(false)
        }
    }
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.accountId}/account`);
            router.refresh();
            router.replace(`/${params.accountId}`)
            toast.success("Account eliminato")
        } catch (error) {
            toast.error("Errore durante la richiesta")
        }
        finally {
            setLoading(false);
            setOpen(false)
        }
    }
    return (
        <>
        <AlertModal isOpen={open} loading={loading} onClose={() => setOpen(false)} onConfirm={onDelete}/>
            <div className='flex p-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 flex flex-col w-full">
                        <div className='flex space-x-32'>
                            <div className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
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
                                                <Input placeholder="Password" {...field} type='password' />
                                            </FormControl>
                                            <FormDescription>
                                                This is your password
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Background image</FormLabel>
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
                            <div className='flex justify-center items-center'>
                                <Button type='button' variant={"destructive"} onClick={() => setOpen(true)}>Elimina account</Button>
                            </div>
                        </div>

                        <Button type="submit" className='bg-blue-600 relative w-[100%] '>Modifica</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default AccountForm