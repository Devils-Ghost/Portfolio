import HeroSection from "@/components/HomePageSections/HeroSection";
import AboutSection from "@/components/HomePageSections/AboutSection";
import SkillsSection from "@/components/HomePageSections/SkillsSection";
import ProjectsSection from "@/components/HomePageSections/ProjectsSection";
import ExperienceSection from "@/components/HomePageSections/ExperienceSection";
import CertificationsSection from "@/components/HomePageSections/CertificationsSection";

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
      <CertificationsSection />
    </div>
  );
}
