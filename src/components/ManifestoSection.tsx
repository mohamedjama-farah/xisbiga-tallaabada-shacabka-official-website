'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const pillars = [
  {
    num: '01',
    en: { title: 'Democracy & Rule of Law', points: ['Free & fair elections', 'Independent judiciary', 'Press freedom & civil liberties'] },
    so: { title: 'Dimuqraadiyad & Xukun-Xeer', points: ['Doorasho xor ah & caddaalad leh', 'Maxkamad madax-bannaan', 'Xorriyaadka saxaafadda & xuquuqda madaniga'] },
  },
  {
    num: '02',
    en: { title: 'Economic Development', points: ['Job creation & entrepreneurship', 'Foreign investment attraction', 'Support for small businesses'] },
    so: { title: 'Horumarka Dhaqaale', points: ['Abuuridda shaqo & ganacsiga', 'Jiitidda maalgashiga shisheeye', 'Taageridda ganacsiyada yaryar'] },
  },
  {
    num: '03',
    en: { title: 'Education & Health', points: ['Free primary education', 'Universal healthcare access', 'Modern hospitals & schools'] },
    so: { title: 'Waxbarasho & Caafimaad', points: ['Waxbarasho bilaash ah oo hoose', 'Helitaanka caafimaadka guud', 'Cisbitaallada & dugsiyada casriga ah'] },
  },
  {
    num: '04',
    en: { title: 'Security & Stability', points: ['End of clan conflicts', 'Strengthening national army', 'Counter-terrorism strategy'] },
    so: { title: 'Amniga & Xaaladda Xasilloon', points: ['Dhamaadka colaadaha qabiilka', 'Xoojinta ciidanka qaranka', 'Istaraatiijiyada la-dagaallanka argagixisada'] },
  },
];

export default function ManifestoSection() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-28 bg-[#080f28] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-5"
        style={{ background: 'linear-gradient(to left, #c9a227, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <BookOpen size={20} className="text-gold" />
              </div>
              <span className="text-gold text-sm font-bold tracking-widest uppercase">
                {lang === 'en' ? 'Our Platform' : 'Barnaamijkayaga'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              {lang === 'en' ? (
                <>A Clear Vision<br />for <span className="text-gold">Somalia&apos;s Future</span></>
              ) : (
                <>Aragtida Cad<br /><span className="text-gold">Mustaqbalka Soomaaliya</span></>
              )}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              {lang === 'en'
                ? 'XTS is built on four unshakeable pillars that address the most critical needs of the Somali people. Every policy we propose is backed by research, community consultation, and a genuine commitment to progress.'
                : 'XTS waxaa lagu dhisay afar tiir oo aan la ruxin karin oo ka jawaabaya baahiyaha ugu muhiimsan ee shacabka Soomaaliyeed. Dhammaan siyaasadaha aan soo jeedinayno waxaa taageera cilmi-baadhistu, la-tashaashiga bulshooyinka, iyo ballan-qaadka dhabta ah ee horumarka.'}
            </p>
            <Link href="/manifesto">
              <motion.span
                whileHover={{ scale: 1.04, x: 4 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy font-black rounded-full cursor-pointer text-lg"
              >
                {lang === 'en' ? 'Read Full Manifesto' : 'Akhri Qorshaha Oo Dhan'}
                <ArrowRight size={20} />
              </motion.span>
            </Link>
          </motion.div>

          {/* Right — pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((p, i) => {
              const content = lang === 'en' ? p.en : p.so;
              return (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                  whileHover={{ y: -5, borderColor: 'rgba(201,162,39,0.5)' }}
                  className="p-6 rounded-2xl bg-white/4 border border-gold/10 transition-colors duration-300"
                >
                  <div className="text-gold/30 font-black text-3xl mb-3">{p.num}</div>
                  <h3 className="text-white font-bold text-base mb-3">{content.title}</h3>
                  <ul className="space-y-2">
                    {content.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-white/50 text-xs">
                        <CheckCircle2 size={13} className="text-gold/60 shrink-0 mt-0.5" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
