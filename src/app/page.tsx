import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { AgentsSection } from "@/components/sections/agents";
import { MetricsSection, CTASection } from "@/components/sections/cta";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AgentsSection />
      <CTASection />
    </main>
  );
}
