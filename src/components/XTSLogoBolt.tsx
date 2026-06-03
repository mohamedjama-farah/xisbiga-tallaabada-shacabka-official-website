'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

const SIZES: Record<LogoSize, { emblem: number; textSize: string; subSize: string; gap: string }> = {
  xs:   { emblem: 40,  textSize: 'text-base',  subSize: 'text-[6px]',  gap: 'gap-2'   },
  sm:   { emblem: 52,  textSize: 'text-xl',    subSize: 'text-[7px]',  gap: 'gap-2.5' },
  md:   { emblem: 68,  textSize: 'text-2xl',   subSize: 'text-[8px]',  gap: 'gap-3'   },
  lg:   { emblem: 86,  textSize: 'text-3xl',   subSize: 'text-[9px]',  gap: 'gap-3.5' },
  xl:   { emblem: 108, textSize: 'text-4xl',   subSize: 'text-[10px]', gap: 'gap-4'   },
  hero: { emblem: 140, textSize: 'text-5xl',   subSize: 'text-xs',     gap: 'gap-5'   },
};

// BIG bold bolt — runs from above circle to below, wide & prominent like PAP
// Outer path going clockwise: top-tip → left-down → notch-right → bottom-tip → right-up → notch-left
const BOLT = 'M 62,2 L 40,52 L 55,52 L 32,98 L 54,48 L 39,48 Z';

// Bright highlight edge on the bolt (left face)
const BOLT_HIGHLIGHT = 'M 62,2 L 40,52 L 44,52 L 66,2 Z';

const RING_C = 251.3; // 2π × 40

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export default function XTSLogoBolt({
  size = 'md',
  animate = true,
  darkBg = true,
  className = '',
}: {
  size?: LogoSize | number;
  animate?: boolean;
  darkBg?: boolean;
  className?: string;
}) {
  const sizeKey: LogoSize =
    typeof size === 'number'
      ? size <= 40 ? 'xs' : size <= 55 ? 'sm' : size <= 72 ? 'md' : size <= 92 ? 'lg' : 'xl'
      : size;

  const { emblem, textSize, subSize, gap } = SIZES[sizeKey];

  type Phase = 'idle' | 'ring' | 'bolt' | 'text' | 'done';
  const [phase, setPhase] = useState<Phase>('idle');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!animate) { setPhase('done'); setPulse(true); return; }
    let cancelled = false;
    const run = async () => {
      await delay(80);  if (cancelled) return; setPhase('ring');
      await delay(950); if (cancelled) return; setPhase('bolt');
      await delay(500); if (cancelled) return; setPhase('text');
      await delay(420); if (cancelled) return; setPhase('done');
      await delay(160); if (cancelled) return; setPulse(true);
    };
    run();
    return () => { cancelled = true; };
  }, [animate]);

  const active = (from: Phase) => {
    const order: Phase[] = ['idle', 'ring', 'bolt', 'text', 'done'];
    return order.indexOf(phase) >= order.indexOf(from);
  };

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {/* ══ EMBLEM ══ */}
      <div className="relative shrink-0" style={{ width: emblem, height: emblem }}>
        <svg viewBox="0 0 100 100" width={emblem} height={emblem} style={{ overflow: 'visible' }}>
          <defs>
            {/* White glow on bolt */}
            <filter id="bolt2-whiteglow" x="-60%" y="-20%" width="220%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#ffffff" floodOpacity="0.7" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            {/* Gold outer glow */}
            <filter id="bolt2-goldglow" x="-60%" y="-20%" width="220%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#c9a227" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            {/* Bolt fill: white core fading to gold */}
            <linearGradient id="bolt2-grad" x1="0.6" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#ffe57a" />
              <stop offset="100%" stopColor="#c9a227" />
            </linearGradient>
            {/* Ring: deep navy */}
            <linearGradient id="ring2-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e2e80" />
              <stop offset="100%" stopColor="#111836" />
            </linearGradient>
          </defs>

          {/* ── Outer thin gold ring ── */}
          <motion.circle cx="50" cy="50" r="47"
            fill="none" stroke="#c9a227" strokeWidth="0.7" strokeOpacity="0.5"
            strokeDasharray={RING_C * 1.18}
            initial={{ strokeDashoffset: RING_C * 1.18, opacity: 0 }}
            animate={active('ring') ? { strokeDashoffset: 0, opacity: 1, transition: { duration: 1.1 } } : {}}
          />

          {/* ── Thick ring ── */}
          <motion.circle cx="50" cy="50" r="40"
            fill="none"
            stroke="url(#ring2-grad)"
            strokeWidth="15"
            strokeLinecap="butt"
            strokeDasharray={RING_C}
            initial={{ strokeDashoffset: RING_C, opacity: 0 }}
            animate={active('ring') ? { strokeDashoffset: 0, opacity: 1, transition: { duration: 1.0, ease: 'easeInOut' } } : {}}
          />

          {/* ── Inner thin gold ring ── */}
          <motion.circle cx="50" cy="50" r="33"
            fill="none" stroke="#c9a227" strokeWidth="0.7" strokeOpacity="0.4"
            strokeDasharray={RING_C * 0.82}
            initial={{ strokeDashoffset: RING_C * 0.82, opacity: 0 }}
            animate={active('ring') ? { strokeDashoffset: 0, opacity: 1, transition: { duration: 1.1, delay: 0.08 } } : {}}
          />

          {/* ── Flash burst on bolt entry ── */}
          <motion.path d={BOLT}
            fill="white"
            filter="url(#bolt2-whiteglow)"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={active('bolt') ? {
              opacity: [0, 1, 0],
              scaleY: [0, 1, 1],
              transition: { duration: 0.3, ease: 'easeOut' }
            } : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Gold outer glow ── */}
          <motion.path d={BOLT}
            fill="#c9a227"
            filter="url(#bolt2-goldglow)"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={active('bolt') ? { scaleY: 1, opacity: 0.9, transition: { duration: 0.45, ease: [0.2, 1.4, 0.4, 1], delay: 0.03 } } : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Main bolt — white + gold gradient ── */}
          <motion.path d={BOLT}
            fill="url(#bolt2-grad)"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={active('bolt') ? { scaleY: 1, opacity: 1, transition: { duration: 0.4, ease: [0.2, 1.4, 0.4, 1], delay: 0.05 } } : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Bright white highlight on top-left face ── */}
          <motion.path d={BOLT_HIGHLIGHT}
            fill="white"
            fillOpacity="0.55"
            initial={{ opacity: 0 }}
            animate={active('bolt') ? { opacity: 1, transition: { duration: 0.3, delay: 0.2 } } : {}}
          />
        </svg>

        {/* Pulse rings */}
        {pulse && [0, 0.7, 1.4].map(d => (
          <motion.span key={d}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1.5px solid #c9a227' }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: d, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* ══ TEXT ══ */}
      <div className="flex flex-col leading-none select-none">
        <motion.div
          className={`font-black tracking-[0.18em] ${textSize}`}
          style={{ fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)' }}
          initial={{ opacity: 0, x: -12 }}
          animate={active('text') ? { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } } : {}}
        >
          {['X', 'T', 'S'].map((l, i) => (
            <motion.span key={l}
              initial={{ opacity: 0, y: 6 }}
              animate={active('text') ? { opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07 } } : {}}
              style={{ color: i === 0 ? '#ffffff' : i === 1 ? '#e8c44a' : '#c9a227' }}
            >
              {l}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col mt-1"
          initial={{ opacity: 0, x: -8 }}
          animate={active('done') ? { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } } : {}}
        >
          <span className={`font-semibold uppercase tracking-[0.22em] ${subSize} ${darkBg ? 'text-white/80' : 'text-navy/65'}`}>
            Xisbiga Tallaabada
          </span>
          <span className={`font-bold uppercase tracking-[0.22em] ${subSize}`} style={{ color: '#c9a227' }}>
            Shacabka
          </span>
          <motion.div className="mt-1.5 h-px"
            style={{ background: 'linear-gradient(90deg, #ffffff 0%, #c9a227 50%, transparent 100%)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={active('done') ? { scaleX: 1, transition: { duration: 0.9, delay: 0.3 } } : {}}
          />
        </motion.div>
      </div>
    </div>
  );
}
