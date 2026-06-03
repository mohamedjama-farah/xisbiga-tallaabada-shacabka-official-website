import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clan-Neutral Unity',
  description: 'XTS Party stands for all Somali people regardless of clan, region, or background. Unity is our strength — midnimo waa xooggeena.',
  keywords: ['Somalia unity', 'clan neutral Somalia', 'Somali unity party', 'XTS midnimo', 'no clan politics Somalia'],
  openGraph: {
    title: 'Clan-Neutral Unity — XTS Party Somalia',
    description: 'XTS Party stands for all Somali people regardless of clan, region, or background. Unity is our strength.',
    url: 'https://xts-party.so/unity',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XTS Party' }],
  },
  twitter: { card: 'summary_large_image', title: 'XTS Unity Statement', images: ['/logo.png'] },
  alternates: { canonical: 'https://xts-party.so/unity' },
};

export default function UnityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
