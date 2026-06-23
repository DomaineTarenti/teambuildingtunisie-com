import Hero from '@/components/Hero';
import WhyTeamBuilding from '@/components/WhyTeamBuilding';
import Activities from '@/components/Activities';
import ClientLogos from '@/components/ClientLogos';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyTeamBuilding />
      <Activities />
      <ClientLogos />
    </main>
  );
}
