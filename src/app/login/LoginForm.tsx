"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { login } from "@/store/features/auth/auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(4, { message: "This field has to be filled." })
})

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, loading } = useAppSelector((state) => state.auth)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    dispatch(login({ email: data.username, password: data.password }));

    toast({
      title: "Login Successful",
      description: "Welcome back! 🎉",
      variant: "success"
    });
  }

  // Redirect after successful login
  useEffect(() => {
    if (user) {
      router.push("/editor");
    }
  }, [user]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="*********@gmail.com" {...field} />
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
                <Input type="password" placeholder="**************" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>Submit</Button>
      </form>
    </Form>
  )
}
