'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const crisisStats = [
  { value: 3900000, suffix: '', en: 'Somalis Displaced', so: 'Barakacay', source: 'UNHCR 2024', color: 'text-orange-300' },
  { value: 714390,  suffix: '+', en: 'Refugees in Africa', so: 'Qaxooti Afrika', source: 'UNHCR 2024', color: 'text-blue-300' },
  { value: 2333,    suffix: '', en: 'Med. Deaths in 2024', so: 'Dhimashada Badda', source: 'IOM 2024', color: 'text-red-300' },
  { value: 33,      suffix: '%', en: 'Youth Unemployment', so: 'Shaqo-la\'aan', source: 'World Bank 2024', color: 'text-yellow-300' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 2200;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  const { lang } = useLang();

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2454 50%, #0a1628 100%)' }}>
      {/* Shimmer sweep */}
      <motion.div animate={{ x: ['-120%', '220%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        className="absolute inset-y-0 w-1/4 skew-x-12 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.07), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-white/40 text-xs font-semibold tracking-widest uppercase">
            {lang === 'en' ? 'Real data — verified UN & World Bank sources' : 'Xog dhabta ah — ilaha rasmiga ah UN & Bangiga Adduunka'}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {crisisStats.map((stat, i) => (
            <motion.div key={stat.en}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/25 transition-all duration-300 group">
              <div className={`text-3xl sm:text-4xl font-black mb-1 ${stat.color}`}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white font-bold text-sm mb-1">{lang === 'en' ? stat.en : stat.so}</div>
              <div className="text-white/30 text-[10px] uppercase tracking-wider">{stat.source}</div>
            </motion.div>
          ))}
        </div>

        {/* Link to data page */}
        <div className="text-center mt-10">
          <Link href="/data"
            className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-sm font-semibold transition-colors group">
            {lang === 'en' ? 'See full verified breakdown with all sources' : 'Arag xogta buuxda oo xaqiijisan oo leh dhammaan ilaha'}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
