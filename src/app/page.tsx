import { SiteLayout } from "@/components/layout/site-layout";
import {
  HeroSection,
  WelcomeSection,
  ProgramsPreview,
  CTASection,
} from "@/components/sections/home-sections";
import { OfficialVideoSection } from "@/components/sections/video-section";
import { generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata();

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <WelcomeSection />
      <OfficialVideoSection />
      <ProgramsPreview />
      <CTASection />
    </SiteLayout>
  );
}
