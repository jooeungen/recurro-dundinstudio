'use client';

import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';
type Platform = 'ios' | 'android';

const ERROR_MAP: Record<string, string> = {
  ALREADY_CLAIMED: 'errorAlreadyClaimed',
  NO_CODES_LEFT: 'errorNoCodesLeft',
  INVALID_EMAIL: 'errorInvalidEmail',
  INVALID_PLATFORM: 'errorInvalidPlatform',
  INVALID_COUPON: 'errorInvalidCoupon',
  COUPON_EXPIRED: 'errorCouponExpired',
};

export default function CodeForm() {
  const t = useTranslations('codeForm');
  const [coupon, setCoupon] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [state, setState] = useState<FormState>('idle');
  const [errorKey, setErrorKey] = useState('errorGeneral');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!platform) return;
    setState('loading');
    setErrorKey('errorGeneral');

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform, coupon }),
      });

      if (res.ok) {
        setState('success');
        return;
      }

      const data = await res.json();
      const key = ERROR_MAP[data.error] ?? 'errorGeneral';
      setErrorKey(key);
      setState('error');
    } catch {
      setErrorKey('errorGeneral');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {t('success')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
        {t('title')}
      </p>

      {/* Coupon code input */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block text-center">
          {t('couponLabel')}
        </label>
        <input
          type="text"
          required
          value={coupon}
          onChange={(e) => {
            setCoupon(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder={t('couponPlaceholder')}
          className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-center uppercase tracking-wider"
          disabled={state === 'loading'}
        />
      </div>

      {/* Platform selector */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          {t('platformLabel')}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => {
              setPlatform('ios');
              if (state === 'error') setState('idle');
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              platform === 'ios'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('ios')}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlatform('android');
              if (state === 'error') setState('idle');
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              platform === 'android'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('android')}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder={t('placeholder')}
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          disabled={state === 'loading'}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !platform}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap"
        >
          {state === 'loading' ? t('sending') : t('submit')}
        </button>
      </div>
      {state === 'error' && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2 text-center">
          {t(errorKey)}
        </p>
      )}
    </form>
  );
}
