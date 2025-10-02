import React, { useEffect, useRef } from 'react';
import { ExternalLink, Github, Shield, Brain, Globe, Lock } from 'lucide-react';

const Projects: React.FC = () => {
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: 'ReconNio tools for reconnaissance',
      description:
        'Complete reconnaissance and vulnerability assessment tool with finding all kind of information for recon.',
      icon: Shield,
      tech: ['Go'],
      color: 'from-green-500 to-emerald-600',
      features: [
        'DNS',
        'Port scanning',
        'Subdomain Enumeration',
        'Whois Lookup',
        'Js recon',
        'Directory Enumeration',
      ],
      codeLink: 'https://github.com/yourusername/reconnio',
    },
    {
      title: 'Steganography Tool',
      description:
        'A command-line and tkinter based tools for hiding and extracting data within image,text,video,audio using steganographic techniques.',
      icon: Globe,
      tech: ['Python', 'Tkinter'],
      color: 'from-purple-500 to-pink-600',
      features: [
        'Image Steganography',
        'Video Steganography',
        'Audio Steganography',
        'Text Steganography',
        'Audio Steganography',
      ],
      codeLink: 'https://github.com/shii9/Steganography',
    },
    {
      title: 'AI-Powered Threat Detection (Working)',
      description:
        'Machine learning system for real-time network anomaly detection and threat classification.',
      icon: Brain,
      tech: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas', 'GUI'],
      color: 'from-blue-500 to-cyan-600',
      features: ['Real-time Analysis', 'ML Classification', 'Alert System'],
      codeLink: 'https://github.com/yourusername/ai-threat-detection',
    },
    {
      title: 'Malware Development (Educational Purpose)',
      description:
        'Development of various types of malware for educational and research purposes.',
      icon: Lock,
      tech: ['Python'],
      color: 'from-orange-500 to-red-600',
      features: ['Multiple Algorithms', 'Key Management', 'Digital Signatures'],
      codeLink: 'https://github.com/shii9/Malware',
    },
    {
      title: 'Nio — AI Assistant',
      description:
        'Nio AI Assistant is a modular virtual assistant that supports voice and text, combining NLP, speech recognition, text-to-speech, image generation, automation, and real-time data access.',
      icon: Shield,
      tech: ['Python', 'Tkinter', 'AI'],
      color: 'from-indigo-500 to-violet-600',
      features: [
        'ChatBot',
        'Image Generation',
        'Automation',
        'Real-time Information retrieval',
        'Speech Recognition & Text-to-Speech',
      ],
      codeLink: 'https://github.com/shii9/Nio-AI-Assistant',
    },
    {
      title: 'Keylogger',
      description:
        'Keylogger is a lightweight, GUI-based input-capture research tool intended strictly for supervised lab use, authorized red-team engagements, and developer debugging. Emphasis on privacy, consent, and encrypted local storage.',
      icon: Globe,
      tech: ['Python', 'Tkinter'],
      color: 'from-yellow-400 to-orange-500',
      features: [
        'Controlled keystroke capture (sandboxed)',
        'GUI controls & audit trail',
        'Encrypted export / optional send-to-email',
        'Consent-first defaults',
      ],
      codeLink: 'https://github.com/shii9/Keylogger',
    },
  ];

  return (
    <section
      id="projects"
      className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={projectsRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Innovative cybersecurity solutions and tools developed with
            cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon as any;
            const hasCode = Boolean(project.codeLink && project.codeLink.trim());
            const hasDemo = Boolean(project.demoLink && project.demoLink.trim());

            const linkButtonBase =
              'flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300';

            const codeBtnClass = ` ${linkButtonBase} bg-gradient-to-r ${project.color} text-white hover:shadow-lg hover:scale-105`;
            const codeBtnDisabledClass = `${linkButtonBase} bg-gray-200 dark:bg-gray-800 text-gray-400 pointer-events-none opacity-60`;

            const demoBtnClass =
              'flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:border-green-500 hover:text-green-500 transition-all duration-300 hover:scale-105';

            return (
              <div
                key={index}
                className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                ></div>

                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${project.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-500 transition-all duration-300">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {project.features.map(
                        (feature: string, featureIndex: number) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2"
                          >
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.color}`}
                            ></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {feature}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-600 group-hover:border-green-500/30 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-4">
                    {hasCode ? (
                      <a
                        href={project.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={codeBtnClass}
                        aria-label={`${project.title} - View Code on GitHub`}
                      >
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                    ) : (
                      <div className={codeBtnDisabledClass} aria-hidden>
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </div>
                    )}

                    {/* Only show Demo if link exists */}
                    {hasDemo && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={demoBtnClass}
                        aria-label={`${project.title} - Live Demo`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Decorative elements */}
                <div
                  className={`absolute top-4 right-4 w-32 h-32 bg-gradient-to-br ${project.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* View all projects button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-green-500/25">
            <a href="https://github.com/shii9">View All Projects on GitHub</a>
          </button>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-1 h-20 bg-green-500 transform rotate-45"></div>
        <div className="absolute bottom-40 right-32 w-1 h-16 bg-blue-500 transform rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-12 bg-purple-500 transform -rotate-45"></div>
      </div>
    </section>
  );
};

export default Projects;
