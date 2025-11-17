'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export default function Screenshots() {
  const t = useTranslations('screenshots');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-100/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-accent-100/20 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-5xl mx-auto">
          <div
            className={`flex-1 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-2xl">
                <Image
                  src="/screenshots/1.png"
                  alt={t('alt1')}
                  width={350}
                  height={700}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>

          <div
            className={`flex-1 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-primary-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-2xl">
                <Image
                  src="/screenshots/2.png"
                  alt={t('alt2')}
                  width={350}
                  height={700}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
