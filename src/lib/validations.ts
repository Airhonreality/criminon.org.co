import { z } from "zod";

// Contact Form (for react-hook-form)
export const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Email invalido"),
  phone: z.string().optional(),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
  type: z.enum(["general", "voluntario", "institucion", "prensa"]),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Course Request
export const courseRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Email invalido"),
  institution: z.string().min(2, "Nombre de la institucion requerido"),
  courseType: z.enum([
    "camino-felicidad",
    "habilidades-comunicacion",
    "herramientas-estudio",
    "supresion",
    "valores-integridad",
    "condiciones-vida",
    "superando-adiccion",
    "todos",
  ]),
  message: z.string().max(1000).optional(),
});

export type CourseRequestData = z.infer<typeof courseRequestSchema>;

// Newsletter
export const newsletterSchema = z.object({
  email: z.string().email("Email invalido"),
  name: z.string().max(100).optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Donation
export const donationSchema = z.object({
  amount: z.number().min(1000, "El monto minimo es $1,000 COP"),
  currency: z.enum(["COP", "USD"]),
  donorName: z.string().max(100).optional(),
  donorEmail: z.string().email("Email invalido").optional(),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "pse"]),
  anonymous: z.boolean(),
  message: z.string().max(500).optional(),
});

export type DonationData = z.infer<typeof donationSchema>;

// Admin: Course
export const courseSchema = z.object({
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/),
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  objective: z.string().min(10),
  content: z.string().min(10),
  dynamics: z.string().min(10),
  imageUrl: z.string().url().optional().nullable(),
  order: z.number().int().min(0),
  published: z.boolean(),
});

export type CourseInput = z.infer<typeof courseSchema>;

// Admin: Post
export const postSchema = z.object({
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/),
  title: z.string().min(5).max(255),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  coverImageUrl: z.string().url().optional().nullable(),
  category: z.enum(["noticias", "casos-exito", "investigacion", "eventos"]),
  published: z.boolean(),
  publishedAt: z.string().optional(),
});

export type PostInput = z.infer<typeof postSchema>;

// Admin: Testimonial
export const testimonialSchema = z.object({
  name: z.string().min(2).max(255),
  role: z.string().max(255).optional(),
  content: z.string().min(10),
  imageUrl: z.string().url().optional().nullable(),
  location: z.string().max(255).optional(),
  featured: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// Admin: Impact Stat
export const impactStatSchema = z.object({
  label: z.string().min(2).max(255),
  value: z.string().max(100),
  description: z.string().optional(),
  icon: z.string().max(100).optional(),
  order: z.number().int().min(0),
});

export type ImpactStatInput = z.infer<typeof impactStatSchema>;
