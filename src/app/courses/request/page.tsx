import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { CourseRequestForm } from "@/components/forms/course-request-form";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Building, CheckCircle } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Solicitar un Curso",
  description:
    "Solicita un curso de Criminon para tu institución, centro penitenciario o comunidad.",
  path: "/courses/request",
});

const steps = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Elige el Curso",
    description:
      "Selecciona el programa que mejor se adapte a las necesidades de tu institución o comunidad.",
  },
  {
    icon: <Building className="h-6 w-6" />,
    title: "Completa el Formulario",
    description:
      "Proporciona los detalles de tu institución y las personas que participarán.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Coordinación",
    description:
      "Nuestro equipo se pondrá en contacto contigo para coordinar logística y fechas.",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Implementación",
    description:
      "Comienza el curso con materiales y capacitación incluidos.",
  },
];

export default function CourseRequestPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#1B3A5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Solicitar un Curso
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            Completa el formulario y nuestro equipo se pondrá en contacto contigo
            para coordinar la implementación del programa.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Card key={step.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#E8734A]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E8734A]">
                    {step.icon}
                  </div>
                  <div className="text-xs text-stone-400 mb-2">Paso {i + 1}</div>
                  <h3 className="font-semibold text-[#1B3A5C] mb-2">{step.title}</h3>
                  <p className="text-sm text-stone-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">
                  Formulario de Solicitud
                </h2>
                <CourseRequestForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
