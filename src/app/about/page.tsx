import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = generatePageMetadata({
  title: "Quiénes Somos",
  description:
    "Conoce la historia de Criminon, una organización internacional dedicada a la rehabilitación criminal desde 1952. Llegó a Colombia en 2005.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[400px]">
        <Image
          src="/images/facilities/criminon-building.jpg"
          alt="Edificio Criminon"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1B3A5C]/80" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quiénes Somos</h1>
            <p className="text-lg text-stone-200">
              Más de 50 años restaurando vidas y construyendo comunidades sin crimen.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1B3A5C] mb-6">Nuestra Misión</h2>
            <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
              <p>
                <strong className="text-[#1B3A5C]">1.</strong> Eliminar aquellos factores
                que producen y precipitan el comportamiento criminal.
              </p>
              <p>
                <strong className="text-[#1B3A5C]">2.</strong> Restaurar el sentido común
                y los valores morales.
              </p>
              <p>
                <strong className="text-[#1B3A5C]">3.</strong> Proporcionar herramientas
                educativas y habilidades para la vida, incluyendo una alfabetización
                efectiva, a quienes lo necesitan.
              </p>
              <p>
                <strong className="text-[#1B3A5C]">4.</strong> Proporcionar una
                rehabilitación efectiva del consumo de drogas.
              </p>
              <p>
                <strong className="text-[#1B3A5C]">5.</strong> Asistir al sistema de justicia
                penal para llevar a cabo reformas que permitan alcanzar estos objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Colombia */}
      <section id="historia" className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1B3A5C] mb-6">
                El Programa Criminon de la Mano con el Estado de Colombia
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  En 2005, bajo el sol implacable de Santa Fe de Ralito, en Córdoba, el
                  equipo de Criminon inició su primera prueba de fuego en Colombia por
                  encargo del Alto Comisionado de Paz.
                </p>
                <p>
                  Entre los desmovilizados de las AUC pesaba un nombre aterrador: Rodrigo
                  Mercado Peluffo, alias &quot;Cadena&quot;, jefe del Bloque Héroes de los
                  Montes de María.
                </p>
                <p>
                  Cadena se negó inicialmente a participar. Pero poco a poco, movido por
                  una curiosidad incómoda, se acercó. Hasta que un día se sentó en la mesa
                  de trabajo.
                </p>
                <p>
                  Unos días después, él mismo pidió reunir a todos los excombatientes.
                  Frente a sus hombres, con la voz quebrada, dio su testimonio: reconoció
                  la crueldad con la que había actuado, admitió el daño causado y asumió su
                  responsabilidad sin excusas.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/team/team-photo.jpg"
                alt="Equipo Criminon"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Way to Happiness */}
      <section id="camino-felicidad" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1B3A5C] mb-6 text-center">
              El Camino a la Felicidad
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Es un código moral laico basado estrictamente en el sentido común,
              diseñado para restaurar la brújula ética, la responsabilidad personal y
              el respeto mutuo en cualquier individuo, sin importar su origen o creencias.
              A través de 21 preceptos prácticos y universales —como vivir con la verdad,
              dar un buen ejemplo, respetar los derechos de los demás y buscar prosperar de
              manera honesta—, este programa no recurre a dogmas religiosos ni a castigos,
              sino a la lógica transparente de que las propias acciones determinan la
              calidad de vida.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "No hagas nada ilegal",
                "Sé digno de confianza",
                "Respeta los esfuerzos de los demás",
                "Busca prosperar de manera honesta",
                "Dar un buen ejemplo",
                "Vivir con la verdad",
              ].map((precept) => (
                <Card key={precept}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E8734A] flex-shrink-0" />
                    <span className="text-sm font-medium text-stone-700">
                      {precept}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crisis */}
      <section className="py-20 bg-[#1B3A5C] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">La Crisis Penitenciaria</h2>
            <p className="text-stone-300 text-lg">
              Colombia enfrenta una crisis penitenciaria urgente que requiere atención
              inmediata.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "104,000+", label: "Personas recluidas" },
              { value: "82,000", label: "Cupos disponibles" },
              { value: "28%", label: "Hacinamiento" },
              { value: "37%", label: "En prisión preventiva" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-[#C5A55A]">{stat.value}</div>
                  <div className="text-sm text-stone-300 mt-2">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="accent" asChild>
              <Link href="/courses/request">Solicitar un Curso</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
