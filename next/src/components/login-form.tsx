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
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    },
  });

  function onSubmit(data: FormData) {
    submitAuth(data);
  }

  return (
    <div className={cn("mt-12 mx-auto h-full w-lg flex flex-col justify-center", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? "Connexion" : "Inscription"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Connectez-vous pour accéder à votre tableau de bord."
              : "Créez un compte pour accéder à votre tableau de bord."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {isLogin ? "Email ou mot de passe incorrect." : "Erreur lors de l'inscription."}
                  </AlertDescription>
                </Alert>
              )}
              
              {!isLogin && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre prénom" {...field} />
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
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
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
                      <Input placeholder="email@example.com" type="email" {...field} />
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
                    <FormLabel>Mot de passe</FormLabel>
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

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CLIENT">Client</SelectItem>
                          <SelectItem value="COACH">Coach</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending 
                  ? (isLogin ? "Connexion en cours..." : "Inscription en cours...") 
                  : (isLogin ? "Se connecter" : "S'inscrire")
                }
              </Button>

              <div className="text-center text-sm">
                {isLogin ? (
                  <>
                    Pas encore de compte ?{" "}
                    <Button variant="link" className="p-0" onClick={() => router.push("/register")}>
                      S'inscrire
                    </Button>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{" "}
                    <Button variant="link" className="p-0" onClick={() => router.push("/login")}>
                      Se connecter
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
