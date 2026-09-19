import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Globe, Calendar, Building, Users, Award, BookOpen, TrendingDown } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Nuestro Impacto",
  description:
    "Descubre el impacto de Criminon en la rehabilitación criminal: más de 50 años transformando vidas en 23 países.",
  path: "/impact",
});

const impactStats = [
  {
    icon: <Globe className="h-8 w-8" />,
    value: "23+",
    label: "Países",
    description: "Presencia internacional",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    value: "50+",
    label: "Años",
    description: "De experiencia en rehabilitación",
  },
  {
    icon: <Building className="h-8 w-8" />,
    value: "100+",
    label: "Centros",
    description: "Penitenciarios atendidos",
  },
  {
    icon: <Users className="h-8 w-8" />,
    value: "50,000+",
    label: "Personas",
    description: "Rehabilitadas exitosamente",
  },
  {
    icon: <TrendingDown className="h-8 w-8" />,
    value: "70%",
    label: "Reducción",
    description: "En reincidencia criminal",
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    value: "7",
    label: "Cursos",
    description: "De habilidades para la vida",
  },
];

const testimonials = [
  {
    name: "Rodrigo Mercado Peluffo",
    role: "Ex-comandante paramilitar",
    quote:
      'Reconoció la crueldad con la que había actuado, admitió el daño causado a las víctimas y a su propia familia, y asumió su responsabilidad sin excusas.',
    location: "Santa Fe de Ralito, Córdoba",
  },
  {
    name: "Funcionarios del Ministerio de Justicia",
    role: "Gobierno de Colombia",
    quote:
      '"¿Qué le están haciendo a esta gente que está cambiando así?" era la pregunta constante al ver los resultados.',
    location: "Colombia",
  },
];

export default function ImpactPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[400px]">
        <Image
          src="/images/hero/cityscape-sunset.jpg"
          alt="Ciudad al atardecer"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1B3A5C]/80" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Impacto</h1>
            <p className="text-lg text-stone-200">
              Más de 50 años transformando vidas y comunidades en todo el mundo.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B3A5C] mb-4">
              Datos que Transforman
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Números que reflejan nuestro compromiso con la rehabilitación efectiva y
              la reducción de la reincidencia criminal.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactStats.map((stat, i) => (
              <Card key={stat.label} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#E8734A]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E8734A]">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-[#1B3A5C] mb-2">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-stone-700 mb-1">{stat.label}</div>
                  <div className="text-sm text-stone-500">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1B3A5C] mb-12 text-center">
            Historias de Transformación
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-8">
                  <div className="mb-4">
                    <Award className="h-8 w-8 text-[#C5A55A]" />
                  </div>
                  <blockquote className="text-stone-600 italic mb-6 leading-relaxed">
                    &quot;{t.quote}&quot;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-[#1B3A5C]">{t.name}</div>
                    <div className="text-sm text-stone-500">{t.role}</div>
                    <div className="text-xs text-stone-400 mt-1">{t.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific Studies */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1B3A5C] mb-6">
              Estudios Científicos
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Desde 1972 Criminon ha demostrado resultados consistentes. Numerosos
              estudios, informes y documentos técnicos presentados a lo largo de los años
              respaldan la efectividad de nuestra metodología.
            </p>
            <Button variant="outline" size="lg">
              Ver Estudios
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B3A5C]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sé Parte del Cambio
          </h2>
          <p className="text-stone-300 mb-8 max-w-xl mx-auto">
            Tu apoyo permite que más personas reciban las herramientas necesarias para
            una segunda oportunidad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="accent" asChild>
              <Link href="/donate">Donar Ahora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#1B3A5C]"
              asChild
            >
              <Link href="/volunteer">Ser Voluntario</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
