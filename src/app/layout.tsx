import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/hooks/useLang';
import ConditionalShell from '@/components/ConditionalShell';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Xisbiga Tallaabada Shacabka — XTS',
    template: '%s | XTS Party Somalia',
  },
  description: 'XTS — Xisbiga Tallaabada Shacabka. A new political movement for justice, unity, and progress for all Somali people. Join us today.',
  keywords: [
    'XTS', 'Xisbiga Tallaabada Shacabka', 'Somalia political party', 'Somali party',
    'Siyaasada Soomaaliya', 'Xisbi Soomaali', 'Somalia election', 'Somali politics',
    'People Progress Party', 'Somalia democracy', 'Mogadishu party',
  ],
  authors: [{ name: 'XTS Party', url: 'https://xts-party.so' }],
  creator: 'Xisbiga Tallaabada Shacabka',
  publisher: 'XTS Party Somalia',
  metadataBase: new URL('https://xts-party.so'),
  alternates: { canonical: 'https://xts-party.so' },
  openGraph: {
    title: 'Xisbiga Tallaabada Shacabka — XTS',
    description: "Building Tomorrow's Somalia Together. Justice, Unity, Progress.",
    url: 'https://xts-party.so',
    siteName: 'XTS Party Somalia',
    type: 'website',
    locale: 'so_SO',
    alternateLocale: 'en_US',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'XTS Party Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xisbiga Tallaabada Shacabka — XTS',
    description: "Building Tomorrow's Somalia Together.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="so">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c9a227" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});})}` }} />
      </head>
      <body>
        <LangProvider>
          <ConditionalShell>{children}</ConditionalShell>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a2454', color: 'white', border: '1px solid #c9a227' },
              success: { iconTheme: { primary: '#c9a227', secondary: '#1a2454' } },
            }}
          />
        </LangProvider>
      </body>
    </html>
  );
}
