import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
  uuid,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─── Auth Tables ───────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    passwordHash: text("password_hash"),
    role: varchar("role", { length: 50 }).default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("users_email_idx").on(t.email)]
);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: varchar("token_type", { length: 255 }),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [uniqueIndex("verification_tokens_unique").on(t.identifier, t.token)]
);

// ─── Content Tables ────────────────────────────────────────────
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    objective: text("objective").notNull(),
    content: text("content").notNull(),
    dynamics: text("dynamics").notNull(),
    imageUrl: text("image_url"),
    order: integer("order").default(0).notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("courses_slug_idx").on(t.slug)]
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    category: varchar("category", { length: 100 }).default("noticias"),
    authorId: uuid("author_id").references(() => users.id),
    published: boolean("published").default(false).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("posts_slug_idx").on(t.slug),
    index("posts_category_idx").on(t.category),
  ]
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    location: varchar("location", { length: 255 }),
    featured: boolean("featured").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("testimonials_featured_idx").on(t.featured)]
);

export const partners = pgTable("partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  websiteUrl: text("website_url"),
  logoUrl: text("logo_url"),
  type: varchar("type", { length: 100 }).default("institutional"),
  order: integer("order").default(0),
});

export const impactStats = pgTable("impact_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  order: integer("order").default(0),
});

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).default("general"),
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("contact_read_idx").on(t.read)]
);

export const courseRequests = pgTable("course_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }),
  courseType: varchar("course_type", { length: 255 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("newsletter_email_idx").on(t.email)]
);

export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  donorName: varchar("donor_name", { length: 255 }),
  donorEmail: varchar("donor_email", { length: 255 }),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("COP"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentId: varchar("payment_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  message: text("message"),
  anonymous: boolean("anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Email ─────────────────────────────────────────────────────
export const emails = pgTable(
  "emails",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    messageId: varchar("message_id", { length: 255 }).unique(),
    sender: varchar("sender", { length: 255 }).notNull(),
    recipient: varchar("recipient", { length: 255 }).notNull(),
    subject: text("subject"),
    bodyText: text("body_text"),
    bodyHtml: text("body_html"),
    attachments: jsonb("attachments").$type<unknown[]>().default([]).notNull(),
    direction: varchar("direction", { length: 10 })
      .notNull()
      .default("INBOUND"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("emails_direction_idx").on(t.direction),
    index("emails_created_at_idx").on(t.createdAt),
    check("emails_direction_check", sql`t.direction IN ('INBOUND', 'OUTBOUND')`),
  ]
);

// ─── Site Settings ─────────────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).default("text"),
});

// ─── Relations ─────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
