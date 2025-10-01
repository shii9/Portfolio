import React, { useEffect, useRef } from 'react';
import { Calendar, Award, Trophy, Users, BookOpen } from 'lucide-react';

const Experience: React.FC = () => {
  const experienceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (experienceRef.current) {
      observer.observe(experienceRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      type: 'education',
      title: 'Bachelor of Computer Science and Engineering',
      organization: 'Daffodil International University',
      period: '2022 - Present',
      description: 'Focusing on cybersecurity, network security, and ethical hacking. Maintaining a strong GPA while actively participating in cybersecurity clubs and competitions.',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      type: 'contribution',
      title: 'University contribution',
      organization: 'Cybersecurity Club DIU',
      period: '2024 - Present',
      description: 'Organized workshops and training sessions on ethical hacking, penetration testing, and security best practices for club members and the university community.',
      icon: Award,
      color: 'from-purple-500 to-pink-600'
    },
    {
      type: 'project',
      title: 'Open Source Contributor',
      organization: 'Various Security Projects',
      period: '2024 - Present',
      description: 'Active contributor to open-source cybersecurity tools and frameworks, with focus on vulnerability scanners.',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      link: 'https://github.com/shii9/'
    }
  ];


  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={experienceRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Experience & Achievements
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Journey through education, achievements, and professional development in cybersecurity
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 rounded-full hidden lg:block"></div>

          <div className="space-y-12">
            {experiences.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className={`hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r ${item.color} rounded-full border-4 border-white dark:border-gray-900 z-10`}>
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`}></div>
                  </div>
                </div>

                {/* Content card */}
                <div className={`flex-1 max-w-lg ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Header */}
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse lg:justify-end' : ''}`}>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        {item.period}
                      </div>
                    </div>

                    {/* Title and organization */}
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-500 transition-all duration-300">
                      {item.title}
                    </h3>
                    
                    <div className={`text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                      {item.organization}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Achievement badge */}
                    <div className={`inline-flex items-center px-4 py-2 mt-6 rounded-full text-sm font-medium bg-gradient-to-r ${item.color} text-white`}>
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 max-w-lg hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills gained section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Skills & Technologies
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Penetration Testing', icon: '🔍' },
              { name: 'Network Security', icon: '🌐' },
              { name: 'Application Security', icon: '🔐' },
              { name: 'Malware Development', icon: '🐛🛠️' },
              { name: 'Incident Response', icon: '🚨' },
              { name: 'Risk Assessment', icon: '📊' },
              { name: 'Steganography', icon: '🖼️' },
              { name: 'Bug Hunting', icon: '🎯' }
              
            ].map((skill, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {skill.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 right-10 w-20 h-20 border border-green-500/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 left-10 w-16 h-16 border border-blue-500/20 rounded-full animate-pulse delay-1000"></div>
    </section>
  );
};

export default Experience;