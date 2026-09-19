export const siteConfig = {
  name: "Criminon Colombia",
  title: "Criminon Colombia - Rehabilitación Criminal Efectiva",
  description:
    "Criminon —significa «sin crimen»— es una organización internacional sin fines de lucro dedicada a la rehabilitación y reforma de personas con antecedentes penales en Colombia.",
  url: "https://criminoncolombia.org",
  ogImage: "/images/hero/cityscape-sunset.jpg",
  creator: "Criminon Colombia",
  keywords: [
    "rehabilitación criminal",
    "Criminon",
    "Colombia",
    "reinserción social",
    "programas penitenciarios",
    "El Camino a la Felicidad",
    "habilidades para la vida",
    "prevención del delito",
  ],
  contact: {
    email: "info@criminoncolombia.org",
    phone: "+57 (1) XXX-XXXX",
    address: "Bogotá, Colombia",
  },
  social: {
    facebook: "https://facebook.com/criminoncolombia",
    instagram: "https://instagram.com/criminoncolombia",
    youtube: "https://youtube.com/@criminoncolombia",
    twitter: "https://twitter.com/criminoncol",
  },
  nav: [
    { label: "Inicio", href: "/" },
    {
      label: "Quiénes Somos",
      href: "/about",
      children: [
        { label: "Sobre Criminon", href: "/about" },
        { label: "Historia en Colombia", href: "/about#historia" },
        { label: "El Camino a la Felicidad", href: "/about#camino-felicidad" },
      ],
    },
    {
      label: "Lo Que Hacemos",
      href: "/programs",
      children: [
        { label: "Programas para Adultos", href: "/programs#adultos" },
        { label: "Programas para Jóvenes", href: "/programs#jovenes" },
        { label: "Cursos por Correspondencia", href: "/courses" },
        { label: "Capacitación y Alianzas", href: "/programs#capacitacion" },
      ],
    },
    { label: "Nuestro Impacto", href: "/impact" },
    { label: "Noticias", href: "/news" },
    { label: "Contacto", href: "/contact" },
    { label: "Donar", href: "/donate", isAccent: true },
  ],
  footer: {
    programs: [
      { label: "El Camino a la Felicidad", href: "/courses/camino-felicidad" },
      { label: "Habilidades de Comunicación", href: "/courses/habilidades-comunicacion" },
      { label: "Herramientas de Estudio", href: "/courses/herramientas-estudio" },
      { label: "Manejo de la Supresión", href: "/courses/supresion" },
      { label: "Valores e Integridad", href: "/courses/valores-integridad" },
      { label: "Condiciones de Vida", href: "/courses/condiciones-vida" },
      { label: "Superando la Adicción", href: "/courses/superando-adiccion" },
    ],
    organization: [
      { label: "Sobre Criminon", href: "/about" },
      { label: "Historia en Colombia", href: "/about#historia" },
      { label: "Nuestro Impacto", href: "/impact" },
      { label: "Noticias", href: "/news" },
      { label: "Contacto", href: "/contact" },
    ],
    getInvolved: [
      { label: "Ser Voluntario", href: "/volunteer" },
      { label: "Ser Patrocinador", href: "/about#patrocinadores" },
      { label: "Solicitar un Curso", href: "/courses/request" },
      { label: "Donar", href: "/donate" },
    ],
  },
  courses: [
    {
      id: "camino-felicidad",
      title: "El Camino a la Felicidad",
      objective: "Restablecer un código moral básico y el respeto a las leyes.",
      icon: "BookOpen",
    },
    {
      id: "habilidades-comunicacion",
      title: "Habilidades de Comunicación",
      objective:
        "Desarrollar la capacidad de interactuar con otros de forma pacífica.",
      icon: "MessageCircle",
    },
    {
      id: "herramientas-estudio",
      title: "Herramientas de Estudio",
      objective:
        "Superar las barreras del aprendizaje para facilitar la reinserción educativa o laboral.",
      icon: "GraduationCap",
    },
    {
      id: "supresion",
      title: "Altos y Bajos en la Vida",
      objective:
        "Aprender a detectar y neutralizar relaciones interpersonales destructivas.",
      icon: "TrendingUp",
    },
    {
      id: "valores-integridad",
      title: "Valores e Integridad Personal",
      objective:
        "Aliviar la culpa y lograr que el recluso asuma la responsabilidad total de sus delitos.",
      icon: "Heart",
    },
    {
      id: "condiciones-vida",
      title: "Mejorando las Condiciones de Vida",
      objective:
        "Brindar herramientas exactas para resolver problemas económicos, familiares o éticos.",
      icon: "Home",
    },
    {
      id: "superando-adiccion",
      title: "Superando la Adicción",
      objective:
        "Comprender el impacto mental de los estupefacientes para evitar recaídas.",
      icon: "Shield",
    },
  ],
  impactStats: [
    { label: "Países", value: "23+", icon: "Globe" },
    { label: "Años de Experiencia", value: "50+", icon: "Calendar" },
    { label: "Centros Penitenciarios", value: "100+", icon: "Building" },
    { label: "Personas Rehabilitadas", value: "50,000+", icon: "Users" },
  ],
};

export type SiteConfig = typeof siteConfig;
