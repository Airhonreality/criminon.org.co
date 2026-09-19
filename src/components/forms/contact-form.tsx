"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      type: "general",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form data:", data);
    setIsSubmitted(true);
    setIsLoading(false);
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">
          Mensaje Enviado!
        </h3>
        <p className="text-stone-600 mb-6">
          Gracias por contactarnos. Te responderemos lo antes posible.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Nombre *
          </label>
          <Input {...register("name")} placeholder="Tu nombre completo" />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Email *
          </label>
          <Input {...register("email")} type="email" placeholder="tu@email.com" />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Telefono
          </label>
          <Input {...register("phone")} placeholder="+57 XXX XXX XXXX" />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Tipo de Consulta *
          </label>
          <select
            {...register("type")}
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
          >
            <option value="general">Consulta General</option>
            <option value="voluntario">Ser Voluntario</option>
            <option value="institucion">Institucion</option>
            <option value="prensa">Prensa / Medios</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700 mb-1 block">
          Asunto *
        </label>
        <Input {...register("subject")} placeholder="En que podemos ayudarte?" />
        {errors.subject && (
          <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700 mb-1 block">
          Mensaje *
        </label>
        <Textarea {...register("message")} placeholder="Escribe tu mensaje aqui..." rows={5} />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" variant="accent" disabled={isLoading}>
        {isLoading ? "Enviando..." : (<><Send className="mr-2 h-4 w-4" /> Enviar Mensaje</>)}
      </Button>
    </form>
  );
}
