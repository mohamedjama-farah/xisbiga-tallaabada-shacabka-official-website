import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Videos & Media',
  description: 'Watch XTS Party speeches, events, and campaigns. Stay connected through our official YouTube channel and Somali radio partners.',
  keywords: ['XTS videos', 'XTS YouTube', 'Somalia political videos', 'XTS media', 'Somali party videos', 'fiidiyowyada XTS'],
  openGraph: {
    title: 'Videos & Media — XTS Party Somalia',
    description: 'Watch XTS Party speeches, events, and campaigns. Stay connected through our official YouTube channel.',
    url: 'https://xts-party.so/media',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XTS Party' }],
  },
  twitter: { card: 'summary_large_image', title: 'XTS Videos & Media', images: ['/logo.png'] },
  alternates: { canonical: 'https://xts-party.so/media' },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
