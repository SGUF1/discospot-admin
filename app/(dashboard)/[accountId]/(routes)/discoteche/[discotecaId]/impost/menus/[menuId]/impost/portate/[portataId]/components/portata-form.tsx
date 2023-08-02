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
import { zodResolver } from '@hookform/resolvers/zod';
import { OptionProdotto, Portata, Prodotto } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface PortataFormProps {
    initialData: Portata & {
        prodotti: Prodotto[];
    } | null;
    optionProdotti: OptionProdotto[];
}

const formSchema = z.object({
    nome: z.string().min(1),
    numeroPortata: z.coerce.number().min(1),
    lastPortata: z.boolean(),
    singolaSelezione: z.boolean().default(false),
    numeroBibiteDiverse: z.coerce.number(),
    numeroBibiteTotale: z.coerce.number(),
    products: z
        .object({
            nome: z.string().min(1),
            prezzo: z.coerce.number(),
            limite: z.coerce.number().min(1),
            descrizione: z.string().min(1),
            imageUrl: z.string().min(1),
        })
        .array(),
});

type PortataFormValues = z.infer<typeof formSchema>;
const PortataForm = ({ initialData, optionProdotti }: PortataFormProps) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Modifica la portata' : 'Crea una portata';
    const description = initialData ? 'Modifica la portata che verrà visualizzata tra le portate' : 'Crea una portata che verrà visualizzata tra le portate';
    const toastMessage = initialData ? 'La portata è stata modificata' : 'La portata è stata creata';
    const action = initialData ? 'Salva le modifiche' : 'Crea la portata';

    const form = useForm<PortataFormValues>({
        resolver: zodResolver(formSchema),
        // @ts-ignore
        defaultValues: initialData
            ? {
                ...initialData,
                numeroPortata: parseInt(String(initialData?.numeroPortata)),
                products: initialData.prodotti
            }
            : {
                nome: '',
                numeroPortata: 0,
                lastPortata: false,
                numeroBibiteDiverse: null,
                numeroBibiteTotale: null,
                products: [],
            },
    });
    const onSubmit = async (data: PortataFormValues) => {
        try {
            setLoading(true);
            if (!initialData) {
                await axios.post(
                    `/api/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}/impost/portate`,
                    data
                );
            } else {
                await axios.patch(
                    `/api/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}/impost/portate/${params.portataId}`,
                    data
                );
            }
            router.refresh();
            router.replace(
                `/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}/impost`
            );
            toast.success(toastMessage);
        } catch (error) {
            toast.error('Qualcosa è andata storto');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `/api/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}/impost/portate/${params.portataId}`
            );
            router.refresh();
            router.replace(
                `/${params.accountId}/discoteche/${params.discotecaId}/impost/menus/${params.menuId}/impost`
            );
            toast.success('La portata è stata eliminata');
        } catch (error) {
            toast.error('Qualcosa è andato storto');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };
    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button disabled={loading} variant={'destructive'} size={'sm'} onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form className="space-y-8 w-full " onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3  space-x-5">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome portata:</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="prima, seconda..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="numeroPortata"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numero portata:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder="numero portata..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastPortata"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center self-start ">
                                    <div className="space-x-0.5 w-2/3">
                                        <FormLabel>Last portata?</FormLabel>
                                        <FormDescription>
                                            Attivando questa opzione, questa diventerà l'ultima portata e se l'utente vorrà
                                            aggiungere altre portate saranno uguali a questa
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='grid grid-cols-3'>

                        <FormField
                            control={form.control}
                            name="singolaSelezione"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center self-start ">
                                    <div className="space-x-0.5 w-2/3">
                                        <FormLabel>Selezione multipla?</FormLabel>
                                        <FormDescription>
                                            Attivando questa opzione, l'utente potrà scegliere un numero limitato di bibite della portata,
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {form.getValues().singolaSelezione &&
                            <>
                                <FormField
                                    control={form.control}
                                    name="numeroBibiteDiverse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numero bibite selezionabili:</FormLabel>
                                            <FormDescription>Scegli il numero di bibite diverse che l'utente può selezionare</FormDescription>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={loading}
                                                    placeholder="numero bibite diverse..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>

                        }
                                <FormField
                                    control={form.control}
                                    name="numeroBibiteTotale"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numero bibite totale:</FormLabel>
                                            <FormDescription>Scegli il numero di bibite totali che l'utente può selezionare. Se non si inserisce nulla l'utente può ordinare il numero massimo di ogni bibita</FormDescription>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={loading}
                                                    placeholder="numero bibite totali..."
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
                        name="products"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>Aggiungi prodotto:</FormLabel>
                                {field.value?.map((prodotto, index) => (
                                    <div className="flex  w-[1500px] space-x-2 space-y-2 items-start" key={index}>
                                        <div className="flex flex-col mt-2 w-[200px] space-y-4">
                                            <FormLabel>Nome prodotto</FormLabel>
                                            <Select
                                                disabled={loading}
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        field.value.map((p, i) => (i === index ? { ...p, nome: value } : p))
                                                    )
                                                }
                                                value={prodotto.nome}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue defaultValue={prodotto.nome} placeholder="Seleziona il prodotto" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {optionProdotti.map((item) => (
                                                        <SelectItem key={item.id} value={item.nome}>
                                                            {item.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col mt-3 w-[200px] space-y-4">
                                            <FormLabel>Prezzo prodotto:</FormLabel>
                                            <Input
                                                disabled={loading}
                                                type="number"
                                                value={prodotto.prezzo}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        field.value.map((p, i) =>
                                                            i === index ? { ...p, prezzo: parseFloat(e.target.value) } : p
                                                        )
                                                    )
                                                }
                                                placeholder="Prezzo prodotto"
                                            />
                                        </div>

                                        <div className="flex flex-col mt-3 w-[400px]  space-y-4">
                                            <FormLabel>Descrizione:</FormLabel>
                                            <Textarea
                                                disabled={loading}
                                                value={prodotto.descrizione}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        field.value.map((p, i) =>
                                                            i === index ? { ...p, descrizione: e.target.value } : p
                                                        )
                                                    )
                                                }
                                                placeholder="Descrizione prodotto"
                                            />
                                        </div>
                                        <div className="flex flex-col mt-3 w-[200px] space-y-4">
                                            <FormLabel>Limite prodotto:</FormLabel>
                                            <Input
                                                disabled={loading}
                                                type="number"
                                                value={prodotto.limite}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        field.value.map((p, i) =>
                                                            i === index ? { ...p, limite: parseInt(e.target.value) } : p
                                                        )
                                                    )
                                                }
                                                placeholder="Limite ordinabile"
                                            />
                                        </div>
                                        <div>
                                            <FormItem>
                                                <FormLabel>Bibita image</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={prodotto.imageUrl ? [prodotto.imageUrl] : []}
                                                        disabled={loading}
                                                        onChange={(url) =>
                                                            field.onChange(
                                                                field.value.map((p, i) =>
                                                                    i === index ? { ...p, imageUrl: url } : p
                                                                )
                                                            )
                                                        }
                                                        onRemove={() =>
                                                            field.onChange(
                                                                field.value.map((p, i) =>
                                                                    i === index ? { ...p, imageUrl: '' } : p
                                                                )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                        <Button
                                            disabled={loading}
                                            variant="destructive"
                                            size="sm"
                                            type="button"
                                            onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    disabled={loading}
                                    size="sm"
                                    onClick={() => field.onChange([...field.value, { nome: '', prezzo: 0, descrizione: '', limite: 0, imageUrl: '' }])}
                                >
                                    Aggiungi
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default PortataForm;
