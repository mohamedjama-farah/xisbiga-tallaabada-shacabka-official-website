'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, PlayCircle, Share2, Send } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import XTSLogoBolt from '@/components/XTSLogoBolt';

const LINK_GROUPS = [
  {
    titleEn: 'Party',
    titleSo: 'Xisbiga',
    links: [
      { href: '/about',   en: 'About XTS',            so: 'Xisbiga XTS' },
      { href: '/policy',  en: 'Policy Platform',       so: 'Qorshaha Siyaasadeed' },
      { href: '/news',    en: 'News',                  so: 'Wararka' },
      { href: '/events',  en: 'Events',                so: 'Dhacdooyinka' },
      { href: '/gallery', en: 'Gallery',               so: 'Sawirrada' },
      { href: '/media',   en: 'Videos & Media',        so: 'Warbaahinta' },
    ],
  },
  {
    titleEn: 'Get Involved',
    titleSo: 'Ka Qaybgal',
    links: [
      { href: '/join',            en: 'Join Us',           so: 'Noogu Soo Biir' },
      { href: '/volunteer',       en: 'Volunteer',         so: 'Iskaa Wax u Qabso' },
      { href: '/donate',          en: 'Donate',            so: 'Deeq' },
      { href: '/candidates',      en: 'Our Candidates',    so: 'Musharaxiideena' },
      { href: '/membership-card', en: 'Membership Card',   so: 'Kaarka Xubnimada' },
      { href: '/diaspora',        en: 'Diaspora',          so: 'Qurbojoog' },
    ],
  },
  {
    titleEn: 'Resources',
    titleSo: 'Macluumaad',
    links: [
      { href: '/vote',     en: 'How to Vote',          so: 'Sida Loo Codeyn' },
      { href: '/niec',     en: 'Voter Registration',   so: 'Diiwaangelinta' },
      { href: '/rights',   en: 'Constitutional Rights',so: 'Xuquuqda Dastuuriga' },
      { href: '/faq',      en: 'FAQ',                  so: "Su'aalaha Badanaa" },
      { href: '/branches', en: 'Branch Offices',       so: 'Xafiisyada' },
      { href: '/contact',  en: 'Contact',              so: 'Xiriir' },
    ],
  },
];

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-[#070e24] border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">

          {/* Brand — 2 cols */}
          <div className="xl:col-span-2">
            <div className="mb-5">
              <XTSLogoBolt size="md" animate={false} darkBg={true} />
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs mb-7">
              {lang === 'en'
                ? 'A political movement dedicated to justice, unity, and progress for all Somali people.'
                : 'Dhaqdhaqaaq siyaasadeed u heellan cadaalad, midnimo, iyo horumar shacabka Soomaaliyeed.'}
            </p>

            {/* Contact */}
            <ul className="space-y-3 mb-7">
              {[
                { Icon: Mail,  text: 'info@xts-party.so' },
                { Icon: Phone, text: '+252 61 XXX XXXX' },
                { Icon: MapPin,text: 'Mogadishu, Somalia' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-white/40 text-xs">
                  <Icon size={13} className="text-gold shrink-0" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { Icon: PlayCircle, href: '#' },
                { Icon: Share2, href: '#' },
                { Icon: Send, href: '#' },
              ].map(({ Icon, href }, i) => (
                <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="w-9 h-9 rounded-full bg-white/5 border border-gold/20 flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/60 transition-colors">
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link groups — 3 cols */}
          {LINK_GROUPS.map(group => (
            <div key={group.titleEn}>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-5">
                {lang === 'en' ? group.titleEn : group.titleSo}
              </h4>
              <ul className="space-y-3">
                {group.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-white/40 hover:text-gold transition-colors text-sm leading-snug">
                      {lang === 'en' ? link.en : link.so}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 pt-7 border-t border-white/6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Xisbiga Tallaabada Shacabka. All rights reserved.
          </p>
          <p className="text-white/15 text-xs">
            {lang === 'en' ? 'Built with integrity and transparency.' : 'Daacadnimo iyo caddaansho lagu dhisay.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
