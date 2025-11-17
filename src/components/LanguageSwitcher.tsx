'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = params.locale as string;

  const locales = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' }
  ];

  const currentLocaleData = locales.find(l => l.code === currentLocale) || locales[0];

  const handleLocaleChange = (locale: 'en' | 'ko') => {
    startTransition(() => {
      router.replace(pathname, { locale });
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        disabled={isPending}
      >
        <span className="text-lg">{currentLocaleData.flag}</span>
        <span className="font-medium text-sm">{currentLocaleData.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentLocale === locale.code ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <span className="text-2xl">{locale.flag}</span>
                <span className="font-medium">{locale.label}</span>
                {currentLocale === locale.code && (
                  <svg className="w-5 h-5 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
