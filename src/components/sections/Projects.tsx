import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  Shield,
  Terminal,
  Search,
  Link2,
  Cpu,
  EyeOff,
  ShieldAlert,
  FileText,
  Download,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { fadeUpProps, fadeSubtleProps, staggerItemProps } from "@/lib/animations";
import { Section, GlowBlob, SectionHeading } from "@/components/layout/Section";

// Newest projects first, based on GitHub repository creation dates.
const projects = [
  {
    title: "EchoMe",
    date: "Aug 2026",
    description:
      "An AI-powered phishing detection and cybersecurity application that analyzes emails, URLs, domains, IP addresses, files, and screenshots to produce explainable risk assessments and actionable recommendations.",
    tags: ["React", "TypeScript", "Threat Detection", "AI Security"],
    icon: Shield,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/EchoMe",
    demo: "https://shii9.github.io/EchoMe/",
    accent: "#EC4899",
  },
  {
    title: "DorkNio",
    date: "May 2026",
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
    title: "UrlShine",
    date: "May 2026",
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
    title: "Nio AI Assistant",
    date: "Oct 2025",
    description:
      "An AI-powered virtual assistant that combines voice and text interaction with automation, speech recognition, text-to-speech, image generation, and real-time information retrieval.",
    tags: ["Python", "AI Assistant", "Voice Interaction", "Automation"],
    icon: Cpu,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/Nio-AI-Assistant",
    demo: null,
    accent: "#8B5CF6",
  },
  {
    title: "LSB Steganography",
    date: "Sep 2025",
    description:
      "A modern steganography toolkit for hiding encrypted data in image, audio, video, text, and other file carriers using Least Significant Bit techniques.",
    tags: ["Python", "Steganography", "Cryptography", "Data Concealment"],
    icon: EyeOff,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/Steganography",
    demo: "https://shii9.github.io/Steganography/",
    accent: "#F59E0B",
  },
  {
    title: "ReconNio",
    date: "Jul 2025",
    description:
      "A comprehensive Go-based reconnaissance toolkit with specialized modules for domain intelligence, network analysis, web application discovery, OSINT, and security testing.",
    tags: ["Go", "Recon", "DNS Discovery", "Network Auditing"],
    icon: Terminal,
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    github: "https://github.com/shii9/ReconNio",
    demo: null,
    accent: "#10B981",
  },
];

const simulationsData = [
  {
    type: "SOC Simulation & DFIR",
    role: "SOC Threat Detection Analysis Simulation: Endpoint Compromise & Log Correlation",
    company: "Splunk Enterprise · Sysmon · MITRE ATT&CK",
    date: "Oct 2026",
    link: "https://github.com/shii9/SOC_Simulation/tree/main/SOC_Investigation_Simulation_1",
    reportDocx: `${import.meta.env.BASE_URL}reports/Splunk-SOC-Investigation-(1)-Report.docx`,
    reportPdf: `${import.meta.env.BASE_URL}reports/Splunk-SOC-Investigation-(1)-Report.pdf`,
    highlight: "Simulation 1",
    icon: ShieldAlert,
    description:
      "A hands-on SOC simulation and DFIR investigation reconstructing a controlled Windows endpoint compromise from reverse HTTP Meterpreter C2 through local reconnaissance, privilege escalation, persistence via SYSTEM scheduled tasks, certutil tool staging, and Mimikatz credential-access preparation. Telemetry was correlated in Splunk Enterprise across Sysmon and Windows Security logs, mapped to MITRE ATT&CK, and codified into Sigma detection rules.",
    tags: [
      "Splunk Enterprise",
      "Sysmon Telemetry",
      "MITRE ATT&CK",
      "Sigma Rules",
      "SPL Threat Hunting",
      "DFIR",
      "Meterpreter C2",
      "LOLBINs (certutil)",
    ],
  },
];

const killChainPhases = [
  {
    step: "01",
    name: "Execution & C2",
    summary: "Meterpreter reverse_http session established from Kali to Windows 10 endpoint.",
    attack: "T1204.002 (User Execution) · T1071.001 (Web Protocols)",
    telemetry: "Sysmon Event ID 1 (Process Create: FreeClude.exe), Sysmon Event ID 3 (Outbound C2 socket), Win Event 4688",
    splunkQuery: 'index=windows (EventCode=1 OR EventCode=3) Image="*\\FreeClude.exe" | table _time host User Image DestinationIp DestinationPort',
  },
  {
    step: "02",
    name: "Discovery & PrivEsc",
    summary: "Internal situational reconnaissance; backdoor local account created and escalated to Administrators group.",
    attack: "T1033 (User Discovery) · T1082 (System Info) · T1136.001 / T1098.007",
    telemetry: "Sysmon 1 (whoami / hostname / systeminfo), Windows Security 4720 (User Created) & 4732 (Group Member Added)",
    splunkQuery: 'index=windows (EventCode=4720 OR EventCode=4732 OR (EventCode=1 Image IN ("*\\whoami.exe", "*\\systeminfo.exe")))',
  },
  {
    step: "03",
    name: "Persistence",
    summary: "Created scheduled task executing payload at user logon under SYSTEM privilege; temporary user account removed.",
    attack: "T1053.005 (Scheduled Task)",
    telemetry: "Windows Security Event 4698 (Scheduled Task Created with SYSTEM Principal), Sysmon Event ID 1 (schtasks.exe)",
    splunkQuery: 'index=windows EventCode=4698 | xmlkv | search UserId="*SYSTEM*" | table _time host TaskName UserId',
  },
  {
    step: "04",
    name: "Tool Staging & Creds",
    summary: "LOLBIN certutil download of Mimikatz disguised as GetClaude.exe; invoked privilege::debug for LSASS targeting.",
    attack: "T1105 (Ingress Tool Transfer) · T1003 (OS Credential Dumping)",
    telemetry: "Sysmon 1 (certutil -urlcache & GetClaude.exe), Sysmon 11 (File Create: GetClaude.exe), Sysmon 10 (lsass access)",
    splunkQuery: 'index=windows EventCode=1 (Image="*\\certutil.exe" OR Image="*\\GetClaude.exe" OR CommandLine="*privilege::debug*")',
  },
  {
    step: "05",
    name: "SIEM Correlation",
    summary: "Splunk Enterprise multi-source log correlation across ProcessGuid, Sigma rule generation, and ATT&CK Navigator layer mapping.",
    attack: "ATT&CK Enterprise Matrix · SigmaHQ Standard",
    telemetry: "Sysmon ProcessGuid correlation linking execution, network C2, file writes, and Windows Security audit events",
    splunkQuery: 'index=windows ProcessGuid="*" | transaction ProcessGuid maxspan=2h | table _time host Image CommandLine EventCode',
  },
];

export default function Projects() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopyQuery = (idx: number, query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

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
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border border-foreground/10 flex-shrink-0"
                    style={{ backgroundColor: `${project.accent}20` }}
                  >
                    <Icon size={20} style={{ color: project.accent }} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-foreground/10 text-muted-foreground bg-foreground/5">
                      {project.date}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${project.statusColor}`}
                    >
                      {project.status}
                    </span>
                  </div>
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
                    rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
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
        className="flex justify-center mb-16"
      >
        <a
          href="https://github.com/shii9?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="button-view-all-projects"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary/90 hover:bg-primary border border-primary/40 px-6 py-2.5 rounded-full transition-[background-color,box-shadow] duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.35)] select-text"
        >
          View All Projects
          <ExternalLink size={14} />
        </a>
      </motion.div>

      {/* Sub Header for Simulations (Placed down under projects like Write-ups in Research) */}
      <motion.div
        {...fadeUpProps()}
        className="mb-10"
      >
        <p className="text-primary font-semibold text-xs tracking-widest uppercase mb-2">Threat Emulation</p>
        <h3 className="text-2xl font-serif font-bold text-foreground">Simulations</h3>
        <div className="h-0.5 w-12 bg-primary/60 rounded-full mt-3" />
      </motion.div>

      {/* Timeline Layout for Simulations */}
      <div className="relative">
        <div className="space-y-6 sm:space-y-8">
          {simulationsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                {...fadeSubtleProps(idx * 0.06)}
                className="relative pl-16 sm:pl-20 md:pl-20"
              >
                <div className="absolute left-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,107,53,0.15)] z-10 mt-1">
                  <Icon size={20} />
                </div>

                <motion.div className="bg-card/50 border border-foreground/8 rounded-2xl p-5 md:p-6 hover:border-primary/25 transition-[border-color,box-shadow,opacity] duration-300 group">
                  {/* Category tag */}
                  <div className="mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/90 bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 inline-block">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {item.role}
                      </h3>
                      <p className="text-primary/80 text-sm mt-1 font-medium">{item.company}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {item.highlight && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          {item.highlight}
                        </span>
                      )}
                      <span className="text-muted-foreground text-sm bg-foreground/5 px-3 py-1 rounded-full border border-foreground/8 whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm text-left sm:text-justify">
                    {item.description}
                  </p>

                  {/* Clean, Clickable Cyber Kill Chain Map */}
                  <div className="my-4 rounded-xl bg-background/50 border border-foreground/8 p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Terminal size={14} />
                        <span>Cyber Kill Chain & Attack Lifecycle</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">
                        Click a stage to view telemetry & detection details
                      </span>
                    </div>

                    {/* Sequential Phase Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2">
                      {killChainPhases.map((phase, pIdx) => {
                        const isSelected = activePhase === pIdx;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setActivePhase(isSelected ? null : pIdx)}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-200 select-none ${
                              isSelected
                                ? "bg-primary/15 border-primary/60 text-primary shadow-[0_0_12px_rgba(255,107,53,0.15)]"
                                : "bg-foreground/[0.03] border-foreground/8 hover:border-primary/30 hover:bg-foreground/[0.05]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-foreground/10 text-muted-foreground"
                                }`}
                              >
                                {phase.step}
                              </span>
                              <ChevronDown
                                size={12}
                                className={`transition-transform duration-200 ${
                                  isSelected ? "rotate-180 text-primary" : "text-muted-foreground/60"
                                }`}
                              />
                            </div>
                            <p className="text-xs font-bold truncate leading-snug">{phase.name}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Expandable Phase Details */}
                    <AnimatePresence>
                      {activePhase !== null && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3.5 rounded-xl bg-background/80 border border-primary/25 space-y-2.5 text-xs mt-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-foreground/8">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-primary text-[11px] bg-primary/10 px-1.5 py-0.5 rounded">
                                  Phase {killChainPhases[activePhase].step}
                                </span>
                                <span className="font-semibold text-foreground text-xs sm:text-sm">
                                  {killChainPhases[activePhase].name}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-primary/80 bg-primary/8 px-2 py-0.5 rounded border border-primary/15 self-start sm:self-auto">
                                ATT&CK: {killChainPhases[activePhase].attack}
                              </span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                              {killChainPhases[activePhase].summary}
                            </p>

                            <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="font-semibold text-foreground/80">Observed Telemetry:</span>
                              <span className="font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                                {killChainPhases[activePhase].telemetry}
                              </span>
                            </div>

                            <div className="pt-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                  Splunk SPL Hunt Query
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyQuery(activePhase, killChainPhases[activePhase].splunkQuery)}
                                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-foreground/5"
                                >
                                  {copiedIdx === activePhase ? (
                                    <>
                                      <Check size={11} className="text-emerald-400" />
                                      <span className="text-emerald-400 font-medium">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={11} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <code className="block font-mono text-[11px] text-primary/90 bg-black/60 p-2 rounded-lg border border-foreground/10 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {killChainPhases[activePhase].splunkQuery}
                              </code>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-primary/80 bg-primary/8 px-3 py-1 rounded-full border border-primary/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                      <a
                        href={item.reportPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-primary/20"
                      >
                        <FileText size={14} />
                        <span>View Report (PDF)</span>
                        <ExternalLink size={12} />
                      </a>

                      <a
                        href={item.reportDocx}
                        download="Splunk-SOC-Investigation-(1)-Report.docx"
                        className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-3.5 py-1.5 rounded-full transition-all duration-200"
                        title="Download Original Investigation Report (.docx)"
                      >
                        <Download size={14} />
                        <span>Download (.docx)</span>
                      </a>

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-3.5 py-1.5 rounded-full transition-all duration-200"
                      >
                        <Github size={14} />
                        <span>GitHub Repo</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
