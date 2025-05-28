"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, registerSchema } from "@/schemas/authSchema"
import { useMutation } from "@tanstack/react-query"
import { auth } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type FormData = LoginFormData | RegisterFormData;

interface AuthFormProps extends React.ComponentProps<"div"> {
  mode: 'login' | 'register';
  className?: string;
}

export function AuthForm({
  mode,
  className,
  ...props
}: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === 'login';

  const form = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: isLogin ? {
      email: "",
      password: "",
    } : {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "CLIENT" as const,
    },
  });

  const {
    mutate: submitAuth,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      return isLogin ? auth.login(data as LoginFormData) : auth.register(data as RegisterFormData);
    },
    onSuccess: (response) => {
      if (isLogin) {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken);
          }
        }
        router.push("/chatbot");
      } else {
        router.push("/login");
      }
    },
  });

  function onSubmit(data: FormData) {
    submitAuth(data);
  }

  return (
    <div className={cn("grid h-screen w-full place-items-center", className)} {...props}>
      <div className="w-full max-w-[400px] space-y-6">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Login with your Apple or Google account"
                : "Sign up with your Apple or Google account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {isLogin ? "Email ou mot de passe incorrect." : "Erreur lors de l'inscription."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4">
                  <Button variant="outline" className="w-full" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    {isLogin ? "Login with Apple" : "Sign up with Apple"}
                  </Button>
                  <Button variant="outline" className="w-full" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    {isLogin ? "Login with Google" : "Sign up with Google"}
                  </Button>
                </div>

                <div className="relative text-center text-sm">
                  <div className="absolute flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative z-10">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {!isLogin && (
                    <>
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" type="email" {...field} />
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          {isLogin && (
                            <Button variant="link" className="px-0 font-normal" type="button">
                              Forgot password?
                            </Button>
                          )}
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="w-full" type="submit" disabled={isPending}>
                  {isPending 
                    ? (isLogin ? "Signing in..." : "Creating account...") 
                    : (isLogin ? "Sign in" : "Create account")
                  }
                </Button>

                <div className="text-center text-sm">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <Button variant='secondary' className="px-0" type="button" onClick={() => router.push("/register")}>
                        Sign up
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Button variant="secondary" className="px-0" type="button" onClick={() => router.push("/login")}>
                        Sign in
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
