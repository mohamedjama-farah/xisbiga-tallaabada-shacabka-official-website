'use client';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, Heart, Users, MapPin, Calendar } from 'lucide-react';
import XTSLogoBolt from '@/components/XTSLogoBolt';
import { useLang } from '@/hooks/useLang';

// ── Deterministic particles with depth (z) layers ─────────────────────────────
const particles = Array.from({ length: 48 }, (_, i) => {
  const phi = 1.6180339887;
  const angle = (i * phi * 360) % 360;
  const radius = 8 + (i % 10) * 9;
  const layer = i % 3; // 0 = far (small), 1 = mid, 2 = near (large)
  return {
    id: i,
    x: +(50 + radius * Math.cos((angle * Math.PI) / 180)).toFixed(4),
    y: +(50 + radius * Math.sin((angle * Math.PI) / 180)).toFixed(4),
    size: layer === 0 ? 1 + (i % 3) * 0.5 : layer === 1 ? 2.5 + (i % 3) * 1 : 4 + (i % 3) * 1.5,
    opacity: layer === 0 ? 0.15 : layer === 1 ? 0.35 : 0.6,
    duration: 4 + (i % 7) * 1.5,
    delay: (i % 10) * 0.4,
    depth: layer, // 0=far, 1=mid, 2=near
  };
});

// ── Floating geometric shapes (3D feel) ───────────────────────────────────────
const shapes = [
  { id: 0, x: 78, y: 15, size: 60, rotate: 12,  depth: 0.4, delay: 0 },
  { id: 1, x: 85, y: 55, size: 90, rotate: -20, depth: 0.7, delay: 1.5 },
  { id: 2, x: 65, y: 80, size: 45, rotate: 35,  depth: 0.2, delay: 3 },
  { id: 3, x: 90, y: 30, size: 30, rotate: -45, depth: 0.9, delay: 0.8 },
  { id: 4, x: 72, y: 68, size: 55, rotate: 60,  depth: 0.5, delay: 2.2 },
];

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
  { icon: Users,    n: '10,000+', en: 'Members',    so: 'Xubnood'     },
  { icon: MapPin,   n: '18',      en: 'Regions',     so: 'Gobolood'    },
  { icon: Calendar, n: '2025',    en: 'Founded',     so: 'La Aasaasay' },
  { icon: Heart,    n: '100%',    en: 'For Somalia', so: 'Soomaaliya'  },
];

// ── FULL Somalia outline — complete "7" shape including Somaliland ────────────
// Scale: x = (lon - 40.5) * 20,  y = (12.5 - lat) * 20
// Traced clockwise from NW (Djibouti border) around the full country.
// The top bar = Gulf of Aden coast (Somaliland + Puntland).
// The right bar = Indian Ocean coast going south.
// The left = Ethiopia/Kenya inland border back up to Djibouti.
// ViewBox "0 0 230 295"
const SOMALIA_PATH = `
  M 50,20
  L 68,25 L 90,40 L 108,36 L 130,38 L 150,32 L 170,24 L 190,18
  L 205,10 L 213,10 L 218,14 L 218,38 L 212,44
  L 206,54 L 200,66 L 192,88 L 180,114 L 162,144 L 144,166
  L 122,192 L 102,208 L 72,228 L 52,244 L 30,268 L 26,278 L 22,284
  L 10,268 L 10,194 L 20,180 L 28,170 L 32,166 L 46,164 L 64,150 L 88,150
  L 86,130 L 78,110 L 70,90 L 62,70 L 55,50 L 50,30
  Z
`;

export default function HeroSection() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const fadeOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fadeY  = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  // ── Mouse parallax ──────────────────────────────────────────────────────────
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const mouseX = useSpring(rawMouseX, { stiffness: 60, damping: 20, mass: 0.8 });
  const mouseY = useSpring(rawMouseY, { stiffness: 60, damping: 20, mass: 0.8 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    rawMouseX.set(x);
    rawMouseY.set(y);
  }, [rawMouseX, rawMouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Parallax layers — different depth factors
  const layer0X = useTransform(mouseX, v => v * -8);   // far  (subtle)
  const layer0Y = useTransform(mouseY, v => v * -8);
  const layer1X = useTransform(mouseX, v => v * -18);  // mid
  const layer1Y = useTransform(mouseY, v => v * -18);
  const layer2X = useTransform(mouseX, v => v * -32);  // near
  const layer2Y = useTransform(mouseY, v => v * -32);
  const layer3X = useTransform(mouseX, v => v * -50);  // foreground
  const layer3Y = useTransform(mouseY, v => v * -50);

  // 3D tilt for Somalia map
  const mapRotateY = useTransform(mouseX, v => v * 18);
  const mapRotateX = useTransform(mouseY, v => v * -12);

  // 3D tilt for shapes
  const shapeRotX = useTransform(mouseY, v => v * -8);
  const shapeRotY = useTransform(mouseX, v => v * 12);

  // ── Slides ──────────────────────────────────────────────────────────────────
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 7000;
  const safeSlide = slide % slides.length;
  const current   = slides[safeSlide];
  const content   = lang === 'en' ? current.en : current.so;

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const tick  = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { setSlide(s => (s + 1) % slides.length); setProgress(0); }
    }, 50);
    return () => clearInterval(tick);
  }, [slide]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden bg-[#040b1c]"
      style={{ perspective: '1200px' }} tabIndex={-1}>

      {/* ── Background photo ── */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${safeSlide}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
          style={{ y: bgY }}>
          <Image src={current.img} alt="Somalia" fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040b1c]/92 via-[#040b1c]/70 to-[#040b1c]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040b1c] via-transparent to-[#040b1c]/30" />
        </motion.div>
      </AnimatePresence>

      {/* ── LAYER 0 — far background orbs ── */}
      <motion.div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
        style={{ x: layer0X, y: layer0Y }}>
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #c9a227, transparent 70%)', filter: 'blur(90px)' }}
        />
        <motion.div
          animate={{ x: [0, -60, 50, 0], y: [0, 50, -30, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', filter: 'blur(110px)' }}
        />
      </motion.div>

      {/* ── LAYER 0 — dot grid (far) ── */}
      <motion.div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ x: layer0X, y: layer0Y,
          backgroundImage: 'radial-gradient(circle, rgba(201,162,39,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px' }} />

      {/* ── LAYER 1 — far particles ── */}
      <motion.div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
        style={{ x: layer1X, y: layer1Y }}>
        {particles.filter(p => p.depth === 0).map(p => (
          <motion.div key={p.id}
            className="absolute rounded-full bg-gold"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: [-12, 12, -12], opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4], scale: [1, 1.2, 1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* ── LAYER 1 — 3D geometric shapes (rings, diamonds) ── */}
      <motion.div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
        style={{ x: layer1X, y: layer1Y, rotateX: shapeRotX, rotateY: shapeRotY, transformStyle: 'preserve-3d' }}>
        {shapes.map(s => (
          <motion.div key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ rotate: [s.rotate, s.rotate + 360], y: [-8, 8, -8] }}
            transition={{ rotate: { duration: 20 + s.id * 4, repeat: Infinity, ease: 'linear' }, y: { duration: 4 + s.id * 0.7, repeat: Infinity, ease: 'easeInOut' }, delay: s.delay }}>
            {/* Diamond shape */}
            <div className="w-full h-full border border-gold/20 rounded-sm"
              style={{ transform: 'rotate(45deg)', boxShadow: `0 0 ${s.size * 0.3}px rgba(201,162,39,${s.depth * 0.12})` }} />
          </motion.div>
        ))}

        {/* Large decorative ring — far right */}
        <motion.div
          className="absolute"
          style={{ right: '8%', top: '10%', width: 280, height: 280 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}>
          <div className="w-full h-full rounded-full border border-gold/10"
            style={{ boxShadow: '0 0 60px rgba(201,162,39,0.06) inset' }} />
          {/* Tick marks */}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="absolute w-1 h-3 bg-gold/20 rounded-full"
              style={{ left: '50%', top: 0, transformOrigin: '50% 140px', transform: `translateX(-50%) rotate(${i * 30}deg)` }} />
          ))}
        </motion.div>

        {/* Medium ring */}
        <motion.div
          className="absolute"
          style={{ right: '14%', top: '18%', width: 160, height: 160 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
          <div className="w-full h-full rounded-full border border-gold/15"
            style={{ borderStyle: 'dashed' }} />
        </motion.div>
      </motion.div>

      {/* ── LAYER 2 — mid particles ── */}
      <motion.div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none"
        style={{ x: layer2X, y: layer2Y }}>
        {particles.filter(p => p.depth === 1).map(p => (
          <motion.div key={p.id}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
              background: 'radial-gradient(circle, #f0c040, #c9a227)',
              boxShadow: `0 0 ${p.size * 2}px rgba(201,162,39,0.4)`, opacity: p.opacity }}
            animate={{ y: [-18, 18, -18], opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* ── LAYER 2 — Somalia 3D Map outline ── */}
      <motion.div
        className="absolute z-[3] pointer-events-none"
        style={{ right: '4%', top: '8%', x: layer2X, y: layer2Y,
          rotateY: mapRotateY, rotateX: mapRotateX, transformStyle: 'preserve-3d' }}>
        <motion.div
          animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="200" height="255" viewBox="0 0 230 295" fill="none"
            style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,39,0.25)) drop-shadow(0 0 60px rgba(201,162,39,0.1))' }}>

            {/* Glow fill */}
            <path d={SOMALIA_PATH} fill="rgba(201,162,39,0.05)" />
            {/* Outer glow stroke */}
            <path d={SOMALIA_PATH} stroke="rgba(201,162,39,0.10)" strokeWidth="9" fill="none" />
            {/* Main dashed outline */}
            <path d={SOMALIA_PATH} stroke="rgba(201,162,39,0.50)" strokeWidth="1.5" fill="none" strokeDasharray="5 3" />
            {/* Inner bright line */}
            <path d={SOMALIA_PATH} stroke="rgba(240,192,64,0.65)" strokeWidth="0.75" fill="none" />

            {/*
              7 cities — positions verified against the COMPLETE Somalia path
              (same scale: x = (lon - 40.5)*20, y = (12.5 - lat)*20)
              All dots confirmed inside the full outline including Somaliland.
              1. Mogadishu  lon=45.34 lat=2.05  → (97,  209) ★ Capital
              2. Hargeisa   lon=44.07 lat=9.56  → (71,   54)   Somaliland
              3. Bosaso     lon=49.18 lat=11.28 → (174,  24)
              4. Garowe     lon=48.48 lat=8.41  → (160,  82)
              5. Dhusamareb lon=46.49 lat=5.54  → (118, 138)
              6. Baidoa     lon=43.65 lat=3.12  → (62,  188)
              7. Kismayo    lon=42.54 lat=-0.36 → (44,  257)
            */}

            {[
              { cx: 97,  cy: 209, capital: true,  delay: 0    }, // Mogadishu ★
              { cx: 71,  cy: 54,  capital: false, delay: 0.4  }, // Hargeisa (Somaliland)
              { cx: 174, cy: 24,  capital: false, delay: 0.8  }, // Bosaso
              { cx: 160, cy: 82,  capital: false, delay: 1.2  }, // Garowe
              { cx: 118, cy: 138, capital: false, delay: 1.6  }, // Dhusamareb
              { cx: 62,  cy: 188, capital: false, delay: 2.0  }, // Baidoa
              { cx: 44,  cy: 252, capital: false, delay: 2.4  }, // Kismayo
            ].map(city => (
              <g key={`${city.cx}-${city.cy}`}>
                {/* Ring 1 */}
                <motion.circle cx={city.cx} cy={city.cy}
                  r={city.capital ? 8 : 6}
                  fill="none"
                  stroke={city.capital ? 'rgba(201,162,39,0.7)' : 'rgba(201,162,39,0.5)'}
                  strokeWidth={city.capital ? 1.5 : 1}
                  animate={{ r: [city.capital ? 8 : 6, city.capital ? 22 : 16, city.capital ? 8 : 6], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: city.capital ? 2 : 2.4, repeat: Infinity, ease: 'easeOut', delay: city.delay }} />
                {/* Ring 2 */}
                <motion.circle cx={city.cx} cy={city.cy}
                  r={city.capital ? 8 : 6}
                  fill="none"
                  stroke="rgba(201,162,39,0.3)"
                  strokeWidth="0.75"
                  animate={{ r: [city.capital ? 8 : 6, city.capital ? 32 : 24, city.capital ? 8 : 6], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: city.capital ? 2 : 2.4, repeat: Infinity, ease: 'easeOut', delay: city.delay + 0.7 }} />
                {/* Ring 3 — capital only */}
                {city.capital && (
                  <motion.circle cx={city.cx} cy={city.cy} r="8"
                    fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="0.5"
                    animate={{ r: [8, 42, 8], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: city.delay + 1.4 }} />
                )}
                {/* Centre dot */}
                <motion.circle cx={city.cx} cy={city.cy}
                  r={city.capital ? 4.5 : 3}
                  fill={city.capital ? '#c9a227' : 'rgba(201,162,39,0.85)'}
                  animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
                  transition={{ duration: city.capital ? 2 : 2.4, repeat: Infinity, delay: city.delay }} />
                {/* Pinpoint drop */}
                <line x1={city.cx} y1={city.cy + (city.capital ? 4.5 : 3)} x2={city.cx} y2={city.cy + (city.capital ? 14 : 11)}
                  stroke="rgba(201,162,39,0.45)" strokeWidth={city.capital ? 1.2 : 0.8} />
                <circle cx={city.cx} cy={city.cy + (city.capital ? 16 : 13)}
                  r={city.capital ? 1.8 : 1.2} fill="rgba(201,162,39,0.5)" />
              </g>
            ))}

            {/* XTS label — centre of map */}
            <text x="75" y="155" fill="rgba(201,162,39,0.18)" fontSize="10"
              fontWeight="900" fontFamily="monospace" letterSpacing="4">XTS</text>
          </svg>
        </motion.div>
      </motion.div>

      {/* ── LAYER 3 — near/foreground particles ── */}
      <motion.div className="absolute inset-0 z-[4] overflow-hidden pointer-events-none"
        style={{ x: layer3X, y: layer3Y }}>
        {particles.filter(p => p.depth === 2).map(p => (
          <motion.div key={p.id}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
              background: 'radial-gradient(circle, #ffffff, #f0c040)',
              boxShadow: `0 0 ${p.size * 3}px rgba(255,255,255,0.5), 0 0 ${p.size * 6}px rgba(201,162,39,0.3)`,
              opacity: p.opacity }}
            animate={{ y: [-25, 25, -25], opacity: [p.opacity * 0.2, p.opacity, p.opacity * 0.2], scale: [0.8, 1.6, 0.8] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* ── Vertical light beam ── */}
      <div className="absolute left-[44%] top-0 bottom-0 w-px z-[4] pointer-events-none opacity-15"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #c9a227 30%, #f0c040 50%, #c9a227 70%, transparent 100%)' }} />

      {/* ── MAIN CONTENT (layer shifts slightly with mouse) ── */}
      <motion.div style={{ opacity: fadeOp, y: fadeY }}
        className="relative z-10 flex flex-col items-start justify-center min-h-screen max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-28 pb-24">

        <motion.div className="max-w-3xl" style={{ x: layer0X, y: layer0Y }}>


          {/* Eyebrow */}
          <AnimatePresence mode="wait">
            <motion.div key={`eye-${safeSlide}-${lang}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">{content.eyebrow}</span>
            </motion.div>
          </AnimatePresence>

          {/* Big headline — with 3D depth text shadow */}
          <div className="mb-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={`headline-${safeSlide}-${lang}`} className="space-y-1">
                {content.headline.map((word, wi) => (
                  <motion.div key={wi}
                    initial={{ y: 90, opacity: 0, filter: 'blur(12px)', rotateX: -15 }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)', rotateX: 0 }}
                    exit={{ y: -60, opacity: 0, rotateX: 10 }}
                    transition={{ duration: 0.75, delay: wi * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`block text-6xl sm:text-7xl lg:text-[88px] font-black leading-[0.9] tracking-[-0.02em] ${
                      wi === content.gold ? 'bg-clip-text text-transparent' : 'text-white'
                    }`}
                    style={wi === content.gold ? {
                      backgroundImage: 'linear-gradient(135deg, #f0c040 0%, #c9a227 40%, #f5d060 70%, #c9a227 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'gradientShift 4s ease infinite',
                      filter: 'drop-shadow(0 0 30px rgba(201,162,39,0.4))',
                    } : {
                      textShadow: '4px 6px 0 rgba(0,0,0,0.3), 0 0 60px rgba(201,162,39,0.06)',
                    }}>
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
              className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mb-10">
              {content.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-14">
            <Link href="/join">
              <motion.span
                whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(201,162,39,0.7), 0 8px 30px rgba(201,162,39,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-gold text-navy font-black text-base rounded-full cursor-pointer shadow-lg shadow-gold/25 transition-all"
                style={{ boxShadow: '0 0 20px rgba(201,162,39,0.3), 0 4px 16px rgba(0,0,0,0.4)' }}>
                {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'} <ArrowRight size={18} />
              </motion.span>
            </Link>
            <Link href="/donate">
              <motion.span
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(239,68,68,0.18)', boxShadow: '0 0 30px rgba(239,68,68,0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 border border-red-500/50 text-red-400 font-bold text-base rounded-full cursor-pointer transition-all backdrop-blur-sm">
                <Heart size={16} className="fill-red-400/30" />
                {lang === 'en' ? 'Donate' : 'Deeq'}
              </motion.span>
            </Link>
            <Link href="/manifesto">
              <motion.span
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.06)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 border border-white/15 text-white/60 font-semibold text-base rounded-full cursor-pointer transition-all backdrop-blur-sm">
                {lang === 'en' ? 'Our Manifesto' : 'Qorshahayaga'}
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-wrap gap-6 pt-7 border-t border-white/10">
            {stats.map(({ icon: Icon, n, en, so }, i) => (
              <motion.div key={en}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.05 }}
                className="flex items-center gap-2.5 group cursor-default">
                <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/40 transition-all"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <Icon size={15} className="text-gold" />
                </div>
                <div>
                  <div className="text-gold font-black text-lg leading-none"
                    style={{ textShadow: '0 0 15px rgba(201,162,39,0.4)' }}>{n}</div>
                  <div className="text-white/40 text-[11px] leading-none mt-0.5">{lang === 'en' ? en : so}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </motion.div>

      {/* ── Slide controls ── */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-4">
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

      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0%   50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0%   50% }
        }
      `}</style>
    </section>
  );
}
