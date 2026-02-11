import CodeForm from '@/components/CodeForm';
import { getTranslations } from 'next-intl/server';

export default async function CodePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'codeForm' });
  const p = await getTranslations({ locale, namespace: 'codePage' });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/30 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-gradient-to-br from-primary-200/30 to-accent-200/30 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-accent-200/20 to-primary-200/20 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-100/20 dark:border-primary-900/20"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-20 space-y-6">
        {/* App Info Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {p('appName')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {p('appDescription')}
          </p>

          {/* Download Links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://apps.apple.com/us/app/recurro/id6748042726"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
              {p('downloadIOS')}
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.dundinstudio.recurro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              {p('downloadAndroid')}
            </a>
          </div>
        </div>

        {/* Redeem Code Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-serif font-bold text-center mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {t('pageTitle')}
          </h2>
          <CodeForm />
        </div>

        {/* How to Redeem Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-5 text-center">
            {p('howToRedeem')}
          </h2>
          <div className="space-y-5">
            {/* iOS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {p('iosSteps.title')}
              </h3>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-decimal list-inside">
                <li>{p('iosSteps.step1')}</li>
                <li>{p('iosSteps.step2')}</li>
                <li>{p('iosSteps.step3')}</li>
                <li>{p('iosSteps.step4')}</li>
                <li>{p('iosSteps.step5')}</li>
                <li>{p('iosSteps.step6')}</li>
              </ol>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            {/* Android */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {p('androidSteps.title')}
              </h3>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-decimal list-inside">
                <li>{p('androidSteps.step1')}</li>
                <li>{p('androidSteps.step2')}</li>
                <li>{p('androidSteps.step3')}</li>
                <li>{p('androidSteps.step4')}</li>
                <li>{p('androidSteps.step5')}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
