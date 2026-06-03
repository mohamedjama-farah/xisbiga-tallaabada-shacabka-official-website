import HeroSection from '@/components/HeroSection';
import ValuesSection from '@/components/ValuesSection';
import ManifestoSection from '@/components/ManifestoSection';
import StatsSection from '@/components/StatsSection';
import MilestonesSection from '@/components/MilestonesSection';
import GetInvolvedSection from '@/components/GetInvolvedSection';
import CommunitySection from '@/components/CommunitySection';
import LeadershipSection from '@/components/LeadershipSection';
import NewsPreview from '@/components/NewsPreview';
import NewsletterSection from '@/components/NewsletterSection';
import JoinCTA from '@/components/JoinCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuesSection />
      <ManifestoSection />
      <StatsSection />
      <MilestonesSection />
      <GetInvolvedSection />
      <CommunitySection />
      <LeadershipSection />
      <NewsPreview />
      <NewsletterSection />
      <JoinCTA />
    </>
  );
}
