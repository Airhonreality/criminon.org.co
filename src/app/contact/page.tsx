import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { generatePageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Contacto",
  description:
    "Contáctate con Criminon Colombia. Estamos aquí para responder tus preguntas sobre nuestros programas de rehabilitación.",
  path: "/contact",
});

const contactInfo = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Email",
    value: "info@criminoncolombia.org",
    href: "mailto:info@criminoncolombia.org",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Teléfono",
    value: "+57 (1) XXX-XXXX",
    href: "tel:+571",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Dirección",
    value: "Bogotá, Colombia",
    href: null,
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Horario",
    value: "Lun - Vie: 8:00 AM - 5:00 PM",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#1B3A5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Contacto</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            ¿Tienes preguntas sobre nuestros programas? ¿Quieres ser voluntario o
            solicitar un curso? Estamos aquí para ayudarte.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">
                Información de Contacto
              </h2>
              {contactInfo.map((info) => (
                <Card key={info.title}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#E8734A]/10 rounded-lg flex items-center justify-center text-[#E8734A] flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-sm text-stone-500">{info.title}</div>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium text-[#1B3A5C] hover:text-[#E8734A] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-medium text-[#1B3A5C]">{info.value}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">
                    Envíanos un Mensaje
                  </h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
