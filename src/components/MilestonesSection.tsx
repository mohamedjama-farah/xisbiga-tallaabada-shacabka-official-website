'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Calendar, MapPin, FileSignature, Heart } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

interface Stats { members: number; volunteers: number; events: number; petitionSigs: number; regions: number; }

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || target === 0) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function MilestonesSection() {
  const { lang } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/milestones').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const items = stats ? [
    { icon: Users,          en: 'Approved Members',   so: 'Xubnaha La Aqbaalay',   value: stats.members,      color: 'text-gold',        bg: 'bg-gold/10',        border: 'border-gold/20' },
    { icon: Heart,          en: 'Active Volunteers',  so: 'Gudoomiyayaasha',        value: stats.volunteers,   color: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400/20' },
    { icon: Calendar,       en: 'Events Held',        so: 'Dhacdooyinka',           value: stats.events,       color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20' },
    { icon: FileSignature,  en: 'Petition Signatures',so: 'Saxiixyo',               value: stats.petitionSigs, color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/20' },
    { icon: MapPin,         en: 'Regions Active',     so: 'Gobollada Firfircoon',   value: stats.regions,      color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20' },
  ] : [];

  return (
    <section className="py-16 bg-[#080f22] border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-gold text-xs font-black uppercase tracking-widest mb-2">
            {lang === 'en' ? 'XTS in Numbers' : 'XTS Tirooyin Ahaan'}
          </p>
          <h2 className="text-3xl font-black text-white">
            {lang === 'en' ? 'Our Growth — Live' : 'Kobacaynaheenna — Toos'}
          </h2>
          <p className="text-white/40 text-sm mt-2">
            {lang === 'en' ? 'These numbers update in real-time as our movement grows.' : 'Tiradani waxay si toos ah u cusboonaysaa markii dhaqdhaqaaqu kobcayo.'}
          </p>
        </div>

        {!stats ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`${item.bg} border ${item.border} rounded-2xl p-5 text-center`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={18} className={item.color} />
                  </div>
                  <div className={`text-3xl font-black mb-1 ${item.color}`}>
                    <Counter target={item.value} suffix={item.value >= 1000 ? '' : ''} />
                  </div>
                  <p className="text-white/50 text-xs leading-tight">
                    {lang === 'en' ? item.en : item.so}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
