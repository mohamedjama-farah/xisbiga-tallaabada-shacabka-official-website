'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Calendar, ChevronDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

const STATES = [
  {
    key: 'puntland',
    nameEn: 'Puntland State',
    nameSo: 'Dowladda Puntland',
    capital: 'Garowe',
    regions: ['Nugaal', 'Mudug', 'Bari', 'Sool (partial)', 'Sanaag (partial)'],
    population: '~3.9 million',
    color: 'gold',
    colorClass: 'text-gold border-gold/30 bg-gold/10',
    dot: 'bg-gold',
    descEn: 'Puntland is a semi-autonomous state in northeast Somalia. XTS is working to build a strong network across Nugaal, Bari, and Mudug regions to represent the people of the northeast.',
    descSo: 'Puntland waa gobol xukumaad ah oo hoosaadka waqooyiga bari ee Soomaaliya. XTS waxay shaqeynaysaa dhisidda shabakad xoog leh oo ku fidsan gobollada Nugaal, Bari, iyo Mudug si loogu mataleeyo dadka waqooyiga bari.',
    contactEn: 'Puntland Regional Office — Contact through national office',
    contactSo: 'Xafiiska Gobolka Puntland — La xiriir xafiiska qaran',
    priorities: {
      en: ['Fishing industry development', 'Port of Bosaso modernization', 'Security in Sool and Sanaag', 'Youth employment'],
      so: ['Horumarka warshadaha kalluumeysiga', 'Casrinimadda dekedda Boosaaso', 'Amniga Sool iyo Sanaag', 'Shaqaynta dhalinyarada'],
    },
  },
  {
    key: 'jubaland',
    nameEn: 'Jubaland State',
    nameSo: 'Dowladda Jubbaland',
    capital: 'Kismayo',
    regions: ['Lower Juba', 'Middle Juba', 'Gedo'],
    population: '~2.5 million',
    color: 'green-400',
    colorClass: 'text-green-400 border-green-400/30 bg-green-400/10',
    dot: 'bg-green-400',
    descEn: 'Jubaland covers southern Somalia including the strategic port city of Kismayo. XTS prioritizes economic development, agriculture, and security stabilization in this region.',
    descSo: 'Jubbaland waxay ku jirtaa koonfurta Soomaaliya oo ay ku jirto magaalada dekedda ee muhiimka ah ee Kismaayo. XTS waxay u mudnaanshaha siisaa horumarka dhaqaale, beeraha, iyo xasillinta amniga gobolkan.',
    contactEn: 'Jubaland Regional Office — Kismayo',
    contactSo: 'Xafiiska Gobolka Jubbaland — Kismaayo',
    priorities: {
      en: ['Port of Kismayo development', 'Agricultural revival (Juba River)', 'Refugee resettlement support', 'Counter-extremism'],
      so: ['Horumarka dekedda Kismaayo', 'Soo celinta beeraha (Webiiga Jubba)', 'Taageerada dib u dejinta qaxootiga', 'Lidka xagjirnimada'],
    },
  },
  {
    key: 'southwest',
    nameEn: 'South West State',
    nameSo: 'Dowladda Koonfur Galbeed',
    capital: 'Baidoa',
    regions: ['Bay', 'Bakool', 'Lower Shabelle'],
    population: '~3.5 million',
    color: 'blue-400',
    colorClass: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    dot: 'bg-blue-400',
    descEn: 'South West State is Somalia\'s breadbasket — Bay and Bakool are agricultural heartlands. XTS focuses on drought response, food security, and connecting rural communities to government services.',
    descSo: 'Dowladda Koonfur Galbeed waa xaruunta dhaqaale ee Soomaaliya — Bay iyo Bakool waa dhul beereed muhiim ah. XTS waxay xoogga saartaa ka jawaabista abaarta, amniga cuntada, iyo xiriirinta bulshada miyiga ah xafiisyada dowladda.',
    contactEn: 'South West Regional Office — Baidoa',
    contactSo: 'Xafiiska Gobolka Koonfur Galbeed — Baydhabo',
    priorities: {
      en: ['Famine and drought response', 'Irrigation and farming support', 'Roads connecting Bay and Bakool', 'Primary education access'],
      so: ['Ka jawaabista abaarta', 'Taageerada biyoshubidda iyo beeraha', 'Wadooyinka xidha Bay iyo Bakool', 'Helitaanka waxbarashada hoose'],
    },
  },
  {
    key: 'hirshabelle',
    nameEn: 'Hirshabelle State',
    nameSo: 'Dowladda Hirshabelle',
    capital: 'Jowhar',
    regions: ['Hiraan', 'Middle Shabelle'],
    population: '~2.2 million',
    color: 'purple-400',
    colorClass: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    dot: 'bg-purple-400',
    descEn: 'Hirshabelle borders Mogadishu and is strategically vital for the capital\'s security and food supply. XTS has a significant volunteer base in Hiraan region.',
    descSo: 'Hirshabelle waxay xudduud la leedahay Muqdisho waxayna muhiim u tahay amni iyo sahayda cuntada ee caasimadda. XTS waxay leedahay saldhig weyn oo gudoomiyayaasha ah gobolka Hiraan.',
    contactEn: 'Hirshabelle Office — Jowhar',
    contactSo: 'Xafiiska Hirshabelle — Jawhar',
    priorities: {
      en: ['Beledweyne flood management', 'Middle Shabelle security', 'Youth radicalisation prevention', 'Livestock trade routes'],
      so: ['Maaraynta daadka Beledweyne', 'Amniga Shabeellaha Dhexe', 'Ka hortagga in lagu jiheysiiyo dhalinyarada', 'Jidadka ganacsiga xoolaha'],
    },
  },
  {
    key: 'galmudug',
    nameEn: 'Galmudug State',
    nameSo: 'Dowladda Galmudug',
    capital: 'Dhusamareb',
    regions: ['Mudug (south)', 'Galguduud'],
    population: '~1.8 million',
    color: 'orange-400',
    colorClass: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    dot: 'bg-orange-400',
    descEn: 'Galmudug sits at the heart of Somalia geographically. XTS is focused on clan reconciliation, pastoralist community support, and building state institutions in Galguduud and Mudug.',
    descSo: 'Galmudug waxay ku taal bartamaha Soomaaliya juquraafiyeed ahaan. XTS waxay xoogga saartaa dib u heshiisiinta qabiilka, taageerada bulshada reer miyi ah, iyo dhisidda hay\'adaha dowladda Galguduud iyo Mudug.',
    contactEn: 'Galmudug Office — Dhusamareb',
    contactSo: 'Xafiiska Galmudug — Dhuusomareeb',
    priorities: {
      en: ['Inter-clan reconciliation', 'Nomadic pastoralist rights', 'Road from Dhusamareb to coast', 'Healthcare in rural areas'],
      so: ['Dib u heshiisiinta qabiilada', 'Xuquuqda reer guuraa', 'Wadada Dhuusomareeb ilaa xeebta', 'Daryeelka caafimaadka ee miyiga'],
    },
  },
  {
    key: 'banadir',
    nameEn: 'Banadir Region (Mogadishu)',
    nameSo: 'Gobolka Banaadir (Muqdisho)',
    capital: 'Mogadishu',
    regions: ['16 districts of Mogadishu'],
    population: '~3.4 million',
    color: 'red-400',
    colorClass: 'text-red-400 border-red-400/30 bg-red-400/10',
    dot: 'bg-red-400',
    descEn: 'Banadir is the capital and the political, economic, and cultural heart of Somalia. It is not a federal member state but a directly administered region. XTS has its national headquarters in Mogadishu.',
    descSo: 'Banaadir waa caasimadda iyo wadnaha siyaasadeed, dhaqaale, iyo dhaqanka Soomaaliya. Maaha dowlad xubin ah laakiin waa gobol si toos ah loo maareeyo. XTS waxay leedahay xafiiskiisa qaran ee Muqdisho.',
    contactEn: 'XTS National HQ — Mogadishu, Banadir',
    contactSo: 'Xafiiska Qaran ee XTS — Muqdisho, Banaadir',
    priorities: {
      en: ['Urban security and police reform', 'Affordable housing crisis', 'Mogadishu port revenue transparency', 'IDP camp integration'],
      so: ['Amniga magaalada iyo dib u habeynta booliska', 'Xaaladda guriyaysiinta ee miisaanka ah', 'Daahfurnaanta dakhliga dekedda Muqdisho', 'Isdhexgalka xerada barakacyaasha'],
    },
  },
];

export default function StatesPage() {
  const { lang } = useLang();
  const [active, setActive] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <MapPin size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Federal Member States' : 'Dowladaha Xubnaha Federaalka'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'XTS Across Somalia' : 'XTS Soomaaliya Oo Dhan'}
          </h1>
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            {lang === 'en'
              ? 'XTS operates in all federal member states and Banadir. Click each state to see our local priorities, contact, and candidates.'
              : 'XTS waxay ka shaqeysaa dhammaan dowladaha xubnaha federaalka iyo Banaadir. Guji gobol kasta si aad u aragto mudnaanshahayaga maxalliga ah, xiriirka, iyo musharaxiinta.'}
          </p>
        </div>

        {/* State cards */}
        <div className="space-y-4">
          {STATES.map((state, i) => (
            <motion.div key={state.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`border rounded-2xl overflow-hidden transition-all ${active === state.key ? 'border-white/20 bg-white/4' : 'border-white/8 bg-white/2 hover:border-white/14'}`}>

              {/* Header row */}
              <button onClick={() => setActive(active === state.key ? null : state.key)}
                className="w-full flex items-center gap-4 p-5 text-left">
                <div className={`w-3 h-3 rounded-full ${state.dot} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-bold text-base">
                      {lang === 'en' ? state.nameEn : state.nameSo}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${state.colorClass}`}>
                      {state.capital}
                    </span>
                    <span className="text-white/30 text-xs">{state.population}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {state.regions.map(r => (
                      <span key={r} className="text-white/30 text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
                <ChevronDown size={16} className={`text-white/30 transition-transform shrink-0 ${active === state.key ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {active === state.key && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 grid sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                          {lang === 'en' ? state.descEn : state.descSo}
                        </p>
                        <div className="flex items-center gap-2 text-white/30 text-xs">
                          <MapPin size={12} />
                          <span>{lang === 'en' ? state.contactEn : state.contactSo}</span>
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${state.colorClass.split(' ')[0]}`}>
                          {lang === 'en' ? 'Our Priorities' : 'Mudnaanshahayaga'}
                        </p>
                        <ul className="space-y-2">
                          {(lang === 'en' ? state.priorities.en : state.priorities.so).map((p, pi) => (
                            <li key={pi} className="flex items-start gap-2 text-white/60 text-xs">
                              <span className={`mt-1 w-1.5 h-1.5 rounded-full ${state.dot} shrink-0`} />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="px-5 pb-4 flex gap-3">
                      <Link href={`/candidates?state=${encodeURIComponent(state.nameEn)}`}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${state.colorClass} hover:opacity-80 transition-opacity`}>
                        <Users size={12} />
                        {lang === 'en' ? 'View Candidates' : 'Arag Musharaxiinta'}
                      </Link>
                      <Link href="/contact"
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 transition-all">
                        <ExternalLink size={12} />
                        {lang === 'en' ? 'Contact This Office' : 'La Xiriir Xafiiskan'}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Join CTA */}
        <div className="mt-12 text-center bg-white/3 border border-white/8 rounded-2xl p-8">
          <p className="text-white font-bold mb-1">
            {lang === 'en' ? 'Represent Your State in XTS' : 'Ka Wakiil Gobolkaaga XTS Gudihiisa'}
          </p>
          <p className="text-white/40 text-sm mb-5">
            {lang === 'en'
              ? 'Join as a member or volunteer in your state. We are building in every region.'
              : 'Ku biir xubin ahaan ama gudoomiye gobolkaaga. Waxaan ka dhisaynaa gobol kasta.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/join" className="px-5 py-2.5 bg-gold text-navy font-black rounded-full hover:bg-gold/90 transition-colors text-sm">
              {lang === 'en' ? 'Join XTS' : 'Ku Biir XTS'}
            </Link>
            <Link href="/volunteer" className="px-5 py-2.5 bg-white/8 text-white font-bold rounded-full hover:bg-white/12 transition-colors text-sm border border-white/15">
              {lang === 'en' ? 'Volunteer in Your State' : 'Ka Yeel Gudoomiye Gobolkaaga'}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
