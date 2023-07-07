// "use client"
// import { AlertModal } from '@/components/modals/alert-modal';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Heading } from '@/components/ui/heading';
// import ImageUpload from '@/components/ui/image-upload';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
// import prismadb from '@/lib/prismadb';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Accounts, Discoteca, Piano, Posizione, Posto, Provincia, Stato, Tavolo } from '@prisma/client'
// import axios from 'axios';
// import { Trash } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-hot-toast';
// import * as z from 'zod';

// interface TavoloFormProps {
//     initialData: Tavolo | null,
//     piano: Piano,
//     posizione: Posizione,
//     stato: Stato,
//     posti: Posto,
// }

// const formSchema = z.object({
//     numeroTavolo: z.string().min(1),
//     posizione: z.string().min(1),
//     posti: z.string().min(1),
//     descrizione: z.string().min(1),
//     prezzo: z.string().min(1),
//     stato: z.string().min(1),
//     posto: z.string().min(1),
// })

// type TavoloFormValues = z.infer<typeof formSchema>
// const TavoloForm = ({ initialData, province }: TavoloFormProps) => {

//     const params = useParams();
//     const router = useRouter();

//     const [open, setOpen] = useState(false)
//     const [loading, setLoading] = useState(false)

//     const title = initialData ? "Edit discoteca" : "Create discoteca";
//     const description = initialData ? "Edit a discoteca" : "Create a discoteca";
//     const toastMessage = initialData ? "Discoteca updated" : "Discoteca created"
//     const action = initialData ? "Save changes" : "Create";

//     const form = useForm<TavoloFormValues>({
//         resolver: zodResolver(formSchema),
//         defaultValues: initialData || {
//             name: "",
//             indirizzo: "",
//             provinciaId: "",
//             city: "",
//             cap: "",
//             imageUrl: "",
//             civico: ""
//         }
//     })

//     const onSubmit = async (data: TavoloFormValues) => {
//         try {
//             setLoading(true);
//             if (!initialData) {
//                 await axios.post(`/api/${params.accountId}/discoteche`, data);
//             } else {
//                 await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}`, data)
//             }
//             router.refresh();
//             router.replace(`/${params.accountId}/discoteche`)
//             toast.success(toastMessage)
//         } catch (error) {
//             toast.error("Something went wrong")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const onDelete = async () => {
//         try {
//             setLoading(true);
//             await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}`)
//             router.refresh();
//             router.replace(`/${params.accountId}/discoteche`)
//             toast.success("Admin deleted");
//         } catch (error) {
//             toast.error("Qualcosa è andato storto");
//         }
//         finally {
//             setLoading(false)
//             setOpen(false)
//         }
//     }
//     const [superior, setSuperior] = useState(false);


//     const getAdmins = async () => {
//         const admins = await axios.get(`/api/${params.accountId}/admins`)
//         for (let i = 0; i < admins.data.length; i++) {
//             if (admins.data[i].id === params.accountId)
//                 if (admins.data[i].superior) {
//                     setSuperior(true)
//                 }
//         }
//     }
//     useEffect(() => {
//         getAdmins()
//     }, [])
//     return (
//         <>
//             <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

//             <div className='flex items-center justify-between'>
//                 <Heading title={title} description={description} />
//                 {initialData && superior && (
//                     <Button disabled={loading} variant={"destructive"} size={"sm"} onClick={() => setOpen(true)}>
//                         <Trash className='h-4 w-4' />
//                     </Button>
//                 )}
//             </div>
//             <Separator />
//             <Form {...form}>
//                 <form className='space-y-8 w-full ' onSubmit={form.handleSubmit(onSubmit)}>
//                     <div className='grid grid-cols-4 space-x-5'>
//                         <FormField
//                             control={form.control}
//                             name="name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Nome discoteca:</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             disabled={loading}
//                                             placeholder="nome"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <div className='flex flex-col gap-5'>
//                             <FormField
//                                 control={form.control}
//                                 name="city"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Città:</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={loading}
//                                                 placeholder="città..."
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="indirizzo"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Indirizzo discoteca:</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={loading}
//                                                 placeholder="indirizzo..."
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="civico"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Civico:</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={loading}
//                                                 placeholder="civico..."
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="provinciaId"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Provincia discoteca:</FormLabel>
//                                         <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
//                                             <FormControl>
//                                                 <SelectTrigger>
//                                                     <SelectValue defaultValue={field.value} placeholder="Seleziona la provincia" />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 {province.map((provincia) => (
//                                                     <SelectItem key={provincia.id} value={provincia.id}>{provincia.name}</SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="cap"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Cap:</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={loading}
//                                                 placeholder="cap..."
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                         </div>
//                         <FormField
//                             control={form.control}
//                             name="imageUrl"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Discoteca image</FormLabel>
//                                     <FormControl>
//                                         <ImageUpload
//                                             value={field.value ? [field.value] : []}
//                                             disabled={loading}
//                                             onChange={(url) => field.onChange(url)}
//                                             onRemove={() => field.onChange('')}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <Button disabled={loading} className='ml-auto' type='submit'>
//                         {action}
//                     </Button>
//                 </form>
//             </Form>
//         </>

//     )
// }

// export default TavoloForm