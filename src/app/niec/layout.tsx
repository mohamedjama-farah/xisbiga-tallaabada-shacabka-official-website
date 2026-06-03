import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voter Registration Guide — NIEC',
  description: 'How to register to vote and cast your ballot in Somali elections. Complete guide from the National Independent Electoral Commission (NIEC).',
  keywords: ['NIEC Somalia', 'voter registration Somalia', 'how to vote Somalia', 'diiwaangelinta codbixiyaha', 'Somali election guide', 'NIEC registration'],
  openGraph: {
    title: 'Voter Registration Guide — XTS Party Somalia',
    description: 'How to register to vote and cast your ballot in Somali elections. Step-by-step guide with NIEC registration centers.',
    url: 'https://xts-party.so/niec',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XTS Party' }],
  },
  twitter: { card: 'summary_large_image', title: 'Somalia Voter Registration Guide', images: ['/logo.png'] },
  alternates: { canonical: 'https://xts-party.so/niec' },
};

export default function NIECLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
