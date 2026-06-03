'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

const crisisStats = [
  {
    value: 3900000, suffix: '', prefix: '',
    en: 'Somalis Displaced', so: 'Barakacay',
    source: 'UNHCR 2024',
    color: 'text-orange-300',
    barColor: 'bg-orange-400',
    glowColor: 'rgba(251,146,60,0.3)',
    icon: '🏕️',
    pct: 78,
  },
  {
    value: 714390, suffix: '+', prefix: '',
    en: 'Refugees in Africa', so: 'Qaxooti Afrika',
    source: 'UNHCR 2024',
    color: 'text-blue-300',
    barColor: 'bg-blue-400',
    glowColor: 'rgba(96,165,250,0.3)',
    icon: '🌍',
    pct: 55,
  },
  {
    value: 2333, suffix: '', prefix: '',
    en: 'Med. Deaths in 2024', so: 'Dhimashada Badda',
    source: 'IOM 2024',
    color: 'text-red-300',
    barColor: 'bg-red-400',
    glowColor: 'rgba(248,113,113,0.3)',
    icon: '⚠️',
    pct: 90,
  },
  {
    value: 67, suffix: '%', prefix: '',
    en: 'Youth Unemployment', so: 'Shaqo-la\'aan Dhalinyarada',
    source: 'World Bank 2024',
    color: 'text-yellow-300',
    barColor: 'bg-yellow-400',
    glowColor: 'rgba(250,204,21,0.3)',
    icon: '📊',
    pct: 67,
  },
];

function Counter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 2400;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #060c1e 0%, #0f1e3d 50%, #060c1e 100%)' }}>

      {/* Animated diagonal lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a227 0px, #c9a227 1px, transparent 1px, transparent 60px)',
        }}
      />

      {/* Sweep shimmer */}
      <motion.div
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        className="absolute inset-y-0 w-1/3 pointer-events-none skew-x-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.05), transparent)' }}
      />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/8 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-xs font-bold tracking-widest uppercase">
              {lang === 'en' ? 'Crisis Reality — Verified Data' : 'Xaqiiqda Dhibaatada — Xog La Xaqiijiyey'}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            {lang === 'en'
              ? <>Why Somalia <span className="gradient-text-gold">Needs Change Now</span></>
              : <>Sababta Soomaaliya <span className="gradient-text-gold">Isbedel U Baahan</span></>}
          </h2>
        </motion.div>

        {/* Stat cards — bold horizontal bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {crisisStats.map((stat, i) => (
            <motion.div
              key={stat.en}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative p-6 rounded-2xl glass border border-white/8 hover:border-white/15 group transition-all duration-300 overflow-hidden cursor-default"
              style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glowColor}, transparent 70%)` }}
              />

              <div className="relative flex items-start gap-4">
                {/* Emoji icon */}
                <div className="text-3xl mt-1 select-none">{stat.icon}</div>

                <div className="flex-1 min-w-0">
                  {/* Big number */}
                  <div className={`text-3xl sm:text-4xl font-black mb-1 ${stat.color} tabular-nums`}>
                    <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>

                  {/* Label */}
                  <div className="text-white font-bold text-sm mb-3">{lang === 'en' ? stat.en : stat.so}</div>

                  {/* Animated progress bar */}
                  <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${stat.barColor}`}
                      initial={{ width: '0%' }}
                      animate={inView ? { width: `${stat.pct}%` } : {}}
                      transition={{ delay: i * 0.12 + 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  {/* Source */}
                  <div className="text-white/25 text-[10px] uppercase tracking-wider mt-2">{stat.source}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* XTS Response banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative glass-gold rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden"
        >
          <motion.div
            animate={{ x: ['−100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.08), transparent)' }}
          />
          <div className="flex items-center gap-3">
            <TrendingUp size={22} className="text-gold shrink-0" />
            <div>
              <div className="text-gold font-black text-base">
                {lang === 'en' ? 'XTS has a concrete solution for every crisis above.' : 'XTS waxay leedahay xal dhab ah dhibaato kasta.'}
              </div>
              <div className="text-white/40 text-sm mt-0.5">
                {lang === 'en' ? 'Read our full policy platform — 10 crises, 10 funded plans.' : 'Akhri qorshayaga siyaasadeed — 10 dhibaato, 10 qorshe.'}
              </div>
            </div>
          </div>
          <Link href="/policy">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(201,162,39,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-black text-sm rounded-full shrink-0 shadow-lg cursor-pointer"
            >
              {lang === 'en' ? 'See Our Plans' : 'Arag Qorshaheena'}
              <ArrowRight size={15} />
            </motion.span>
          </Link>
        </motion.div>

        {/* Link to data page */}
        <div className="text-center mt-8">
          <Link href="/data"
            className="inline-flex items-center gap-2 text-white/30 hover:text-gold text-xs font-semibold tracking-widest uppercase transition-colors group">
            {lang === 'en' ? 'View all verified sources' : 'Arag dhammaan ilaha xaqiijisan'}
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
