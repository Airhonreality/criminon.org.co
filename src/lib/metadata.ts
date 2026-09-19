import type { Metadata } from "next";
import { siteConfig } from "./config";

export function generateSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...overrides,
  };
}

export function generatePageMetadata(
  page: {
    title: string;
    description: string;
    path: string;
    image?: string;
  },
  overrides?: Partial<Metadata>
): Metadata {
  return generateSiteMetadata({
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteConfig.url}${page.path}`,
      images: [
        {
          url: page.image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      title: page.title,
      description: page.description,
      images: [page.image || siteConfig.ogImage],
    },
    ...overrides,
  });
}
