'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { UserPlus, HandHeart, Megaphone, Vote, ArrowRight, Sparkles } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const actions = [
  {
    icon: UserPlus,
    color: 'from-gold/20 via-gold/8 to-transparent',
    border: 'border-gold/30',
    iconColor: 'text-gold',
    iconBg: 'bg-gold/15',
    glow: 'rgba(201,162,39,0.25)',
    href: '/join',
    en: { title: 'Become a Member', desc: 'Join 10,000+ Somalis who are already building the future. Registration is free and open to all.' },
    so: { title: 'Xubin Noqo', desc: 'Ku biir 10,000+ Soomaali oo horay uga jirta dhisidda mustaqbalka. Diiwaan-gelinta waa bilaash oo u furan dhammaan.' },
  },
  {
    icon: HandHeart,
    color: 'from-red-500/15 via-red-500/5 to-transparent',
    border: 'border-red-500/30',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15',
    glow: 'rgba(239,68,68,0.2)',
    href: '/volunteer',
    en: { title: 'Volunteer', desc: 'Give your time, skills, and energy to the movement. Every hour you contribute builds a stronger Somalia.' },
    so: { title: 'Iskaa Wax U Qabso', desc: 'Waqtigaaga, xirfadahaaga, iyo xoogaaga u hibi dhaqdhaqaaqa. Saac kasta oo aad ka shaqeyso waxay dhisaysaa Soomaali xooggan.' },
  },
  {
    icon: Megaphone,
    color: 'from-blue-500/15 via-blue-500/5 to-transparent',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
    glow: 'rgba(59,130,246,0.2)',
    href: '/contact',
    en: { title: 'Spread the Word', desc: 'Share our message with your community. Be an ambassador for change in your region and among your network.' },
    so: { title: 'Faafintu', desc: 'Farriintayada la wadaag bulshadaada. Ka noqo safiirada isbedelka gobolkaaga iyo shabakadaada.' },
  },
  {
    icon: Vote,
    color: 'from-green-500/15 via-green-500/5 to-transparent',
    border: 'border-green-500/30',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/15',
    glow: 'rgba(34,197,94,0.2)',
    href: '/niec',
    en: { title: 'Register to Vote', desc: 'Your vote is your voice. Make sure you are registered and encourage others in your community to do the same.' },
    so: { title: 'Codadkayga U Diiwangeeli', desc: 'Codkaagu waa codkaaga. Hubi inaad diiwaan-gasho oo ku dhiiri-geli kuwa kale bulshadaada.' },
  },
];

function TiltCard({ action, index, lang }: { action: typeof actions[0]; index: number; lang: 'en' | 'so' }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);
  const Icon = action.icon;
  const content = lang === 'en' ? action.en : action.so;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      <Link href={action.href}>
        <motion.div
          ref={ref}
          onMouseMove={handleMouse}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative h-full group cursor-pointer"
        >
          {/* Glow spotlight that follows mouse */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, ${action.glow}, transparent 60%)`,
            }}
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative h-full p-7 rounded-2xl bg-gradient-to-br ${action.color} border ${action.border} overflow-hidden`}
            style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.3)', transform: 'translateZ(0)' }}
          >
            {/* Shimmer line on hover */}
            <motion.div
              className="absolute top-0 left-[-100%] w-full h-full pointer-events-none opacity-0 group-hover:opacity-100"
              animate={{ left: ['−100%', '200%'] }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
            />

            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className={`w-14 h-14 rounded-2xl ${action.iconBg} flex items-center justify-center mb-5`}
              style={{ transform: 'translateZ(20px)' }}
            >
              <Icon size={26} className={action.iconColor} />
            </motion.div>

            {/* Text */}
            <div style={{ transform: 'translateZ(10px)' }}>
              <h3 className="text-white font-black text-lg mb-3">{content.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{content.desc}</p>
            </div>

            {/* CTA */}
            <motion.span
              className={`inline-flex items-center gap-2 text-sm font-bold ${action.iconColor} group-hover:gap-3 transition-all duration-200`}
              style={{ transform: 'translateZ(15px)' }}
            >
              {lang === 'en' ? 'Get started' : 'Bilow'}
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={15} />
              </motion.span>
            </motion.span>

            {/* Card number */}
            <div className="absolute bottom-4 right-5 text-white/5 font-black text-5xl leading-none select-none group-hover:text-white/10 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function GetInvolvedSection() {
  const { lang } = useLang();

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #060c1e 0%, #0a1128 50%, #060c1e 100%)' }}>

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '45px 45px' }} />

      {/* Large soft glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #c9a227, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-6"
          >
            <Sparkles size={12} className="text-gold animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">
              {lang === 'en' ? 'Take Action' : 'Tallaabso'}
            </span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
            {lang === 'en'
              ? <><span className="gradient-text-gold">Get Involved</span> Today</>
              : <>Maanta <span className="gradient-text-gold">Ka Qayb Qaado</span></>}
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg">
            {lang === 'en'
              ? 'Four ways you can help build a better Somalia — starting today.'
              : 'Afar hab oo aad ku caawin karto dhisidda Soomaaliya wanaagsan — maanta bilow.'}
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <motion.div
              animate={{ scaleX: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="h-px w-24 bg-gradient-to-r from-transparent to-gold/60"
            />
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <motion.div
              animate={{ scaleX: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="h-px w-24 bg-gradient-to-l from-transparent to-gold/60"
            />
          </div>
        </motion.div>

        {/* 3D Tilt cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, i) => (
            <TiltCard key={action.en.title} action={action} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
