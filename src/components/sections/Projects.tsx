import { motion } from "framer-motion";
import { Github, ExternalLink, Shield, Terminal, Search, Lock, Network, Code, Link2, Cpu, EyeOff } from "lucide-react";
import { fadeUpProps, staggerItemProps } from "@/lib/animations";
import { Section, GlowBlob, SectionHeading } from "@/components/layout/Section";

const projects = [
  {
    title: "UrlShine",
    description:
      "A high-performance URL reconnaissance and normalization engine built in Go. Aggregates, de-duplicates, and normalizes URLs from multiple threat intelligence and search index sources to optimize security scans.",
    tags: ["Go", "Reconnaissance", "Security Auditing", "Bug Bounty"],
    icon: Link2,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/UrlShine",
    demo: null,
    accent: "#3B82F6",
  },
  {
    title: "DorkNio",
    description:
      "A powerful Google Dorking platform running entirely in the browser with zero server telemetry. Enables security researchers to locate sensitive files, exposed admin consoles, and potential web vulnerabilities securely.",
    tags: ["HTML", "JavaScript", "OSINT", "Google Dorking"],
    icon: Search,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/DorkNio",
    demo: "https://shii9.github.io/DorkNio/",
    accent: "#FF6B35",
  },
  {
    title: "ReconNio",
    description:
      "A modular, multi-threaded active and passive reconnaissance framework written in Go. Automates DNS discovery, target subdomain mapping, port auditing, and banner grabbing for initial attack surface evaluations.",
    tags: ["Go", "Recon", "DNS Discovery", "Network Auditing"],
    icon: Terminal,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/ReconNio",
    demo: null,
    accent: "#10B981",
  },
  {
    title: "Phishing Analyzer",
    description:
      "A TypeScript-based security analysis tool that parses suspicious URLs, inspects SSL certificates, performs WHOIS queries, and identifies potential credential-harvesting login flows to detect phishing attempts.",
    tags: ["TypeScript", "Phishing Analysis", "Threat Intel", "Web Security"],
    icon: Shield,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/Phishing-Analyzer",
    demo: null,
    accent: "#EC4899",
  },
  {
    title: "LSB Steganography",
    description:
      "A Python utility executing Least Significant Bit (LSB) steganography algorithms. Supports concealing and extracting encrypted payload files inside cover image, text, audio, and video media carriers.",
    tags: ["Python", "Steganography", "Cryptography", "Data Concealment"],
    icon: EyeOff,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/Steganography",
    demo: null,
    accent: "#F59E0B",
  },
  {
    title: "Nio AI Assistant",
    description:
      "An advanced AI agent assistant engineered for SecOps tasks. Automates threat intelligence ingestion, queries common security APIs, drafts incident response plans, and summarizes security log anomalies.",
    tags: ["Python", "AI Assistant", "SecOps Automation", "LLM Integration"],
    icon: Cpu,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/Nio-AI-Assistant",
    demo: null,
    accent: "#8B5CF6",
  },
];

export default function Projects() {
  return (
    <Section id="projects">
      <GlowBlob position="right" />

      {/* Section Header */}
      <SectionHeading eyebrow="What I've Built" title="Projects" />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
{projects.map((project, idx) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                {...staggerItemProps(idx)}
                className="h-full"
              >
                <div
                  className="h-full bg-card/60 backdrop-blur-sm border border-foreground/8 rounded-2xl p-6 flex flex-col gap-4 hover:border-foreground/15 transition-[border-color,box-shadow,opacity] duration-300 group relative overflow-hidden"
                >
                  {/* Accent glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${project.accent}18 0%, transparent 60%)`,
                    }}
                  />

                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center border border-foreground/10 flex-shrink-0"
                      style={{ backgroundColor: `${project.accent}20` }}
                    >
                      <Icon size={20} style={{ color: project.accent }} />
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${project.statusColor}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-foreground font-bold text-base mb-2 group-hover:text-primary transition-colors duration-200 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-foreground/5 border border-foreground/8 text-foreground/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-4 mt-auto border-t border-foreground/10">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                      data-testid={`link-github-${idx}`}
                    >
                      <Github size={14} />
                      <span>Source Code</span>
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors duration-200 ml-auto"
                        data-testid={`link-demo-${idx}`}
                      >
                        <ExternalLink size={14} />
                        <span>View Live</span>
                      </a>
                    )}
                  </div>
</div>
              </motion.div>
            );
          })}
      </div>

      <motion.div
        {...fadeUpProps(0.1)}
        className="flex justify-center mt-0"
      >
        <a
          href="https://github.com/shii9?tab=repositories"
          target="_blank"
          rel="noreferrer"
          data-testid="button-view-all-projects"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary/90 hover:bg-primary border border-primary/40 px-6 py-2.5 rounded-full transition-[background-color,box-shadow] duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.35)] select-text"
        >
          View All Projects
          <ExternalLink size={14} />
        </a>
      </motion.div>
    </Section>
  );
}
