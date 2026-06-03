import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Petitions',
  description: 'Sign XTS Party petitions and make your voice heard. Stand with us for justice, accountability, and a better Somalia.',
  keywords: ['XTS petition', 'Somalia petition', 'Somali civil petition', 'Codsiyo XTS', 'voice for Somalia'],
  openGraph: {
    title: 'Petitions — XTS Party Somalia',
    description: 'Sign XTS Party petitions and make your voice heard. Stand with us for justice and a better Somalia.',
    url: 'https://xts-party.so/petition',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XTS Party' }],
  },
  twitter: { card: 'summary_large_image', title: 'XTS Petitions', images: ['/logo.png'] },
  alternates: { canonical: 'https://xts-party.so/petition' },
};

export default function PetitionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
