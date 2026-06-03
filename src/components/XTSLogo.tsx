'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

const SIZES: Record<LogoSize, { emblem: number; textSize: string; subSize: string; gap: string }> = {
  xs:   { emblem: 36,  textSize: 'text-base',  subSize: 'text-[6px]',  gap: 'gap-2'   },
  sm:   { emblem: 48,  textSize: 'text-xl',    subSize: 'text-[7px]',  gap: 'gap-2.5' },
  md:   { emblem: 64,  textSize: 'text-2xl',   subSize: 'text-[8px]',  gap: 'gap-3'   },
  lg:   { emblem: 80,  textSize: 'text-3xl',   subSize: 'text-[9px]',  gap: 'gap-3.5' },
  xl:   { emblem: 100, textSize: 'text-4xl',   subSize: 'text-[10px]', gap: 'gap-4'   },
  hero: { emblem: 130, textSize: 'text-5xl',   subSize: 'text-xs',     gap: 'gap-5'   },
};

// 5-pointed star centered at 50,50 — outer r=22, inner r=9
const STAR = 'M50,28 L55.29,42.72 L70.91,43.21 L58.56,52.78 L62.92,67.79 L50,59 L37.08,67.79 L41.44,52.78 L29.09,43.21 L44.71,42.72 Z';

// Upward arrow (progress symbol) overlaid on star
const ARROW = 'M50,35 L55.5,46 L52.2,46 L52.2,61 L47.8,61 L47.8,46 L44.5,46 Z';

// Outer ring circumference for r=46: 2π×46 ≈ 289
const C = 289;

export default function XTSLogo({
  size = 'md',
  animate = true,
  darkBg = true,
  className = '',
}: {
  size?: LogoSize | number;   // pass number for legacy pixel usage
  animate?: boolean;
  darkBg?: boolean;
  className?: string;
}) {
  // Legacy number support (old callers pass size={44} etc.)
  const sizeKey: LogoSize =
    typeof size === 'number'
      ? size <= 36 ? 'xs' : size <= 52 ? 'sm' : size <= 68 ? 'md' : size <= 88 ? 'lg' : 'xl'
      : size;

  const { emblem, textSize, subSize, gap } = SIZES[sizeKey];

  type Phase = 'idle' | 'ring' | 'star' | 'text' | 'done';
  const [phase, setPhase] = useState<Phase>('idle');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!animate) { setPhase('done'); setPulse(true); return; }
    let cancelled = false;
    const run = async () => {
      await delay(80);  if (cancelled) return; setPhase('ring');
      await delay(800); if (cancelled) return; setPhase('star');
      await delay(650); if (cancelled) return; setPhase('text');
      await delay(450); if (cancelled) return; setPhase('done');
      await delay(200); if (cancelled) return; setPulse(true);
    };
    run();
    return () => { cancelled = true; };
  }, [animate]);

  const active = (from: Phase) => {
    const order: Phase[] = ['idle', 'ring', 'star', 'text', 'done'];
    return order.indexOf(phase) >= order.indexOf(from);
  };

  return (
    <div className={`flex items-center ${gap} ${className}`}>

      {/* ════ EMBLEM ════ */}
      <div className="relative shrink-0" style={{ width: emblem, height: emblem }}>
        <svg viewBox="0 0 100 100" width={emblem} height={emblem} style={{ overflow: 'visible' }}>
          <defs>
            {/* Gold glow */}
            <filter id="xts-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#c9a227" floodOpacity="0.55" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            {/* Emblem bg gradient */}
            <radialGradient id="xts-bg" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#243378" />
              <stop offset="100%" stopColor="#111836" />
            </radialGradient>
            {/* Star gradient */}
            <linearGradient id="xts-star" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5d060" />
              <stop offset="100%" stopColor="#b8851a" />
            </linearGradient>

            {/* Arc paths for text */}
            <path id="arc-bottom" d="M 14,56 A 38,38 0 0,0 86,56" fill="none" />
            <path id="arc-top"    d="M 17,43 A 37,37 0 0,1 83,43" fill="none" />
          </defs>

          {/* ── Outer decorative ring (draw-in) ── */}
          <motion.circle cx="50" cy="50" r="46"
            fill="none" stroke="#c9a227" strokeWidth="0.8" strokeOpacity="0.6"
            strokeDasharray={C} strokeLinecap="round"
            initial={{ strokeDashoffset: C, opacity: 0 }}
            animate={active('ring')
              ? { strokeDashoffset: 0, opacity: 1, transition: { duration: 1.1, ease: 'easeInOut' } }
              : {}}
          />

          {/* ── Main emblem disc (scale in) ── */}
          <motion.circle cx="50" cy="50" r="43"
            fill="url(#xts-bg)" stroke="#c9a227" strokeWidth="2.2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={active('ring')
              ? { scale: 1, opacity: 1, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } }
              : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Inner dashed ring ── */}
          <motion.circle cx="50" cy="50" r="36"
            fill="none" stroke="#c9a227" strokeWidth="0.5"
            strokeOpacity="0.45" strokeDasharray="3.5 2.8"
            initial={{ opacity: 0, rotate: -180 }}
            animate={active('star')
              ? { opacity: 1, rotate: 0, transition: { duration: 1.0, ease: 'easeOut' } }
              : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── 5-pointed star (rotate + settle) ── */}
          <motion.path d={STAR}
            fill="url(#xts-star)"
            filter="url(#xts-glow)"
            initial={{ scale: 0, rotate: -130, opacity: 0 }}
            animate={active('star')
              ? { scale: 1, rotate: 0, opacity: 1,
                  transition: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] } }
              : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Shield outline (authority) ── */}
          <motion.path
            d="M50,31 L64,39 L64,55 Q64,65 50,72 Q36,65 36,55 L36,39 Z"
            fill="none" stroke="#c9a227" strokeWidth="1" strokeOpacity="0.35"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={active('text')
              ? { opacity: 1, scale: 1, transition: { duration: 0.5 } }
              : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Upward arrow (progress) ── */}
          <motion.path d={ARROW}
            fill="#1a2454" fillOpacity="0.9"
            initial={{ opacity: 0, y: 6 }}
            animate={active('text')
              ? { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
              : {}}
          />

          {/* ── Curved text — bottom ── */}
          <motion.text fill="#c9a227" fontSize="6" fontWeight="800" letterSpacing="1.8"
            initial={{ opacity: 0 }}
            animate={active('done') ? { opacity: 1, transition: { duration: 0.6, delay: 0.1 } } : {}}>
            <textPath href="#arc-bottom" startOffset="50%" textAnchor="middle">
              ✦ XISBIGA TALLAABADA ✦
            </textPath>
          </motion.text>

          {/* ── Curved text — top ── */}
          <motion.text fill="#c9a227" fontSize="5" fontWeight="700" letterSpacing="2.5"
            initial={{ opacity: 0 }}
            animate={active('done') ? { opacity: 1, transition: { duration: 0.6, delay: 0.25 } } : {}}>
            <textPath href="#arc-top" startOffset="50%" textAnchor="middle">
              SHACABKA · 2024 ·
            </textPath>
          </motion.text>
        </svg>

        {/* ── Pulse rings ── */}
        {pulse && [0, 0.65, 1.3].map(d => (
          <motion.span key={d}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid #c9a227' }}
            initial={{ scale: 1, opacity: 0.45 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: d, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* ════ TEXT ════ */}
      <div className="flex flex-col leading-none select-none">

        {/* XTS letters */}
        <motion.div
          className={`font-black tracking-[0.18em] ${textSize}`}
          style={{ fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={active('text')
            ? { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } }
            : {}}
        >
          {['X', 'T', 'S'].map((letter, i) => (
            <motion.span key={letter}
              style={{ color: '#c9a227' }}
              initial={{ opacity: 0, y: 8 }}
              animate={active('text')
                ? { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }
                : {}}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Full name */}
        <motion.div
          className="flex flex-col mt-1"
          initial={{ opacity: 0, y: 6 }}
          animate={active('done')
            ? { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
            : {}}
        >
          <span className={`font-semibold uppercase tracking-[0.22em] ${subSize} ${darkBg ? 'text-white/75' : 'text-navy/65'}`}>
            Xisbiga Tallaabada
          </span>
          <span className={`font-bold uppercase tracking-[0.22em] ${subSize}`} style={{ color: '#c9a227' }}>
            Shacabka
          </span>

          {/* Gold underline draws in */}
          <motion.div
            className="mt-1.5 h-px"
            style={{ background: 'linear-gradient(90deg, #c9a227 0%, transparent 100%)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={active('done')
              ? { scaleX: 1, transition: { duration: 0.9, delay: 0.35, ease: 'easeOut' } }
              : {}}
          />
        </motion.div>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
