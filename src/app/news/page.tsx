import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Noticias",
  description:
    "Noticias y actualizaciones de Criminon Colombia. Conoce nuestras últimas actividades y logros.",
  path: "/news",
});

const news = [
  {
    slug: "teaching-real-life-skills",
    title: "Enseñando Habilidades Reales para la Vida",
    excerpt:
      "Criminon United Kingdom proporciona cursos educativos complementarios para ayudar a los internos a tomar decisiones positivas y formular planes para el futuro.",
    category: "noticias",
    date: "2025-11-27",
    image: "/images/team/team-photo.jpg",
  },
  {
    slug: "reducing-disadvantage-incarcerated",
    title: "Reduciendo la Desventaja para las Personas Encarceladas",
    excerpt:
      "Criminon Maine ha estado trabajando incansablemente durante más de veinticinco años para brindar educación efectiva y habilidades para la vida.",
    category: "casos-exito",
    date: "2025-10-15",
    image: "/images/team/graduation-south-africa.jpg",
  },
  {
    slug: "florida-courses",
    title: "Criminon Florida Entrega Cursos de Habilidades para la Vida",
    excerpt:
      "El programa continúa expandiéndose en Florida, brindando herramientas esenciales para la rehabilitación de internos.",
    category: "noticias",
    date: "2025-09-20",
    image: "/images/facilities/training-session.jpg",
  },
];

const categoryLabels: Record<string, string> = {
  noticias: "Noticias",
  "casos-exito": "Casos de Éxito",
  investigacion: "Investigación",
  eventos: "Eventos",
};

export default function NewsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#1B3A5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Noticias</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            Mantente al día con las últimas noticias y actualizaciones de Criminon
            Colombia y alrededor del mundo.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Card key={item.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-stone-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="accent">
                      {categoryLabels[item.category]}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    <time>{item.date}</time>
                  </div>
                  <h2 className="font-bold text-lg text-[#1B3A5C] mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-stone-600 mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-[#E8734A] text-sm font-medium hover:underline inline-flex items-center"
                  >
                    Leer más
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
