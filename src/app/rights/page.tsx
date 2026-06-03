'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { Scale, Shield, Users, Heart, BookOpen, Star, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const ARTICLES = [
  {
    num: 11,
    icon: Users,
    color: '#c9a227',
    category: { en: 'Equality', so: 'Sinnaanta' },
    en: {
      title: 'Article 11 — Equality',
      text: 'All citizens, regardless of sex, religion, social or economic status, political opinion, clan, disability, occupation, birth or dialect shall have equal rights and duties before the law.',
      relevance: 'This article makes the 4.5 clan system unconstitutional. Equal rights means equal votes — not shares divided by clan.',
    },
    so: {
      title: 'Maqaalka 11 — Sinnaanta',
      text: 'Dhammaan muwaadiniinta, jinsiga, diinta, xaaladda bulshada ama dhaqaalaha, fikradda siyaasadeed, qabiilka, naafanimada, shaqada, dhalashada ama lahjadda aysan loo eegin, waxay leeyihiin xuquuq iyo waajibaad siman hortii sharciga.',
      relevance: 'Maqaalkan wuxuu ka dhigayaa nidaamka 4.5 ee qabiilku mid dastuurka ka soo horjeeda. Xuquuq siman macnaheedu waa cod siman — ma aha qaybaha qabiilka ku kala qaybsan.',
    },
  },
  {
    num: 38,
    icon: Star,
    color: '#3b82f6',
    category: { en: 'Right to Vote', so: 'Xaqa Codeynta' },
    en: {
      title: 'Article 38 — Right to Vote',
      text: 'Every citizen who has reached the age of 18 shall have the right to vote, and shall have the right to be elected to public office, unless otherwise restricted by this Constitution or federal law.',
      relevance: 'Your vote is a constitutional right — not a privilege. No clan elder, no warlord, no political deal can take it from you.',
    },
    so: {
      title: 'Maqaalka 38 — Xaqa Codeynta',
      text: 'Muwaadin kasta oo gaadha 18 jir wuxuu xaq u leeyahay inuu codeeyaa, wuxuuna xaq u leeyahay inuu u tartamo xafiisyada dadweynaha, haddaan Dastuurkan ama sharciga federaalka kale si kale u xukumin.',
      relevance: 'Codkaagu waa xaq dastuuriga ah — ma aha maamul. Odayga qabiilka, nin xoog leh, ama heshiis siyaasadeed kuma qaadi karo.',
    },
  },
  {
    num: 39,
    icon: Scale,
    color: '#8b5cf6',
    category: { en: 'Political Participation', so: 'Lug-qaadashada Siyaasadeed' },
    en: {
      title: 'Article 39 — Political Rights',
      text: 'Every citizen shall have the right to take part in public affairs. Every citizen shall have an equal right of access to public service and equal opportunity to be elected.',
      relevance: 'No Somali can be legally barred from political life because of their clan. Equal access is the law.',
    },
    so: {
      title: 'Maqaalka 39 — Xuquuqda Siyaasadeed',
      text: 'Muwaadin kasta wuxuu xaq u leeyahay inuu ka qayb qaato arrimaha guud. Muwaadin kasta wuxuu leeyahay xaq siman helitaanka adeegga dadweynaha iyo fursad siman in la dooro.',
      relevance: 'Soomaali kama laga soo celiyaayaan si sharciga ahi nolasha siyaasadeed qabiilkooda darteed. Helitaanka siman waa sharci.',
    },
  },
  {
    num: 42,
    icon: BookOpen,
    color: '#22c55e',
    category: { en: 'Political Parties', so: 'Xisbiyadda Siyaasadeed' },
    en: {
      title: 'Article 42 — Political Parties',
      text: 'Citizens have the right to form political parties or to participate in political parties. Political parties must not be based on religion, clan or sub-clan, sex, or occupation.',
      relevance: 'XTS is built exactly on this article — a party for all Somalis, not one clan or group. The constitution demands it.',
    },
    so: {
      title: 'Maqaalka 42 — Xisbiyadda Siyaasadeed',
      text: 'Muwaadiniintu waxay xaq u leeyihiin inay aasasaan xisbiyada siyaasadeed ama ay ka qayb galaan xisbiyada siyaasadeed. Xisbiyada siyaasadeed ma aasaasan karaan diinta, qabiilka ama qaybta hoosteedu, jinsiga, ama shaqada.',
      relevance: 'XTS si buuxda ayaa loogu dhisay maqaalkan — xisbi Soomaali oo dhan u ah, ma aha qabiil ama koox. Dastuurku sidaas ayuu u dalbanayaa.',
    },
  },
  {
    num: 34,
    icon: Heart,
    color: '#ec4899',
    category: { en: "Women's Rights", so: 'Xuquuqda Haweenka' },
    en: {
      title: 'Article 34 — Rights of Women',
      text: 'Women shall have the right to political participation and shall be represented in the national institutions of the state. There shall be no discrimination against women in matters of education, employment or any other public matters.',
      relevance: 'The constitution guarantees women equal political participation. XTS enforces this with our 30% minimum commitment — pushing toward 50%.',
    },
    so: {
      title: 'Maqaalka 34 — Xuquuqda Haweenka',
      text: 'Haweenku waxay xaq u leeyihiin lug-qaadashada siyaasadeed waxaana la matalayaa hay\'adaha qaranka ee dowladda. Takoor kuma jiri doono haweenka arrimaha waxbarashada, shaqada ama arrimaha kale ee dadweynaha.',
      relevance: 'Dastuurku wuxuu dammaanad qaadaa haweenka lug-qaadashada siyaasadeed ee siman. XTS waxay hirgelisaa tan 30% ugu yaraan ballanqaadkayaga — u dhaqdhaqaaqaysa 50%.',
    },
  },
  {
    num: 35,
    icon: Shield,
    color: '#f97316',
    category: { en: "Children's Rights", so: 'Xuquuqda Caruurta' },
    en: {
      title: 'Article 35 — Rights of Children',
      text: 'Every child has the right to a name and nationality from birth, to be protected from discrimination and exploitation, to receive free primary education, and to be protected from physical and psychological harm.',
      relevance: 'Free primary education is a constitutional right for every Somali child. XTS will make this real nationwide.',
    },
    so: {
      title: 'Maqaalka 35 — Xuquuqda Caruurta',
      text: 'Ilmo kasta wuxuu xaq u leeyahay magac iyo dhalasho dhalashada xilliga, in laga dhawro takoorka iyo la-abaarta, inuu helaa waxbarasho hoose oo bilaash ah, oo in laga dhawro waxyeelada jirka iyo maskaxda.',
      relevance: 'Waxbarashada hoose oo bilaash ah waa xaq dastuuriga ah ee ilmo Soomaali kasta. XTS waxay tan u dhigaysaa xaqiiq qaranka oo dhan.',
    },
  },
  {
    num: 36,
    icon: Users,
    color: '#06b6d4',
    category: { en: 'Minority Rights', so: 'Xuquuqda Yar-yar' },
    en: {
      title: 'Article 36 — Minority Groups',
      text: 'All minority groups shall have the right to preserve their traditions and customs, to establish their own educational institutions, and to participate equally in the political process.',
      relevance: 'Minority clans and groups — including those excluded by the 4.5 system — have a constitutional right to equal political participation.',
    },
    so: {
      title: 'Maqaalka 36 — Kooxaha Yar-yar',
      text: 'Dhammaan kooxaha yar-yar waxay xaq u leeyihiin in ay ilaaliyaan dhaqannadooda iyo caadooyinkooda, in ay aasasaan hay\'adahooda waxbarasho, oo ay si siman ugu qayb galaan hannaanka siyaasadeed.',
      relevance: 'Qabiilada yar-yar iyo kooxaha — oo ay ku jiraan kuwa laga reebay nidaamka 4.5 — waxay leeyihiin xaq dastuuriga ah oo ay ku qaybgalaan si siman siyaasadda.',
    },
  },
  {
    num: 109,
    icon: Scale,
    color: '#c9a227',
    category: { en: 'Electoral Commission', so: 'Guddiga Doorashada' },
    en: {
      title: 'Article 109B — Independent Electoral Commission',
      text: 'There shall be an Independent Electoral Commission (ICES) to manage and supervise elections. ICES shall be independent of government, political parties, and any other authority.',
      relevance: 'The ICES is independent by law. Any political interference in elections is unconstitutional — XTS will always respect and defend this.',
    },
    so: {
      title: 'Maqaalka 109B — Guddiga Doorashada ee Madaxbanaan',
      text: 'Waxaa jiri doona Guddi Doorasho oo Madaxbanaan (ICES) oo maareynaya oo kormeeraya doorashooyinka. ICES waxay ka madaxbanaanaan doontaa dowladda, xisbiyada siyaasadeed, iyo awood kale oo kasta.',
      relevance: 'ICES waa madaxbanaan sharciga. Faragelin siyaasadeed kasta oo doorashooyinka ku ah waa dastuurka ka soo horjeeda — XTS had iyo jeer ayay la ixtiraamaysaa oo u difaaci doontaa tan.',
    },
  },
];

function ArticleCard({ article, lang, index }: { article: typeof ARTICLES[0]; lang: 'en' | 'so'; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = article.icon;
  const content = article[lang];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
    >
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 p-5 text-left">
        <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${article.color}20`, border: `1px solid ${article.color}40` }}>
          <Icon size={18} style={{ color: article.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${article.color}15`, color: article.color }}>
              {article.category[lang]}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">{content.title}</h3>
        </div>
        {open ? <ChevronUp size={16} className="text-white/30 flex-shrink-0" /> : <ChevronDown size={16} className="text-white/30 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/8 pt-4">
          <p className="text-white/70 text-sm leading-relaxed">{content.text}</p>
          <div className="flex items-start gap-2 bg-gold/8 border border-gold/20 rounded-xl p-3">
            <AlertCircle size={14} className="text-gold flex-shrink-0 mt-0.5" />
            <p className="text-gold/80 text-xs leading-relaxed">{content.relevance}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function RightsPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Scale size={13} />
            {lang === 'en' ? 'Federal Republic of Somalia' : 'Jamhuuriyadda Federaalka Soomaaliya'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'Your Constitutional Rights' : 'Xuquuqdaada Dastuuriga ah'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'The Provisional Constitution of Somalia (2012) already guarantees these rights to every Somali citizen. Know your rights — they are the law.'
              : 'Dastuurka Ku-meel-gaarka ah ee Soomaaliya (2012) horaan u dammaanad qaadaa xuquuqdaan muwaadin Soomaali ah kasta. Ogow xuquuqdaada — waa sharci.'}
          </p>
        </motion.div>
      </div>

      {/* Constitution note */}
      <div className="max-w-3xl mx-auto px-4 mb-10">
        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <BookOpen size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-blue-200 text-sm leading-relaxed">
            {lang === 'en'
              ? 'Source: Provisional Constitution of the Federal Republic of Somalia, 2012. The full text is available at the Federal Government of Somalia website. XTS is committed to the full implementation of every article listed here.'
              : 'Isha: Dastuurka Ku-meel-gaarka ah ee Jamhuuriyadda Federaalka Soomaaliya, 2012. Qoraalka buuxa waxaa laga heli karaa goobta internetka Dowladda Federaalka Soomaaliya. XTS waxay u heellan tahay hirgelinta buuxda ee maqaal kasta oo halkan ku qoran.'}
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <div className="space-y-3">
          {ARTICLES.map((article, i) => (
            <ArticleCard key={article.num} article={article} lang={lang} index={i} />
          ))}
        </div>
      </div>

      {/* 4.5 System vs Constitution */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {lang === 'en' ? 'The 4.5 System Violates the Constitution' : 'Nidaamka 4.5 Wuxuu Ka Soo Horjeedaa Dastuurka'}
          </h2>
          <div className="space-y-3">
            {[
              {
                en: 'Article 11 guarantees equal rights regardless of clan. The 4.5 system gives different power to different clans — direct violation.',
                so: 'Maqaalka 11 wuxuu dammaanad qaadaa xuquuq siman ee qabiilka aysan loo eegin. Nidaamka 4.5 wuxuu siinayaa awood kala duwan qabiilada kala duwan — xad-gudub toos ah.',
              },
              {
                en: 'Article 38 gives every citizen equal voting rights. The 4.5 system weighs votes by clan — directly unconstitutional.',
                so: 'Maqaalka 38 wuxuu siinayaa muwaadin kasta xuquuq siman oo codeyn. Nidaamka 4.5 wuxuu miisaamayaa codadka qabiilka — si toos ah dastuurka ka soo horjeeda.',
              },
              {
                en: 'Article 36 protects minority groups. The 4.5 system formally excludes minority clans from full representation.',
                so: 'Maqaalka 36 wuxuu ilaalinayaa kooxaha yar-yar. Nidaamka 4.5 si rasmi ah wuxuu ka saarayaa qabiilada yar-yar matalanta buuxda.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                <p className="text-white/70 text-sm leading-relaxed">{item[lang]}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-red-500/20">
            <p className="text-white/50 text-sm italic">
              {lang === 'en'
                ? 'XTS will fight through democratic, constitutional, and legal means to replace the 4.5 system with genuine one-person-one-vote democracy as the constitution demands.'
                : 'XTS waxay la dagaallami doontaa hab dimuqraadi, dastuuriga ah, iyo sharci ah si loo beddelo nidaamka 4.5 dimuqraadiyad runta ah oo hal qof-hal cod ah sida dastuurku u dalbanayo.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            {lang === 'en' ? 'Defend the Constitution — Join XTS' : 'U Difaac Dastuurka — Ku Biir XTS'}
          </h2>
          <p className="text-white/60 mb-6">
            {lang === 'en' ? 'XTS fights every day to make these constitutional rights real for every Somali.' : 'XTS maalin walba ayay u diriraysaa si ay xuquuqdahan dastuuriga ah uga dhigtaa xaqiiq Soomaali kasta.'}
          </p>
          <a href="/join" className="inline-block px-8 py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold/90 transition-all">
            {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
