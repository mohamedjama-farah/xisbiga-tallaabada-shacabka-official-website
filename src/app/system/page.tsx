'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/hooks/useLang';
import { Building2, Users, Scale, ChevronRight, MapPin, Info } from 'lucide-react';

const FEDERAL_BODIES = [
  {
    icon: Building2,
    color: '#c9a227',
    en: {
      title: 'President of Somalia',
      seats: '',
      desc: 'Elected by the Parliament (both houses combined) for a 4-year term. The President is head of state and appoints the Prime Minister.',
      role: 'Commander-in-Chief, sign legislation, represent Somalia internationally',
    },
    so: {
      title: 'Madaxweynaha Soomaaliya',
      seats: '',
      desc: 'Loo doortay Baarlamaanka (labada gole oo midaysan) xilli 4-sano ah. Madaxweynuhu waa madaxa dowladda wuxuuna magacaabayaa Ra\'iisul Wasaare.',
      role: 'Taliyaha Ciidanka, saxiixa sharciga, matalaadda Soomaaliya caalamka',
    },
  },
  {
    icon: Users,
    color: '#3b82f6',
    en: {
      title: 'Upper House — House of the People of the Federal Member States',
      seats: '54 seats',
      desc: 'Represents the interests of the six Federal Member States. Each state sends 9 senators regardless of population size. Senators serve 4-year terms.',
      role: 'Approve constitutional amendments, review federal laws, represent state interests',
    },
    so: {
      title: 'Golaha Sare — Golaha Shacabka Dowladaha Xubnaha Federaalka',
      seats: '54 kursi',
      desc: 'Waxay matashaa danaha Dowladaha Xubnaha Federaalka lix. Gobol kasta wuxuu dirayaa 9 xildhibaan oo aan loo eegin tirada dadka. Xildhibaanaddu waxay u adeegaan xilli 4-sano ah.',
      role: 'Ansixinta wax ka beddelista dastuurka, dib u eegista sharciyada federaalka, matalaadda danaha gobolka',
    },
  },
  {
    icon: Users,
    color: '#8b5cf6',
    en: {
      title: 'Lower House — House of the People',
      seats: '275 seats',
      desc: 'The main legislative body. Members are elected directly by Somali citizens (in theory — currently by clan elders under the 4.5 system). Serves 4-year terms.',
      role: 'Pass federal laws, approve national budget, vote of confidence for government',
    },
    so: {
      title: 'Golaha Hoose — Golaha Wakiilada',
      seats: '275 kursi',
      desc: 'Hay\'adda sharciga ee ugu weyn. Xubnaha si toos ah ayay u doortaan muwaadiniinta Soomaaliyeed (mabda\' ahaan — hadda odayaasha qabiilka ayaa dooraya nidaamka 4.5 hoos tiisa). Waxay u adeegaan xilli 4-sano ah.',
      role: 'Ansixinta sharciyada federaalka, ansixinta miisaaniyada qaranka, codkii kalsoonida ee dowladda',
    },
  },
];

const FEDERAL_STATES = [
  { name: 'Puntland', capital: 'Garowe', regions: 'Nugaal, Bari, Mudug (N)', color: '#c9a227' },
  { name: 'Galmudug', capital: 'Dhusamareb', regions: 'Galgaduud, Mudug (S)', color: '#3b82f6' },
  { name: 'Hirshabelle', capital: 'Jowhar', regions: 'Hiraan, Middle Shabelle', color: '#22c55e' },
  { name: 'South West State', capital: 'Baidoa', regions: 'Bay, Bakool, Lower Shabelle', color: '#f97316' },
  { name: 'Jubaland', capital: 'Kismayo', regions: 'Lower Juba, Middle Juba, Gedo', color: '#ef4444' },
  { name: 'Benadir', capital: 'Mogadishu', regions: 'Capital district — 17 districts', color: '#8b5cf6' },
];

const WHAT_XTS_WANTS = [
  {
    en: { title: 'Replace 4.5 with Direct Elections', desc: 'Every Somali aged 18+ votes directly for their MP. One person, one vote — as the constitution demands.' },
    so: { title: 'Ka Beddel 4.5 Doorashooyin Toos ah', desc: 'Soomaali kasta oo 18+ ah si toos ah ayuu u codeeya xildhibaankiisa. Hal qof, hal cod — sida dastuurku u dalbanayo.' },
  },
  {
    en: { title: 'Strengthen Federal Member States', desc: 'Give states more power over local education, health, and police — with real budgets and accountability to their citizens.' },
    so: { title: 'Xoojinta Dowladaha Xubnaha Federaalka', desc: 'Siiso dowladaha awood dheeraad ah oo waxbarasho maxalliga ah, caafimaadka, iyo booliiska — oo leh miisaaniyad dhabta ah iyo xisaabtanka muwaadiniintooda.' },
  },
  {
    en: { title: 'Transparent Budget', desc: 'Every shilling of federal revenue and expenditure published online monthly. Zero hidden deals.' },
    so: { title: 'Miisaaniyad Shafafan', desc: 'Shilin kasta oo dakhliga federaalka iyo kharashka bishiiba la daabicaa online. Eber heshiisyo qarsoodi ah.' },
  },
  {
    en: { title: 'Independent Judiciary', desc: 'Judges appointed by merit, not by clan or political connection. The Supreme Court independent of all political pressure.' },
    so: { title: 'Garsoorka Madaxbanaan', desc: 'Xukaamada loo magacaabo sharafta, ma aha qabiilka ama xiriirka siyaasadeed. Maxkamadda Sare oo ka madaxbanaanaan dhammaan cadaadiska siyaasadeed.' },
  },
];

export default function SystemPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Building2 size={13} />
            {lang === 'en' ? 'How Somalia Works' : 'Sida Soomaaliya u Shaqeyso'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? "Somalia's Political System Explained" : 'Nidaamka Siyaasadeed ee Soomaaliya oo Sharaxan'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'A simple, honest guide to how Somalia is governed — and what XTS wants to change to make it truly democratic.'
              : 'Hagid fudud oo daacad ah oo ku saabsan sida Soomaaliya loo maamullo — iyo waxa XTS u beddeli lahayd si ay runtii u noqoto dimuqraadi.'}
          </p>
        </motion.div>
      </div>

      {/* Federal Government Bodies */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-6">{lang === 'en' ? 'The Three Federal Bodies' : 'Saddexda Hay\'adood ee Federaalka'}</h2>
        <div className="space-y-4">
          {FEDERAL_BODIES.map((body, i) => {
            const Icon = body.icon;
            const content = body[lang];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${body.color}20`, border: `1px solid ${body.color}40` }}>
                    <Icon size={20} style={{ color: body.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-white">{content.title}</h3>
                      {content.seats && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${body.color}20`, color: body.color }}>
                          {content.seats}
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-2">{content.desc}</p>
                    <div className="flex items-start gap-2">
                      <Scale size={12} className="text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-white/40 text-xs">{lang === 'en' ? 'Role: ' : 'Doorka: '}{content.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How a law is passed */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-6">{lang === 'en' ? 'How a Law is Passed' : 'Sida Sharci Loo Ansixiyo'}</h2>
        <div className="flex flex-col md:flex-row gap-2">
          {[
            { step: 1, en: 'MP or Minister drafts a Bill', so: 'Xildhibaan ama Wasiir wuxuu qorayaa Sharciga' },
            { step: 2, en: 'Lower House debates & votes (simple majority)', so: 'Golaha Hoose wuxuu doodaa oo codeeya (cod-bixin fudud)' },
            { step: 3, en: 'Upper House reviews & approves', so: 'Golaha Sare wuxuu dib u eegaa oo ansixiyaa' },
            { step: 4, en: 'President signs into law (or vetoes)', so: 'Madaxweynuhu sharci ayuu ku saxiixaa (ama diiday)' },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex md:flex-col items-center gap-2 flex-1">
              <div className="flex md:flex-col items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-gold text-navy font-black text-sm flex items-center justify-center flex-shrink-0">
                  {s.step}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex-1 text-center">
                  <p className="text-white/70 text-xs leading-relaxed">{s[lang]}</p>
                </div>
              </div>
              {i < arr.length - 1 && <ChevronRight size={16} className="text-gold/40 flex-shrink-0 md:rotate-90" />}
            </div>
          ))}
        </div>
      </div>

      {/* Federal Member States */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-6">{lang === 'en' ? 'The Six Federal Member States' : 'Dowladaha Xubnaha Federaalka ee Lix'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEDERAL_STATES.map((state, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: state.color }} />
                <h3 className="font-bold text-white text-sm">{state.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                <MapPin size={10} className="text-gold" />
                <span>{lang === 'en' ? 'Capital: ' : 'Caasimadda: '}{state.capital}</span>
              </div>
              <p className="text-white/35 text-xs">{state.regions}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 bg-white/3 border border-white/8 rounded-xl p-3">
          <Info size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
          <p className="text-white/40 text-xs">
            {lang === 'en'
              ? 'North West (Somaliland) operates autonomously and has not joined the Federal Member State system. Talks are ongoing.'
              : 'Waqooyi-Galbeed (Somaliland) si madaxbanaan ayay u shaqeysaa mana ku biirin nidaamka Dowladaha Xubnaha Federaalka. Waxbarashooyinku way socdaan.'}
          </p>
        </div>
      </div>

      {/* The 4.5 Problem */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">{lang === 'en' ? 'The 4.5 Problem' : 'Dhibaatada 4.5'}</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {lang === 'en'
              ? 'Instead of direct elections, Somalia currently uses the "4.5 system" — the four major clan families each receive equal parliamentary seats, and smaller clans share a combined "0.5" share. This means:'
              : 'Halkii doorashooyinka tooska ah, Soomaaliya hadda waxay isticmaalaysaa "nidaamka 4.5" — afarta qoys qabiil ee waaweyn mid kasta waxay helayaan kuraasta baarlamaanka ee siman, qabiilada yar-yaruna waxay wadaagaan "0.5" wadaag midaysan. Tan macnaheedu waa:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { en: 'Your clan decides your political power, not your merit or your vote', so: 'Qabiilkaagu ayaa go\'aamiya awooda siyaasadeedaada, ma aha sharafta ama codkaaga' },
              { en: 'Minority clans get fraction of representation regardless of their numbers', so: 'Qabiilada yar-yar waxay helaan qaybta matalanta aysan loo eegin tiradooda' },
              { en: 'Clan elders — not citizens — choose MPs, cutting ordinary people out', so: 'Odayaasha qabiilka — ma aha muwaadiniintu — waxay dooranayaan xildhibaanadda, oo ka saarayaa dadka caadiga ah' },
              { en: 'Women and youth are systematically sidelined by clan gatekeepers', so: 'Haweenka iyo dhalinyaradu si nidaamsan ayay uga miro-dhaliyaan ilaasha qabiilka' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-500/8 rounded-lg p-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                <p className="text-white/60 text-xs">{item[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What XTS Wants */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-6">{lang === 'en' ? 'What XTS Will Change' : 'Waxa XTS Beddeli Doonto'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WHAT_XTS_WANTS.map((item, i) => {
            const content = item[lang];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-gold/20 transition-colors">
                <h3 className="font-bold text-white mb-2 text-sm">{content.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{content.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
