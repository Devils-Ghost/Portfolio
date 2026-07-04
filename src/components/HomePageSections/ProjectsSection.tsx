"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, GitBranch, ExternalLink } from "lucide-react";
import ProjectCard, { ProjectData } from "@/components/ui/ProjectCard";
import Modal from "@/components/ui/Modal"; // Import the new Modal

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );

  const projects: ProjectData[] = [
    {
      title: "AI-Based Intrusion Detection System",
      desc: "Developed a machine learning model to classify network attacks.",
      fullDesc:
        "An advanced machine learning pipeline capable of classifying over 40 different types of network intrusion attempts. This system drastically reduces false positives while maintaining high detection rates across complex network topologies.",
      techStack: ["Python", "Scikit-Learn", "Pandas", "Network Security"],
      github: "https://github.com/yourusername/repo",
    },
    {
      title: "Blockchain Chain of Custody",
      desc: "Engineered a blockchain-powered management system for forensics.",
      fullDesc:
        "Engineered a highly secure chain of custody application using Go. This ensures that digital forensic evidence remains completely immutable from the moment of capture through the final court presentation.",
      techStack: ["Go", "Hyperledger", "Blockchain", "Cryptography"],
      github: "https://github.com/yourusername/repo",
    },
    {
      title: "Secure AI Civic Platform",
      desc: "Conceptualized a secure AI assistant for voters at the AI + Elections Hackathon.",
      fullDesc:
        "Designed during the AI + Elections Hackathon, this platform provides voters with a secure, untampered AI assistant to verify polling data, reducing election misinformation through robust backend validation.",
      techStack: ["Next.js", "Python", "LLMs", "System Design"],
      live: "https://your-live-link.com",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20 relative">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Work</h2>
        <Link
          href="/projects"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
        >
          View All{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* ================= ORGANIC CLUSTER LAYOUT ================= */}
      <div className="flex flex-col gap-12 md:gap-0 relative">
        {projects.map((project, index) => {
          let positionClasses = "";

          if (index === 0) {
            positionClasses = "md:self-start";
          } else if (index === 1) {
            positionClasses = "md:self-end md:-mt-24 lg:-mt-32";
          } else if (index === 2) {
            positionClasses =
              "md:self-start md:-mt-24 lg:-mt-32 md:ml-12 lg:ml-24";
          }

          return (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
              className={positionClasses}
            />
          );
        })}
      </div>

      {/* ================= REUSABLE MODAL ================= */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        className="max-w-2xl" // Pass custom width for the project modal
      >
        {selectedProject && (
          <>
            <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {selectedProject.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-8">
              {selectedProject.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-blue-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed mb-10">
              {selectedProject.fullDesc}
            </p>

            <div className="flex gap-4">
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  <GitBranch size={18} /> Source Code
                </a>
              )}
              {selectedProject.live && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
