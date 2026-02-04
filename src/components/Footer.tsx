'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <span className="font-serif text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Recurro
            </span>
          </div>

          {/* Tagline */}
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl">
            {t('tagline')}
          </p>

          {/* Circular decoration */}
          <div className="flex gap-3 my-4">
            <div className="w-3 h-3 rounded-full bg-primary-400 opacity-60 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-accent-400 opacity-60 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary-300 opacity-60 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>

          {/* Contact Email */}
          <a
            href="mailto:admin@dundinstudio.com"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            admin@dundinstudio.com
          </a>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
