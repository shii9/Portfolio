import React, { useEffect, useRef, useState } from 'react';

const Skills: React.FC = () => {
  const skillsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Python', level: 90, color: 'from-green-500 to-green-600' },
        { name: 'Go', level: 85, color: 'from-blue-500 to-blue-600' },
        { name: 'JavaScript', level: 80, color: 'from-yellow-500 to-yellow-600' },
        { name: 'C/C++', level: 75, color: 'from-purple-500 to-purple-600' },
      ]
    },
    {
      title: 'Cybersecurity Tools',
      skills: [
        { name: 'Nmap', level: 95, color: 'from-red-500 to-red-600' },
        { name: 'Burp Suite', level: 88, color: 'from-orange-500 to-orange-600' },
        { name: 'Metasploit', level: 82, color: 'from-pink-500 to-pink-600' },
        { name: 'Wireshark', level: 87, color: 'from-indigo-500 to-indigo-600' },
      ]
    },
    {
      title: 'Others',
      skills: [
        { name: 'Linux', level: 80, color: 'from-blue-500 to-blue-600' },
        { name: 'GitHub', level: 70, color: 'from-purple-500 to-purple-600' },
        { name: 'Data Base', level: 70, color: 'from-green-500 to-green-600' },
        { name: 'Algorithm', level: 75, color: 'from-yellow-500 to-yellow-600' },
      ]
    },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={skillsRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive toolkit for cybersecurity, development, and digital forensics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                {category.title}
              </h3>
              
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out transform origin-left ${
                          isVisible ? 'scale-x-100' : 'scale-x-0'
                        }`}
                        style={{ 
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${categoryIndex * 200 + skillIndex * 100}ms`
                        }}
                      >
                        <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Glow effect on hover */}
                    <div className={`w-full h-3 bg-gradient-to-r ${skill.color} rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 -mt-3 blur-sm`}></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating skill badges */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
            Additional Skills
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['Ethical Hacking', 'Penetration Testing', 'OSINT', 'Linux','Malware', 'Risk Assessment', 'Incident Response', 'Vulnerability Assessment', 'Network Security'].map((skill, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:from-green-500/20 hover:to-blue-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105 cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-2000"></div>
      </div>
    </section>
  );
};

export default Skills;