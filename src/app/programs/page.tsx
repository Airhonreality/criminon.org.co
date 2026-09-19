import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  MessageCircle,
  GraduationCap,
  TrendingUp,
  Heart,
  Home,
  Shield,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Lo Que Hacemos - Programas",
  description:
    "Conoce los programas de rehabilitación de Criminon: El Camino a la Felicidad, Habilidades de Comunicación, Herramientas de Estudio y más.",
  path: "/programs",
});

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-6 w-6" />,
  MessageCircle: <MessageCircle className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
};

const courses = [
  {
    id: "camino-felicidad",
    title: "El Camino a la Felicidad",
    objective: "Restablecer un código moral básico y el respeto a las leyes.",
    description:
      "El estudiante analiza los 21 preceptos no religiosos del folleto homónimo. Se escribe un ensayo por cada precepto, explicando cómo violar esa norma afectó su vida pasada y cómo pretenden aplicarla en el futuro.",
    icon: "BookOpen",
  },
  {
    id: "habilidades-comunicacion",
    title: "Habilidades de Comunicación",
    objective: "Desarrollar la capacidad de interactuar con otros de forma pacífica.",
    description:
      "Se estudian los componentes del ciclo de la comunicación. Incluye rutinas de entrenamiento prácticas donde el participante practica mirar fijamente a otra persona sin reaccionar, hablar con claridad y aprender a reconocer lo que otros dicen sin alterarse.",
    icon: "MessageCircle",
  },
  {
    id: "herramientas-estudio",
    title: "Herramientas de Estudio",
    objective:
      "Superar las barreras del aprendizaje para facilitar la reinserción educativa o laboral.",
    description:
      'Enseña la "Tecnología de Estudio" enfocada en tres barreras principales: la falta de masa, saltarse gradientes y la palabra malentendida. El alumno aprende a usar diccionarios de forma exhaustiva.',
    icon: "GraduationCap",
  },
  {
    id: "supresion",
    title: "Altos y Bajos en la Vida",
    objective:
      "Aprender a detectar y neutralizar relaciones interpersonales destructivas.",
    description:
      "Define los conceptos de Personalidad Antisocial y Personalidad Social. El estudiante evalúa a las personas de su pasado para entender quiénes influyeron negativamente en sus actos delictivos.",
    icon: "TrendingUp",
  },
  {
    id: "valores-integridad",
    title: "Valores e Integridad Personal",
    objective:
      "Aliviar la culpa y lograr que el recluso asuma la responsabilidad total de sus delitos.",
    description:
      "Introduce los conceptos de Overs (actos dañinos) y Withholds (ocultar activamente esos actos). El participante escribe una confesión detallada de sus transgresiones pasadas.",
    icon: "Heart",
  },
  {
    id: "condiciones-vida",
    title: "Mejorando las Condiciones de Vida",
    objective:
      "Brindar herramientas exactas para resolver problemas económicos, familiares o éticos.",
    description:
      "Introduce las Fórmulas de las Condiciones, pasos secuenciales asignados a diferentes estados de la vida. El estudiante identifica en qué nivel se encuentra un área específica y aplica los pasos correspondientes.",
    icon: "Home",
  },
  {
    id: "superando-adiccion",
    title: "Superando la Adicción",
    objective:
      "Comprender el impacto mental de los estupefacientes para evitar recaídas.",
    description:
      "Explica la teoría de que los residuos de las drogas se alojan en los tejidos grasos del cuerpo durante años, nublando la mente y detonando deseos de consumir. Es un componente teórico que complementa los cursos anteriores.",
    icon: "Shield",
  },
];

export default function ProgramsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[350px]">
        <Image
          src="/images/team/group-ceremony.webp"
          alt="Ceremonia Criminon"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1B3A5C]/80" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Lo Que Hacemos</h1>
            <p className="text-lg text-stone-200">
              Programas de rehabilitación basados en más de 50 años de experiencia
              internacional.
            </p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="adultos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B3A5C] mb-4">
              Programas para Adultos
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Cada curso utiliza materiales específicos para modificar la conducta del
              estudiante mediante lecturas, ensayos y ejercicios prácticos.
            </p>
          </div>

          <div className="space-y-8">
            {courses.map((course, i) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-64 bg-[#1B3A5C] flex items-center justify-center p-8">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          {iconMap[course.icon]}
                        </div>
                        <div className="text-sm text-stone-300">Curso {i + 1}</div>
                      </div>
                    </div>
                    <div className="flex-1 p-6 md:p-8">
                      <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">
                        {course.title}
                      </h3>
                      <p className="text-[#E8734A] font-medium text-sm mb-3">
                        {course.objective}
                      </p>
                      <p className="text-stone-600 mb-4">{course.description}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>Más Información</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#E8734A]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Interesado en Nuestros Programas?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Solicita un curso para tu institución o centro penitenciario. Nuestro equipo
            se pondrá en contacto contigo.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/courses/request">Solicitar un Curso</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
