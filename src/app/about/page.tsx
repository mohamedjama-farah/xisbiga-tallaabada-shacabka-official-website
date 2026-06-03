'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';
import { Target, Eye, Flag } from 'lucide-react';

const pillars = [
  {
    icon: Target,
    en: { title: 'Our Mission', text: 'To build a democratic, prosperous, and united Somalia where every citizen has equal opportunities and their rights are protected by law.' },
    so: { title: 'Hadafkeenna', text: 'In la dhiso Soomaali dimuqraadiyad leh, horumaraysa, oo mideysan halka muwaadin kasta ay fursad siman u leeyihiin xuquuqdoodna sharciga ayaa difaacinaya.' },
  },
  {
    icon: Eye,
    en: { title: 'Our Vision', text: 'A Somalia where education, healthcare, infrastructure and rule of law are the foundations of a thriving society for all generations.' },
    so: { title: 'Aragtidayada', text: 'Soomaali waxbarasho, caafimaad, kaabayaal iyo xukun-xeerku ay yihiin aasaaska bulshada oo dhammaan jiilalka u barwaaqasanaysa.' },
  },
  {
    icon: Flag,
    en: { title: 'Our Pledge', text: 'We pledge transparency, accountability, and servant leadership — putting the needs of the Somali people above all else.' },
    so: { title: 'Ballanqaadkayaga', text: 'Waxaan ballanqaadaynaa wax-sheegidda, xisaabtanka, iyo hoggaaminta adeegida — baahida shacabka Soomaaliyeed ayaan ka hor dhigeynaa wax kale.' },
  },
];

export default function AboutPage() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-[#0a1128] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <svg viewBox="0 0 100 100" className="w-28 h-28">
                <circle cx="50" cy="50" r="48" fill="#1a2454" stroke="#c9a227" strokeWidth="3" />
                <path d="M28 50 A22 22 0 1 0 28 50.5 A14 14 0 1 1 28 50Z" fill="#c9a227" />
                <polygon points="52,16 42,54 50,54 38,84 62,46 54,46" fill="#dc2626" />
                <text x="56" y="70" fontSize="13" fontWeight="900" fill="white" fontFamily="Georgia,serif">XTS</text>
              </svg>
            </motion.div>
          </div>
          <p className="text-gold tracking-widest text-sm uppercase font-semibold mb-3">
            {lang === 'en' ? 'Who We Are' : 'Cidda Aan Nahay'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">{t('about.title', lang)}</h1>
          <p className="text-white/60 text-xl max-w-3xl mx-auto leading-relaxed">
            {t('about.missionText', lang)}
          </p>
          <div className="mt-8 w-24 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            const content = lang === 'en' ? p.en : p.so;
            return (
              <motion.div
                key={p.en.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl bg-white/5 border border-gold/20 hover:border-gold/40 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                  <Icon size={28} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{content.title}</h3>
                <p className="text-white/60 leading-relaxed">{content.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-gold/20 rounded-3xl p-10"
        >
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            {lang === 'en' ? 'Our Story' : 'Taariikhdeena'}
          </h2>
          <div className="space-y-8">
            {[
              { year: '2025', en: 'XTS founded by a group of dedicated Somali activists and intellectuals with a shared vision.', so: 'XTS waxaa aasaasay koox dhaqdhaqaaqleyaal iyo aqoonyahannada Soomaaliyeed oo aragtida wadaagta ah.' },
              { year: '2025', en: 'First regional offices opened across Somalia, growing our grassroots network.', so: 'Xafiisyada gobolka ee ugu horreeya ayaa laga furay dalka Soomaaliya, tamarta hoose ee shabakadayadu waa kobtay.' },
              { year: '2026', en: 'Nationwide membership drive launched, welcoming thousands of new members.', so: 'Mashruuca xubnaha ee qaranka oo dhan ayaa la bilaabay, uguna soo dhowaynay kumaan xubo oo cusub.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy font-black text-sm shrink-0">
                    {item.year}
                  </div>
                  {i < 2 && <div className="w-0.5 h-8 bg-gold/30 mt-2" />}
                </div>
                <p className="text-white/70 leading-relaxed pt-3">
                  {lang === 'en' ? item.en : item.so}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
