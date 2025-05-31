"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  Dumbbell,
  HeartPulse,
  StretchHorizontal,
  Bike,
  MoveRight,
  ArrowLeft,
  HandHeart,
  Pilcrow,
  Drumstick,
  Handshake,
  UserPlus,
  ListPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const prestations = [
  { name: "Coaching personnel", icon: UserPlus },
  { name: "Cours de yoga", icon: StretchHorizontal },
  { name: "Crossfit", icon: Dumbbell },
  { name: "Pilates", icon: HeartPulse },
  { name: "Musculation", icon: Dumbbell },
  { name: "Remise en forme", icon: HeartPulse },
  { name: "Zumba", icon: MoveRight },
  { name: "Cardio-training", icon: Bike },
  { name: "Stretching", icon: StretchHorizontal },
  { name: "Boxe", icon: Handshake },
  { name: "Arts martiaux", icon: Drumstick },
  { name: "Danse", icon: Pilcrow },
  { name: "Autre", icon: ListPlus },
];

export default function ServicesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [main, setMain] = useState<string | null>(null);
  const router = useRouter();

  const togglePrestation = (item: string) => {
    if (selected.includes(item)) {
      setSelected((prev) => prev.filter((p) => p !== item));
      if (main === item) setMain(null);
    } else if (selected.length < 4) {
      setSelected((prev) => [...prev, item]);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/prestations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prestations: selected, principale: main }),
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
        <Button
          size="lg"
          onClick={() => mutation.mutate()}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Envoi..." : "Continuer"}
          <MoveRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            Configuration du compte
          </p>
          <h1 className="text-3xl font-bold">
            Quelles prestations proposez-vous ?
          </h1>
          <p className="text-muted-foreground">
            Choisissez votre activité principale et jusqu’à 3 activités
            complémentaires
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {prestations.map(({ name, icon: Icon }) => {
            const isSelected = selected.includes(name);
            const isMain = main === name;

            return (
              <div
                key={name}
                onClick={() => togglePrestation(name)}
                className={cn(
                  "cursor-pointer relative border rounded-xl p-4 text-sm font-medium transition-all hover:shadow-sm flex flex-col gap-2",
                  isSelected ? "border-primary bg-muted/50" : "bg-background"
                )}
              >
                <Icon className="w-6 h-6 text-muted-foreground" />
                <span className="text-base">{name}</span>

                {isMain && (
                  <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-primary text-white">
                    Principal
                  </div>
                )}

                {isSelected && !isMain && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMain(name);
                    }}
                    className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full border text-primary hover:bg-primary hover:text-white transition"
                  >
                    Définir comme principal
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {mutation.isError && (
          <p className="text-destructive text-sm">Erreur lors de l'envoi.</p>
        )}
      </div>
    </div>
  );
}
