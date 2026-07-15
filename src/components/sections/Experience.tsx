import { motion } from "framer-motion";
import { GraduationCap, Award, Terminal, Code, BookOpen } from "lucide-react";
import { fadeUpProps } from "@/lib/animations";
import { Section, GlowBlob, SectionHeading } from "@/components/layout/Section";

const timelineData = [
  {
    type: "Experience & Training",
    role: "Bug Hunting & Penetration Testing",
    company: "TryHackMe / HackTheBox",
    date: "2025 — Present",
    highlight: null,
    icon: Terminal,
    description:
      "Actively engaging in Capture The Flag (CTF) challenges to sharpen offensive and defensive security skills. Continuously exploring vulnerabilities in sandboxed environments to understand real-world attack vectors.",
    tags: ["CTF", "Ethical Hacking", "Linux", "Kali Linux"],
  },
  {
    type: "Experience & Training",
    role: "OSINT & Vulnerability Learner",
    company: "Self-Study / Online Courses",
    date: "2025 — Present",
    highlight: null,
    icon: BookOpen,
    description:
      "Learning open-source intelligence gathering techniques, digital footprinting, and reconnaissance methodologies used by penetration testers and red teams worldwide.",
    tags: ["OSINT", "Reconnaissance", "Shodan", "Google Dorks"],
  },
  {
    type: "Experience & Training",
    role: "Network Security Enthusiast",
    company: "Independent Homelab Projects",
    date: "2024 — Present",
    highlight: null,
    icon: Code,
    description:
      "Configuring firewalls, analyzing network packets, and implementing IDS/IPS rules in personal homelab setups. Writing Python scripts for automated scanning and log analysis.",
    tags: ["Python", "Wireshark", "IDS/IPS", "Firewall"],
  },
  {
    type: "Learning",
    role: "Bachelor of Science in Computer Science and Engineering (BSc in CSE)",
    company: "Daffodil International University",
    date: "2022 – 2026",
    highlight: "GPA 3.52",
    icon: GraduationCap,
    description:
      "Active in research, learning and security projects. Focusing on software engineering principles, computer networks, and cybersecurity fundamentals.",
    tags: ["Research", "Cybersecurity Projects", "Software Engineering", "Computer Networks"],
  },
  {
    type: "Learning",
    role: "Higher Secondary Certificate (HSC) in Science",
    company: "Gazipur Ideal College",
    date: "2019 – 2022",
    highlight: "GPA 4.50",
    icon: Award,
    description:
      "Completed Higher Secondary Certificate with a strong background in Science, Mathematics, and Physics.",
    tags: ["Science", "Physics", "Mathematics", "Information & Communication Technology"],
  },
];

export default function Experience() {
  return (
    <Section id="experience">
      <GlowBlob position="right" />

      <SectionHeading eyebrow="The journey so far." title="Experience & Education" />

      <div className="relative">
        <div className="space-y-6 sm:space-y-8">
          {timelineData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                {...fadeUpProps()}
                className="relative pl-16 sm:pl-20 md:pl-20"
              >
                {/* Timeline Line connecting to the next item */}
                {idx !== timelineData.length - 1 && (
                  <div className="absolute left-5 sm:left-6 top-5 sm:top-6 w-px h-[calc(100%+1.5rem)] sm:h-[calc(100%+2rem)] bg-primary/40 z-0" />
                )}

                <div className="absolute left-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-background border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,107,53,0.15)] z-10 mt-1">
                  <div className="absolute inset-0 rounded-2xl bg-primary/15" />
                  <Icon size={20} className="relative z-10" />
                </div>

                <div className="bg-card/50 border border-foreground/8 rounded-2xl p-5 md:p-6 hover:border-primary/25 transition-[border-color,box-shadow,opacity] duration-300 group">
                  {/* Category tag up top */}
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

                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm text-left sm:text-justify">{item.description}</p>

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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}