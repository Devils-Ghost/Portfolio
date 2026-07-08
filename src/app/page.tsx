import HeroSection from "@/container/HomePage/HeroSection";
import AboutSection from "@/container/HomePage/AboutSection";
import SkillsSection from "@/container/HomePage/SkillsSection";
import ProjectsSection from "@/container/HomePage/ProjectsSection";
import ExperienceSection from "@/container/HomePage/ExperienceSection";
import CertificationsSection from "@/container/HomePage/CertificationsSection";
import EngagementSection from "@/container/HomePage/EngagementSection";
import BlogSection from "@/container/HomePage/SuccessStoriesSection";
import CallToAction from "@/container/HomePage/CallToAction";

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
      <BlogSection />
      <CertificationsSection />
      <CallToAction />
    </div>
  );
}
