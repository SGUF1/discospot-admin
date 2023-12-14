"use client"
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import prismadb from '@/lib/prismadb';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accounts, Data, Discoteca, Evento, Informazione, Piano, Posizione, Provincia, Sala, Stato, Tavolo, TipoInformazione } from '@prisma/client'
import axios from 'axios';
import { addDays, format, parseISO } from 'date-fns';
import { Trash, Calendar as CalendarIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

interface DataFormProps {
    initialData: Data | null,
    evento: Evento[]
}
const items = [
    {
        id: "lunedi",
        label: "Lunedì",
    },
    {
        id: "martedi",
        label: "Martedì",
    },
    {
        id: "mercoledi",
        label: "Mercoledì",
    },
    {
        id: "giovedi",
        label: "Giovedì",
    },
    {
        id: "venerdi",
        label: "Venerdì",
    },
    {
        id: "sabato",
        label: "Sabato",
    },
    {
        id: "domenica",
        label: "Domenica",
    },
] as const;

const formSchema = z.object({
    type: z.enum(["ferie", "aperto"], {
        required_error: "Devi selezionare il tipo di data"
    }),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Scegline almeno uno.",
    }),
})

type DataFormValues = z.infer<typeof formSchema>
const DataForm = ({ initialData, evento }: DataFormProps) => {

    const params = useParams();
    const router = useRouter();

    const convertJsonToDateRange = (jsonDateRange: any): DateRange | undefined => {
        if (!jsonDateRange || !Array.isArray(jsonDateRange)) {
            return undefined;
        }

        const dateStrings: string[] = jsonDateRange.map((jsonDateString: string) => {
            return JSON.parse(jsonDateString); // Converte le stringhe JSON in stringhe
        });

        if (dateStrings.length === 0) {
            return undefined;
        }

        const fromDate = parseISO(dateStrings[0]);
        const toDate = parseISO(dateStrings[dateStrings.length - 1]);

        return { from: fromDate, to: toDate };
    };


    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [date, setDate] = React.useState<DateRange | undefined>(convertJsonToDateRange(initialData?.dateRange))
    const title = initialData ? "Modifica la data" : "Crea la data";
    const description = initialData ? "Modifica la data per le prenotazioni dei tavoli" : "Crea la data per le prenotazioni dei tavoli";
    const toastMessage = initialData ? "La data è stata modificata" : "La data è stata creata"
    const action = initialData ? "Salva le modifiche" : "Crea la data";

    const form = useForm<DataFormValues>({
        resolver: zodResolver(formSchema),
        // @ts-ignore
        defaultValues: initialData ? {
            ...initialData, items: initialData?.giorni || ["sabato"]
        } : {
            type: 'aperto',
            items: ["sabato"]
        }
    })
    const onSubmit = async (prova: DataFormValues) => {
        try {
            setLoading(true);
            const type = prova.type
            const items = prova.items
            const dataToSend = { type, items, date }
            if (!initialData) {
                await axios.post(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/date`, dataToSend);
            } else {
                await axios.patch(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/date/${params.dataId}`, dataToSend)
            }
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
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
            await axios.delete(`/api/${params.accountId}/discoteche/${params.discotecaId}/impost/date/${params.dataId}`)
            router.refresh();
            router.replace(`/${params.accountId}/discoteche/${params.discotecaId}/impost`)
            toast.success("La data è stata eliminata");
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
                <form className='space-y-8 w-full  ' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className={cn("grid gap-2",)}>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className='text-xl'>Seleziona il tipo di data...</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            // @ts-ignore
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0 ">
                                                <FormControl>
                                                    <RadioGroupItem value="aperto" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-lg">
                                                    Data di apertura
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="ferie" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-lg">
                                                    Data di chiusura
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.getValues().type === 'ferie' ?
                            <div className='mt-4'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-[300px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "LLL dd, y")} -{" "}
                                                        {format(date.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(date.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div> : <div className='mt-4'>
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-xl">Giorni della settimana</FormLabel>
                                                <FormDescription className='text-lg'>
                                                    Selezione i giorni della settimana e ricordati di ripassare da data di chiusura e tornare in data di apertura
                                                </FormDescription>
                                            </div>
                                            {items.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="items"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                        className='p-2'
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {item.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /></div>}

                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}

export default DataForm