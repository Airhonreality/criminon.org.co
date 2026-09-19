"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top bar */}
      <div className="hidden md:block bg-[#1B3A5C] text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="https://able.org" target="_blank" rel="noopener" className="hover:text-[#C5A55A] transition-colors">ABLE.ORG</a>
            <a href="https://narconon.org" target="_blank" rel="noopener" className="hover:text-[#C5A55A] transition-colors">NARCONON.ORG</a>
            <a href="https://appliedscholastics.org" target="_blank" rel="noopener" className="hover:text-[#C5A55A] transition-colors">APPLIEDSCHOLASTICS.ORG</a>
            <a href="https://thewaytohappiness.org" target="_blank" rel="noopener" className="hover:text-[#C5A55A] transition-colors">THEWAYTOHAPPINESS.ORG</a>
          </div>
          <a href="tel:+571" className="hover:text-[#C5A55A] transition-colors font-medium">
            OBTENER AYUDA
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1B3A5C] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-[#1B3A5C]">Criminon</span>
              <span className="text-xs block text-stone-500 -mt-1">Colombia</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {siteConfig.nav.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    item.isAccent
                      ? "bg-[#E8734A] text-white hover:bg-[#E8734A]/90"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </Link>

                {item.children && openDropdown === item.href && (
                  <div className="absolute top-full left-0 w-56 rounded-md border border-stone-200 bg-white p-1 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {siteConfig.nav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md",
                    item.isAccent
                      ? "bg-[#E8734A] text-white text-center"
                      : "text-stone-700 hover:bg-stone-100"
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-1.5 text-sm text-stone-500 hover:text-stone-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
