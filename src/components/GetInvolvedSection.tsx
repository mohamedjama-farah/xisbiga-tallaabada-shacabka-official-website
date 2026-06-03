'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, HandHeart, Megaphone, Vote, ArrowRight } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const actions = [
  {
    icon: UserPlus,
    color: 'from-gold/20 to-gold/5',
    border: 'border-gold/30',
    iconColor: 'text-gold',
    href: '/join',
    en: { title: 'Become a Member', desc: 'Join 10,000+ Somalis who are already building the future. Registration is free and open to all.' },
    so: { title: 'Xubin Noqo', desc: 'Ku biir 10,000+ Soomaali oo horay uga jirta dhisidda mustaqbalka. Diiwaan-gelinta waa bilaash oo u furan dhammaan.' },
  },
  {
    icon: HandHeart,
    color: 'from-red-500/10 to-transparent',
    border: 'border-red-500/20',
    iconColor: 'text-red-400',
    href: '/volunteer',
    en: { title: 'Volunteer', desc: 'Give your time, skills, and energy to the movement. Every hour you contribute builds a stronger Somalia.' },
    so: { title: 'Iskaa Wax U Qabso', desc: 'Waqtigaaga, xirfadahaaga, iyo xoogaaga u hibi dhaqdhaqaaqa. Saac kasta oo aad ka shaqeyso waxay dhisaysaa Soomaali xooggan.' },
  },
  {
    icon: Megaphone,
    color: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    href: '/contact',
    en: { title: 'Spread the Word', desc: 'Share our message with your community. Be an ambassador for change in your region and among your network.' },
    so: { title: 'Faafintu', desc: 'Farriintayada la wadaag bulshadaada. Ka noqo safiirada isbedelka gobolkaaga iyo shabakadaada.' },
  },
  {
    icon: Vote,
    color: 'from-green-500/10 to-transparent',
    border: 'border-green-500/20',
    iconColor: 'text-green-400',
    href: '/join',
    en: { title: 'Register to Vote', desc: 'Your vote is your voice. Make sure you are registered and encourage others in your community to do the same.' },
    so: { title: 'Codadkayga U Diiwangeeli', desc: 'Codkaagu waa codkaaga. Hubi inaad diiwaan-gasho oo ku dhiiri-geli kuwa kale bulshadaada.' },
  },
];

export default function GetInvolvedSection() {
  const { lang } = useLang();

  return (
    <section className="py-28 bg-gradient-to-b from-[#0a1128] to-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)',
          backgroundSize: '45px 45px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-widest text-sm uppercase font-bold mb-3">
            {lang === 'en' ? 'Take Action' : 'Tallaabso'}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            {lang === 'en' ? 'Get Involved Today' : 'Maanta Ka Qayb Qaado'}
          </h2>
          <div className="mt-5 w-20 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, i) => {
            const Icon = action.icon;
            const content = lang === 'en' ? action.en : action.so;
            return (
              <motion.div
                key={action.en.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link href={action.href}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`h-full p-7 rounded-2xl bg-gradient-to-br ${action.color} border ${action.border} cursor-pointer group transition-all duration-300`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={26} className={action.iconColor} />
                    </div>
                    <h3 className="text-white font-black text-lg mb-3">{content.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-5">{content.desc}</p>
                    <span className="flex items-center gap-2 text-gold text-sm font-bold group-hover:gap-3 transition-all">
                      {lang === 'en' ? 'Get started' : 'Bilow'}
                      <ArrowRight size={15} />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
