import React, { useEffect, useRef } from 'react';
import { ChevronDown, Download, Mail, Github, Linkedin, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Matrix-style background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-bg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="space-y-8 animate-fade-in-up">
          {/* Profile image placeholder with glow effect */}
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Shield className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-green-400/20 to-blue-500/20 blur-xl animate-pulse"></div>
          </div>

          {/* Name and title */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Sourov Hossen
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
              Aspiring Cybersecurity & Researcher | Passionate in Application Security
            </p>
          </div>

          {/* Tagline */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
              Computer Science student passionate about ethical hacking, penetration testing, 
              and securing digital infrastructures. Eager to contribute to the cybersecurity community through hands-on projects and continuous learning.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/25">
              <span className="relative z-10 flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button 
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-green-500 text-green-500 dark:text-green-400 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Get In Touch</span>
              </span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 pt-8">
            <a href="https://github.com/shii9" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-110 group">
              <Github className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-green-500" />
            </a>
            <a href="https://www.linkedin.com/in/sourov-hossen-307655351/" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110 group">
              <Linkedin className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .matrix-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(90deg, transparent 98%, #00ff41 100%),
            linear-gradient(180deg, transparent 98%, #00ff41 100%);
          background-size: 20px 20px;
          animation: matrix 20s linear infinite;
        }
        
        @keyframes matrix {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-20px, -20px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;