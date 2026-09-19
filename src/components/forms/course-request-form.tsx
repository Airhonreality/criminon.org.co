"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { courseRequestSchema, type CourseRequestData } from "@/lib/validations";
import { Send, CheckCircle } from "lucide-react";

const courseOptions = [
  { value: "camino-felicidad", label: "El Camino a la Felicidad" },
  { value: "habilidades-comunicacion", label: "Habilidades de Comunicación" },
  { value: "herramientas-estudio", label: "Herramientas de Estudio" },
  { value: "supresion", label: "Altos y Bajos en la Vida" },
  { value: "valores-integridad", label: "Valores e Integridad Personal" },
  { value: "condiciones-vida", label: "Mejorando las Condiciones de Vida" },
  { value: "superando-adiccion", label: "Superando la Adicción" },
  { value: "todos", label: "Todos los Cursos" },
];

export function CourseRequestForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseRequestData>({
    resolver: zodResolver(courseRequestSchema),
  });

  const onSubmit = async (data: CourseRequestData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Course request:", data);
    setIsSubmitted(true);
    setIsLoading(false);
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">
          ¡Solicitud Enviada!
        </h3>
        <p className="text-stone-600 mb-6">
          Hemos recibido tu solicitud. Nuestro equipo te contactará en las
          próximas 48 horas para coordinar los detalles.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-stone-700 mb-1 block">
            Nombre Completo *
          </label>
          <Input {...register("name")} placeholder="Tu nombre" />
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

      <div>
        <label className="text-sm font-medium text-stone-700 mb-1 block">
          Institución / Centro Penitenciario *
        </label>
        <Input
          {...register("institution")}
          placeholder="Nombre de la institución"
        />
        {errors.institution && (
          <p className="text-red-500 text-xs mt-1">
            {errors.institution.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700 mb-1 block">
          Curso Solicitado *
        </label>
        <select
          {...register("courseType")}
          className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
        >
          <option value="">Selecciona un curso</option>
          {courseOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.courseType && (
          <p className="text-red-500 text-xs mt-1">
            {errors.courseType.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700 mb-1 block">
          Mensaje Adicional
        </label>
        <Textarea
          {...register("message")}
          placeholder="Cuéntanos más detalles sobre tu solicitud..."
          rows={4}
        />
      </div>

      <Button type="submit" size="lg" variant="accent" disabled={isLoading}>
        {isLoading ? (
          "Enviando..."
        ) : (
          <>
            Enviar Solicitud
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
