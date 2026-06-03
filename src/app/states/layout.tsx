import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Federal States',
  description: 'XTS Party across all Federal Member States of Somalia — Puntland, Jubaland, South West, Hirshabelle, Galmudug, and Banadir.',
  keywords: ['Somalia federal states', 'Puntland XTS', 'Jubaland party', 'Galmudug party', 'Gobolada Federaalka Soomaaliya', 'XTS states'],
  openGraph: {
    title: 'Federal States — XTS Party Somalia',
    description: 'XTS Party is active across all Federal Member States of Somalia — building justice and progress in every region.',
    url: 'https://xts-party.so/states',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XTS Party' }],
  },
  twitter: { card: 'summary_large_image', title: 'XTS Federal States', images: ['/logo.png'] },
  alternates: { canonical: 'https://xts-party.so/states' },
};

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
