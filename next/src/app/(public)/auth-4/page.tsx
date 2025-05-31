"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MoveRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  "Moi uniquement",
  "2 à 5 personnes",
  "6 à 10 personnes",
  "+ de 11 personnes",
];

export default function TeamSizePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/team-size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamSize: selected }),
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
      {/* Header navigation */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Button
          size="lg"
          onClick={() => mutation.mutate()}
          disabled={!selected || mutation.isLoading}
        >
          {mutation.isLoading ? "Chargement..." : "Continuer"}
          <MoveRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            Configuration du compte
          </p>
          <h1 className="text-3xl font-bold">
            De combien de personnes se compose votre équipe ?
          </h1>
          <p className="text-muted-foreground">
            Cela nous aidera à configurer votre calendrier correctement
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size='lg'
              className={cn(
                "bg-white justify-start text-left h-auto py-4",
                selected === option &&
                  "border-primary bg-muted/50 hover:bg-muted"
              )}
              onClick={() => setSelected(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        {mutation.isError && (
          <p className="text-destructive text-sm mt-2">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </div>
    </div>
  );
}
