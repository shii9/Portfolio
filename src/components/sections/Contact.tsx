import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Newspaper } from "lucide-react";
import { fadeUpProps } from "@/lib/animations";

const socials = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/shii9",
    label: "@shii9",
    bg: "hover:bg-foreground/10 hover:border-foreground/20",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/sourov-hossen-307655351/",
    label: "Sourov Hossen",
    bg: "hover:bg-[#0a66c2]/10 hover:border-[#0a66c2]/30",
  },
  {
    name: "Medium",
    icon: Newspaper,
    href: "https://shii9.medium.com/",
    label: "@shii9",
    bg: "hover:bg-black/10 hover:border-black/20",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:sourovlimon85@gmail.com",
    label: "sourovlimon85@gmail.com",
    bg: "hover:bg-primary/10 hover:border-primary/30",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="pt-[96px] pb-12 relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          {...fadeUpProps()}
        >
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Let's Connect
          </h2>
          <p className="text-muted-foreground text-lg mb-14 leading-relaxed max-w-xl mx-auto text-left sm:text-justify">
          Interested in cybersecurity, research, bug bounty or potential opportunities? Feel free to reach out. I'm always open to connecting with security researchers, professionals and learners.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 text-left">
            {socials.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                data-testid={`link-social-${social.name.toLowerCase()}`}
{...fadeUpProps(i * 0.06)}
className={`flex items-center gap-4 p-5 rounded-2xl border border-foreground/8 bg-card/50 text-muted-foreground transition-[background-color,border-color,box-shadow] duration-300 group ${social.bg}`}
              >
                <div className="w-11 h-11 rounded-xl bg-foreground/5 border border-foreground/8 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <social.icon size={20} />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{social.name}</p>
                  <p className="text-xs mt-0.5 truncate">{social.label}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <a
            href="mailto:sourovlimon85@gmail.com"
            data-testid="button-send-message"
            className="inline-flex items-center gap-3 bg-primary text-white font-bold px-10 py-4 rounded-full hover:bg-primary/90 transition-[background-color,box-shadow,transform] duration-200 hover:shadow-[0_0_32px_rgba(255,107,53,0.4)] text-base"
          >
            <Mail size={18} />
            Send a Message
          </a>
        </motion.div>
      </div>
    </section>
  );
}
