'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/hooks/useLang';

const itemsEn = [
  '🇸🇴 Justice For All Somalis',
  '⚡ 500,000 New Jobs',
  '🏫 Free Education For Every Child',
  '💧 Clean Water For Every Region',
  '🕊️ Peace Through Unity',
  '🗳️ Register To Vote',
  '🌍 Somalia Rising',
  '✊ People First — Always',
  '📢 Join The Movement',
  '❤️ Xisbiga Tallaabada Shacabka',
];

const itemsSo = [
  '🇸🇴 Cadaalad Shacabka Dhamaan',
  '⚡ 500,000 Shaqo Cusub',
  '🏫 Waxbarasho Bilaash Ah',
  '💧 Biyo Nadiif Ah Gobol Kasta',
  '🕊️ Nabad Midnimo Lagu Helo',
  '🗳️ Diiwangelinta Codaynta',
  '🌍 Soomaaliya Kacaysaa',
  '✊ Shacabka Horta — Markasta',
  '📢 Ku Biir Dhaqdhaqaaqa',
  '❤️ Xisbiga Tallaabada Shacabka',
];

export default function MarqueeTicker() {
  const { lang } = useLang();
  const items = lang === 'en' ? itemsEn : itemsSo;
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-3 bg-gold/[0.06] border-y border-gold/15 z-10">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #040b1c, transparent)' }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #040b1c, transparent)' }} />

      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="text-gold/80 text-xs font-bold tracking-[0.18em] uppercase">{item}</span>
            <span className="text-gold/25 text-xs">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
