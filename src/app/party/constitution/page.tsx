'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { FileText, ChevronDown, ChevronUp, Scale } from 'lucide-react';

interface Article {
  num: number;
  en: { title: string; content: string };
  so: { title: string; content: string };
}

const ARTICLES: Article[] = [
  {
    num: 1,
    en: { title: 'Name and Identity', content: 'The party shall be known as Xisbiga Tallaabada Shacabka, abbreviated XTS, and in English as The People\'s Progress Party. The party is a legal political entity registered under the laws of the Federal Republic of Somalia.' },
    so: { title: 'Magaca iyo Aqoonsiga', content: 'Xisbiga waxaa loo yaqaan Xisbiga Tallaabada Shacabka, oo gaabis ahaan loo yaqaan XTS. Xisbiga waa hay\'ad siyaasadeed oo sharci ah oo ka diiwaangashan sharciyada Jamhuuriyadda Federaalka Soomaaliya.' },
  },
  {
    num: 2,
    en: { title: 'Founding Principles', content: 'XTS is founded upon five unbreakable principles: (1) Democracy — the authority of government comes from the people alone; (2) Equality — all Somali citizens are equal under the law regardless of clan, gender, region, or religion; (3) Justice — every citizen deserves fair treatment, fair courts, and fair opportunity; (4) Accountability — all party and government officials must answer to the people; (5) Transparency — party finances, decisions, and processes shall be open to public scrutiny.' },
    so: { title: 'Mabaadi\'da Aasaasiga', content: 'XTS waxaa laga dhisay shan mabaadi\' oo aan jabnayn: (1) Dimuqraadiyad — awooda dowladdu waxay ka timaadaa dadka oo keliya; (2) Sinnaanta — muwaadiniinta Soomaaliyeed oo dhan waxay siman yihiin sharciga hoos tiisa qabiilka, jinsiga, gobolka, ama diinta aysan loo eegin; (3) Cadaaladda — muwaadin kasta wuxuu mudan yahay daaqdid xaq ah, maxkamado xaq ah, iyo fursad xaq ah; (4) Xisaabtanaanta — dhammaan mas\'uuliyiinta xisbiga iyo dowladda waa in ay u jawaabaan dadka; (5) Shafafnaan — maaraynta xisbiga, go\'aamadiisa, iyo habdhaqankiisu waa in ay furan yihiin baarista dadweynaha.' },
  },
  {
    num: 3,
    en: { title: 'Membership', content: 'Membership in XTS is open to every Somali citizen aged 18 or over, without distinction of clan, region, gender, or background. Membership requires: (a) agreement with the party\'s founding principles; (b) payment of an annual membership fee, which shall be set at an affordable rate; (c) no current membership in another registered Somali political party. Membership may not be denied or revoked on the basis of clan.' },
    so: { title: 'Xubinnimada', content: 'Xubinnimada XTS waxay furan tahay muwaadin Soomaali ah kasta oo 18 jir ama ka weyn, iyada oo aan loo eegi qabiilka, gobolka, jinsiga, ama asal ahaan. Xubinnimadu waxay u baahan tahay: (a) heshiiska mabaadi\'da aasaasiga xisbiga; (b) bixinta lacagta xubinnimada sanadlaha ah, kaas oo la xiddi lahaa qiimo la heli karo; (c) aan hadda xubinnimo ku lahayn xisbi siyaasadeed kale oo Soomaaliyeed oo diiwaangashan. Xubinnimada uma diidi doonto oo uma joojin doonto qabiilka.' },
  },
  {
    num: 4,
    en: { title: 'Leadership Structure', content: 'XTS shall be led by: (1) A Party Congress — the supreme decision-making body, convening every two years, composed of elected delegates from all regions; (2) A National Executive Committee (NEC) — responsible for day-to-day party governance, consisting of 21 elected members; (3) A Party Chair — elected by the Congress for a four-year term, maximum two terms; (4) A Secretary-General — appointed by the NEC, responsible for administration. A minimum of 30% of all leadership positions must be held by women.' },
    so: { title: 'Qaab-dhismeedka Hogaaminta', content: 'XTS waxaa hogaamin doona: (1) Golaha Xisbiga — hay\'adda ugu sare ee go\'aaminta, oo shiraaya laba sano marka loo eego, oo ka kooban wakiillada la doortay dhammaan goboladda; (2) Gudiga Fulinta ee Qaranka (NEC) — mas\'uulka maalinlaha maamulka xisbiga, oo ka kooban 21 xubn oo la doortay; (3) Guddoomiyaha Xisbiga — la doortay golaha afar sano, ugu badan laba xilli; (4) Xoghayaha Guud — uu magacaabay NEC, mas\'uulka maamulka. Ugu yaraan 30% dhammaan xafiisyada hogaaminta waa in uu hayo haweenku.' },
  },
  {
    num: 5,
    en: { title: 'The 4.5 Clan System', content: 'XTS formally and completely rejects the 4.5 power-sharing clan system as incompatible with democracy, equality, and the dignity of all Somali citizens. XTS shall never use the 4.5 system as a basis for internal allocations, candidate selection, or government appointments. XTS is committed to replacing the 4.5 system with a one-person-one-vote electoral system in which every Somali citizen has equal standing regardless of clan.' },
    so: { title: 'Nidaamka Qabiilka 4.5', content: 'XTS si rasmi ah oo buuxda ayay u diiday nidaamka qabiilka 4.5 ee wadaagga awooda maadaama uusan la jaanqaadi karin dimuqraadiyada, sinnaanta, iyo sharafta muwaadiniinta Soomaaliyeed oo dhan. XTS weligeedba ma isticmaali doonto nidaamka 4.5 aasaas ahaan u ah qaybinta gudaha, doorashada musharaxiinta, ama magacaabista dowladda. XTS waxay u heellan tahay in la beddelo nidaamka 4.5 nidaam doorasho ah oo hal qof-hal cod ah oo muwaadin Soomaali ah kasta ay ku leedahay joog siman qabiilkiisa ha noqdee.' },
  },
  {
    num: 6,
    en: { title: 'Finances and Transparency', content: 'All party income and expenditure shall be recorded and publicly reported annually. XTS shall not accept donations from: (a) foreign governments or foreign government-linked entities; (b) any individual or company seeking government contracts; (c) anonymous sources over $500. An independent Audit Committee of three members shall review party finances quarterly. Full financial statements shall be published on the party website within 60 days of each financial year end.' },
    so: { title: 'Maaliyadda iyo Shafafnaanta', content: 'Dhammaan dakhliga iyo kharashka xisbiga waa in la diiwaangeliyo oo sanad walba si dadweyne ah loo wariyaa. XTS ma aqbali doonto deeqaha: (a) dowladaha shisheeye ama hay\'adaha la xidha dowladaha shisheeye; (b) shakhsi ama shirkad kasta oo raadinaya xariigooyinka dowladda; (c) ilaha magac la\'aanta ah ee ka badan $500. Gudiga Xisaabta Madaxbanaan ee saddex xubnood ayaa dib u eegi doona maaliyadda xisbiga goor kasta oo rubuca ah. Warbixinnada maaliyadda oo buuxa waxaa la daabici doonaa goobta internetka xisbiga 60 maalmood gudahood ka dib dhammaadka sannadka maaliyadda.' },
  },
  {
    num: 7,
    en: { title: 'Women and Youth', content: 'XTS formally establishes a Women\'s Wing and a Youth Wing as integral parts of the party structure. Each wing shall have: (a) an elected leadership body; (b) a dedicated budget allocation of not less than 10% of total party expenditure; (c) direct representation on the National Executive Committee. The Women\'s Wing shall have a minimum of two seats on the NEC. The Youth Wing (ages 18–35) shall have a minimum of two seats on the NEC.' },
    so: { title: 'Haweenka iyo Dhalinyarada', content: 'XTS si rasmi ah ayay u aasaasaysaa Goobta Haweenka iyo Goobta Dhalinyarada qaybo aasaasi ah oo ah qaab-dhismeedka xisbiga. Goob kasta waxay lahaanaysaa: (a) hay\'ad hogaamin oo la doortay; (b) qaybsiga miisaaniyaha u gaar ah oo aan ka yarin 10% kharashka xisbiga oo wadar ah; (c) wakaaladda tooska ah ee Guddiga Fulinta ee Qaranka. Goobta Haweenka waxay lahaanaysaa ugu yaraan laba kursi NEC. Goobta Dhalinyarada (da\'da 18–35) waxay lahaanaysaa ugu yaraan laba kursi NEC.' },
  },
  {
    num: 8,
    en: { title: 'Diaspora Membership', content: 'Somalis living outside Somalia are entitled to full XTS membership and the rights that come with it, including the right to vote in party elections and to stand as party candidates. XTS shall establish diaspora chapters in countries with significant Somali populations. Diaspora members may vote in party elections online through a secure verified system. XTS commits to pushing for diaspora voting rights in Somali national elections.' },
    so: { title: 'Xubinnimada Qurbojoog', content: 'Soomaalida ku nool dibedda Soomaaliya waxay xaq u leeyihiin xubinnimada buuxda ee XTS iyo xuquuqaha la socda, oo ay ku jiraan xaqa u codeynta doorashooyinka xisbiga iyo inay u taagan yihiin musharaxiinta xisbiga. XTS waxay aasaasi doontaa qaybaha qurbojoogta dalalka ay ku nool yihiin dad Soomaali ah oo badan. Xubnaha qurbojoogta waxay u codeeyn karaan doorashooyinka xisbiga online nidaam xaqiijin ammaan leh iyaga loo marayo. XTS waxay u heellan tahay in la dagaalamo xuquuqda codeynta qurbojoogta doorashooyinka qaranka Soomaaliya.' },
  },
  {
    num: 9,
    en: { title: 'Amendments', content: 'This Constitution may be amended only by a two-thirds majority vote of the Party Congress. Proposed amendments must be submitted in writing at least 60 days before the Congress at which they will be voted on. Articles 1, 2, and 5 — relating to the party name, founding principles, and rejection of the 4.5 system — may not be amended under any circumstances.' },
    so: { title: 'Wax Ka Beddelista', content: 'Dastuurkan wax ka beddelista waxaa loo baahan yahay cod-bixinta laba-saddexaad oo baarlamaanka xisbiga. Wax-ka-beddelladaha la soo jeediyay waa in lagu gudbin qoraal ahaan ugu yaraan 60 maalmood ka hor golaha ay ku codeyn doonaan. Maqaalada 1, 2, iyo 5 — kuwaas oo ku saabsan magaca xisbiga, mabaadi\'da aasaasiga, iyo diiridda nidaamka 4.5 — waa in aan weligood laga bedeli karin xaaladda kasta.' },
  },
  {
    num: 10,
    en: { title: 'Dissolution', content: 'XTS may be dissolved only by a unanimous vote of the full Party Congress convened specifically for this purpose, with a minimum 90-day notice period. In the event of dissolution, all party assets shall be transferred to a registered Somali civil society organisation agreed upon by the Congress. No assets may be distributed to individual members.' },
    so: { title: 'Kala Joojinta', content: 'XTS waxaa laga kala joojin karaa kaliya cod-bixin midaysan oo golaha xisbiga oo dhan ah oo u shiraaya gaar ahaan ujeeddadaas, oo leh muddada ogeysiiska ugu yaraan 90 maalmood. Kiiska kala joojinta, dhammaan hantida xisbiga waa in loo gudbiyo hay\'ad bulshada rayidka ee diiwaangashan ee Soomaaliyeed oo golaha ku heshiiyay. Hantidu mas\'uuliyiin shakhsiga ah looma qaybsan karo.' },
  },
];

function ArticleCard({ article, lang }: { article: Article; lang: 'en' | 'so' }) {
  const [open, setOpen] = useState(false);
  const content = article[lang];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-gold text-xs font-black uppercase tracking-widest w-12 flex-shrink-0">
            {lang === 'en' ? `Art. ${article.num}` : `M. ${article.num}`}
          </span>
          <span className="font-semibold text-white text-sm">{content.title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-white/40 flex-shrink-0" /> : <ChevronDown size={16} className="text-white/40 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-white/8">
          <p className="text-white/60 text-sm leading-relaxed pt-4">{content.content}</p>
        </div>
      )}
    </div>
  );
}

export default function ConstitutionPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-12" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <FileText size={13} />
            {lang === 'en' ? 'Founding Document' : 'Dukumiintiga Aasaasiga'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'Party Constitution' : 'Dastuurka Xisbiga'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            {lang === 'en'
              ? 'The founding document of Xisbiga Tallaabada Shacabka — XTS. These are the rules, values, and commitments that every member, leader, and candidate is bound by.'
              : 'Dukumiintiga aasaasiga Xisbiga Tallaabada Shacabka — XTS. Kuwani waa xeerarka, qiyamka, iyo ballanqaadyada ay xubin kasta, hogaamin kasto, iyo musharax kasta ku xidnaadaan.'}
          </p>
        </motion.div>
      </div>

      {/* Preamble */}
      <div className="max-w-3xl mx-auto px-4 mb-10">
        <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={18} className="text-gold" />
            <h2 className="font-bold text-white">{lang === 'en' ? 'Preamble' : 'Hordhac'}</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed italic">
            {lang === 'en'
              ? 'We, the founding members of Xisbiga Tallaabada Shacabka, believing in the dignity and equality of every Somali citizen; committed to building a democratic, just, and prosperous Somalia; resolved to end the divisive 4.5 clan system and replace it with genuine democracy; and inspired by the principles of Islam which affirm the equality of all human beings — do hereby establish this Constitution as the supreme governing document of our party. We dedicate ourselves to the service of the Somali people — all of them, without exception.'
              : 'Annagu, xubnaha aasaasiga ee Xisbiga Tallaabada Shacabka, oo rumaynta sharafta iyo sinnaanta muwaadin Soomaali ah kasta; ku heellanaan dhisidda Soomaaliya dimuqraadi, cadaalad leh, oo barakaysan; go\'aansan inaan dhammaynno nidaamka qabiilka 4.5 ee kala-qeybisan oo aan ka bedelno dimuqraadiyad runta ah; oo ay dhiirigelisay mabaadi\'da Islaamka ee xaqiijinaysa sinnaanta aadamiinta oo dhan — sidaas darteed waxaan aasaasnaa Dastuurkan dukumiintiga maamulka ugu sarreeya xisbigayaga. Isha ugu hurnaa ayaan u xidhidhnayn adeegga dadka Soomaaliyeed — oo dhankooda, exception la\'aan.'}
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-lg font-bold text-white mb-5">{lang === 'en' ? 'Articles' : 'Maqaalada'}</h2>
        <div className="space-y-3">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.num}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <ArticleCard article={article} lang={lang} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Adoption notice */}
      <div className="max-w-3xl mx-auto px-4 mt-10">
        <div className="text-center bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/40 text-xs">
            {lang === 'en'
              ? 'Adopted by the Founding Congress of Xisbiga Tallaabada Shacabka, 2025. This document is the supreme governing instrument of XTS. No individual, committee, or officer may act contrary to its provisions.'
              : 'Loo aqbalay Golaha Aasaasiga ee Xisbiga Tallaabada Shacabka, 2025. Dukumiintigan waa qaladaadka maamulka ugu sarreeya ee XTS. Shakhsi, guddi, ama sarkaal kuma ahan inuu ku dhaqmaan si ka soo horjeeda xukumaadkiisa.'}
          </p>
        </div>
      </div>
    </div>
  );
}
