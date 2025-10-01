import React, { useEffect, useRef } from 'react';
import { Code, Shield, Brain, Target } from 'lucide-react';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Ethical hacking, penetration testing, and security analysis'
    },
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Leveraging AI for enhanced security solutions'
    },
    {
      icon: Target,
      title: 'Cyber security Researcher',
      description: 'Focused on research in cybersecurity and threat intelligence'
    },
    {
      icon: Code,
      title: 'Cyber security Tools',
      description: 'Developing practical security tools and scripts'
    },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={aboutRef} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                  About Me
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"></div>
            </div>

            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                I’m a passionate Computer Science student with a deep focus on cybersecurity and ethical hacking. What started as curiosity about how systems work has grown into a mission to design and protect secure digital infrastructures.
              </p>
              <p>
                I actively participate in cybersecurity research, CTF competitions, and hands-on projects where I build practical security tools. My approach blends zero-trust principles, AI-driven threat intelligence, automated incident response, and continuous monitoring to create resilient security systems that don’t just look good on paper — they work in the real world.
              </p>
              <p>
                My goal is to become an Application Security professional, building secure frameworks that protect software in critical industries. I focus on secure development, threat modeling, and continuous testing, while exploring AI and machine learning to strengthen modern app security.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">10+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">1.5+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Years Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">5+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">vulnerability Found</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">100%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Dedication</div>
              </div>
            </div>
          </div>

          {/* Right side - Highlights grid */}
          <div className="grid gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default About;