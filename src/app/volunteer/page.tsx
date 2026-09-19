import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Users, BookOpen, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Involúcrate",
  description:
    "Únete a Criminon Colombia como voluntario, donante o patrocinador. Hay muchas formas de contribuir a la rehabilitación criminal.",
  path: "/volunteer",
});

const ways = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Ser Voluntario",
    description:
      "Comparte tu tiempo y habilidades para ayudar a personas en proceso de reintegración. Capacitación incluida.",
    cta: "Registrarse como Voluntario",
    href: "/volunteer/register",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Ser Patrocinador",
    description:
      "Las empresas pueden patrocinarse para financiar cursos y materiales para centros penitenciarios.",
    cta: "Más Información",
    href: "/about#patrocinadores",
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Solicitar un Curso",
    description:
      "Si trabajas en un centro penitenciario o institución, solicita nuestros programas de rehabilitación.",
    cta: "Solicitar Curso",
    href: "/courses/request",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Difundir",
    description:
      "Comparte nuestra misión en redes sociales, con tu comunidad y con personas que puedan beneficiarse.",
    cta: "Compartir",
    href: "/",
  },
];

export default function VolunteerPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#1B3A5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Involúcrate con Criminon
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            Hay muchas formas de contribuir a la rehabilitación criminal y la
            construcción de comunidades más seguras.
          </p>
        </div>
      </section>

      {/* Ways to help */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {ways.map((way) => (
              <Card key={way.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#E8734A]/10 rounded-full flex items-center justify-center mb-6 text-[#E8734A]">
                    {way.icon}
                  </div>
                  <h2 className="text-xl font-bold text-[#1B3A5C] mb-3">
                    {way.title}
                  </h2>
                  <p className="text-stone-600 mb-6">{way.description}</p>
                  <Button variant="outline" asChild>
                    <Link href={way.href}>
                      {way.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <blockquote className="text-xl italic text-stone-600 mb-6">
            &quot;Si un comandante paramilitar endurecido por la guerra pudo
            confrontar su pasado y elegir el camino de la ética, qué impacto
            puede tener este programa en la sociedad.&quot;
          </blockquote>
          <cite className="text-[#1B3A5C] font-medium">— Criminon Colombia</cite>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#E8734A]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para Hacer la Diferencia?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Cada persona que se involucra amplifica nuestro impacto. Únete hoy.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Contactar</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
