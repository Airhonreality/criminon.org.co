"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationSchema, type DonationData } from "@/lib/validations";
import { Heart, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const presetAmounts = [10000, 25000, 50000, 100000];

export function DonationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50000);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50000,
      currency: "COP",
      paymentMethod: "credit_card",
      anonymous: false,
    },
  });

  const amount = watch("amount");

  const handleAmountClick = (preset: number) => {
    setSelectedAmount(preset);
    setValue("amount", preset);
  };

  const onSubmit = async (data: DonationData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Donation data:", data);
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">
          Gracias por tu Donacion!
        </h3>
        <p className="text-stone-600">
          Tu generosidad ayuda a transformar vidas. Recibiras un correo de
          confirmacion pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-stone-700 mb-3 block">
          Selecciona un monto
        </label>
        <div className="grid grid-cols-2 gap-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAmountClick(preset)}
              className={cn(
                "p-4 rounded-lg border-2 text-center transition-all font-semibold",
                selectedAmount === preset
                  ? "border-[#E8734A] bg-[#E8734A]/10 text-[#E8734A]"
                  : "border-stone-200 hover:border-stone-300"
              )}
            >
              ${preset.toLocaleString("es-CO")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700 mb-1 block">
          O ingresa un monto personalizado (COP) *
        </label>
        <Input
          {...register("amount", { valueAsNumber: true })}
          type="number"
          min={1000}
          placeholder="Monto en pesos colombianos"
          onChange={(e) => {
            setSelectedAmount(null);
            setValue("amount", parseInt(e.target.value) || 0);
          }}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Nombre (opcional)
          </label>
          <Input {...register("donorName")} placeholder="Tu nombre" />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Email (para recibo)
          </label>
          <Input {...register("donorEmail")} type="email" placeholder="tu@email.com" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700 mb-3 block">
          Metodo de pago
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "credit_card" as const, label: "Tarjeta" },
            { value: "pse" as const, label: "PSE" },
            { value: "bank_transfer" as const, label: "Transferencia" },
          ].map((method) => (
            <label
              key={method.value}
              className={cn(
                "p-3 rounded-lg border-2 text-center cursor-pointer transition-all text-sm font-medium",
                watch("paymentMethod") === method.value
                  ? "border-[#E8734A] bg-[#E8734A]/10 text-[#E8734A]"
                  : "border-stone-200 hover:border-stone-300"
              )}
            >
              <input
                type="radio"
                {...register("paymentMethod")}
                value={method.value}
                className="sr-only"
              />
              {method.label}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register("anonymous")} className="w-4 h-4 rounded border-stone-300" />
        <span className="text-sm text-stone-600">Donar de forma anonima</span>
      </label>

      <Button type="submit" size="xl" variant="accent" disabled={isLoading} className="w-full">
        {isLoading ? "Procesando..." : (<><Heart className="mr-2 h-5 w-5" /> Donar {amount ? `$${amount.toLocaleString("es-CO")}` : ""}</>)}
      </Button>

      <p className="text-xs text-stone-500 text-center">
        Tu donacion es deducible de impuestos. Recibiras un comprobante por correo electronico.
      </p>
    </form>
  );
}
