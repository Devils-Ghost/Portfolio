import HeroSection from "@/sections/home/HeroSection";
import AboutSection from "@/sections/home/AboutSection";
import SkillsSection from "@/sections/home/SkillsSection";
import ProjectsSection from "@/sections/home/ProjectsSection";
import ExperienceSection from "@/sections/home/ExperienceSection";
import CertificationsSection from "@/sections/home/CertificationsSection";
import EngagementSection from "@/sections/home/EngagementSection";
import SuccessStoriesSection from "@/sections/home/SuccessStoriesSection";
import CallToAction from "@/sections/home/CallToAction";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* Subtle Glowing Background - Stays here because it covers the whole page */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black -z-10" />

      <HeroSection />

      {/* Spacer to force scroll */}
      <div className="h-24 w-full"></div>

      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <EngagementSection />
      <SuccessStoriesSection />
      <CertificationsSection />
      <CallToAction />
    </div>
  );
}
