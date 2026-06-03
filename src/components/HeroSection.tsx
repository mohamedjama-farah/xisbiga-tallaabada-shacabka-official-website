'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, Heart, Users, MapPin, Calendar } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

// Deterministic particles — no Math.random (prevents hydration mismatch)
const particles = Array.from({ length: 30 }, (_, i) => {
  const phi = 1.6180339887;
  const angle = (i * phi * 360) % 360;
  const radius = 10 + (i % 8) * 10;
  return {
    id: i,
    x: +(50 + radius * Math.cos((angle * Math.PI) / 180)).toFixed(4),
    y: +(50 + radius * Math.sin((angle * Math.PI) / 180)).toFixed(4),
    size: 0.8 + (i % 5) * 0.6,
    duration: 3 + (i % 6) * 1.2,
    delay: (i % 8) * 0.5,
  };
});

const slides = [
  {
    img: '/somalia-fishing.jpg',
    accent: '#c9a227',
    en: {
      eyebrow: 'Youth & Employment',
      headline: ['Building', "Somalia's", 'Future'],
      gold: 1,
      sub: '67% of Somali youth are unemployed. Thousands risk the Mediterranean crossing. XTS will create 500,000 jobs and open new hope at home.',
    },
    so: {
      eyebrow: 'Dhalinyarada & Shaqada',
      headline: ['Mustaqbalka', 'Soomaaliya', 'Dhisaya'],
      gold: 2,
      sub: '67% dhalinyarada Soomaaliyeed ayaa shaqo la\'a. Kumaan ayaa naftooda halis u gelinaya. XTS waxay abuuraysaa 500,000 shaqo.',
    },
  },
  {
    img: '/somalia-river.jpg',
    accent: '#22c55e',
    en: {
      eyebrow: 'Environment & Water',
      headline: ['Protecting', 'Our Natural', 'Resources'],
      gold: 2,
      sub: "Somalia's rivers, forests and coastlines are under threat. XTS invests in climate resilience, reforestation and clean water for every region.",
    },
    so: {
      eyebrow: 'Deegaanka & Biyaha',
      headline: ['Ilaalinaya', 'Khayraadka', 'Dabiiciga'],
      gold: 1,
      sub: 'Webiyaasha, kaynta iyo xeebaha Soomaaliya waa halis. XTS waxay maalgelin doontaa adkaysiga cimilada iyo biyo nadiif ah.',
    },
  },
];

const stats = [
  { icon: Users,   n: '10,000+', en: 'Members',     so: 'Xubnood'     },
  { icon: MapPin,  n: '18',      en: 'Regions',      so: 'Gobolood'    },
  { icon: Calendar,n: '2025',    en: 'Founded',      so: 'La Aasaasay' },
  { icon: Heart,   n: '100%',    en: 'For Somalia',  so: 'Soomaaliya'  },
];

export default function HeroSection() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%',  '25%']);
  const fadeOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fadeY  = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 7000;

  // Safe slide index — never undefined even if stale state
  const safeSlide = slide % slides.length;
  const current   = slides[safeSlide];
  const content   = lang === 'en' ? current.en : current.so;

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const tick  = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setSlide(s => (s + 1) % slides.length);
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [slide]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden bg-[#040b1c]">

      {/* ── Background photo with parallax ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${safeSlide}`}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 z-0"
          style={{ y: bgY }}
        >
          <Image src={current.img} alt="Somalia" fill priority className="object-cover object-[center_65%]" sizes="100vw" />
          {/* Multi-layer overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040b1c]/95 via-[#040b1c]/75 to-[#040b1c]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040b1c] via-transparent to-[#040b1c]/40" />
        </motion.div>
      </AnimatePresence>

      {/* ── Fine dot grid ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(201,162,39,0.18) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      {/* ── Gold particles ── */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-gold/40"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [-15, 15, -15], opacity: [0.1, 0.6, 0.1], scale: [1, 1.3, 1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Accent vertical light beam ── */}
      <div className="absolute left-[45%] top-0 bottom-0 w-px z-[1] opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #c9a227, transparent)' }} />

      {/* ── Main content ── */}
      <motion.div style={{ opacity: fadeOp, y: fadeY }}
        className="relative z-10 flex flex-col items-start justify-center min-h-screen max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-28 pb-24">

        <div className="max-w-3xl">

          {/* Logo + party name */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-4 mb-10">
            <div className="relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full border border-dashed border-gold/30" style={{ inset: -8 }} />
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 40px 8px rgba(201,162,39,0.35)' }} />
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/50 shadow-2xl">
                <Image src="/logo.png" alt="XTS" fill className="object-contain p-1" priority />
              </div>
            </div>
            <div>
              <div className="text-gold font-black text-sm tracking-[0.2em] uppercase">Xisbiga Tallaabada</div>
              <div className="text-gold/70 font-semibold text-xs tracking-[0.3em] uppercase">Shacabka · XTS</div>
            </div>
          </motion.div>

          {/* Eyebrow label */}
          <AnimatePresence mode="wait">
            <motion.div key={`eye-${safeSlide}-${lang}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">{content.eyebrow}</span>
            </motion.div>
          </AnimatePresence>

          {/* Big headline — word by word */}
          <div className="mb-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={`headline-${safeSlide}-${lang}`} className="space-y-1">
                {content.headline.map((word, wi) => (
                  <motion.div key={wi}
                    initial={{ y: 90, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.75, delay: wi * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`block text-6xl sm:text-7xl lg:text-[88px] font-black leading-[0.9] tracking-[-0.02em] ${wi === content.gold ? 'text-gold' : 'text-white'}`}
                  >
                    {word}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p key={`sub-${safeSlide}-${lang}`}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mb-10"
            >
              {content.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-14">
            <Link href="/join">
              <motion.span whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,162,39,0.6)' }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-gold text-navy font-black text-base rounded-full cursor-pointer shadow-lg shadow-gold/20 transition-all">
                {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'} <ArrowRight size={18} />
              </motion.span>
            </Link>
            <Link href="/donate">
              <motion.span whileHover={{ scale: 1.04, backgroundColor: 'rgba(239,68,68,0.18)' }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 border border-red-500/50 text-red-400 font-bold text-base rounded-full cursor-pointer transition-all backdrop-blur-sm">
                <Heart size={16} className="fill-red-400/30" />
                {lang === 'en' ? 'Donate' : 'Xiwaal'}
              </motion.span>
            </Link>
            <Link href="/manifesto">
              <motion.span whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.06)' }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 border border-white/15 text-white/60 font-semibold text-base rounded-full cursor-pointer transition-all backdrop-blur-sm">
                {lang === 'en' ? 'Our Manifesto' : 'Qorshahayaga'}
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-wrap gap-6 pt-7 border-t border-white/10">
            {stats.map(({ icon: Icon, n, en, so }) => (
              <div key={en} className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Icon size={14} className="text-gold" />
                </div>
                <div>
                  <div className="text-gold font-black text-lg leading-none">{n}</div>
                  <div className="text-white/40 text-[11px] leading-none mt-0.5">{lang === 'en' ? en : so}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Slide controls — bottom right ── */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-4">
        {/* Progress bars */}
        <div className="flex flex-col gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setSlide(i); setProgress(0); }}
              className="group flex items-center gap-2" aria-label={`Slide ${i + 1}`}>
              <span className="text-white/30 text-[10px] font-mono group-hover:text-gold/60 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative w-16 h-0.5 bg-white/15 rounded-full overflow-hidden">
                {i === safeSlide && (
                  <motion.div className="absolute inset-y-0 left-0 bg-gold rounded-full"
                    style={{ width: `${progress}%` }} />
                )}
                {i < safeSlide && <div className="absolute inset-0 bg-gold/40 rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div className="text-white/20 text-xs font-mono">
          <span className="text-gold font-bold">{String(safeSlide + 1).padStart(2, '0')}</span>
          <span> / {String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
        <span className="text-white/20 text-[9px] tracking-[0.4em] uppercase font-medium">Scroll</span>
        <ChevronDown size={18} className="text-gold/35" />
      </motion.div>
    </section>
  );
}
