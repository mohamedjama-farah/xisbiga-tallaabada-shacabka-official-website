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

// 5-pointed star — small, right side of crescent, outer r=10, inner r=4
// centered at (68, 36)
const starPoints = (cx: number, cy: number, or: number, ir: number) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? or : ir;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d + 'Z';
};

const STAR = starPoints(66, 38, 10, 4);

// Crescent: outer circle minus inner offset circle
// Outer: cx=44, cy=52, r=26
// Inner (to cut): cx=52, cy=48, r=21 → creates crescent facing right
const CRESCENT_OUTER = 'M44,26 A26,26 0 1,1 43.99,26.01 Z'; // full circle, will use clip

// Ring circumference r=46
const C = 289;

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export default function XTSLogoCrescent({
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

  type Phase = 'idle' | 'circle' | 'crescent' | 'star' | 'text' | 'done';
  const [phase, setPhase] = useState<Phase>('idle');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!animate) { setPhase('done'); setPulse(true); return; }
    let cancelled = false;
    const run = async () => {
      await delay(80);   if (cancelled) return; setPhase('circle');
      await delay(900);  if (cancelled) return; setPhase('crescent');
      await delay(600);  if (cancelled) return; setPhase('star');
      await delay(450);  if (cancelled) return; setPhase('text');
      await delay(400);  if (cancelled) return; setPhase('done');
      await delay(200);  if (cancelled) return; setPulse(true);
    };
    run();
    return () => { cancelled = true; };
  }, [animate]);

  const active = (from: Phase) => {
    const order: Phase[] = ['idle', 'circle', 'crescent', 'star', 'text', 'done'];
    return order.indexOf(phase) >= order.indexOf(from);
  };

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {/* ══ EMBLEM ══ */}
      <div className="relative shrink-0" style={{ width: emblem, height: emblem }}>
        <svg viewBox="0 0 100 100" width={emblem} height={emblem} style={{ overflow: 'visible' }}>
          <defs>
            {/* Crescent shape via clip */}
            <clipPath id="crescent-clip">
              {/* Show outer circle, cut away inner offset circle */}
              <path d="
                M 44,26
                A 26,26 0 1,1 43.99,26.01
                Z
                M 52,30
                A 21,21 0 1,0 51.99,30.01
                Z
              " fillRule="evenodd" />
            </clipPath>

            {/* Gold glow filter */}
            <filter id="cres-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#c9a227" floodOpacity="0.55" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            {/* White glow for star */}
            <filter id="star-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feFlood floodColor="#ffffff" floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Emblem background */}
            <radialGradient id="cres-bg" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e2d7a" />
              <stop offset="100%" stopColor="#0e1640" />
            </radialGradient>

            {/* Crescent gradient: gold top, white highlight */}
            <linearGradient id="cres-fill" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#fffbe0" />
              <stop offset="30%" stopColor="#f5d060" />
              <stop offset="100%" stopColor="#b8851a" />
            </linearGradient>
          </defs>

          {/* ── Outer ring — draws in ── */}
          <motion.circle cx="50" cy="50" r="47"
            fill="none" stroke="#c9a227" strokeWidth="0.8" strokeOpacity="0.5"
            strokeDasharray={C * 1.02}
            initial={{ strokeDashoffset: C * 1.02, opacity: 0 }}
            animate={active('circle') ? { strokeDashoffset: 0, opacity: 1, transition: { duration: 1.1 } } : {}}
          />

          {/* ── Main disc ── */}
          <motion.circle cx="50" cy="50" r="44"
            fill="url(#cres-bg)"
            stroke="#c9a227" strokeWidth="2"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={active('circle') ? { scale: 1, opacity: 1, transition: { duration: 0.75, ease: [0.34, 1.56, 0.64, 1] } } : {}}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* ── Inner dashed ring ── */}
          <motion.circle cx="50" cy="50" r="37"
            fill="none" stroke="#c9a227" strokeWidth="0.5" strokeOpacity="0.3"
            strokeDasharray="3 3"
            initial={{ opacity: 0 }}
            animate={active('crescent') ? { opacity: 1, transition: { duration: 0.5 } } : {}}
          />

          {/* ── Crescent moon (gold with white highlight) ── */}
          {/* Rendered as outer circle fill, inner circle cuts out using evenodd */}
          <motion.path
            d="M 44,26 A 26,26 0 1,1 43.99,26.01 Z"
            fill="url(#cres-fill)"
            filter="url(#cres-glow)"
            clipPath="url(#crescent-clip)"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={active('crescent') ? {
              scale: 1, rotate: 0, opacity: 1,
              transition: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }
            } : {}}
            style={{ transformOrigin: '50px 50px' }}
          />
          {/* Inner circle to actually cut out the crescent */}
          <motion.circle cx="52" cy="48" r="21"
            fill="url(#cres-bg)"
            initial={{ scale: 0, opacity: 0 }}
            animate={active('crescent') ? {
              scale: 1, opacity: 1,
              transition: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }
            } : {}}
            style={{ transformOrigin: '52px 48px' }}
          />

          {/* ── 5-pointed star (white + glow) ── */}
          <motion.path
            d={STAR}
            fill="white"
            filter="url(#star-glow)"
            initial={{ scale: 0, rotate: -120, opacity: 0 }}
            animate={active('star') ? {
              scale: 1, rotate: 0, opacity: 1,
              transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
            } : {}}
            style={{ transformOrigin: '66px 38px' }}
          />
          {/* Gold star center accent */}
          <motion.path
            d={starPoints(66, 38, 4, 1.5)}
            fill="#c9a227"
            initial={{ opacity: 0 }}
            animate={active('star') ? { opacity: 1, transition: { duration: 0.3, delay: 0.2 } } : {}}
          />

          {/* ── Bottom label arc ── */}
          <path id="cres-arc-bot" d="M 16,58 A 38,38 0 0,0 84,58" fill="none" />
          <motion.text fill="#c9a227" fontSize="5.5" fontWeight="800" letterSpacing="1.6"
            initial={{ opacity: 0 }}
            animate={active('done') ? { opacity: 1, transition: { duration: 0.6, delay: 0.1 } } : {}}>
            <textPath href="#cres-arc-bot" startOffset="50%" textAnchor="middle">
              ✦ XISBIGA TALLAABADA ✦
            </textPath>
          </motion.text>
          <path id="cres-arc-top" d="M 18,43 A 36,36 0 0,1 82,43" fill="none" />
          <motion.text fill="#c9a227" fontSize="4.8" fontWeight="700" letterSpacing="2"
            initial={{ opacity: 0 }}
            animate={active('done') ? { opacity: 1, transition: { duration: 0.6, delay: 0.25 } } : {}}>
            <textPath href="#cres-arc-top" startOffset="50%" textAnchor="middle">
              SHACABKA · 2024 ·
            </textPath>
          </motion.text>
        </svg>

        {/* Pulse rings */}
        {pulse && [0, 0.75, 1.5].map(d => (
          <motion.span key={d}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1.5px solid #c9a227' }}
            initial={{ scale: 1, opacity: 0.45 }}
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
