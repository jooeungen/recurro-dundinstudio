'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';

export default function UseCases() {
  const t = useTranslations('useCases');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const useCases = [
    { key: 'home', color: 'from-blue-400 to-blue-600', days: 60 },
    { key: 'pets', color: 'from-pink-400 to-pink-600', days: 30 },
    { key: 'vehicle', color: 'from-orange-400 to-orange-600', days: 90 },
    { key: 'plants', color: 'from-green-400 to-green-600', days: 7 },
    { key: 'health', color: 'from-purple-400 to-purple-600', days: 180 },
    { key: 'cleaning', color: 'from-teal-400 to-teal-600', days: 30 },
  ];

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white via-primary-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-6">
        <h2
          className={`font-serif text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.key}
              className={`group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Date badge circle */}
              <div className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-sm">D+{useCase.days}</span>
              </div>

              {/* Emoji */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                {t(`${useCase.key}.emoji`)}
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {t(`${useCase.key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(`${useCase.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
