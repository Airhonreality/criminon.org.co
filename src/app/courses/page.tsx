import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  MessageCircle,
  GraduationCap,
  TrendingUp,
  Heart,
  Home,
  Shield,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Cursos",
  description:
    "Conoce todos los cursos de rehabilitación de Criminon Colombia. Cada curso está diseñado para transformar vidas.",
  path: "/courses",
});

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-8 w-8" />,
  MessageCircle: <MessageCircle className="h-8 w-8" />,
  GraduationCap: <GraduationCap className="h-8 w-8" />,
  TrendingUp: <TrendingUp className="h-8 w-8" />,
  Heart: <Heart className="h-8 w-8" />,
  Home: <Home className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
};

const courses = [
  {
    id: "camino-felicidad",
    title: "El Camino a la Felicidad",
    objective: "Restablecer un código moral básico y el respeto a las leyes.",
    description:
      "El estudiante analiza los 21 preceptos no religiosos del folleto homónimo. Se escribe un ensayo por cada precepto.",
    icon: "BookOpen",
    color: "bg-blue-500",
  },
  {
    id: "habilidades-comunicacion",
    title: "Habilidades de Comunicación",
    objective: "Desarrollar la capacidad de interactuar con otros de forma pacífica.",
    description:
      "Incluye rutinas de entrenamiento prácticas donde el participante practica habilidades de comunicación.",
    icon: "MessageCircle",
    color: "bg-green-500",
  },
  {
    id: "herramientas-estudio",
    title: "Herramientas de Estudio",
    objective:
      "Superar las barreras del aprendizaje para facilitar la reinserción educativa o laboral.",
    description:
      "Enseña la Tecnología de Estudio enfocada en tres barreras principales del aprendizaje.",
    icon: "GraduationCap",
    color: "bg-purple-500",
  },
  {
    id: "supresion",
    title: "Altos y Bajos en la Vida",
    objective:
      "Aprender a detectar y neutralizar relaciones interpersonales destructivas.",
    description:
      "Define los conceptos de Personalidad Antisocial y Personalidad Social.",
    icon: "TrendingUp",
    color: "bg-orange-500",
  },
  {
    id: "valores-integridad",
    title: "Valores e Integridad Personal",
    objective:
      "Aliviar la culpa y lograr que el recluso asuma la responsabilidad total.",
    description:
      "Introduce los conceptos de Overs y Withholds para la toma de responsabilidad.",
    icon: "Heart",
    color: "bg-red-500",
  },
  {
    id: "condiciones-vida",
    title: "Mejorando las Condiciones de Vida",
    objective:
      "Brindar herramientas para resolver problemas económicos, familiares o éticos.",
    description:
      "Introduce las Fórmulas de las Condiciones para diferentes estados de la vida.",
    icon: "Home",
    color: "bg-teal-500",
  },
  {
    id: "superando-adiccion",
    title: "Superando la Adicción",
    objective:
      "Comprender el impacto mental de los estupefacientes para evitar recaídas.",
    description:
      "Explica cómo los residuos de las drogas afectan la mente y detonan deseos de consumir.",
    icon: "Shield",
    color: "bg-indigo-500",
  },
];

export default function CoursesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#1B3A5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Cursos</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            Cada curso utiliza materiales específicos para modificar la conducta del
            estudiante mediante lecturas, ensayos y ejercicios prácticos.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className={`h-2 ${course.color}`} />
                <CardContent className="p-6">
                  <div className="mb-4 text-[#1B3A5C]">
                    {iconMap[course.icon]}
                  </div>
                  <h2 className="text-xl font-bold text-[#1B3A5C] mb-2">
                    {course.title}
                  </h2>
                  <p className="text-[#E8734A] text-sm font-medium mb-3">
                    {course.objective}
                  </p>
                  <p className="text-stone-600 text-sm mb-6">
                    {course.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-[#E8734A] group-hover:text-white group-hover:border-[#E8734A] transition-colors"
                    asChild
                  >
                    <Link href={`/courses/${course.id}`}>
                      Ver Detalles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-4">
            ¿Interesado en Nuestros Cursos?
          </h2>
          <p className="text-stone-600 mb-8 max-w-xl mx-auto">
            Solicita un curso para tu institución o centro penitenciario.
          </p>
          <Button size="lg" variant="accent" asChild>
            <Link href="/courses/request">
              Solicitar un Curso
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
