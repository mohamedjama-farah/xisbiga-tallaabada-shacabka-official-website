'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Shield, Users, Zap, Scale, Leaf, Droplets, GraduationCap, HeartPulse, Waves, Sword } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const issues = [
  {
    icon: Shield, num: '01',
    gradient: 'from-red-500/15 via-red-500/5 to-transparent',
    border: 'border-red-500/25 hover:border-red-500/50',
    glow: 'shadow-red-500/10',
    iconBg: 'bg-red-500/15 text-red-400',
    bar: 'bg-red-500',
    en: { title: 'Security Crisis', stat: '70% ungoverned', desc: 'Al-Shabaab terrorism and clan conflicts claim thousands of lives yearly. XTS will professionalize the military, strengthen communities, and build lasting peace.' },
    so: { title: 'Xaaladda Amniga', stat: '70% la\'aangovernaan', desc: 'Argagixisada Al-Shabaab iyo colaadaha qabiilku waxay baabi\'inayaan kumaan naf. XTS waxay xirfadeyn doontaa ciidanka oo raadin doontaa nabad.' },
  },
  {
    icon: Zap, num: '02',
    gradient: 'from-yellow-500/15 via-yellow-500/5 to-transparent',
    border: 'border-yellow-500/25 hover:border-yellow-500/50',
    glow: 'shadow-yellow-500/10',
    iconBg: 'bg-yellow-500/15 text-yellow-400',
    bar: 'bg-yellow-500',
    en: { title: 'Youth Unemployment', stat: '67% jobless', desc: '67% of Somali youth are unemployed, driving instability and desperation. XTS will create 500,000 jobs through infrastructure, technology and vocational training.' },
    so: { title: 'Shaqo-la\'aanta Dhalinyarada', stat: '67% shaqo la\'a', desc: '67% dhalinyarada Soomaaliyeed ayaa shaqo la\'a. XTS waxay 500,000 shaqo abuuraysaa iyada oo loo marayo kaabayaasha iyo teknoolojiyada.' },
  },
  {
    icon: Waves, num: '03',
    gradient: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
    border: 'border-cyan-500/25 hover:border-cyan-500/50',
    glow: 'shadow-cyan-500/10',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    bar: 'bg-cyan-500',
    en: { title: 'Mediterranean Deaths', stat: '1000s die yearly', desc: 'Thousands of Somali youth risk and lose their lives crossing the Mediterranean Sea each year. XTS will build real opportunity at home so no one must flee.' },
    so: { title: 'Dhimashada Badda', stat: 'Kumaan sanad kasta', desc: 'Kumaan dhalinyaro Soomaaliyeed ayaa Badda Medditerranean ku geeriya sanad kasta. XTS waxay fursado ka dhisi doontaa gudaha si cidna u baaqayn badda.' },
  },
  {
    icon: Users, num: '04',
    gradient: 'from-orange-500/15 via-orange-500/5 to-transparent',
    border: 'border-orange-500/25 hover:border-orange-500/50',
    glow: 'shadow-orange-500/10',
    iconBg: 'bg-orange-500/15 text-orange-400',
    bar: 'bg-orange-500',
    en: { title: 'Refugee & IDP Crisis', stat: '3.8M displaced', desc: '3.8 million Somalis are internally displaced — the world\'s longest-running displacement crisis. XTS will rebuild destroyed towns and resettle every family.' },
    so: { title: 'Qaxootiga & Barakacayaasha', stat: '3.8M barakacay', desc: '3.8 milyan Soomaali ayaa barakacay. XTS waxay dib u dhisi doontaa tuulooyinka burburay oo dib u dejin doontaa qoys kasta.' },
  },
  {
    icon: Sword, num: '05',
    gradient: 'from-slate-500/15 via-slate-500/5 to-transparent',
    border: 'border-slate-500/25 hover:border-slate-500/50',
    glow: 'shadow-slate-500/10',
    iconBg: 'bg-slate-500/15 text-slate-300',
    bar: 'bg-slate-400',
    en: { title: 'Army & Defense', stat: 'Critically weak', desc: 'Somalia\'s military lacks training, equipment and pay — soldiers defect to militias. XTS will build a professional, well-equipped national army.' },
    so: { title: 'Ciidanka & Difaaca', stat: 'Aad u daciif', desc: 'Ciidanka Soomaaliya wuxuu ka maqanyahay tababar iyo qalab. XTS waxay dhisi doontaa ciidan xirfadleh oo wanaagsan.' },
  },
  {
    icon: Droplets, num: '06',
    gradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
    border: 'border-blue-500/25 hover:border-blue-500/50',
    glow: 'shadow-blue-500/10',
    iconBg: 'bg-blue-500/15 text-blue-400',
    bar: 'bg-blue-500',
    en: { title: 'Water & Famine', stat: '5M food insecure', desc: 'Millions lack clean water and food security. XTS will build irrigation networks, support farmers and establish strategic food reserves to end hunger.' },
    so: { title: 'Biyo & Abaar', stat: '5M cunto la\'aan', desc: 'Malaayin ka maqan yihiin biyo nadiif ah. XTS waxay dhisi doontaa nidaamyada waraabinta oo dhamayn doontaa gaajada.' },
  },
  {
    icon: GraduationCap, num: '07',
    gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
    border: 'border-amber-500/25 hover:border-amber-500/50',
    glow: 'shadow-amber-500/10',
    iconBg: 'bg-amber-500/15 text-amber-400',
    bar: 'bg-amber-500',
    en: { title: 'Education Gap', stat: 'Only 30% finish school', desc: 'Only 30% of Somali children complete primary school. XTS will build schools in every district, train teachers and make quality education completely free.' },
    so: { title: 'Farqiga Waxbarashada', stat: '30% oo kaliya', desc: '30% carruurta Soomaaliyeed oo kaliya ayaa dhameeysa dugsiga. XTS waxay dugsiyada ku dhisi doontaa degmo kasta oo waxbarasho bilaash ka dhigi doontaa.' },
  },
  {
    icon: HeartPulse, num: '08',
    gradient: 'from-pink-500/15 via-pink-500/5 to-transparent',
    border: 'border-pink-500/25 hover:border-pink-500/50',
    glow: 'shadow-pink-500/10',
    iconBg: 'bg-pink-500/15 text-pink-400',
    bar: 'bg-pink-500',
    en: { title: 'Healthcare Crisis', stat: 'World\'s worst rates', desc: 'Somalia has the world\'s highest maternal & child mortality. XTS will build hospitals in all regions, train 10,000 healthcare workers and provide free care.' },
    so: { title: 'Xaaladda Caafimaadka', stat: 'Heerka ugu xun', desc: 'Soomaaliya waxay leedahay dhimashada hooyadda ugu sarreysa adduunka. XTS waxay cisbitaallada ku dhisi doontaa dhammaan gobollada.' },
  },
  {
    icon: Leaf, num: '09',
    gradient: 'from-green-500/15 via-green-500/5 to-transparent',
    border: 'border-green-500/25 hover:border-green-500/50',
    glow: 'shadow-green-500/10',
    iconBg: 'bg-green-500/15 text-green-400',
    bar: 'bg-green-500',
    en: { title: 'Climate Change', stat: 'Severe droughts', desc: 'Somalia faces devastating droughts, floods and desertification. XTS will invest in reforestation, water management and climate-resilient agriculture.' },
    so: { title: 'Isbedelka Cimilada', stat: 'Abaaro xooggan', desc: 'Soomaaliya waxay la kulantaa abaaro, daad iyo baadiyoobis. XTS waxay maalgelin doontaa dib u habaynta kaynta iyo maaraynta biyaha.' },
  },
  {
    icon: Scale, num: '10',
    gradient: 'from-purple-500/15 via-purple-500/5 to-transparent',
    border: 'border-purple-500/25 hover:border-purple-500/50',
    glow: 'shadow-purple-500/10',
    iconBg: 'bg-purple-500/15 text-purple-400',
    bar: 'bg-purple-500',
    en: { title: 'Corruption & Injustice', stat: '$1B lost yearly', desc: 'Corruption costs Somalia over $1 billion annually. XTS will establish independent anti-corruption courts, transparent budgets and full citizen oversight.' },
    so: { title: 'Musuqmaasuq & Xaq-darro', stat: '$1B sanad kasta', desc: 'Musuqmaasuqku wuxuu Soomaaliya kacsi ka dhigaa over $1 bilyan sanad kasta. XTS waxay aasaasi doontaa maxkamadaha musuqmaasuqa u madaxbannaan.' },
  },
];

export default function ValuesSection() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #040b1c 0%, #070e24 50%, #040b1c 100%)' }}>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(201,162,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #c9a227, transparent 70%)' }} />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} className="text-center mb-20">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">
              {lang === 'en' ? "Somalia's Challenges — Our Commitment" : 'Caqabadaha Soomaaliya — Ballanqaadkayaga'}
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-tight">
            {lang === 'en' ? <>We Will Fix <span className="text-gold">These 10 Issues</span></> : <>10 Arrimood <span className="text-gold">Ayaan Saxaynaynaa</span></>}
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto text-lg">
            {lang === 'en'
              ? 'These are the real crises facing Somalia today. XTS has a concrete, funded plan for every single one.'
              : 'Kuwani waa dhibaatooyinka dhabta ah ee Soomaaliya maanta. XTS waxay leedahay qorshe dhab ah oo ku saabsan mid kastaba.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-2 h-2 rounded-full bg-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </motion.div>

        {/* Issue cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {issues.map((issue, i) => {
            const Icon = issue.icon;
            const content = lang === 'en' ? issue.en : issue.so;
            const isHovered = hovered === i;

            return (
              <motion.div
                key={issue.num}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className={`relative p-5 rounded-2xl border bg-gradient-to-b ${issue.gradient} ${issue.border} backdrop-blur-sm cursor-default transition-all duration-300 group ${isHovered ? `shadow-xl ${issue.glow}` : ''}`}
              >
                {/* Issue number */}
                <div className="absolute top-4 right-4 text-white/10 font-black text-2xl leading-none select-none group-hover:text-white/20 transition-colors">
                  {issue.num}
                </div>

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${issue.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>

                {/* Stat badge */}
                <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2.5 ${issue.iconBg} uppercase tracking-wide`}>
                  {content.stat}
                </div>

                {/* Title */}
                <h3 className="text-white font-black text-sm mb-2 leading-snug">{content.title}</h3>

                {/* Description */}
                <p className="text-white/50 text-[11px] leading-relaxed">{content.desc}</p>

                {/* Bottom accent bar */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl ${issue.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
