import { motion } from "framer-motion";
import {
  SiLinux,
  SiPython,
  SiKalilinux,
  SiWireshark,
  SiGnubash,
  SiMetasploit,
  SiBurpsuite,
  SiOwasp,
  SiHackthebox,
  SiTryhackme,
  SiSplunk,
  SiOpenvpn,
  SiOpenssl,
  SiWireguard,
} from "react-icons/si";
import { Lock, Network, Search, Target, TerminalSquare, Bug, Wifi, Shield, Eye, Fingerprint, Code, Globe, Share2 } from "lucide-react";
import { fadeUpProps, staggerItemProps } from "@/lib/animations";
import { Section, GlowBlob, SectionHeading, SubHeading } from "@/components/layout/Section";

const marqueeTools = [
  { name: "Kali Linux", icon: SiKalilinux, color: "#557C94", proficiency: 90 },
  { name: "Metasploit", icon: SiMetasploit, color: "#3070B0", proficiency: 75 },
  { name: "Burp Suite", icon: SiBurpsuite, color: "#FF6633", proficiency: 80 },
  { name: "Wireshark", icon: SiWireshark, color: "#1679A7", proficiency: 85 },
  { name: "OWASP", icon: SiOwasp, color: "#ffffff", proficiency: 70 },
  { name: "Splunk", icon: SiSplunk, color: "#000000", proficiency: 60 },
  { name: "HackTheBox", icon: SiHackthebox, color: "#9FEF00", proficiency: 85 },
  { name: "TryHackMe", icon: SiTryhackme, color: "#C11111", proficiency: 80 },
  { name: "OpenVPN", icon: SiOpenvpn, color: "#EA7E20", proficiency: 70 },
  { name: "WireGuard", icon: SiWireguard, color: "#88171A", proficiency: 65 },
  { name: "OpenSSL", icon: SiOpenssl, color: "#721412", proficiency: 60 },
  { name: "SIEM", icon: Shield, color: "#00BCD4", proficiency: 70 },
  { name: "Python", icon: SiPython, color: "#3776AB", proficiency: 90 },
  { name: "Linux", icon: SiLinux, color: "#FCC624", proficiency: 95 },
  { name: "Bash", icon: SiGnubash, color: "#4EAA25", proficiency: 85 },
  { name: "Wazuh", icon: Eye, color: "#3AABE6", proficiency: 65 },
  { name: "Shodan", icon: Globe, color: "#D0021B", proficiency: 75 },
  { name: "Maltego", icon: Share2, color: "#2E8B57", proficiency: 60 },
  { name: "C++", icon: Code, color: "#00599C", proficiency: 70 },
  { name: "Crido", icon: Fingerprint, color: "#8B5CF6", proficiency: 55 },
];

const skillCategories = [
  {
    title: "Core Expertise",
    color: "from-orange-500/10 to-transparent",
    borderHover: "hover:border-primary/40",
    skills: [
      { name: "Network Security", icon: Network },
      { name: "Application Security", icon: Shield },
      { name: "Security Operations", icon: Eye },
      { name: "Threat Detection", icon: Search },
    ],
  },
  {
    title: "Offensive Security",
    color: "from-red-500/10 to-transparent",
    borderHover: "hover:border-red-400/40",
    skills: [
      { name: "Ethical Hacking", icon: Target },
      { name: "Penetration Testing", icon: Bug },
      { name: "Vulnerability Research", icon: Search },
      { name: "OSINT & Reconnaissance", icon: Globe },
    ],
  },
  {
    title: "Defensive Security",
    color: "from-cyan-500/10 to-transparent",
    borderHover: "hover:border-cyan-400/40",
    skills: [
      { name: "SOC Monitoring", icon: Eye },
      { name: "NIDS & Intrusion Detection", icon: Network },
      { name: "Incident Response", icon: Shield },
      { name: "SIEM & Log Analysis", icon: TerminalSquare },
    ],
  },
  {
    title: "Active Learning",
    color: "from-violet-500/10 to-transparent",
    borderHover: "hover:border-violet-400/40",
    skills: [
      { name: "Aspiring SOC L1", icon: TerminalSquare },
      { name: "Penetration Testing", icon: Target },
      { name: "Network Traffic Analysis", icon: Network },
      { name: "Security Research", icon: Code },
    ],
  },
];

function ToolCard({ tool }: { tool: (typeof marqueeTools)[number] }) {
  const Icon = tool.icon;
  return (
    <div className="relative flex items-center gap-4 bg-foreground/[0.03] border border-foreground/[0.06] hover:border-primary/30 px-7 py-5 rounded-2xl transition-[border-color,box-shadow] duration-300 group/tool hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] cursor-default flex-shrink-0 overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-full transition-opacity duration-500 ease-out opacity-60 md:opacity-0 md:group-hover/tool:opacity-100 rounded-2xl"
        style={{
          height: `${tool.proficiency}%`,
          background: `linear-gradient(to top, ${tool.color}30, ${tool.color}08)`,
        }}
      />
      <Icon size={28} style={{ color: tool.color }} className="relative z-10 transition-transform duration-300 md:group-hover/tool:scale-110" />
      <span className="relative z-10 text-foreground/80 md:text-foreground/50 md:group-hover/tool:text-foreground/90 transition-colors duration-200 text-base font-semibold whitespace-nowrap">
        {tool.name}
      </span>
    </div>
  );
}

export default function Skills() {
  return (
    <Section id="skills">
      <GlowBlob position="left" />

      <SectionHeading eyebrow="What I Know" title="My Skills & Arsenal" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={category.title}
            {...staggerItemProps(idx)}
            className={`relative bg-card/60 backdrop-blur-sm border border-foreground/8 rounded-2xl p-7 ${category.borderHover} transition-[color,border-color,box-shadow,opacity] duration-300 group overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
            <h3 className="relative text-lg font-semibold text-foreground mb-6 md:group-hover:text-primary transition-colors duration-200">
              {category.title}
            </h3>
            <div className="relative space-y-3">
              {category.skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/8 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-[color,border-color] duration-200 flex-shrink-0">
                    <skill.icon size={18} />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-200 font-medium text-sm">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUpProps(0.1)} className="mt-10">
        <SubHeading eyebrow="Technologies & Systems" title="My Security Toolkit" />

        <div className="relative w-full overflow-hidden select-none marquee-mask">
          <div className="marquee-row">
            <div className="marquee-track marquee-scroll-right">
              {[...marqueeTools, ...marqueeTools].map((tool, idx) => (
                <ToolCard key={`r1-${idx}`} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
