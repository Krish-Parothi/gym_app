import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection, StatsBar } from "@/components/landing/hero-section";
import { ProgramsSection } from "@/components/landing/programs-sections";
import { WhyUsSection } from "@/components/landing/why-us-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";



export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <ProgramsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
