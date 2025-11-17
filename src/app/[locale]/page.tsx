import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Screenshots from '@/components/Screenshots';
import UseCases from '@/components/UseCases';
import Features from '@/components/Features';
import DownloadSection from '@/components/DownloadSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Screenshots />
      <UseCases />
      <Features />
      <DownloadSection />
      <Footer />
    </main>
  );
}
