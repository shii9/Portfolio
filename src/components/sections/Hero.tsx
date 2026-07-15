import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-custom.png";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Github, Linkedin, Twitter, ArrowRight, FolderGit2, MapPin, GraduationCap, Sparkles } from "lucide-react";
import CyberShield3D from "@/components/ui/CyberShield3D";
import CyberHexGrid from "@/components/ui/CyberHexGrid";
import CountUp from "@/components/ui/CountUp";
import { fadeUpProps, scaleInProps, smoothTransition, BLUR, EASE_OUT } from "@/lib/animations";

// ─── Hero headline reveal ───────────────────────────────────────────
// The H1 reveals one word at a time on load. Container staggers its
// children; each word rises a fraction of a line and fades in on the
// shared expo curve — a refined first impression without a big sweep.
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const headlineWord: Variants = {
  hidden: { opacity: 0, y: "0.45em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

const ROLES = [
  "Security Researcher",
  "Bug Hunter",
  "Penetration Tester",
  "Cybersecurity Learner",
] as const;

function RoleBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold text-foreground bg-card/90 backdrop-blur-md border border-primary/25 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg min-w-[9rem] sm:min-w-[11rem] justify-center">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="whitespace-nowrap"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const socials = [
  { name: "GitHub", icon: Github, href: "https://github.com/shii9" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/sourov-hossen-307655351/" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/Shiii999999" },
];

const aboutData = {
  name: "Sourov Hossen",
  title: "Cybersecurity Learner · CSE Student · Security Researcher",
  bio: "I am a cybersecurity enthusiast pursuing a BSc in Computer Science and Engineering at Daffodil International University. I have maintained a strong academic record while continuously expanding my practical skills through hands-on learning, security research and real-world project experience. My interest in cybersecurity began when I realized the vulnerability of digital systems. Since then, I have been dedicated to understanding how attackers think, how systems fail and how organizations can defend against modern cyber threats. I am actively building expertise in ethical hacking, web application security, network security, penetration testing and security operations. Alongside my academic studies, I continuously strengthen my skills through practical labs, vulnerability research and developing security-focused projects.",
  interests: [
    "Network Security & Intrusion Detection",
    "Explainable AI for Cybersecurity",
    "Web Application Penetration Testing",
    "CTF & Competitive Hacking",
    "Open-Source Intelligence (OSINT)",
  ],
};

const infoCards = [
  {
    icon: Sparkles,
    title: "Passion",
    justify: true,
    lines: [
      "Passionate cybersecurity researcher with experience developing security projects and conducting AI-integrated security research.",
    ],
  },
  {
    icon: GraduationCap,
    title: "Education",
    lines: [
      "B.Sc. CSE in Daffodil International University (CGPA 3.52)",
      "HSC From Gazipur Ideal College (GPA 4.50)",
    ],
  },
  {
    icon: MapPin,
    title: "Based In",
    lines: [
      "Currently on Daffodil Smart City, Dhaka.",
      "Originally From Tangail, Bangladesh.",
    ],
  },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative min-h-[100dvh] flex flex-col justify-center pt-28 pb-12 md:pt-32 md:pb-16">
      {/* Background hex grid decoration */}
      <CyberHexGrid className="absolute top-20 right-0 w-64 h-56 opacity-20 pointer-events-none hidden md:block" />

      {/* Decorative 3D cyber shield accent — top-right, below the header */}
      <div className="absolute top-24 md:top-28 lg:top-32 right-0 lg:-right-4 w-24 sm:w-28 lg:w-36 opacity-70 animate-hero-float pointer-events-none hidden md:block z-0">
        <CyberShield3D />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center lg:items-end">
        {/* Left — Text Content */}
        <div className="order-1 flex flex-col min-w-0">
          <motion.div {...fadeUpProps()}>
            <span className="inline-flex items-center gap-1.5 sm:gap-2 self-start text-[10px] sm:text-xs md:text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6 whitespace-nowrap leading-none">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse shrink-0" />
              Open to Opportunities
            </span>
          </motion.div>

          <motion.h1
            variants={headlineContainer}
            initial={reduceMotion ? "show" : "hidden"}
            animate="show"
            className="text-2xl sm:text-4xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-serif font-bold text-foreground leading-[1.1] mb-5"
          >
            <motion.span variants={headlineWord} className="inline-block">
              Hi,
            </motion.span>
            <br />
            <motion.span variants={headlineWord} className="inline-block">
              I'm&nbsp;
            </motion.span>
            <motion.span variants={headlineWord} className="inline-block text-primary relative">
              Sourov
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/40 rounded-full" />
            </motion.span>
            <br />
            <motion.span variants={headlineWord} className="inline-block text-foreground/90">
              Security&nbsp;
            </motion.span>
            <motion.span variants={headlineWord} className="inline-block text-foreground/90">
              Researcher
            </motion.span>
          </motion.h1>

          <motion.p
            {...fadeUpProps(0.1)}
            className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-md mb-8"
          >
            Cybersecurity enthusiast turning curiosity into competence through
            continuous learning in offensive security, penetration testing,
            security research and building secure systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div {...fadeUpProps(0.15)} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-fit">
            <a
              href="#contact"
              className="group flex items-center justify-center gap-2 w-[10.25rem] text-sm font-semibold text-white bg-primary hover:bg-primary/85 px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-[0_0_22px_rgba(255,107,53,0.45)]"
            >
              Let's Connect
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#projects"
              className="flex items-center justify-center gap-2 w-[10.25rem] text-sm font-semibold text-foreground bg-foreground/5 border border-foreground/15 hover:border-primary/40 hover:text-primary px-5 py-2.5 rounded-full transition-all duration-200"
            >
              <FolderGit2 size={16} />
              View Work
            </a>
          </motion.div>
        </div>

        {/* Right — Profile Portrait */}
        <motion.div
          {...scaleInProps(0.1)}
          className="order-2 flex items-center justify-center relative"
        >
          {/* Ambient glow behind portrait */}
          <div className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/15 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative animate-hero-float">
            {/* Rotating accent ring */}
            <div className="absolute -inset-3 rounded-[2.25rem] border border-primary/20 [mask-image:linear-gradient(135deg,black,transparent_65%)] pointer-events-none" />

            {/* Framed portrait card */}
            <div className="relative w-40 sm:w-72 md:w-80 lg:w-[21rem] aspect-[3/4] rounded-[2rem] overflow-hidden border border-primary/25 bg-gradient-to-b from-primary/12 via-card/40 to-background shadow-[0_20px_60px_-15px_rgba(255,107,53,0.35)]">
              {/* Inner gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src={heroImage}
                alt="Sourov Hossen — Security Researcher"
                className="relative z-0 w-full h-full object-cover object-top select-none"
                loading="eager"
                draggable={false}
              />

              <RoleBadge />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Row — full width, positioned above the About Me section */}
      {/* Animates on page load (not scroll) so it appears with the rest of
          the hero — it sits right at the first screen's fold, where a
          whileInView trigger wouldn't fire until the user scrolls. */}
      <motion.div
        initial={{ opacity: 0, y: 44, filter: BLUR.soft }}
        animate={{ opacity: 1, y: 0, filter: BLUR.none }}
        transition={smoothTransition(0.2)}
        className="mt-4 md:mt-5 mb-10 w-full sm:max-w-2xl grid grid-cols-2 gap-x-5 gap-y-6 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-5 py-6 border-y border-foreground/10"
      >
        {[
          { value: "2+", label: "Yrs Experience" },
          { value: "10+", label: "Projects" },
          { value: "5+", label: "Vulnerability Disclosed" },
          { value: "2+", label: "Research Papers" },
        ].map((stat, idx) => {
          // Mobile: 2×2 grid, so only the 2nd/4th cells (right column) get a
          // divider. Desktop: content-width flex row, so the 3rd cell also
          // picks up its divider at the `sm` breakpoint.
          const divider = [
            "",
            "border-l border-foreground/12 pl-4 sm:pl-8",
            "sm:border-l sm:border-foreground/12 sm:pl-8",
            "border-l border-foreground/12 pl-4 sm:pl-8",
          ][idx];
          return (
            <div key={idx} className={`flex flex-col ${divider}`}>
              <CountUp
                value={stat.value}
                className="text-2xl md:text-3xl font-serif font-bold text-primary leading-none mb-1.5"
              />
              <span className="text-[11px] md:text-xs font-medium uppercase tracking-wide text-muted-foreground leading-snug whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* About Me Section — full page width */}
      <motion.div {...fadeUpProps(0.25)} className="mb-8 w-full">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Introduction</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">About Me</h2>
        <div className="h-1 w-16 bg-primary rounded-full mt-3 mb-6" />

        <div className="bg-card/50 border border-foreground/8 rounded-2xl p-6 md:p-8 w-full">
          <div className="max-w-none text-muted-foreground text-sm leading-relaxed space-y-4 text-left sm:text-justify">
            <p>{aboutData.bio}</p>
            <p>
              I have designed and developed projects including a Network Intrusion Detection System (NIDS),
              a Phishing Analyzer, DorkNio and several other cybersecurity tools. These projects provided me
              with practical experience using both red and blue team methodologies, improving my understanding
              of secure system design.
            </p>
            <p>
              Beyond technical implementation, I am deeply interested in cybersecurity research that focuses on
              identifying emerging security challenges and exploring practical solutions to strengthen the
              security of modern systems. I am particularly interested in the intersection of cybersecurity and
              artificial intelligence, where research is advancing by integrating AI with cybersecurity to
              enhance the overall resilience of modern digital systems. For me, cybersecurity is more than just
              a collection of tools or techniques. It is a mindset of continuous learning, critical thinking
              and proactive defence.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Three Info Cards — Passion, Education, Based In */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              {...fadeUpProps(0.25 + idx * 0.07)}
              className="bg-card/50 backdrop-blur-md border border-foreground/8 hover:border-primary/30 rounded-3xl p-5 md:p-6 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_25px_rgba(255,107,53,0.12)] group flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                {card.title}
              </h3>
              {card.lines.length === 1 ? (
                <p
                  className={`text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/40 pl-4${
                    card.justify ? " text-left sm:text-justify" : ""
                  }`}
                >
                  {card.lines[0]}
                </p>
              ) : (
                <div className="text-muted-foreground text-sm leading-relaxed flex flex-col gap-2 border-l-2 border-primary/40 pl-4">
                  {card.lines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}