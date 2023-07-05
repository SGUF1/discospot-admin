"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { FormEventHandler, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
const formSchema = z.object({
  name: z.string().min(2).max(50),
  password: z.string().min(5),
});

const formSchemaPin = z.object({
  pin: z.string().min(10).max(10),
});
export type AuthFormValues = z.infer<typeof formSchema>;
type PinFormValues = z.infer<typeof formSchemaPin>;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const formPin = useForm<PinFormValues>({
    resolver: zodResolver(formSchemaPin),
    defaultValues: {
      pin: "",
    },
  });
  const onSubmit = async (values: AuthFormValues) => {

    try {
      setLoading(true)
      const res = await axios.post("api/auth/login", values)
      if (!res.data.username) throw new Error("Errrore gravissimo");
      router.push(`/${res.data.id}`)
      toast.success("Incredibile, sei entrato")

    } catch (error) {
      toast.error("Minchia ma come fai a non ricordarti le tue credenziali");
    }
    finally {
      setLoading(false)
    }

  };

  return (
    <>
      <div className="p-4 flex flex-col space-y-10 justify-center items-center h-full ">
        <p className="text-2xl font-extrabold">LOGIN</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">Name:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="name"
                      {...field}
                      className="w-[300px]"
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
                  <FormLabel className="text-xl font-bold">Password:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="password"
                      type="password"
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-evenly">
              <Button
                type="submit"
                className="self-center w-[40%] bg-blue-600"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
