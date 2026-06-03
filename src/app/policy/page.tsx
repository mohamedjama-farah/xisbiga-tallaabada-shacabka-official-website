'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/hooks/useLang';
import {
  GraduationCap, Heart, Shield, Globe, Briefcase, Home,
  Users, Leaf, Scale, Wifi, ChevronRight
} from 'lucide-react';

const POLICIES = [
  {
    icon: GraduationCap,
    color: '#c9a227',
    en: { title: 'Education for All', summary: 'Free primary and secondary education nationwide. Build 500 new schools in rural areas by 2027. Fully fund university scholarships for top students regardless of clan or region.', points: ['Free primary & secondary schooling', 'Rural school construction program', 'University merit scholarships', 'Adult literacy campaign in Somali language', 'Teacher training & fair pay'] },
    so: { title: 'Waxbarasho Dadka Oo Dhan', summary: 'Waxbarasho bilaash ah oo xad-gudub la\'aanta ah. Dhis 500 dugsiyood oo cusub oo miyiga ah 2027 kahor. Bixinta deeqaha jaamacadda ee ardayda ugu wanaagsan ee aan loo eegi qabiilka ama gobolka.', points: ['Waxbarasho bilaash ah', 'Barnaamij dhismaha dugsiyada miyiga', 'Deeqaha jaamacadda ee sharafta leh', 'Ololaha aqoon-u-yeelashada dadka waaweyn', 'Tababarka macallimiinta iyo mushaharka xaq ah'] },
  },
  {
    icon: Heart,
    color: '#ef4444',
    en: { title: 'Healthcare', summary: 'A clinic within 10km of every Somali by 2028. Free maternal care and child vaccinations. Train 2,000 new doctors and nurses from within Somalia.', points: ['Clinic within 10km for every citizen', 'Free maternal & child health', 'National vaccination program', 'Train Somali doctors & nurses', 'Mental health services in every region'] },
    so: { title: 'Caafimaadka', summary: 'Xarun caafimaad 10km gudaheeda ah ee Soomaali kasta 2028 kahor. Daryeel haweeneed iyo tallaalka caruurta oo bilaash ah. Tababar 2,000 dhakhaatiir iyo kalkaaliyayaal cusub.', points: ['Xarun caafimaad 10km gudaheeda', 'Caafimaadka haweenka iyo caruurta oo bilaash', 'Barnaamijka tallaalka qaranka', 'Tababar dhakhaatiirta Soomaaliyeed', 'Adeegyada caafimaadka maskaxda'] },
  },
  {
    icon: Shield,
    color: '#3b82f6',
    en: { title: 'Security & Justice', summary: 'A professional, clan-blind national army and police. Independent courts free from political interference. Zero tolerance for corruption at every level of government.', points: ['Professional national security forces', 'Independent judiciary', 'Anti-corruption commission with real power', 'Community policing in every district', 'Prisoner rights & legal aid'] },
    so: { title: 'Amniga & Cadaaladda', summary: 'Ciidan iyo booliisnimo xirfad leh oo aan qabiilka loo eegi. Maxkamado madax-bannaan oo aan siyaasaddu ku faragelin. Eber-dulqaad musuqmaasuqa dhammaan heerarka dowladda.', points: ['Ciidammada amniga xirfad leh', 'Garsoorka madax-bannaan', 'Gudiga ka hortagga musuqmaasuqa oo awood leh', 'Booliska bulshada ee gobolkasta', 'Xuquuqda maxaabiista iyo caawinta sharciga'] },
  },
  {
    icon: Briefcase,
    color: '#10b981',
    en: { title: 'Economy & Jobs', summary: 'Create 100,000 jobs in 4 years. Support small businesses with micro-loans. Modernise agriculture and fishing to feed Somalia and export surplus.', points: ['100,000 new jobs by 2030', 'Micro-loan program for small businesses', 'Modern fishing industry investment', 'Agricultural modernisation', 'Special economic zones in port cities'] },
    so: { title: 'Dhaqaalaha & Shaqada', summary: 'Abuur 100,000 shaqo oo 4 sano gudahood. Taageero ganacsiyada yar-yar ee amaahda yar-yar. Casriyeynta beeraha iyo kalluumaaysiga si ay Soomaaliya u quudinaan oo ay ka dheeraataan.', points: ['100,000 shaqo cusub 2030 kahor', 'Barnaamijka amaahda yar-yar', 'Maalgashiga warshadda kalluumaaysiga', 'Casriyeynta beeraha', 'Goobaha dhaqaale-gaadhsiinta magaalooyinka xeebta'] },
  },
  {
    icon: Users,
    color: '#8b5cf6',
    en: { title: "Women's Rights", summary: 'Minimum 30% women in parliament and government positions. End gender-based violence with a dedicated national law. Equal pay and equal opportunity enshrined in law.', points: ['30% minimum women in parliament', 'National law against gender-based violence', 'Equal pay legislation', 'Women-led business support fund', 'Girls\' education priority program'] },
    so: { title: 'Xuquuqda Haweenka', summary: 'Ugu yaraan 30% haween ah ee baarlamaanka iyo xafiisyada dowladda. Dhammaad rabshadaha jinsiga ku saabsan ee sharci qaranka ah. Mushahar siman iyo fursad siman oo sharci ku dhisan.', points: ['30% haween ugu yaraan baarlamaanka', 'Sharciga qaranka ee ka dhanka ah rabshadaha jinsiga', 'Sharciga mushaarka la siman yahay', 'Sanduuqa taageerada ganacsiga haweenka', 'Barnaamijka mudnaanta waxbarashada gabdhaha'] },
  },
  {
    icon: Globe,
    color: '#f97316',
    en: { title: 'Diaspora Rights', summary: 'Dual citizenship for all Somali diaspora. Online voter registration so diaspora can vote in elections. A dedicated Diaspora Ministry to serve Somalis abroad.', points: ['Dual citizenship right', 'Online diaspora voter registration', 'Ministry of Diaspora Affairs', 'Diaspora investment incentives', 'Consular services in all diaspora cities'] },
    so: { title: 'Xuquuqda Masakinta', summary: 'Dhalashada laba-geesood ee dhammaan masakinta Soomaaliyeed. Diiwaangelinta cod-bixinta online si masakintu u codeeyaan doorashooyinka. Wasaarad u gaar ah adeegga Soomaalida dibedda.', points: ['Xuquuqda dhalashada laba-geesood', 'Diiwaangelinta cod-bixinta online', 'Wasaaradda Arrimaha Masakinta', 'Dhiirigelinta maalgashiga masakinta', 'Adeegyada qunsuliyadda magaalooyinka masakinta'] },
  },
  {
    icon: Home,
    color: '#06b6d4',
    en: { title: 'Housing & Infrastructure', summary: 'Build 50,000 affordable homes in urban areas. Paved roads connecting all regional capitals. Clean water and electricity for every town by 2030.', points: ['50,000 affordable homes', 'Roads connecting all regional capitals', 'Clean water for every town', 'Electricity for every town by 2030', 'Sanitation & waste management'] },
    so: { title: 'Guriyaha & Kaabayaasha', summary: 'Dhis 50,000 guryood oo qiimo jaban oo magaalooyinka. Wadooyinka gaadiidka oo xidha dhammaan caasimadaha gobolka. Biyo nadiif ah iyo korontada magaalada kasta 2030 kahor.', points: ['50,000 guryood oo qiimo jaban', 'Wadooyinka oo xidha caasimadaha gobolka', 'Biyo nadiif ah magaalada kasta', 'Koronto magaalada kasta 2030 kahor', 'Nadaafadda iyo maamulka qashinka'] },
  },
  {
    icon: Leaf,
    color: '#22c55e',
    en: { title: 'Environment', summary: 'Ban illegal charcoal export destroying our forests. Plant 10 million trees by 2030. Protect Somali coastline and marine resources from illegal foreign fishing.', points: ['Ban illegal charcoal export', 'Plant 10 million trees by 2030', 'Protect marine resources', 'Drought preparedness national plan', 'Solar energy in rural communities'] },
    so: { title: 'Deegaanka', summary: 'Mamnuucida dhoofinta dhuxusha sharci-darro ah ee kaymo-beelinta. Beer 10 milyan oo geed 2030 kahor. Ilaalinta xeebaha Soomaaliya iyo khayraadka badda ee kalluumaaysiga shisheeye ee sharci-darrada ah.', points: ['Mamnuucida dhoofinta dhuxusha sharci-darro', 'Beer 10 milyan oo geed 2030 kahor', 'Ilaalinta khayraadka badda', 'Qorshe qaranka diyaargarowga abaarta', 'Tamarta qoraxda bulshada miyiga'] },
  },
  {
    icon: Wifi,
    color: '#a855f7',
    en: { title: 'Technology & Youth', summary: 'Free internet in every school and public library. A national tech hub in Mogadishu to train 10,000 young coders. Digital government services to cut corruption and waiting times.', points: ['Free internet in all schools', 'National tech hub — 10,000 coders', 'Digital ID for every Somali', 'e-Government services', 'Youth innovation fund'] },
    so: { title: 'Tknoolajiyada & Dhalinyarada', summary: 'Internet bilaash ah dugsiyada iyo maktabadaha dadweynaha oo dhan. Xarun tknoolajiyad qaranka ah oo Muqdisho ku taal si ay 10,000 dhalinyaro oo code-yeeleyaal ah loo tababaro. Adeegyada dowladda ee dhijitaalka ah si loo yareeyo musuqmaasuqa iyo waqtiga sugitaanka.', points: ['Internet bilaash ah dugsiyada oo dhan', 'Xarun tknoolajiyad qaranka — 10,000 code-yeeleyaal', 'Aqoonsiga dhijitaalka ee Soomaali kasta', 'Adeegyada dowladda e-Government', 'Sanduuqa kacaanka dhalinyarada'] },
  },
  {
    icon: Scale,
    color: '#c9a227',
    en: { title: 'Clan Equality', summary: 'Abolish the 4.5 power-sharing system. Replace it with a one-person-one-vote democracy. Every citizen — regardless of clan — has equal standing in law and government.', points: ['End the 4.5 clan system', 'One person — one vote democracy', 'Equal rights for all clans in law', 'Anti-discrimination legislation', 'National unity reconciliation program'] },
    so: { title: 'Sinnaanta Qabiilka', summary: 'Baabbi\'inta nidaamka wadaagga awooda 4.5. Ka beddel dimuqraadiyad hal-qof-hal-cod ah. Muwaadin kasta — qabiilkiisa ha noqdee — wuu leeyahay xaq siman sharciga iyo dowladda.', points: ['Dhammaadka nidaamka qabiilka 4.5', 'Hal qof — hal cod dimuqraadiyad', 'Xuquuq siman qabiilada oo dhan sharciga', 'Sharciga ka hortagga takoorka', 'Barnaamijka heshiisiinta midnimada qaranka'] },
  },
];

function PolicyCard({ policy, lang, index }: { policy: typeof POLICIES[0]; lang: 'en' | 'so'; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = policy.icon;
  const content = policy[lang];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:bg-white/8 group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${policy.color}20`, border: `1px solid ${policy.color}40` }}>
          <Icon size={22} style={{ color: policy.color }} />
        </div>
        <h3 className="text-lg font-bold text-white pt-1">{content.title}</h3>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-4">{content.summary}</p>
      <ul className="space-y-2">
        {content.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/50">
            <ChevronRight size={14} className="flex-shrink-0 mt-0.5" style={{ color: policy.color }} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function PolicyPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Scale size={13} />
            {lang === 'en' ? 'Our Platform' : 'Qorshahayaga'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'XTS Policy Platform' : 'Qorshaha Siyaasadeed ee XTS'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Ten clear commitments to every Somali citizen. No vague promises — concrete plans with measurable goals.'
              : 'Toban ballanqaad oo cad oo Soomaali kasta loo qaatay. Ballanno aan muuqan — qorshe cad oo yoolal la cabiraa ku leh.'}
          </p>
        </motion.div>
      </div>

      {/* Policies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POLICIES.map((policy, i) => (
            <PolicyCard key={i} policy={policy} lang={lang} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 mt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-10"
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            {lang === 'en' ? 'Stand Behind This Platform' : 'Taage Qorshahan'}
          </h2>
          <p className="text-white/60 mb-6">
            {lang === 'en' ? 'Join XTS and help make these policies a reality for Somalia.' : 'Ku biir XTS oo ka caawi in qorshahan Soomaaliya loogu hirgaliyo.'}
          </p>
          <a
            href="/join"
            className="inline-block px-8 py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold/90 transition-all"
          >
            {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
