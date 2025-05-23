import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import ClientCard from "@/components/ClientCard"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ArrowLeft className="size-4" />
            </div>
          </a>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-xs">
            <h1>S'inscrire/se connecter</h1>
            <ClientCard
              title="Vitup pour les clients"
              description="Prenez rendez-vous avec un coach près de chez vous"
              href="/clients"
            />
            <ClientCard
              className="mt-4"
              title="Vitup pour les professionnels"
              description="Gérez et développez votre activité"
              href="/auth-2"
            />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/runner.jpg"
          alt="Illustration de connexion"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}
