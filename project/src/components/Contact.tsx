import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const contactRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Offline queue + background sync
  useEffect(() => {
    const key = 'contact_messages';

    const flushQueue = async () => {
      try {
        const existingRaw = localStorage.getItem(key);
        const queue: any[] = existingRaw ? JSON.parse(existingRaw) : [];
        if (!Array.isArray(queue) || queue.length === 0) return;

        const remaining: any[] = [];
        for (const item of queue) {
          try {
            const res = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: item.name,
                email: item.email,
                subject: item.subject,
                message: item.message,
              }),
            });
            if (!res.ok) throw new Error('Failed');
          } catch (_) {
            remaining.push(item);
          }
        }
        if (remaining.length > 0) {
          localStorage.setItem(key, JSON.stringify(remaining));
        } else {
          localStorage.removeItem(key);
        }
      } catch (_) {
        // ignore
      }
    };

    // Try on mount
    flushQueue();
    // Retry on focus/visibilitychange
    const onFocus = () => flushQueue();
    const onVisible = () => {
      if (document.visibilityState === 'visible') flushQueue();
    };
    const onOnline = () => flushQueue();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    // Retry periodically during dev browsing
    const interval = window.setInterval(flushQueue, 10000);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
      window.clearInterval(interval);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      // Prepare the entry once so we can fall back to local storage if needed
      const entry = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('Message sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // Fallback: store locally if backend is not running
      try {
        const key = 'contact_messages';
        const existingRaw = localStorage.getItem(key);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const queued = Array.isArray(existing) ? existing : [];
        const queuedEntry = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          createdAt: new Date().toISOString(),
        };
        queued.push(queuedEntry);
        localStorage.setItem(key, JSON.stringify(queued));
        // Attempt background sync of the just-queued entry immediately
        (async () => {
          try {
            const res = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: queuedEntry.name,
                email: queuedEntry.email,
                subject: queuedEntry.subject,
                message: queuedEntry.message,
              }),
            });
            if (res.ok) {
              const updatedRaw = localStorage.getItem(key);
              const updated: any[] = updatedRaw ? JSON.parse(updatedRaw) : [];
              const filtered = Array.isArray(updated)
                ? updated.filter((m: any) => m.id !== queuedEntry.id)
                : [];
              if (filtered.length > 0) localStorage.setItem(key, JSON.stringify(filtered));
              else localStorage.removeItem(key);
              setStatus('Message sent successfully.');
              setFormData({ name: '', email: '', subject: '', message: '' });
              return;
            }
          } catch (_) {
            // ignore, will retry later
          }
        })();
        // Do NOT show success now; queued for later sync
        setStatus('Message is not sent.');
      } catch (_) {
        setStatus('Failed to send or save message. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'sourov.hossen@email.com',
      href: 'mailto:sourov.hossen@email.com',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+8801318096328',
      href: 'tel:+8801318096328',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Dhaka, Bangladesh',
      href: '#',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/shii9',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sourov-hossen-307655351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://x.com/SHI91537122?t=5vEffPDcAI9rExKq2-eYGQ&s=09',
      color: 'hover:text-blue-400'
    },
    {
      icon: MessageCircle,
      label: 'Discord',
      href: '',
      color: 'hover:text-purple-600'
    }
  ];

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center py-20 bg-white dark:bg-gray-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div ref={contactRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to discuss cybersecurity projects, collaboration opportunities, or just want to connect?
            I'd love to hear from you!
          </p>
        </div>

        <div className="grid gap-12 place-items-center justify-items-center">
          {/* Contact Information */}
          <div className="space-y-8 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Let's Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                I'm always interested in discussing new projects, creative ideas, or opportunities
                to be part of your vision. Whether you're looking for cybersecurity consulting,
                collaboration on security research, or just want to chat about the latest in
                ethical hacking, feel free to reach out.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="group flex items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full max-w-md mx-auto min-h-[112px]"
                >
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${info.color} mr-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {info.label}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-300">
                      {info.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Follow Me
              </h4>
              <div className="flex space-x-4 justify-center">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-40 left-20 w-1 h-1 bg-blue-500 rounded-full animate-ping delay-1000"></div>
    </section>
  );
};

export default Contact;
