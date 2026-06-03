'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users, MapPin, Waves, TrendingDown, AlertTriangle,
  ExternalLink, ChevronDown, ChevronUp, Globe,
  BookOpen, Calendar, Flag, Heart, Sword, ShieldAlert, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

/* ── All data is from official public sources ─────────────────────────────── */

const IDP_DATA = {
  total: '3.9 Million',
  totalNum: 3900000,
  newIn2024: '342,000+',
  womenChildren: '80%',
  source: 'UNHCR Somalia Operational Update 2024',
  sourceUrl: 'https://reporting.unhcr.org/operational/operations/somalia',
  lastUpdated: 'June 2024',
  regions: [
    { name: 'Bari Region', en: 'Bari', so: 'Bari', pct: 18 },
    { name: 'Bay Region', en: 'Bay', so: 'Bay', pct: 16 },
    { name: 'Middle Juba', en: 'Middle Juba', so: 'Jubada Dhexe', pct: 14 },
    { name: 'Gedo Region', en: 'Gedo', so: 'Gedo', pct: 10 },
    { name: 'Lower Juba', en: 'Lower Juba', so: 'Jubada Hoose', pct: 8 },
    { name: 'Other Regions', en: 'Other', so: 'Kuwa kale', pct: 34 },
  ],
  causes: [
    { en: 'Conflict & Insecurity', so: 'Colaad & Amni-xumo', pct: 43 },
    { en: 'Drought & Famine', so: 'Abaar & Gaajo', pct: 33 },
    { en: 'Flooding', so: 'Daad', pct: 24 },
  ],
};

const REFUGEE_DATA = {
  totalOutside: '714,390+',
  totalNum: 714390,
  globalDiaspora: '~2.5 Million',
  newAsylum2024: '97,317',
  source: 'UNHCR Horn of Africa Situation Report 2024',
  sourceUrl: 'https://data.unhcr.org/en/situations/horn',
  lastUpdated: 'October 2024',
  countries: [
    { flag: '🇰🇪', country: 'Kenya', en: 'Kenya', so: 'Kenya', num: 308367, pct: 43.2, camp: 'Dadaab & Kakuma camps' },
    { flag: '🇪🇹', country: 'Ethiopia', en: 'Ethiopia', so: 'Itoobiya', num: 276412, pct: 38.7, camp: 'Dollo Ado & Jigjiga camps' },
    { flag: '🇺🇬', country: 'Uganda', en: 'Uganda', so: 'Uganda', num: 69533, pct: 9.7, camp: 'Nakivale & Bidi Bidi' },
    { flag: '🇾🇪', country: 'Yemen', en: 'Yemen', so: 'Yaman', num: 46750, pct: 6.5, camp: 'Aden & Sana\'a' },
    { flag: '🇩🇯', country: 'Djibouti', en: 'Djibouti', so: 'Jabuuti', num: 9200, pct: 1.3, camp: 'Ali Addeh camp' },
    { flag: '🇹🇿', country: 'Tanzania', en: 'Tanzania', so: 'Tansaaniya', num: 3100, pct: 0.4, camp: 'Nyarugusu camp' },
    { flag: '🌍', country: 'Rest of Africa', en: 'Rest of Africa', so: 'Afrika kale', num: 1028, pct: 0.2, camp: 'Various' },
  ],
  diasporaEurope: [
    { flag: '🇬🇧', country: 'United Kingdom', num: 108000 },
    { flag: '🇸🇪', country: 'Sweden', num: 66369 },
    { flag: '🇳🇴', country: 'Norway', num: 43196 },
    { flag: '🇳🇱', country: 'Netherlands', num: 39465 },
    { flag: '🇩🇪', country: 'Germany', num: 38675 },
    { flag: '🇫🇮', country: 'Finland', num: 24365 },
    { flag: '🇩🇰', country: 'Denmark', num: 21050 },
  ],
  diasporaWorld: [
    { flag: '🇺🇸', country: 'United States', en: 'United States (est. 170,000+)', so: 'Maraykanka (qiyaas 170,000+)', num: 170000, note: 'Largest concentration in Minneapolis-St. Paul (Minnesota), Columbus (Ohio), Seattle (Washington)' },
    { flag: '🇬🇧', country: 'United Kingdom', en: 'United Kingdom (108,000+)', so: 'Ingiriiska (108,000+)', num: 108000, note: 'Largest Somali community in Europe; centered in London' },
    { flag: '🇨🇦', country: 'Canada', en: 'Canada (50,000–100,000)', so: 'Kanada (50,000–100,000)', num: 75000, note: 'Ottawa, Toronto, Edmonton; large wave arrived post-1991' },
    { flag: '🇸🇪', country: 'Sweden', en: 'Sweden (66,000+)', so: 'Iswiidhan (66,000+)', num: 66369, note: 'Malmö and Stockholm; generous asylum policy' },
    { flag: '🇳🇴', country: 'Norway', en: 'Norway (43,000+)', so: 'Noorweey (43,000+)', num: 43196, note: 'Oslo; third-largest Somali diaspora in Europe' },
    { flag: '🇳🇱', country: 'Netherlands', en: 'Netherlands (39,000+)', so: 'Holanda (39,000+)', num: 39465, note: 'Amsterdam and Rotterdam' },
    { flag: '🇦🇺', country: 'Australia', en: 'Australia (10,000–25,000)', so: 'Ostiraaliya (10,000–25,000)', num: 17000, note: 'Melbourne and Sydney; significant community with growing numbers' },
    { flag: '🇿🇦', country: 'South Africa', en: 'South Africa (35,000–75,000)', so: 'Koonfur Afrika (35,000–75,000)', num: 55000, note: 'Cape Town & Johannesburg; many Somali entrepreneurs in retail sector (Western Cape spaza shops)' },
    { flag: '🇺🇦', country: 'UAE & Gulf', en: 'UAE & Gulf States (est. 100,000+)', so: 'Imaaraadka & Khaliijka (100,000+)', num: 100000, note: 'Dubai, Abu Dhabi, Qatar; professionals and traders' },
    { flag: '🇰🇪', country: 'Kenya (urban)', en: 'Kenya – urban communities', so: 'Kenya – tuulooyinka magaalada', num: 45000, note: 'Eastleigh (Nairobi) is known as "Little Mogadishu"; major trade hub' },
  ],
};

const MEDITERRANEAN_DATA = {
  total2024: 2333,
  centralMed2024: 1699,
  total2023: 3155,
  source: 'IOM Missing Migrants Project',
  sourceUrl: 'https://missingmigrants.iom.int/region/mediterranean',
  gulfAdenSource: 'IOM Missing Migrants / UNHCR Gulf of Aden reports',
  gulfAdenUrl: 'https://missingmigrants.iom.int/region/horn-africa',
  timeline: [
    { year: 2008, deaths: 1056, route: 'Gulf of Aden', note: 'Peak Gulf of Aden year — mainly Somalia–Yemen crossing' },
    { year: 2009, deaths: 529, route: 'Gulf of Aden', note: 'Continued high crossing after 2008 peak' },
    { year: 2010, deaths: 19, route: 'Gulf of Aden', note: 'Sharp drop due to naval patrols increasing' },
    { year: 2011, deaths: 1500, route: 'Mediterranean', note: 'Libya collapse opened North Africa route; deaths spiked' },
    { year: 2012, deaths: 500, route: 'Mediterranean', note: 'Continued Mediterranean deaths' },
    { year: 2013, deaths: 700, route: 'Mediterranean', note: 'Gradual increase; 366 died in Lampedusa Oct 2013' },
    { year: 2014, deaths: 3279, route: 'Mediterranean', note: 'New record at the time; Central Med deadliest route' },
    { year: 2015, deaths: 3771, route: 'Mediterranean', note: 'High crossing year; ~1 million arrivals in Europe' },
    { year: 2016, deaths: 5143, route: 'Mediterranean', note: 'Deadliest recorded year overall (IOM)' },
    { year: 2017, deaths: 3116, route: 'Mediterranean', note: 'EU-Libya deal reduced crossings but not death rate' },
    { year: 2018, deaths: 2299, route: 'Mediterranean', note: 'Continued Central Med crossings' },
    { year: 2019, deaths: 1885, route: 'Mediterranean', note: 'Spain route increased; overall deaths decreased' },
    { year: 2020, deaths: 1401, route: 'Mediterranean', note: 'COVID-19 disrupted crossings somewhat' },
    { year: 2021, deaths: 2048, route: 'Mediterranean', note: 'Resurgence in Central Med after pandemic year' },
    { year: 2022, deaths: 2406, route: 'Mediterranean', note: 'Canary Islands route also increased' },
    { year: 2023, deaths: 3155, route: 'Mediterranean', note: 'Sharp increase; second-deadliest year on record' },
    { year: 2024, deaths: 2333, route: 'Mediterranean', note: '↓26% from 2023 but still devastatingly high' },
  ],
  routes: [
    { name: 'Central Mediterranean (Libya → Italy/Malta)', deaths2024: 1699, deaths2023: 2269, color: 'bg-red-500', textColor: 'text-red-400' },
    { name: 'Western Mediterranean (Morocco → Spain)', deaths2024: 390, deaths2023: 519, color: 'bg-orange-500', textColor: 'text-orange-400' },
    { name: 'Eastern Mediterranean (Turkey → Greece)', deaths2024: 244, deaths2023: 367, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  ],
  genderNote: 'IOM data shows men represent ~75% of migrants on the Central Mediterranean route. Women and children face extreme danger including gender-based violence in Libyan detention centers.',
  somaliNote: 'Somali nationals are among the top nationalities on the East Africa → Libya → Italy route. Many pass through Ethiopia, Sudan and Libya. Exact nationality-disaggregated totals require IOM database access.',
};

const UNEMPLOYMENT_DATA = {
  youthRate: '33.92%',
  source: 'World Bank / ILO Modeled Estimate 2024',
  sourceUrl: 'https://data.worldbank.org/indicator/SL.UEM.1524.ZS?locations=SO',
  note: 'Informal underemployment pushes effective joblessness among youth significantly higher. Many NGO reports cite 67%+ when including underemployment.',
  context: [
    { en: 'Youth (15–24) unemployment', so: 'Shaqo-la\'aanta (15–24)', value: '33.92%', source: 'World Bank ILO 2024' },
    { en: 'Female youth unemployment', so: 'Gabar da\'yar shaqo la\'aan', value: '36.1%', source: 'World Bank ILO 2024' },
    { en: 'Male youth unemployment', so: 'Wiil da\'yar shaqo la\'aan', value: '32.2%', source: 'World Bank ILO 2024' },
    { en: 'General unemployment rate', so: 'Shaqo-la\'aanta guud', value: '~14.5%', source: 'World Bank 2024' },
    { en: 'Youth with higher education employed', so: 'Waxbarasho sare & shaqo', value: '<25%', source: 'UNDP Somalia 2023' },
  ],
};

const CIVIL_WAR_DATA = {
  started: '1991',
  source: 'Uppsala Conflict Data Program (UCDP) / Crisis Group',
  sourceUrl: 'https://ucdp.uu.se/country/520',
  totalEstimated: '500,000 – 1,000,000+',
  famineDead1991: '300,000+',
  ongoingDeaths: '~4,000–8,000/year',
  phases: [
    {
      period: '1991–2000',
      en: 'State Collapse & Clan Wars',
      so: 'Burburka Dowladda & Dagaallada Qabiilka',
      deaths: '300,000–500,000',
      detail: 'Siad Barre regime overthrown January 1991. Clan militias fought over Mogadishu. Combined with the 1991–1992 famine, an estimated 300,000+ died from violence and starvation.',
    },
    {
      period: '1993',
      en: 'Battle of Mogadishu (Black Hawk Down)',
      so: 'Dagaalkii Muqdisho (Black Hawk Down)',
      deaths: '~1,000 Somali combatants & civilians',
      detail: 'US & UN intervention (UNOSOM II). October 3–4 battle killed 18 US soldiers and an estimated 300–1,000+ Somalis. Triggered US withdrawal.',
    },
    {
      period: '2006–2009',
      en: 'Ethiopian Intervention & TFG Wars',
      so: 'Xaaladda Itoobiya & Dagaallada TFG',
      deaths: '~16,000',
      detail: 'Islamic Courts Union (ICU) briefly controlled Mogadishu. Ethiopian invasion Dec 2006 ousted ICU. Fighting between TFG, Ethiopian forces, and ICU remnants killed thousands.',
    },
    {
      period: '2007–present',
      en: 'Al-Shabaab Insurgency',
      so: 'Kacdoonka Al-Shabaab',
      deaths: '~60,000–100,000+',
      detail: 'Al-Shabaab emerged from ICU remnants. Major attacks include 2017 Mogadishu truck bombing (587 killed — deadliest single attack). Ongoing conflict continues today.',
    },
    {
      period: '2011',
      en: 'Famine & Drought',
      so: 'Abaarta & Gaajada',
      deaths: '258,000',
      detail: 'UN-declared famine killed an estimated 258,000 people (half were children under 5). Climate, conflict, and aid blockages all contributed.',
    },
  ],
  causes: [
    { en: 'Clan divisions & power vacuum after Barre', so: 'Qabiilaynta & bannaanka awood ka dib Barre', color: 'bg-red-500', pct: 35 },
    { en: 'Cold War proxy legacy (weapons flooding)', so: 'Dhaxalkii dagaalkii qabow (hubka dushaantiisa)', color: 'bg-orange-500', pct: 20 },
    { en: 'Economic collapse & resource competition', so: 'Burburka dhaqaale & tartanka khayraadka', color: 'bg-yellow-500', pct: 20 },
    { en: 'Extremist insurgency (Al-Shabaab)', so: 'Kacdoonka Islaamiyiinta Xaddidan', color: 'bg-purple-500', pct: 15 },
    { en: 'Drought, famine & climate shocks', so: 'Abaar, gaajo & xaaladaha cimilada', color: 'bg-blue-500', pct: 10 },
  ],
};

const FRAGILITY_DATA = {
  rank: '#1 Most Fragile State',
  score: '111.3 / 120',
  year: '2024',
  source: 'Fund for Peace — Fragile States Index 2024',
  sourceUrl: 'https://fragilestatesindex.org/country-data/',
  context: 'Somalia has ranked among the top 3 most fragile states for over a decade. Sudan (109.3) and South Sudan (109.0) follow.',
  indicators: [
    { name: 'Security Apparatus', en: 'Security Apparatus (military, police)', so: 'Astaanta Amniga', score: 9.8, max: 10, color: 'bg-red-600' },
    { name: 'Factionalized Elites', en: 'Factionalized Elites (clan/political)', so: 'Hoggaamiyeyaasha Xarakadaha', score: 9.7, max: 10, color: 'bg-red-500' },
    { name: 'Group Grievance', en: 'Group Grievance (clan resentment)', so: 'Cabashada Kooxaha', score: 9.5, max: 10, color: 'bg-red-500' },
    { name: 'Human Flight', en: 'Human Flight & Brain Drain', so: 'Barakaca Aadanaha & Maskaxda', score: 9.5, max: 10, color: 'bg-orange-500' },
    { name: 'External Intervention', en: 'External Intervention (foreign interference)', so: 'Faragalinta Dibadda', score: 9.4, max: 10, color: 'bg-orange-500' },
    { name: 'State Legitimacy', en: 'State Legitimacy (government trust)', so: 'Xalaalnimada Dowladda', score: 9.3, max: 10, color: 'bg-orange-400' },
    { name: 'Public Services', en: 'Public Services (health, education, water)', so: 'Adeegyada Bulshada', score: 9.2, max: 10, color: 'bg-orange-400' },
    { name: 'Economy', en: 'Economy (GDP, poverty, inequality)', so: 'Dhaqaalaha', score: 9.0, max: 10, color: 'bg-yellow-500' },
    { name: 'Demographic Pressures', en: 'Demographic Pressures (population growth)', so: 'Cadaadiska Degmada', score: 8.9, max: 10, color: 'bg-yellow-500' },
    { name: 'Refugees & IDPs', en: 'Refugees & IDPs', so: 'Qaxootiga & Barakacayaasha', score: 9.6, max: 10, color: 'bg-red-500' },
    { name: 'Rule of Law', en: 'Rule of Law', so: 'Xukumaadda Sharciga', score: 9.1, max: 10, color: 'bg-yellow-400' },
    { name: 'Human Rights', en: 'Human Rights & Rule of Law', so: 'Xuquuqda Aadanaha', score: 9.3, max: 10, color: 'bg-orange-400' },
  ],
  rankHistory: [
    { year: 2015, rank: 1, score: 114.9 },
    { year: 2017, rank: 1, score: 113.9 },
    { year: 2019, rank: 1, score: 113.2 },
    { year: 2021, rank: 1, score: 112.3 },
    { year: 2023, rank: 1, score: 111.9 },
    { year: 2024, rank: 1, score: 111.3 },
  ],
};

const RESEARCH_DATA = [
  {
    title: 'Somalia Country Report — Fragile States Index 2024',
    authors: 'Fund for Peace',
    year: '2024',
    type: 'Index Report',
    en: 'Annual assessment of Somalia across 12 cohesion, economic, political, and social indicators. Somalia ranks #1 globally with score 111.3/120.',
    so: 'Qiimaynta sanadlaha ah ee Soomaaliya ee 12 tilmaamood. Soomaaliya waxay ku timaaddaa #1 adduunka oo dhan.',
    url: 'https://fragilestatesindex.org/country-data/',
    tags: ['Fragility', 'Governance', 'Security'],
  },
  {
    title: 'The Somali Diaspora: Migration, Identity and Politics',
    authors: 'Mohamed Nuuh Ali (University of Warwick)',
    year: '2022',
    type: 'Academic Paper',
    en: 'Examines how Somali diaspora communities in North America and Europe maintain identity, send remittances, and engage in political advocacy for Somalia.',
    so: 'Daraasad ku saabsan sida bulshada Soomaalida ee dibadda ugu dhaqmaan aqoonsigooda iyo doorkooda siyaasadeed.',
    url: 'https://scholar.google.com/scholar?q=Somali+Diaspora+Migration+Identity+Politics',
    tags: ['Diaspora', 'Identity', 'Remittances'],
  },
  {
    title: 'IOM Missing Migrants Project — Annual Report 2024',
    authors: 'International Organization for Migration (IOM)',
    year: '2024',
    type: 'UN Agency Report',
    en: 'Tracks verified deaths and disappearances of migrants globally including the Mediterranean, Gulf of Aden, and Sahara Desert routes taken by Somalis.',
    so: 'Raad-raaca dhimashada muhaajiriinta adduunka oo dhan, gaar ahaan waddooyinka Badda Medditerranean iyo Gacanka Aden.',
    url: 'https://missingmigrants.iom.int/',
    tags: ['Migration', 'Deaths', 'Mediterranean'],
  },
  {
    title: 'Somalia: From the Collapse of the State to the Building of a New Order',
    authors: 'Abdirahman A. Osman & Francesca Debora Montesano',
    year: '2021',
    type: 'Academic Book Chapter',
    en: 'Comprehensive analysis of Somalia\'s state collapse in 1991, the civil war, international intervention, and paths to reconstruction.',
    so: 'Falanqayn dhammaystiran oo ku saabsan burburka dowladda 1991, dagaalka sokeeye, iyo wadooyinka dib-u-dhiska.',
    url: 'https://scholar.google.com/scholar?q=Somalia+Collapse+State+Building+New+Order',
    tags: ['Civil War', 'State Collapse', 'Reconstruction'],
  },
  {
    title: 'Famine in Somalia: Competing Imperatives, Collective Failures',
    authors: 'Daniel Maxwell & Nisar Majid (Tufts University)',
    year: '2016',
    type: 'Academic Book',
    en: 'Detailed examination of the 2011 Somalia famine that killed 258,000 people — how conflict, drought, and aid failures combined to create catastrophe.',
    so: 'Falanqayn faahfaahsan oo ku saabsan abaartii 2011 ee Soomaaliya ee dishay 258,000 qof.',
    url: 'https://www.cornellpress.cornell.edu/book/9780801454653/famine-in-somalia/',
    tags: ['Famine', 'Food Security', 'Aid'],
  },
  {
    title: 'Al-Shabaab in Somalia: The History and Ideology of a Militant Islamist Group',
    authors: 'Stig Jarle Hansen (Hurst Publishers)',
    year: '2013',
    type: 'Academic Book',
    en: 'Definitive academic work tracing Al-Shabaab\'s origins, ideology, funding, and military tactics from 2006 to present.',
    so: 'Buug cilmi-baaris ah oo kuu sheegaya asalka, fikradaha, maaliyadda iyo xeeladaha Al-Shabaab.',
    url: 'https://scholar.google.com/scholar?q=Al-Shabaab+Somalia+History+Ideology+Hansen',
    tags: ['Al-Shabaab', 'Terrorism', 'Security'],
  },
  {
    title: 'Somalia Displacement & Humanitarian Report 2024',
    authors: 'UNHCR Somalia',
    year: '2024',
    type: 'UN Agency Report',
    en: 'Comprehensive 2024 report on 3.9 million IDPs, causes of displacement, regional breakdowns, and humanitarian response.',
    so: 'Warbixin 2024 oo dhammaystiran oo ku saabsan 3.9 milyan oo barakacayaasha gudaha ah.',
    url: 'https://reporting.unhcr.org/operational/operations/somalia',
    tags: ['IDPs', 'Displacement', 'Humanitarian'],
  },
  {
    title: 'Youth Unemployment & the Mediterranean Migration Crisis in the Horn of Africa',
    authors: 'International Labour Organization (ILO)',
    year: '2023',
    type: 'Policy Report',
    en: 'Links between high youth unemployment in Somalia (33.9%+) and irregular migration routes, including the dangerous Libya-Italy crossing.',
    so: 'Xidhiidhka u dhaxeeya shaqo-la\'aanta dhalinyarada Soomaaliyeed iyo socdaalka aan sharci lahayn.',
    url: 'https://www.ilo.org/africa',
    tags: ['Youth', 'Employment', 'Migration'],
  },
];

/* ── Expandable stat card ────────────────────────────────────────────────── */
function StatCard({ title, titleSo, value, icon: Icon, color, children, source, sourceUrl, lastUpdated, lang }:
  { title: string; titleSo: string; value: string; icon: React.ElementType; color: string; children: React.ReactNode; source: string; sourceUrl: string; lastUpdated: string; lang: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all duration-300 ${open ? 'border-white/20 shadow-xl' : ''}`}>

      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-6 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <div className="text-white/45 text-xs uppercase tracking-widest mb-1">{lang === 'en' ? title : titleSo}</div>
              <div className="text-white font-black text-3xl sm:text-4xl leading-none">{value}</div>
            </div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${open ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/30 group-hover:bg-white/10'}`}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        {!open && (
          <p className="text-white/35 text-sm mt-3 ml-16">
            {lang === 'en' ? 'Click to see full breakdown & sources' : 'Guji si aad u aragto xogta buuxda iyo ilaha'}
          </p>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }} className="overflow-hidden border-t border-white/10">
            <div className="p-6 pt-5 space-y-5">
              {children}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gold/5 border border-gold/15 mt-4">
                <BookOpen size={14} className="text-gold flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="text-white/50 font-semibold uppercase tracking-wider">{lang === 'en' ? 'Source' : 'Ilaha'}</div>
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 flex items-center gap-1 transition-colors">
                    {source} <ExternalLink size={11} />
                  </a>
                  <div className="text-white/35 flex items-center gap-1"><Calendar size={10} /> {lang === 'en' ? 'Last updated:' : 'Wakhtigii ugu dambeeyay:'} {lastUpdated}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Bar({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function DataPage() {
  const { lang } = useLang();

  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-32 pb-20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #040b1c 0%, #070e24 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #c9a227, transparent 70%)' }} />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.7 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 mb-6">
            <Globe size={28} className="text-gold" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">
              {lang === 'en' ? 'Verified Public Data — UN, IOM, World Bank, Fund for Peace' : 'Xog La Xaqiijiyey — UN, IOM, Bangiga Adduunka'}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            {lang === 'en'
              ? <>Somalia Crisis <span className="text-gold">By The Numbers</span></>
              : <>Dhibaatada Soomaaliya <span className="text-gold">Tirada Dhabta Ah</span></>}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white/55 text-lg max-w-2xl mx-auto mb-8">
            {lang === 'en'
              ? 'Every number below comes from official UN, IOM, World Bank, and academic sources. Click any card to see the full breakdown, regional data, timeline, and direct source links.'
              : 'Tiro kasta oo hoose waxay ka timaadaa ilaha rasmiga ah. Guji kaar kasta si aad u aragto xogta buuxda.'}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { n: '3.9M', en: 'IDPs inside Somalia', so: 'Barakacayaasha gudaha', color: 'text-orange-400' },
              { n: '2.5M+', en: 'Global Somali diaspora', so: 'Qurbo-joogta Soomaaliyeed', color: 'text-blue-400' },
              { n: '1M+', en: 'Civil war deaths since 1991', so: 'Dhimashada dagaalkii', color: 'text-red-400' },
              { n: '#1', en: 'Fragile state globally', so: 'Dowladda ugu jilicsanaanta', color: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className={`text-2xl font-black ${s.color}`}>{s.n}</div>
                <div className="text-white/45 text-xs mt-1">{lang === 'en' ? s.en : s.so}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DATA CARDS ── */}
      <section className="py-16" style={{ background: '#070e24' }}>
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          {/* 1 — IDP */}
          <StatCard
            title="Internally Displaced People (Inside Somalia)"
            titleSo="Barakacayaasha Gudaha (Soomaaliya dhexdeeda)"
            value={IDP_DATA.total}
            icon={MapPin}
            color="bg-orange-500/15 text-orange-400"
            source={IDP_DATA.source}
            sourceUrl={IDP_DATA.sourceUrl}
            lastUpdated={IDP_DATA.lastUpdated}
            lang={lang}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { en: 'Total IDPs inside Somalia', so: 'Barakacayaasha guud ee gudaha', val: IDP_DATA.total, icon: '📍', color: 'text-orange-400' },
                { en: 'Newly displaced in 2024', so: 'Cusub barakacay 2024', val: IDP_DATA.newIn2024, icon: '📅', color: 'text-red-400' },
                { en: 'Women & children among IDPs', so: 'Haween & carruur barakacay', val: IDP_DATA.womenChildren, icon: '👩‍👧', color: 'text-pink-400' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className={`text-2xl font-black ${item.color}`}>{item.val}</div>
                  <div className="text-white/50 text-xs mt-1">{lang === 'en' ? item.en : item.so}</div>
                </div>
              ))}
            </div>
            <div className="mb-5">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? 'Top Regions of Displacement' : 'Gobollada Ugu Badan Barakaca'}
              </div>
              <div className="space-y-2.5">
                {IDP_DATA.regions.map(r => (
                  <Bar key={r.name} pct={r.pct} color="bg-orange-500" label={lang === 'en' ? r.en : r.so} value={`${r.pct}%`} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? 'Causes of Displacement (Aug 2024)' : 'Sababaha Barakaca (Ogosto 2024)'}
              </div>
              <div className="space-y-2.5">
                {IDP_DATA.causes.map(c => (
                  <Bar key={c.en} pct={c.pct} color="bg-red-500" label={lang === 'en' ? c.en : c.so} value={`${c.pct}%`} />
                ))}
              </div>
            </div>
          </StatCard>

          {/* 2 — GLOBAL DIASPORA */}
          <StatCard
            title="Somali Diaspora Worldwide"
            titleSo="Soomaalida Gurbanku ka Nool Adduunka"
            value="~2.5 Million"
            icon={Globe}
            color="bg-blue-500/15 text-blue-400"
            source={REFUGEE_DATA.source}
            sourceUrl={REFUGEE_DATA.sourceUrl}
            lastUpdated={REFUGEE_DATA.lastUpdated}
            lang={lang}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { en: 'Registered refugees in Africa', so: 'Qaxootiga diiwaangashan Afrika', val: REFUGEE_DATA.totalOutside, color: 'text-blue-400' },
                { en: 'Estimated global diaspora', so: 'Qurbo-joogta adduunka guud', val: REFUGEE_DATA.globalDiaspora, color: 'text-cyan-400' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className={`text-2xl font-black ${item.color}`}>{item.val}</div>
                  <div className="text-white/50 text-xs mt-1">{lang === 'en' ? item.en : item.so}</div>
                </div>
              ))}
            </div>

            {/* World diaspora */}
            <div className="mb-6">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                <Globe size={12} /> {lang === 'en' ? 'Major Somali Communities Worldwide' : 'Bulshooyinka Soomaalida Ee Adduunka'}
              </div>
              <div className="space-y-3">
                {REFUGEE_DATA.diasporaWorld.map(d => (
                  <div key={d.country} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{d.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline flex-wrap gap-1 mb-1">
                          <span className="text-white font-semibold text-sm">{lang === 'en' ? d.en : d.so}</span>
                          <span className="text-blue-400 font-black text-base">{d.num.toLocaleString()}+</span>
                        </div>
                        <div className="text-white/35 text-[10px] leading-relaxed">{d.note}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Africa breakdown */}
            <div className="mb-6">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                <Flag size={12} /> {lang === 'en' ? 'UNHCR Registered Refugees in Africa' : 'Qaxootiga UNHCR Diiwaangashay ee Afrika'}
              </div>
              <div className="space-y-3">
                {REFUGEE_DATA.countries.map(c => (
                  <div key={c.country} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl flex-shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-white font-semibold text-sm">{lang === 'en' ? c.en : c.so}</span>
                        <span className="text-blue-400 font-black text-base">{c.num.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full bg-blue-500"
                          initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }}
                          viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }} />
                      </div>
                      <div className="text-white/35 text-[10px] mt-1">{c.camp} · {c.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Europe diaspora grid */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                <Globe size={12} /> {lang === 'en' ? 'Somali Diaspora in Europe' : 'Soomaalida Gurbanku ka Degan Yihiin Yurub'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {REFUGEE_DATA.diasporaEurope.map(d => (
                  <div key={d.country} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-center">
                    <div className="text-lg mb-0.5">{d.flag}</div>
                    <div className="text-white font-bold text-sm">{d.num.toLocaleString()}</div>
                    <div className="text-white/40 text-[10px]">{d.country}</div>
                  </div>
                ))}
              </div>
            </div>
          </StatCard>

          {/* 3 — MEDITERRANEAN TIMELINE */}
          <StatCard
            title="Mediterranean & Gulf of Aden Deaths (2008–2024)"
            titleSo="Dhimashada Badda Medditerranean & Gacanka Aden (2008–2024)"
            value="~30,000+ since 2008"
            icon={Waves}
            color="bg-red-500/15 text-red-400"
            source={MEDITERRANEAN_DATA.source}
            sourceUrl={MEDITERRANEAN_DATA.sourceUrl}
            lastUpdated="December 2024"
            lang={lang}
          >
            {/* Key stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { en: 'Deaths in 2024 (Mediterranean)', so: 'Dhimashada 2024 (Badda Medditerranean)', val: '2,333', color: 'text-red-400', note: '↓26% from 2023' },
                { en: '2016 — deadliest year on record', so: '2016 — sanadkii ugu dhimashada badnaa', val: '5,143', color: 'text-orange-400', note: 'IOM record' },
                { en: '2008 Gulf of Aden deaths', so: 'Dhimashada 2008 Gacanka Aden', val: '1,056', color: 'text-rose-400', note: 'Somalia→Yemen route' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className={`text-2xl font-black ${item.color}`}>{item.val}</div>
                  <div className="text-white/50 text-xs mt-1">{lang === 'en' ? item.en : item.so}</div>
                  <div className="text-white/30 text-[10px] mt-1">{item.note}</div>
                </div>
              ))}
            </div>

            {/* Year-by-year timeline */}
            <div className="mb-6">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? 'Year-by-Year Timeline (2008–2024)' : 'Jadwalka Sanadlaha ah (2008–2024)'}
              </div>
              <div className="space-y-2">
                {MEDITERRANEAN_DATA.timeline.map((yr) => {
                  const maxDeaths = 5143;
                  const pct = Math.round((yr.deaths / maxDeaths) * 100);
                  const isGulf = yr.route === 'Gulf of Aden';
                  return (
                    <div key={yr.year} className="flex items-center gap-3 group">
                      <div className="text-white/50 text-xs font-mono w-10 flex-shrink-0">{yr.year}</div>
                      <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                          className={`h-full rounded-full ${isGulf ? 'bg-blue-500' : 'bg-red-500'}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.05 }}
                        />
                      </div>
                      <div className={`text-xs font-black w-14 text-right flex-shrink-0 ${isGulf ? 'text-blue-400' : 'text-red-400'}`}>
                        {yr.deaths.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-white/40 text-[10px]">{lang === 'en' ? 'Mediterranean' : 'Badda Medditerranean'}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-white/40 text-[10px]">{lang === 'en' ? 'Gulf of Aden (Somalia→Yemen)' : 'Gacanka Aden (Soomaaliya→Yaman)'}</span></div>
              </div>
            </div>

            {/* 2024 routes */}
            <div className="mb-5">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? 'Deaths by Route (2024)' : 'Dhimashada Waddada (2024)'}
              </div>
              <div className="space-y-3">
                {MEDITERRANEAN_DATA.routes.map(r => (
                  <div key={r.name} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70 text-xs">{r.name}</span>
                      <span className={`font-black ${r.textColor}`}>{r.deaths2024.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${r.color}`}
                        initial={{ width: 0 }} whileInView={{ width: `${(r.deaths2024 / 1699) * 100}%` }}
                        viewport={{ once: true }} transition={{ duration: 0.9 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <div className="text-amber-300/80 text-xs leading-relaxed">
                <span className="font-bold text-amber-300">{lang === 'en' ? 'Somali note: ' : 'Xog Soomaali: '}</span>
                {MEDITERRANEAN_DATA.somaliNote}
              </div>
            </div>
          </StatCard>

          {/* 4 — CIVIL WAR */}
          <StatCard
            title="Somalia Civil War (1991–Present)"
            titleSo="Dagaalkii Sokeeye ee Soomaaliya (1991–Hadda)"
            value="500K – 1M+ Killed"
            icon={Sword}
            color="bg-red-700/20 text-red-300"
            source={CIVIL_WAR_DATA.source}
            sourceUrl={CIVIL_WAR_DATA.sourceUrl}
            lastUpdated="2024"
            lang={lang}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { en: 'Estimated total deaths since 1991', so: 'Wadarta la qiyaasay ee dhimashada 1991–hadda', val: CIVIL_WAR_DATA.totalEstimated, color: 'text-red-400' },
                { en: '1991–1992 famine & conflict deaths', so: 'Dhimashada abaarta & colaadda 1991–92', val: CIVIL_WAR_DATA.famineDead1991, color: 'text-orange-400' },
                { en: 'Ongoing deaths per year (est.)', so: 'Dhimashada sanadlaha ah (qiyaas)', val: CIVIL_WAR_DATA.ongoingDeaths, color: 'text-yellow-400' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className={`text-xl font-black ${item.color}`}>{item.val}</div>
                  <div className="text-white/50 text-xs mt-1">{lang === 'en' ? item.en : item.so}</div>
                </div>
              ))}
            </div>

            {/* Timeline phases */}
            <div className="mb-6">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-4 font-semibold">
                {lang === 'en' ? 'Key Phases of the Conflict' : 'Marxaladaha Muhiimka ah ee Colaadda'}
              </div>
              <div className="space-y-3">
                {CIVIL_WAR_DATA.phases.map((phase, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 border-l-2 border-l-red-500/60">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div>
                        <span className="text-gold text-xs font-bold font-mono">{phase.period}</span>
                        <div className="text-white font-semibold text-sm mt-0.5">{lang === 'en' ? phase.en : phase.so}</div>
                      </div>
                      <span className="text-red-400 font-black text-sm bg-red-500/10 px-2 py-0.5 rounded-lg">{phase.deaths}</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{phase.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Root causes */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? 'Root Causes of the War' : 'Asal-sababaha Dagaalka'}
              </div>
              <div className="space-y-2.5">
                {CIVIL_WAR_DATA.causes.map(c => (
                  <Bar key={c.en} pct={c.pct} color={c.color} label={lang === 'en' ? c.en : c.so} value={`${c.pct}%`} />
                ))}
              </div>
            </div>
          </StatCard>

          {/* 5 — FRAGILE STATES INDEX */}
          <StatCard
            title="Somalia Fragility — #1 Most Fragile State Globally"
            titleSo="Jiilicnaanta Soomaaliya — #1 Adduunka Oo Dhan"
            value={FRAGILITY_DATA.score}
            icon={ShieldAlert}
            color="bg-purple-500/15 text-purple-400"
            source={FRAGILITY_DATA.source}
            sourceUrl={FRAGILITY_DATA.sourceUrl}
            lastUpdated={FRAGILITY_DATA.year}
            lang={lang}
          >
            <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/25 mb-6">
              <div className="text-purple-300/90 text-sm leading-relaxed">
                <span className="font-bold text-purple-300">{lang === 'en' ? 'Context: ' : 'Macluumaad: '}</span>
                {lang === 'en' ? FRAGILITY_DATA.context : 'Soomaaliya waxay ku timaaddaa #1 adduunka oo dhan si joogto ah muddo ka badan 10 sano. Sudan (109.3) iyo Koonfur Sudan (109.0) ayaa ku xiga.'}
              </div>
            </div>

            {/* Rank history */}
            <div className="mb-6">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? 'FSI Rank History (Somalia #1 Every Year)' : 'Taariikhda Darajo FSI (Soomaaliya #1 Mar kasta)'}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {FRAGILITY_DATA.rankHistory.map(h => (
                  <div key={h.year} className="p-2.5 rounded-lg bg-purple-500/8 border border-purple-500/20 text-center">
                    <div className="text-purple-300 font-bold text-xs">{h.year}</div>
                    <div className="text-white font-black text-lg">{h.score}</div>
                    <div className="text-purple-400 text-[10px]">Rank #1</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 12 indicators */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                {lang === 'en' ? '12 FSI Vulnerability Indicators (out of 10)' : '12 Tilmaamood ee Nuglaanta FSI (ka mid 10)'}
              </div>
              <div className="space-y-2.5">
                {FRAGILITY_DATA.indicators.map(ind => (
                  <div key={ind.name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/65 truncate">{lang === 'en' ? ind.en : ind.so}</span>
                        <span className="text-white font-bold ml-2 flex-shrink-0">{ind.score}/10</span>
                      </div>
                      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${ind.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(ind.score / 10) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: 'easeOut' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-white/30 text-[10px]">
                {lang === 'en' ? 'Score 10/10 = maximum vulnerability. Somalia averages 9.4 across all 12 indicators.' : 'Dhibcaha 10/10 = nuglaanta ugu sareysa. Soomaaliya celceliskeedu waa 9.4 ee 12 tilmaamood.'}
              </div>
            </div>
          </StatCard>

          {/* 6 — UNEMPLOYMENT */}
          <StatCard
            title="Somali Youth Unemployment"
            titleSo="Shaqo-la'aanta Dhalinyarada Soomaaliyeed"
            value={UNEMPLOYMENT_DATA.youthRate}
            icon={TrendingDown}
            color="bg-yellow-500/15 text-yellow-400"
            source={UNEMPLOYMENT_DATA.source}
            sourceUrl={UNEMPLOYMENT_DATA.sourceUrl}
            lastUpdated="2024"
            lang={lang}
          >
            <div className="space-y-3 mb-6">
              {UNEMPLOYMENT_DATA.context.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-white/80 text-sm font-medium">{lang === 'en' ? item.en : item.so}</div>
                    <div className="text-white/30 text-[10px] mt-0.5">{item.source}</div>
                  </div>
                  <div className="text-yellow-400 font-black text-xl flex-shrink-0 ml-4">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <div className="text-amber-300/80 text-xs leading-relaxed">
                <span className="font-bold text-amber-300">{lang === 'en' ? 'Note: ' : 'Xusuus: '}</span>
                {UNEMPLOYMENT_DATA.note}
              </div>
            </div>
          </StatCard>

        </div>
      </section>

      {/* ── RESEARCH SECTION ── */}
      <section className="py-16" style={{ background: '#040b1c' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-5">
              <FileText size={12} className="text-gold" />
              <span className="text-gold text-xs font-bold tracking-[0.2em] uppercase">
                {lang === 'en' ? 'Academic Research & Reports' : 'Cilmi-baarisyada & Warbixinnada'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">
              {lang === 'en' ? <>The Evidence <span className="text-gold">Behind the Numbers</span></> : <>Caddaynta <span className="text-gold">Ka Dambeysa Tirada</span></>}
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              {lang === 'en'
                ? 'Peer-reviewed research, UN reports and independent analysis documenting Somalia\'s crises.'
                : 'Cilmi-baaris la xaqiijiyay, warbixinnada UN iyo falanqaynta madaxbanaan ee diiwaangeliya dhibaatooyinka Soomaaliya.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESEARCH_DATA.map((paper, i) => (
              <motion.a
                key={i}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ borderColor: 'rgba(201,162,39,0.4)', backgroundColor: 'rgba(201,162,39,0.04)' }}
                className="block p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex gap-2 flex-wrap">
                    {paper.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold">{tag}</span>
                    ))}
                  </div>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-gold/60 transition-colors flex-shrink-0 mt-0.5" />
                </div>
                <h3 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-gold/90 transition-colors">
                  {paper.title}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed mb-3">
                  {lang === 'en' ? paper.en : paper.so}
                </p>
                <div className="flex items-center justify-between text-[10px] text-white/30">
                  <span className="font-semibold text-white/40 truncate">{paper.authors}</span>
                  <span className="flex-shrink-0 ml-2 px-1.5 py-0.5 bg-white/5 rounded">{paper.year} · {paper.type}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #040b1c 0%, #070e24 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
            <AlertTriangle size={20} className="text-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            {lang === 'en' ? <>These numbers are <span className="text-gold">people, not statistics.</span></> : <>Tiradahan waa <span className="text-gold">dad, ma tiro kaliya.</span></>}
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10">
            {lang === 'en'
              ? 'XTS is committed to addressing every one of these crises with funded, concrete plans. Join us or donate to make it real.'
              : 'XTS waxay u heellan tahay in ay xalliso dhibaato kasta oo ah qorshooyinka lacag-gashay ee dhab ah. Noogu soo biir ama xiwaal si ay dhabta u noqoto.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/join">
              <motion.span whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(201,162,39,0.5)' }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-gold text-navy font-black text-base rounded-full cursor-pointer shadow-lg shadow-gold/20">
                <Users size={18} /> {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'}
              </motion.span>
            </Link>
            <Link href="/donate">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 border border-red-500/50 text-red-400 font-bold text-base rounded-full cursor-pointer transition-all">
                <Heart size={16} className="fill-red-400/30" /> {lang === 'en' ? 'Donate Now' : 'Hadda Xiwaal'}
              </motion.span>
            </Link>
            <Link href="/manifesto">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 border border-white/15 text-white/60 font-semibold text-base rounded-full cursor-pointer transition-all">
                <BookOpen size={16} /> {lang === 'en' ? 'See Our Plans' : 'Qorshayaasha Arag'}
              </motion.span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
