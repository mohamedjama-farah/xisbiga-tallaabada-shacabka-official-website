'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Heart, ChevronDown, Search } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';

interface DropLink { href: string; en: string; so: string }
interface NavLink {
  href?: string;
  key?: string;
  en?: string;
  so?: string;
  children?: DropLink[];
}

const navLinks: NavLink[] = [
  { href: '/', key: 'nav.home' },
  { href: '/about', key: 'nav.about' },
  {
    en: 'Party',
    so: 'Xisbiga',
    children: [
      { href: '/policy',             en: 'Policy Platform',       so: 'Qorshaha Siyaasadeed' },
      { href: '/rights',             en: 'Constitutional Rights',  so: 'Xuquuqda Dastuuriga' },
      { href: '/system',             en: 'How Somalia Works',      so: 'Nidaamka Soomaaliya' },
      { href: '/unity',              en: 'Clan-Neutral Unity',     so: 'Midnimada Qabiilka' },
      { href: '/states',             en: 'Federal States',         so: 'Gobolada Federaalka' },
      { href: '/party/constitution', en: 'Party Constitution',     so: 'Dastuurka Xisbiga' },
      { href: '/simnanta',           en: 'Simnanta',               so: 'Simnanta' },
      { href: '/press',              en: 'Press Room',             so: 'Qolka Saxaafadda' },
      { href: '/materials',          en: 'Party Materials',        so: 'Agabka Xisbiga' },
      { href: '/branches',           en: 'Branch Offices',         so: 'Xafiisyada' },
    ],
  },
  {
    en: 'People',
    so: 'Dadka',
    children: [
      { href: '/candidates',      en: 'Our Candidates',      so: 'Musharaxiideena' },
      { href: '/representatives', en: 'Representatives',     so: 'Wakiilada' },
      { href: '/women',           en: "Women's Wing",        so: 'Goobta Haweenka' },
      { href: '/youth',           en: 'Youth Wing',          so: 'Goobta Dhalinyarada' },
      { href: '/diaspora',        en: 'Diaspora',            so: 'Masakinta' },
      { href: '/volunteer',       en: 'Volunteer / Canvass', so: 'Volunteer / Xooge' },
      { href: '/poll',            en: 'Member Polls',        so: "Ra'yiyadda" },
      { href: '/petition',        en: 'Petitions',           so: 'Codsiyo' },
    ],
  },
  {
    en: 'More',
    so: 'Dheeraad',
    children: [
      { href: '/events',  en: 'Events',            so: 'Dhacdooyinka' },
      { href: '/gallery', en: 'Gallery',           so: 'Gallariya' },
      { href: '/news',    en: 'News',              so: 'Wararka' },
      { href: '/media',   en: 'Videos & Media',    so: 'Fiidiyowyada' },
      { href: '/data',    en: 'Crisis Data',       so: 'Xogta' },
      { href: '/niec',    en: 'Voter Registration', so: 'Diiwaangelinta Codbix.' },
      { href: '/vote',    en: 'How to Vote',       so: 'Sida Loo Codeyn' },
      { href: '/faq',     en: 'FAQ',               so: "Su'aalaha" },
      { href: '/contact', en: 'Contact',           so: 'Xiriir' },
    ],
  },
];

function Dropdown({ link, lang, onClose }: { link: NavLink; lang: 'en' | 'so'; onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const label = lang === 'en' ? link.en : link.so;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-white/80 hover:text-gold transition-colors text-sm font-medium whitespace-nowrap"
      >
        {label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-[190px] bg-[#0d1835] border border-gold/20 rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50"
          >
            {link.children?.map(child => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => { setOpen(false); onClose?.(); }}
                className="block px-4 py-2.5 text-sm text-white/65 hover:text-gold hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                {lang === 'en' ? child.en : child.so}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getLabel = (link: NavLink) => {
    if (link.key) return t(link.key, lang);
    return lang === 'en' ? (link.en ?? '') : (link.so ?? '');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gold/40 bg-[#1a2454]">
              <Image src="/logo.png" alt="XTS Logo" fill className="object-contain p-0.5" priority />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-gold font-bold text-sm">Xisbiga Tallaabada</div>
              <div className="text-gold font-bold text-sm">Shacabka</div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-6 flex-1 min-w-0">
            {navLinks.map((link, i) => {
              if (link.children) {
                return <Dropdown key={i} link={link} lang={lang} />;
              }
              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-white/80 hover:text-gold transition-colors text-sm font-medium whitespace-nowrap relative group"
                >
                  {getLabel(link)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/donate"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/40 text-red-400 font-bold text-xs rounded-full hover:bg-red-500/20 transition-all whitespace-nowrap"
              >
                <Heart size={12} className="fill-red-400/40" />
                {lang === 'en' ? 'Donate' : 'Xiwaal'}
              </Link>

              <Link
                href="/join"
                className="px-4 py-1.5 bg-gold text-navy font-bold text-xs rounded-full hover:bg-gold/90 transition-all hover:shadow-md hover:shadow-gold/30 whitespace-nowrap"
              >
                {t('nav.join', lang)}
              </Link>

              <Link
                href="/search"
                className="p-1.5 text-white/60 hover:text-gold transition-colors"
                title="Search"
              >
                <Search size={15} />
              </Link>

              <button
                onClick={() => setLang(lang === 'en' ? 'so' : 'en')}
                className="flex items-center gap-1 text-white/60 hover:text-gold transition-colors text-xs font-semibold"
              >
                <Globe size={14} />
                {lang === 'en' ? 'SO' : 'EN'}
              </button>
            </div>
          </div>

          {/* ── Mobile burger ── */}
          <div className="lg:hidden ml-auto flex items-center gap-3">
            <Link href="/join" className="px-3 py-1.5 bg-gold text-navy font-bold text-xs rounded-full">
              {t('nav.join', lang)}
            </Link>
            <button className="text-white p-1.5" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0d1835]/98 backdrop-blur-md border-t border-gold/20 overflow-y-auto max-h-[80vh]"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                if (link.children) {
                  const label = lang === 'en' ? link.en : link.so;
                  const isExpanded = expandedMobile === label;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedMobile(isExpanded ? null : (label ?? null))}
                        className="w-full flex items-center justify-between py-3 text-white/80 hover:text-gold text-base"
                      >
                        <span className="font-medium">{label}</span>
                        <ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="pl-3 border-l border-gold/20 ml-1 mb-2">
                          {link.children.map(child => (
                            <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
                              className="block py-2 text-sm text-white/55 hover:text-gold transition-colors">
                              {lang === 'en' ? child.en : child.so}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={link.href} href={link.href!} onClick={() => setOpen(false)}
                    className="py-3 text-white/80 hover:text-gold transition-colors text-base font-medium border-b border-white/5">
                    {getLabel(link)}
                  </Link>
                );
              })}

              <div className="pt-4 flex flex-col gap-3 border-t border-white/10 mt-2">
                <Link href="/donate" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-full">
                  <Heart size={15} className="fill-red-400/40" />
                  {lang === 'en' ? 'Donate' : 'Xiwaal'}
                </Link>
                <button onClick={() => setLang(lang === 'en' ? 'so' : 'en')}
                  className="flex items-center justify-center gap-2 text-white/60 hover:text-gold py-2 text-sm">
                  <Globe size={16} />
                  {lang === 'en' ? 'Switch to Somali' : 'Switch to English'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
