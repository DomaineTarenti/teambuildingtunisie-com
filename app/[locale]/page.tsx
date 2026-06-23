import Hero from '@/components/Hero';
import WhyTeamBuilding from '@/components/WhyTeamBuilding';
import Activities from '@/components/Activities';
import ClientLogos from '@/components/ClientLogos';
import BlogPreview from '@/components/BlogPreview';
import ContactForm from '@/components/ContactForm';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main>
      <Hero />
      <WhyTeamBuilding />
      <Activities />
      <ClientLogos />
      <BlogPreview locale={locale} />
      <ContactForm />
    </main>
  );
}
