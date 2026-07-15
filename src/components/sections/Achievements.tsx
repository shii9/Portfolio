import { motion } from "framer-motion";
import { Trophy, Medal, ShieldCheck, Flag, Target, Network, ExternalLink } from "lucide-react";
import { fadeUpProps, fadeSubtleProps } from "@/lib/animations";

const achievementsData = [
  {
    title: "HackTheBox Pro",
    organization: "HackTheBox",
    date: "2026",
    icon: Flag,
    description:
      "Achieved Pro Hacker rank by compromising numerous active and retired machines in the HTB labs.",
  },
  {
    title: "Top 3 - TryHackMe",
    organization: "TryHackMe",
    date: "2025",
    icon: Target,
    description:
      "Ranked in the global Top 3 on TryHackMe, completing advanced offensive security paths and consistently topping the leaderboard.",
  },
];

const certificationsData = [
  {
    type: "Certification",
    role: "CompTIA Security+",
    company: "CompTIA",
    date: "Nov 2025",
    link: "https://www.credly.com/badges/comptia-security-plus",
    highlight: "Certified",
    icon: Medal,
    description:
      "Validates foundational, vendor-neutral IT security knowledge and skills — covering network security, risk management, cryptography, and operational security.",
    tags: ["Network Security", "Risk Management", "Cryptography"],
  },
  {
    type: "Certification",
    role: "Junior Cybersecurity Analyst",
    company: "Cisco",
    date: "Jul 2025",
    link: "https://www.linkedin.com/in/sourov-hossen-307655351/overlay/Certifications/605544045/treasury/?profileId=ACoAAFfW0HcBu8LfD9gTG5y-o53GuHCory4Fuig",
    highlight: "Certified",
    icon: ShieldCheck,
    description:
      "Completed Cisco's Junior Cybersecurity Analyst career path — covering security monitoring, network defense, threat analysis, and incident response fundamentals.",
    tags: ["Cybersecurity", "Network Defense", "Threat Analysis"],
  },
  {
    type: "Certification",
    role: "Network Cable",
    company: "LetsDefend",
    date: "Apr 2025",
    link: "https://app.letsdefend.io/my-rewards/detail/bb2bf958f7f04355a225108b4609b480",
    highlight: "Certified",
    icon: Network,
    description:
      "Hands-on defensive security training on LetsDefend — practicing SOC analysis, alert triage, and incident investigation in realistic blue-team scenarios.",
    tags: ["Blue Team", "SOC", "Incident Response"],
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="pt-[96px] pb-8 md:pb-10 relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Header */}
      <motion.div
        {...fadeUpProps()}
        className="mb-10"
      >
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Milestones</p>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Achievements &amp; Certifications</h2>
        <div className="h-1 w-20 bg-primary rounded-full mt-5" />
      </motion.div>

      {/* Grid Layout for Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-12">
        {achievementsData.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              {...fadeSubtleProps(idx * 0.06)}
              className="bg-card/50 border border-foreground/8 rounded-2xl p-5 md:p-6 hover:border-primary/25 transition-[border-color,box-shadow,opacity] duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />

              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 z-10 relative">
                  <Icon size={24} />
                </div>
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-primary/80 text-sm font-medium">{item.organization}</span>
                    <span className="text-muted-foreground text-xs bg-foreground/5 px-2 py-0.5 rounded border border-foreground/8">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm z-10 relative text-left sm:text-justify">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Sub Header for Certifications */}
      <motion.div
        {...fadeUpProps()}
        className="mb-12"
      >
        <p className="text-primary font-semibold text-xs tracking-widest uppercase mb-2">Credentials</p>
        <h3 className="text-2xl font-serif font-bold text-foreground">Certifications</h3>
        <div className="h-0.5 w-12 bg-primary/60 rounded-full mt-3" />
      </motion.div>

      {/* Timeline Layout for Certifications */}
      <div className="relative">
        <div className="space-y-6 sm:space-y-8">
          {certificationsData.map((item, idx) => {
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

                <div className="bg-card/50 border border-foreground/8 rounded-2xl p-5 md:p-6 hover:border-primary/25 transition-[border-color,box-shadow,opacity] duration-300 group">
                  {/* Category tag up top */}
                  <div className="mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/90 bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 inline-block">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-start justify-between mb-3 gap-2">
                    {/* Name + org on one line */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {item.role}
                      </h3>
                      <span className="text-muted-foreground/60">|</span>
                      <p className="text-primary/80 text-xl font-medium">{item.company}</p>
                    </div>
                    {/* Badge + completion date on the right */}
                    <div className="flex items-center gap-2 shrink-0">
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-4 py-1.5 rounded-full transition-[background-color,border-color,color] duration-200"
                    >
                      View Certificate
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* View All Certificates Button */}
      <motion.div
        {...fadeUpProps(0.3)}
        className="mt-10 flex justify-center"
      >
        <a
          href="https://www.linkedin.com/in/sourov-hossen-307655351/details/certifications/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary/90 hover:bg-primary border border-primary/40 px-6 py-2.5 rounded-full transition-[background-color,box-shadow] duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.35)]"
        >
          View All Certificates
          <ExternalLink size={14} />
        </a>
      </motion.div>
    </section>
  );
}
