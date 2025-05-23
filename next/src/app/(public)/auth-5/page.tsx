"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, LocateFixed, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AddressPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [noAddress, setNoAddress] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: noAddress ? null : address }),
      });
      if (!res.ok) throw new Error("Échec de l'envoi");
      return res.json();
    },
    onSuccess: () => {
      router.push("/onboarding/calendar");
    },
  });

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Button
            size="lg"
            onClick={() => mutation.mutate()}
            disabled={(!noAddress && address.trim() === "") || mutation.isLoading}
          >
            {mutation.isLoading ? "Chargement..." : "Continuer"}
            <MoveRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            Configuration du compte
          </p>
          <h1 className="text-3xl font-bold">Configurez l'adresse de votre établissement.</h1>
          <p className="text-muted-foreground">
            Ajoutez la localisation de votre entreprise afin que vos clients puissent facilement vous trouver.
          </p>
        </div>

        <div className="space-y-4">
          <label htmlFor="address" className="text-sm font-medium block">
            Où se situe votre entreprise ?
          </label>
          <div className="relative">
            <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="address"
              disabled={noAddress}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Saisissez votre adresse"
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="noAddress"
              checked={noAddress}
              onChange={(e) => setNoAddress(e.target.checked)}
              className="accent-primary-2 w-4 h-4"
            />
            <label htmlFor="noAddress" className="text-sm text-muted-foreground">
              Je n’ai pas d’adresse professionnelle (prestations itinérantes ou en ligne uniquement)
            </label>
          </div>

          {mutation.isError && (
            <p className="text-destructive text-sm">
              Une erreur est survenue. Veuillez réessayer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
