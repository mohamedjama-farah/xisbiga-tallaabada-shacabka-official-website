import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Candidates',
  description: 'Meet the XTS Party candidates standing for federal and state elections across Somalia. Justice, unity, and progress for all Somali people.',
  keywords: ['XTS candidates', 'Somalia election candidates', 'Somali political candidates', 'Musharaxiinta XTS', 'doorashada Soomaaliya'],
  openGraph: {
    title: 'Our Candidates — XTS Party Somalia',
    description: 'Meet the XTS Party candidates standing for federal and state elections across Somalia.',
    url: 'https://xts-party.so/candidates',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XTS Party' }],
  },
  twitter: { card: 'summary_large_image', title: 'XTS Candidates', images: ['/logo.png'] },
  alternates: { canonical: 'https://xts-party.so/candidates' },
};

export default function CandidatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
