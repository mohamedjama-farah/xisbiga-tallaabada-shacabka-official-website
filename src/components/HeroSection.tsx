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
    img: '/mogadishu-beach.jpg',
    accent: '#c9a227',
    en: {
      eyebrow: 'Mogadishu — Our Capital',
      headline: ['Building', "Tomorrow's", 'Somalia'],
      gold: 1,
      sub: 'From the shores of Mogadishu to every corner of Somalia — XTS stands for justice, unity and progress for every Somali citizen.',
    },
    so: {
      eyebrow: 'Muqdisho — Caasimaddeena',
      headline: ['Dhisaya', 'Soomaaliya', 'Cusub'],
      gold: 2,
      sub: 'Xeebaha Muqdisho ilaa geeska Soomaaliya — XTS waxay taageertaa cadaalad, midnimo iyo horumar muwaadin kasta.',
    },
  },
  {
    img: '/mogadishu-aerial.jpg',
    accent: '#3b82f6',
    en: {
      eyebrow: 'A Nation Rising',
      headline: ['One People,', 'One Somalia,', 'One Vision'],
      gold: 2,
      sub: 'Somalia has the longest coastline in Africa and unlimited potential. XTS will unlock that potential — with real plans, real jobs and real change.',
    },
    so: {
      eyebrow: 'Qarankii Kacaya',
      headline: ['Dad Mideysan,', 'Soomaali Mideysan,', 'Hal Aragtood'],
      gold: 1,
      sub: 'Soomaaliya waxay leedahay xeebta ugu dheer Afrika iyo kartida aan xad lahayn. XTS waxay furaysaa kartidaas.',
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <Image src={current.img} alt="Mogadishu Somalia" fill priority className="object-cover object-center" sizes="100vw" />
          {/* Multi-layer overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040b1c]/90 via-[#040b1c]/65 to-[#040b1c]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040b1c] via-transparent to-[#040b1c]/30" />
        </motion.div>
      </AnimatePresence>

      {/* ── Aurora orbs ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #c9a227, transparent 70%)', filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ x: [0, -60, 50, 0], y: [0, 50, -30, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', filter: 'blur(100px)' }}
        />
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -40, 60, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #ef4444, transparent 70%)', filter: 'blur(70px)' }}
        />
      </div>

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
                    initial={{ y: 90, opacity: 0, filter: 'blur(12px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.75, delay: wi * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`block text-6xl sm:text-7xl lg:text-[88px] font-black leading-[0.9] tracking-[-0.02em] ${
                      wi === content.gold
                        ? 'bg-clip-text text-transparent'
                        : 'text-white'
                    }`}
                    style={wi === content.gold ? {
                      backgroundImage: 'linear-gradient(135deg, #f0c040 0%, #c9a227 40%, #f5d060 70%, #c9a227 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'gradientShift 4s ease infinite',
                    } : {}}
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
