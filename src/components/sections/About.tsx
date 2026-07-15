import { motion } from "framer-motion";
import { fadeUpProps, hoverLift } from "@/lib/animations";

const aboutData = {
  name: "Sourov Hossen",
  title: "Cybersecurity Learner · CSE Student · Security Researcher",
  bio: "I'm a cybersecurity enthusiast pursuing my BSc in Computer Science & Engineering at Daffodil International University. My journey blends academic rigor with hands-on offensive security practice — from CTF challenges and bug bounty hunting to building homelab infrastructure for network security research.",
  interests: [
    "Network Security & Intrusion Detection",
    "Explainable AI for Cybersecurity",
    "Web Application Penetration Testing",
    "CTF & Competitive Hacking",
    "Open-Source Intelligence (OSINT)",
  ],
};

export default function About() {
  return (
    <section id="about" className="pt-[96px] pb-8 md:pb-10 relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div {...fadeUpProps()} className="mb-10">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Introduction</p>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">About Me</h2>
        <div className="h-1 w-20 bg-primary rounded-full mt-5" />
      </motion.div>

      <motion.div
        {...fadeUpProps(0.1)}
        className="max-w-3xl"
      >
        <motion.div {...hoverLift} className="bg-card/50 border border-foreground/8 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-[border-color,box-shadow] duration-300">
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>{aboutData.bio}</p>
            <p>
              My research focuses on the intersection of cybersecurity and artificial intelligence — specifically
              designing interpretable, AI-driven intrusion detection systems that can explain their decisions.
              I'm currently working on a hybrid XAI-driven NIDS and a SHAP-based cyber risk scoring framework.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}