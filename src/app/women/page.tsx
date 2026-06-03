'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/hooks/useLang';
import { Heart, Star, Scale, Users, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

const PILLARS = [
  {
    icon: Scale,
    color: '#c9a227',
    en: { title: 'Political Representation', desc: 'XTS commits to a minimum 30% women in all elected and appointed positions. We are pushing to raise this to full equality. Women must have an equal voice in building Somalia.' },
    so: { title: 'Wakaaladda Siyaasadeed', desc: 'XTS waxay ballanqaatay ugu yaraan 30% haween ah dhammaan xafiisyada la doortay iyo la magacaabay. Waxaan u diriraysaa in tan la kor u qaado sinnaanta buuxda. Haweenku waa in ay leeyihiin cod siman ee dhisidda Soomaaliya.' },
  },
  {
    icon: BookOpen,
    color: '#ec4899',
    en: { title: 'Education & Skills', desc: 'Girls education is non-negotiable. XTS will prioritise girls in rural schools, fund female university scholarships, and open professional training for women in every region.' },
    so: { title: 'Waxbarashada & Xirfadaha', desc: 'Waxbarashada gabdhaha ma jirto wax laga wadahadlo. XTS waxay mudaneyneysaa gabdhaha dugsiyada miyiga, maalgeliso deeqaha jaamacadda ee haweenka, oo furto tababarka xirfadaha ee haweenka gobol kasta.' },
  },
  {
    icon: Heart,
    color: '#ef4444',
    en: { title: 'Protection from Violence', desc: 'A national law against gender-based violence with real consequences. Shelters and legal aid for survivors in every region. Police training to properly handle GBV cases.' },
    so: { title: 'Ilaalinta Rabshadaha', desc: 'Sharci qaranka ah oo ka dhanka ah rabshadaha jinsiga leh natiijooyinkiisa dhabta ah. Guryo gargaar ah iyo caawinta sharciga ee badbaaduhu gobol kasta. Tababarka booliska si saxda ah u maamula kiisaska GBV.' },
  },
  {
    icon: Star,
    color: '#f97316',
    en: { title: 'Economic Independence', desc: 'A dedicated fund for women-led businesses. Micro-loans without clan gatekeeping. Land rights for women formally recognised in Somali law.' },
    so: { title: 'Xornimada Dhaqaale', desc: 'Sanduuq u gaar ah ganacsiyada haweenka hogaaminaysa. Amaahda yar-yar oo aan lahayn xidhiidhka qabiilka. Xuquuqda dhulka ee haweenka oo si rasmi ah loo aqoonsan yahay sharciga Soomaaliyeed.' },
  },
  {
    icon: Users,
    color: '#8b5cf6',
    en: { title: 'Community Leadership', desc: 'Women have always led Somali communities informally. XTS formalises this — village councils, district boards, and regional governments must include women in leadership.' },
    so: { title: 'Hogaaminta Bulshada', desc: 'Haweenku had iyo jeer ayay si cidla ah hogaamiyan bulshooyinka Soomaaliyeed. XTS waxay si rasmi ah u dhigtaa — golayaasha tuulooyinka, guddiyada degmooyinka, iyo dowladaha goboladdu waa inay ku daraan haweenka hogaaminta.' },
  },
];

const QURAN_VERSE = {
  arabic: 'وَالْمُؤْمِنُونَ وَالْمُؤْمِنَاتُ بَعْضُهُمْ أَوْلِيَاءُ بَعْضٍ يَأْمُرُونَ بِالْمَعْرُوفِ وَيَنْهَوْنَ عَنِ الْمُنكَرِ',
  transliteration: 'Wal-mu\'minoona wal-mu\'minaatu ba\'duhum awliyaa\'u ba\'din, ya\'muroona bil-ma\'roofi wa yanhawna \'anil-munkar.',
  ref: 'At-Tawbah • 9:71',
  en: '"The believing men and believing women are allies of one another. They enjoin what is right and forbid what is wrong."',
  so: '"Ragga mu\'mineen iyo haweenka mu\'mineenku waxay saaxiibo wada yihiin midba midka kale. Waxay amraan waxa wanaagsan waxayna ka waaniyaan waxa xun."',
};

const HADITH = {
  arabic: 'إِنَّمَا النِّسَاءُ شَقَائِقُ الرِّجَالِ',
  transliteration: 'Innamal-nisaa\'u shaqaa\'iqur-rijaal.',
  ref: 'Abu Dawud — Sahih',
  en: '"Women are the full siblings (equals) of men."',
  so: '"Haweenku waa walaalaha la mid ah ragga."',
};

const GOALS = [
  { en: '30% minimum women in parliament — pushing for 50%', so: '30% haween ugu yaraan baarlamaanka — waxaan u diriraysaa 50%' },
  { en: 'Women\'s courts and legal aid in every region', so: 'Maxkamadaha haweenka iyo caawinta sharciga gobol kasta' },
  { en: 'Free maternal healthcare for all Somali women', so: 'Daryeelka caafimaadka haweenka oo bilaash ah Soomaalida oo dhan' },
  { en: 'Equal inheritance rights under Somali national law', so: 'Xuquuqda dhaxalka la siman ee sharciga qaranka Soomaaliyeed' },
  { en: '1,000 women leadership scholarships by 2028', so: '1,000 deeqo hogaaminta haweenka 2028 kahor' },
  { en: 'End FGM through education and legal reform', so: 'Dhammaadka FGM waxbarasho iyo dib u habaynta sharciga iyaga loo marayo' },
];

export default function WomenPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Heart size={13} />
            {lang === 'en' ? "Women's Wing" : 'Goobta Haweenka'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? "Somali Women — Leaders, Not Bystanders" : 'Haweenka Soomaaliyeed — Hogaaminayaasha, Ma Aha Ilbaxnimada'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'For too long, Somali women have been sidelined from formal politics. XTS is changing this. Half of Somalia is women — they must have half the power.'
              : 'Waa muddo dheer haweenka Soomaaliyeed oo ka miro-dhaliyey siyaasadda rasmiga ah. XTS waxay bedesheysaa kan. Soomaaliya koodeedii waa haween — waa in ay leeyihiin xoogga koodeedii.'}
          </p>
        </motion.div>
      </div>

      {/* Islamic Foundation */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 rounded-2xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-white">{lang === 'en' ? 'Our Islamic Foundation' : 'Aasaaskeenna Islaamiga'}</h2>

          {/* Quran verse */}
          <div className="space-y-3">
            <p className="text-right text-xl leading-loose text-gold font-arabic">{QURAN_VERSE.arabic}</p>
            <p className="text-white/50 text-sm italic">{QURAN_VERSE.transliteration}</p>
            <p className="text-white/80 text-sm">{lang === 'en' ? QURAN_VERSE.en : QURAN_VERSE.so}</p>
            <p className="text-gold/60 text-xs font-semibold">{QURAN_VERSE.ref}</p>
          </div>

          <hr className="border-white/10" />

          {/* Hadith */}
          <div className="space-y-3">
            <p className="text-right text-lg leading-loose text-gold/80 font-arabic">{HADITH.arabic}</p>
            <p className="text-white/50 text-sm italic">{HADITH.transliteration}</p>
            <p className="text-white/80 text-sm">{lang === 'en' ? HADITH.en : HADITH.so}</p>
            <p className="text-gold/60 text-xs font-semibold">{HADITH.ref}</p>
          </div>
        </div>
      </div>

      {/* Five Pillars */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          {lang === 'en' ? 'Five Pillars of XTS Women\'s Policy' : 'Shanta Tiir ee Siyaasadda Haweenka ee XTS'}
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

      {/* Specific Goals */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-6">{lang === 'en' ? 'Concrete Goals by 2030' : 'Yoolalka Cad 2030 Kahor'}</h2>
        <div className="space-y-3">
          {GOALS.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5"
            >
              <CheckCircle2 size={16} className="text-pink-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70 text-sm">{goal[lang]}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 rounded-2xl p-10"
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            {lang === 'en' ? 'Are You a Somali Woman Ready to Lead?' : 'Ma Tahay Haween Soomaaliyeed oo Diyaar u ah Hogaaminta?'}
          </h2>
          <p className="text-white/60 mb-6">
            {lang === 'en' ? 'Join XTS and be part of Somalia\'s women-led political change.' : 'Ku biir XTS oo ka qayb noqo isbeddelka siyaasadeed ee haweenka hogaaminaya Soomaaliya.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/join" className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-all">
              {lang === 'en' ? 'Join the Women\'s Wing' : 'Ku Biir Goobta Haweenka'}
            </a>
            <a href="/contact" className="px-8 py-3 border border-white/20 text-white font-bold rounded-full hover:border-white/40 transition-all">
              {lang === 'en' ? 'Contact Us' : 'Nala Xiriir'}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
