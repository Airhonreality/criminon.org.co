"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";

const stats = [
  { label: "Países", value: "23+" },
  { label: "Años de Experiencia", value: "50+" },
  { label: "Centros Penitenciarios", value: "100+" },
  { label: "Personas Rehabilitadas", value: "50,000+" },
];

export function HeroSection() {
  return (
    <section className="relative">
      {/* Hero */}
      <div className="relative h-[600px] lg:h-[700px]">
        <Image
          src="/images/team/graduation-south-africa.jpg"
          alt="Graduación Criminon Sudáfrica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A5C]/90 to-[#1B3A5C]/60" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Sin Crimen,{" "}
              <span className="text-[#C5A55A]">Con Futuro</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-stone-200 mb-8 leading-relaxed"
            >
              Criminon restaura la responsabilidad, devuelve el respeto por uno mismo
              y demuestra que siempre es posible elegir un nuevo camino.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="xl" variant="accent" asChild>
                <Link href="/courses/request">
                  Solicitar un Curso
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1B3A5C]"
                asChild
              >
                <Link href="/about">
                  Conocer Más
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[#1B3A5C] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#C5A55A]">
                  {stat.value}
                </div>
                <div className="text-sm text-stone-300 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WelcomeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5C] mb-6">
              Bienvenidos a Criminon Colombia
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Criminon —que significa «sin crimen»— es una organización internacional
                sin fines de lucro dedicada a la rehabilitación y reforma de personas con
                antecedentes penales.
              </p>
              <p>
                Lleva a cabo su labor mediante servicios que fomentan el respeto por uno
                mismo y por los demás, la mejora en las habilidades de comunicación y
                resolución de conflictos, y las relaciones interpersonales, ayudando a
                romper hábitos destructivos.
              </p>
              <p>
                Criminon proporciona herramientas mediantes las cuales se adquieren
                habilidades básicas para la vida a personas que se encuentran actualmente
                encarceladas o que han estado en prisión, capacitándolas para convertirse
                en miembros éticos y productivos de sus comunidades.
              </p>
            </div>
            <Button className="mt-8" variant="accent" asChild>
              <Link href="/about">
                Nuestra Historia
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/facilities/criminon-building.jpg"
                alt="Edificio Criminon"
                width={600}
                height={400}
                className="object-cover w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#E8734A] text-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold">2005</div>
              <div className="text-sm">Llegada a Colombia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProgramsPreview() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5C] mb-4">
            Nuestros Programas
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Cada curso utiliza materiales específicos para modificar la conducta del
            estudiante mediante lecturas, ensayos y ejercicios prácticos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.courses.slice(0, 6).map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#E8734A]/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-[#E8734A] text-xl font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#1B3A5C]">
                    {course.title}
                  </h3>
                  <p className="text-sm text-stone-600 mb-4">{course.objective}</p>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-[#E8734A] text-sm font-medium hover:underline inline-flex items-center"
                  >
                    Ver detalles
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/programs">
              Ver Todos los Programas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 bg-[#1B3A5C]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ayúdanos a Crear un Mañana Seguro y Libre
        </h2>
        <p className="text-stone-300 max-w-2xl mx-auto mb-8">
          Tu donación permite que Criminon continúe brindando herramientas de
          rehabilitación a quienes más lo necesitan. Cada contribución transforma
          vidas.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="xl" variant="accent" asChild>
            <Link href="/donate">
              Donar Ahora
              <Heart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="xl"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#1B3A5C]"
            asChild
          >
            <Link href="/volunteer">Ser Voluntario</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
