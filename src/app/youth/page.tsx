'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/hooks/useLang';
import { Zap, GraduationCap, Wifi, Music, Briefcase, Users, CheckCircle2, Star } from 'lucide-react';

const PILLARS = [
  {
    icon: GraduationCap,
    color: '#3b82f6',
    en: { title: 'Education Access', desc: 'Free university education for every Somali aged 18–25 who qualifies. No clan, no region — only merit. XTS will build 3 new universities in underserved regions.' },
    so: { title: 'Helitaanka Waxbarashada', desc: 'Waxbarasho jaamacadeed bilaash ah ee Soomaali kasta da\'da 18–25 oo xaq u leh. Qabiil la\'aan, gobol la\'aan — sharafta kaliya. XTS waxay dhisan doontaa 3 jaamacadood oo cusub gobollo aan adeeg lahayn.' },
  },
  {
    icon: Briefcase,
    color: '#22c55e',
    en: { title: 'Jobs & Entrepreneurship', desc: 'A national youth employment fund: apprenticeships, business seed grants, and skills training. 50,000 youth jobs in 4 years — real jobs, not promises.' },
    so: { title: 'Shaqada & Ganacsiga', desc: 'Sanduuqa shaqada dhalinyarada qaranka: bartilmaameedyada, deeqaha abuurka ganacsiga, iyo tababarka xirfadaha. 50,000 shaqo oo dhalinyaro ah 4 sano — shaqooyin runta ah, ballanno ma aha.' },
  },
  {
    icon: Wifi,
    color: '#a855f7',
    en: { title: 'Tech & Innovation', desc: 'Somalia\'s youth are tech-savvy. XTS will open coding bootcamps in 10 cities, fund a national start-up accelerator, and give free internet to every student.' },
    so: { title: 'Tknoolajiyada & Hal-Abuurka', desc: 'Dhalinyarada Soomaaliya waxay fahamsan yihiin tknoolajiyada. XTS waxay furi doontaa bootcamp-yada coding ee 10 magaalo, maalgeliso xarun kor-u-qaadista bilow-ganacsiyada qaranka, oo siiso internet bilaash ah ardayda oo dhan.' },
  },
  {
    icon: Users,
    color: '#f97316',
    en: { title: 'Political Inclusion', desc: 'Lower the age for political candidacy to 21. Reserve 20% of all government positions for Somalis aged 18–35. Young people must help build the Somalia they will inherit.' },
    so: { title: 'Lug-qaadashada Siyaasadeed', desc: 'Hoos u dhig da\'da musharaxnimada siyaasadeed ilaa 21. Kaydi 20% dhammaan xafiisyada dowladda Soomaalida da\'da 18–35. Dhalinyaradu waa in ay ka gacan seeyaan dhisidda Soomaaliya ee ay dhaxal qaadan doonaan.' },
  },
  {
    icon: Music,
    color: '#ec4899',
    en: { title: 'Arts & Culture', desc: 'Somali culture is rich and beautiful. XTS will fund youth cultural centers, music and poetry programs, and protect Somali language in a digital age.' },
    so: { title: 'Fanka & Dhaqanka', desc: 'Dhaqanka Soomaaliyeed wuxuu aad u ballaaranyahay oo qurux badan. XTS waxay maalgelin doontaa xarumaha dhaqanka dhalinyarada, barnaamijyada muusikada iyo maansooyinka, oo ilaaliso luqadda Soomaaliga xilliga dhijitaalka.' },
  },
  {
    icon: Star,
    color: '#c9a227',
    en: { title: 'Sports & Health', desc: 'Build public sports facilities in every district. A national youth sports league. Free mental health support for young Somalis — trauma and displacement are real.' },
    so: { title: 'Ciyaaraha & Caafimaadka', desc: 'Dhis xarumaha ciyaaraha dadweynaha degmo kasta. Xulashadda ciyaaraha dhalinyarada ee qaranka. Taageerada caafimaadka maskaxda oo bilaash ah dhalinyarada Soomaaliyeed — dhaawacyada iyo qaxootigu waa xaqiiq.' },
  },
];

const STATS = [
  { value: '70%', en: 'of Somalia\'s population is under 30', so: 'dad Soomaaliya ka yar yahay 30 jir' },
  { value: '1M+', en: 'young Somalis currently unemployed', so: 'dhalinyaro Soomaali ah oo hadda shaqo la\'a' },
  { value: '30%', en: 'youth literacy rate in rural areas', so: 'heerka waxbarasho dhalinyarada miyiga' },
  { value: '0', en: 'dedicated youth ministries in Somalia today', so: 'wasaaraddo u gaar ah dhalinyarada Soomaaliya maanta' },
];

const COMMITMENTS = [
  { en: 'Youth Advisory Council with direct access to party leadership', so: 'Guddi la-taliye dhalinyarada oo si toos ah ula xidha hoggaanka xisbiga' },
  { en: 'Minimum 25% youth in XTS candidate lists', so: 'Ugu yaraan 25% dhalinyaro listaska musharaxiinta XTS' },
  { en: 'Annual National Youth Forum — Mogadishu', so: 'Goob-wadaagga Dhalinyarada ee Qaranka sannad kasta — Muqdisho' },
  { en: 'Monthly youth town halls in all 18 regions', so: 'Shirarka bulshada dhalinyarada bishiiba dhammaan 18 gobol' },
  { en: 'Online youth platform for feedback and ideas', so: 'Barnaamijka online ee dhalinyarada ee jawaab-celinta iyo fikradaha' },
];

export default function YouthPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Zap size={13} />
            {lang === 'en' ? 'Youth Wing' : 'Goobta Dhalinyarada'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? "Somalia's Future Starts With Its Youth" : 'Mustaqbalka Soomaaliya Wuxuu Ka Bilaabmayaa Dhalinyaradeedu'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? '70% of Somalis are under 30. The old politics has failed them. XTS is the first Somali party to put youth at the centre of its platform — not as an afterthought, but as the foundation.'
              : '70% Soomaaliyeed waxay ka yar yihiin 30 jir. Siyaasadda hore waxay ku guul daraysatay. XTS waa xisbigii ugu horeeyay ee Soomaaliyeed ee dhiga dhalinyarada bartamaha qorshihiisa — ma aha ficil dambe, laakiin aasaas.'}
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
            >
              <div className="text-3xl font-black text-gold mb-1">{stat.value}</div>
              <div className="text-white/50 text-xs leading-tight">{stat[lang]}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Six Pillars */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          {lang === 'en' ? 'Six Pillars for Somali Youth' : 'Lixda Tiir ee Dhalinyarada Soomaaliyeed'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            const content = pillar[lang];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="p-3 rounded-xl w-fit mb-4" style={{ background: `${pillar.color}20`, border: `1px solid ${pillar.color}40` }}>
                  <Icon size={20} style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{content.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{content.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Commitments */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-6">{lang === 'en' ? 'How XTS Includes Youth Directly' : 'Sida XTS si Toos ah Ugu Darto Dhalinyarada'}</h2>
        <div className="space-y-3">
          {COMMITMENTS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5"
            >
              <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70 text-sm">{c[lang]}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-10"
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            {lang === 'en' ? 'Are You 18–35? Somalia Needs You.' : 'Ma Jirtaa 18–35? Soomaaliya Waxay Ku Baahan Tahay.'}
          </h2>
          <p className="text-white/60 mb-6">
            {lang === 'en' ? 'Join XTS Youth Wing and help build the Somalia your generation deserves.' : 'Ku biir Goobta Dhalinyarada XTS oo ka caawi dhisidda Soomaaliya ee jiilkaagu layaabka u leh.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/join" className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-all">
              {lang === 'en' ? 'Join Youth Wing' : 'Ku Biir Goobta Dhalinyarada'}
            </a>
            <a href="/volunteer" className="px-8 py-3 border border-white/20 text-white font-bold rounded-full hover:border-white/40 transition-all">
              {lang === 'en' ? 'Volunteer' : 'Iska Volunteerso'}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
