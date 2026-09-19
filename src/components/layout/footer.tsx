import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-[#1B3A5C] text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1B3A5C] font-bold text-lg">C</span>
              </div>
              <div>
                <span className="font-bold text-lg">Criminon</span>
                <span className="text-xs block text-stone-300">Colombia</span>
              </div>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              Criminon —significa «sin crimen»— es una organización internacional sin
              fines de lucro dedicada a la rehabilitación y reforma de personas con
              antecedentes penales.
            </p>
            <div className="space-y-2 text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#C5A55A] transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{siteConfig.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold mb-4 text-[#C5A55A]">Programas</h3>
            <ul className="space-y-2 text-sm text-stone-300">
              {siteConfig.footer.programs.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h3 className="font-semibold mb-4 text-[#C5A55A]">Organización</h3>
            <ul className="space-y-2 text-sm text-stone-300">
              {siteConfig.footer.organization.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-semibold mb-4 text-[#C5A55A]">Involúcrate</h3>
            <ul className="space-y-2 text-sm text-stone-300">
              {siteConfig.footer.getInvolved.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} Criminon Colombia. Todos los derechos
            reservados.
          </p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="h-3 w-3 text-[#E8734A]" /> para la
            rehabilitación en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
