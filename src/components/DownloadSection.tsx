'use client';

import { useTranslations } from 'next-intl';
import Button from './Button';
import { useEffect, useState, useRef } from 'react';

export default function DownloadSection() {
  const t = useTranslations('download');
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

  return (
    <section
      id="download"
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 border-white/10"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`font-serif text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('title')}
          </h2>

          <p
            className={`text-xl text-white/90 mb-12 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('subtitle')}
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <a
              href="https://apps.apple.com/us/app/recurro/id6748042726"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 flex items-center gap-4 border border-white/20 hover:border-white/40 hover:scale-105">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                <div className="text-left">
                  <div className="text-white/80 text-sm">{t('availableOn')}</div>
                  <div className="text-white font-bold text-xl">App Store</div>
                </div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.dundinstudio.recurro"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 flex items-center gap-4 border border-white/20 hover:border-white/40 hover:scale-105">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-white/80 text-sm">{t('availableOn')}</div>
                  <div className="text-white font-bold text-xl">Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
