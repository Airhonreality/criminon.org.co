import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { DonationForm } from "@/components/forms/donation-form";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, CreditCard, Users } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Donar",
  description:
    "Tu donación permite que Criminon continúe brindando herramientas de rehabilitación a quienes más lo necesitan.",
  path: "/donate",
});

const benefits = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Transforma Vidas",
    description:
      "Cada donación帮助a una persona a recibir herramientas de rehabilitación que cambian su vida para siempre.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Reduce la Reincidencia",
    description:
      "Nuestros programas han demostrado reducir la reincidencia criminal en un 70%.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Donación Segura",
    description:
      "Utilizamos pasarelas de pago seguras para proteger tu información.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Comunidad",
    description:
      "Únete a una comunidad de personas comprometidas con la rehabilitación y la paz social.",
  },
];

export default function DonatePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#1B3A5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Ayúdanos a Crear un Mañana Seguro y Libre
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            Tu donación permite que Criminon continúe brindando herramientas de
            rehabilitación a quienes más lo necesitan.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">
                ¿Por Qué Donar?
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <Card key={benefit.title}>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E8734A]/10 rounded-lg flex items-center justify-center text-[#E8734A] flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1B3A5C] mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-stone-600">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">
                    Haz tu Donación
                  </h2>
                  <DonationForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-4">
            Tu Impacto con Cada Donación
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-8">
            <div>
              <div className="text-3xl font-bold text-[#E8734A]">$50,000</div>
              <div className="text-sm text-stone-600 mt-2">
                Financia un curso completo para 20 personas
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E8734A]">$20,000</div>
              <div className="text-sm text-stone-600 mt-2">
                Proporciona materiales de estudio para un centro
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E8734A]">$5,000</div>
              <div className="text-sm text-stone-600 mt-2">
                Financia la capacitación de un voluntario
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
