import { motion } from "framer-motion";
import { BrainCircuit, Network, FileText, ExternalLink, Shield, ArrowRight } from "lucide-react";
import { fadeUpProps, fadeSoftProps, fadeSubtleProps } from "@/lib/animations";

const researchInterest = {
  type: "Research Interest",
  title: "Cybersecurity & Artificial Intelligence",
  date: "",
  category: "Interdisciplinary Research",
  readTime: "Focus Areas",
  icon: BrainCircuit,
  description:
    "My research interests lie at the intersection of cybersecurity and artificial intelligence, with a primary focus on leveraging AI-driven techniques to strengthen the security, resilience, and trustworthiness of modern digital systems. I am particularly interested in network security, application security, and the application of machine learning for proactive cyber threat detection and response.\n\nMy goal is to design intelligent, interpretable security solutions capable of detecting, analyzing, and mitigating evolving cyber threats in real time. Through interdisciplinary research, I aim to bridge the gap between AI and cybersecurity, contributing to the development of adaptive defense mechanisms that enhance the overall resilience of critical digital infrastructure.",
  tags: ["Network Security", "Application Security", "Threat Detection", "Interpretable AI"],
  link: "#",
};

const researchData = [
  {
    type: "Research Experience",
    title: "A Hybrid Network Intrusion Detection System with Explainable Artificial Intelligence",
    date: "In Progress",
    category: "Network Security",
    readTime: "Journal",
    icon: Network,
    description:
      "Architected a hybrid XAI-driven NIDS with three detection layers for transparent cyber threat detection. Achieved high detection accuracy using a super-hybrid model that combines SHAP, LIME, and rule-based explanations for transparent and interpretable intrusion detection.",
    tags: ["NIDS", "XAI", "SHAP", "LIME"],
    link: "#",
  },
  {
    type: "Research Experience",
    title: "Identity Theft and User Cybersecurity Behaviors: Predicting User Cyber Risk",
    date: "Submitted on Elsevier | May 2026",
    category: "Application Security",
    readTime: "Journal",
    icon: Shield,
    description:
      "Designed a SHAP-based cyber risk score framework using interpretable machine learning to predict identity theft vulnerability across users. Achieved high classification accuracy, finding users at risk or not with a hybrid ensemble model and identified the key factors influencing user risk profiles using SHAP-driven analysis.",
    tags: ["Identity Theft", "User Risk", "SHAP", "Ensemble Learning"],
    link: "#",
  },
];

const writeupsData = [
  {
    type: "Write-up",
    role: "Mastering FFUF: The Complete Guide to Fast Web Fuzzing with FFUF (Fuzz Faster U Fool)",
    company: "Medium",
    date: "July 2026",
    link: "https://medium.com/@shii9/mastering-ffuf-the-complete-guide-to-fast-web-fuzzing-with-ffuf-fuzz-faster-u-fool-be6ea36ab38b",
    highlight: "Published",
    icon: FileText,
    description:
      "A comprehensive deep-dive into FFUF (Fuzz Faster U Fool), covering installation, basic usage, advanced techniques, recursion, filtering, matching, and real-world scenarios for efficient web application fuzzing and content discovery.",
    tags: ["FFUF", "Fuzzing", "Web Security", "Bug Bounty", "Reconnaissance"],
  },
];

function ResearchCard({
  item,
  showReadMore = true,
}: {
  item: (typeof researchData)[number] | typeof researchInterest;
  showReadMore?: boolean;
}) {
  return (
    <div className="bg-card/50 border border-foreground/8 rounded-2xl p-5 md:p-6 hover:border-primary/25 transition-[border-color,box-shadow,opacity] duration-300 group flex flex-col h-full relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0 pointer-events-none" />

      <div className="mb-2 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary/90 bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 inline-block">
          {item.type}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2 relative z-10">
        <div className="max-w-4xl">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
            {item.title}
          </h3>
          {"date" in item && item.date && (
            <p className="text-primary/80 text-sm mt-1 font-medium">{item.date}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {item.category}
          </span>
          <span className="text-muted-foreground text-sm bg-foreground/5 px-3 py-1 rounded-full border border-foreground/8 whitespace-nowrap">
            {item.readTime}
          </span>
        </div>
      </div>

      <div className="text-muted-foreground leading-relaxed mb-4 text-sm relative z-10 flex-1 text-left sm:text-justify space-y-2">
        {item.description.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto relative z-10">
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

        {showReadMore && (
          <a
            href={item.link}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-4 py-1.5 rounded-full transition-[background-color,border-color,color] duration-200"
          >
            Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Research() {
  return (
    <section id="research" className="pt-[96px] pb-8 md:pb-10 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        {...fadeUpProps()}
        className="mb-10"
      >
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Publications</p>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Research & Write-ups</h2>
        <div className="h-1 w-20 bg-primary rounded-full mt-5" />
      </motion.div>

      <motion.div
        {...fadeUpProps(0.1)}
        className="mb-8 sm:mb-10 w-full"
      >
        <ResearchCard item={researchInterest} showReadMore={false} />
      </motion.div>

      {/* Research Experience Section */}
      <motion.div {...fadeUpProps()} className="mb-12">
        <p className="text-primary font-semibold text-xs tracking-widest uppercase mb-2">Papers</p>
        <h3 className="text-2xl font-serif font-bold text-foreground">Research Experience</h3>
        <div className="h-0.5 w-12 bg-primary/60 rounded-full mt-3" />
      </motion.div>

      <div className="space-y-6 sm:space-y-8 mb-12">
        {researchData.map((item, idx) => {
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
                {/* Category tag up top */}
                <div className="mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary/90 bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 inline-block">
                    {item.type}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-primary/80 text-sm mt-1 font-medium">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {item.date && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap">
                        {item.date}
                      </span>
                    )}
                    <span className="text-muted-foreground text-sm bg-foreground/5 px-3 py-1 rounded-full border border-foreground/8 whitespace-nowrap">
                      {item.readTime}
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

                  {item.link && item.link !== "#" ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-4 py-1.5 rounded-full transition-[background-color,border-color,color] duration-200"
                    >
                      Read More <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Not yet published"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground/50 bg-foreground/5 border border-foreground/10 px-4 py-1.5 rounded-full opacity-50 cursor-not-allowed pointer-events-none select-none"
                    >
                      Read More <ExternalLink size={14} />
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Sub Header for Write-ups */}
      <motion.div
        {...fadeUpProps()}
        className="mb-12"
      >
        <p className="text-primary font-semibold text-xs tracking-widest uppercase mb-2">Articles</p>
        <h3 className="text-2xl font-serif font-bold text-foreground">Write-ups</h3>
        <div className="h-0.5 w-12 bg-primary/60 rounded-full mt-3" />
      </motion.div>

      {/* Timeline Layout for Write-ups */}
      <div className="relative">
        <div className="space-y-6 sm:space-y-8">
          {writeupsData.map((item, idx) => {
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
                      Read Article <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
