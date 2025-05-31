import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ArrowLeft className="size-4" />
            </div>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Vitup pour les professionnels</h1>
              <p className="text-muted-foreground text-sm">
                Créez un compte ou connectez-vous pour gérer votre activité.
              </p>
            </div>

            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Entrez votre adresse e-mail"
                className="border border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button size='lg' type="submit" className="w-full font-semibold text-base">
                Continuer
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs">OU</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-3">
              <Button size='lg' variant="outline" className="w-full justify-start gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                  alt="Google"
                  width={24}
                  height={24}
                />
                Continuer avec Google
              </Button>
            </div>

            <div className="text-center text-sm mt-4">
              <span>Vous êtes client ? </span>
              <Link href="/clients" className="text-blue-600 font-medium hover:underline">
                Accédez à Vitup pour les clients
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="/runner.jpg"
          alt="Illustration de connexion"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
