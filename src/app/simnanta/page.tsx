'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/hooks/useLang';
import { Scale, BookOpen, Users, Star, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   QURAN VERSES — each entry has:
     arabic        → original Arabic text
     transliteration → how to read it in Latin letters (sounds)
     en            → English meaning
     so            → Somali translation (natural, not word-for-word)
   ───────────────────────────────────────────────────────────────────────────── */
const VERSES = [
  /* 1 — Al-Hujurat 49:13 — the equality verse */
  {
    id: 'hujurat-13',
    ref: 'Al-Hujurat • 49:13',
    color: '#c9a227',
    icon: Star,
    highlight: true,
    arabic:
      'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ',
    transliteration:
      'Yaa ayyuhan-naas, innaa khalaqnaakum min dhakarin wa-unthaa, wa ja\'alnaakum shu\'ooban wa qabaa\'ila lita\'aarafoo. Inna akramakum \'indal-laahi atqaakum.',
    en: '"O mankind — We created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you."',
    so: '"Dadow — Annagu waxaan idiin abuuray lab iyo dheddig, oo waxaan idiin dhigay ummaduhu iyo qabiiladu si ay isugu yaqaanaan. Laakiin ogaada: kii Eebe u sharafta badan waa kii ugu dhaqanka fiican — kuma aha kii aasalka ka sarreeya."',
    meaning: {
      en: 'Tribes were created so people could recognise and cooperate with each other — not to rank or dominate one another. The only measure Allah uses is righteousness, not lineage or clan.',
      so: 'Qabiiladu waxay loo abuuray in dadku isku garto oo is-garab siiyaan — ma aha in mid kale ka sarreeyaan. Eebe kuma cabiray sharafta dadka asal ahaan, wuxuu ku cabbiray dhaqan iyo taqwa.',
    },
  },

  /* 2 — Al-Hujurat 49:11 — no mocking by origin or appearance */
  {
    id: 'hujurat-11',
    ref: 'Al-Hujurat • 49:11',
    color: '#f97316',
    icon: AlertTriangle,
    highlight: false,
    arabic:
      'يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ',
    transliteration:
      'Yaa ayyuhal-ladheena aamanoo, laa yaskhar qawmun min qawmin \'asaa an yakoonoo khayran minhum.',
    en: '"O you who have believed — let not a people ridicule another people; perhaps they may be better than them."',
    so: '"Kuwa rumaystow — ha jirin koox kale oo ka qososhaa ama ka fiican u maleynaysa sabab la\'aanteed; waxa laga yaabaa in kuwa la kafoofinayaa ay ka wanaagsan yihiin."',
    meaning: {
      en: 'No person or group may demean another based on tribe, skin colour, origin or place of birth. Allah warns that the ones being looked down upon may, in truth, be the more honourable.',
      so: 'Qof ma aha mida wax lagu hooseeyo sabab la\'aanteed — qabiilkiisa, midabkiisa, halkuu ka yimid, ama sida uu u dhalay. Eebe wuxuu na digayaa: kan la ceebaynayaa waxa laga yaabaa inuu runtii ka sharafnaado.',
    },
  },

  /* 3 — An-Nisa 4:58 — just governance */
  {
    id: 'nisa-58',
    ref: 'An-Nisa • 4:58',
    color: '#3b82f6',
    icon: Scale,
    highlight: false,
    arabic:
      'إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ',
    transliteration:
      'Innal-laaha ya\'murukum an tu\'addil-amaanaati ilaa ahlihaa, wa idhaa hakamtum baynan-naasi an tahkumoo bil-\'adl.',
    en: '"Indeed, Allah commands you to render trusts to whom they are due, and when you judge between people, to judge with justice."',
    so: '"Runtii Eebe wuxuu idinku amrayaa inaad amaanada siiso kuwa xaqiisa leh, markaad dadka dhexdooda go\'aan gaarsiinaanba, cadaalad ku aasaasa."',
    meaning: {
      en: 'A government\'s duty is to be a trust (amanah) held for the people — not for a clan or a group. When decisions are made, they must be just for all citizens equally. This is the Islamic foundation of accountable leadership.',
      so: 'Dowladdu waa amaano la qabtay dadka — ma aha qabiil gaar ah. Markaad go\'aan gaarsiinaanba, waa in caddaaladda lagu saleeyo dadka oo dhan isku si. Kani waa aasaaska Islaamiga ee hoggaanka xisaabtanka leh.',
    },
  },

  /* 4 — Al-Nahl 16:90 — Allah commands justice, forbids oppression */
  {
    id: 'nahl-90',
    ref: 'An-Nahl • 16:90',
    color: '#22c55e',
    icon: Shield,
    highlight: false,
    arabic:
      'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ',
    transliteration:
      'Innal-laaha ya\'muru bil-\'adli wal-ihsaani wa iitaa\'i dhil-qurbaa, wa yanhaa \'anil-fahshaa\'i wal-munkari wal-baghyi.',
    en: '"Indeed, Allah commands justice, good conduct and giving to relatives, and He forbids immorality, bad conduct and oppression."',
    so: '"Runtii Eebe wuxuu amrayaa caddaaladda, xusnaanta dhaqanka, iyo gargaarka qaraabada. Wuxuuna ka reebayaa xumaanta, dembiyadda, iyo dulliga."',
    meaning: {
      en: 'Allah explicitly forbids al-baghi — oppression and injustice toward others. Any system that denies citizens equal political rights based on birth is al-baghi. The 4.5 formula falls directly under what Allah has forbidden here.',
      so: 'Eebe si cad ayuu u mamnuucayaa "al-baghi" — dulliga iyo xaq-dhaafka dadka. Nidaam kasta oo xuquuqda siyaasadeed kaga dhigo dhalashada asal ahaan — taasi waa al-baghi. Nidaamka 4.5 ayaa si toos ah uga dhacaya waxa Eebe halkan ka mamnuucay.',
    },
  },

  /* 5 — Al-Ma'idah 5:8 — justice even against those you dislike */
  {
    id: 'maida-8',
    ref: 'Al-Ma\'idah • 5:8',
    color: '#8b5cf6',
    icon: CheckCircle2,
    highlight: false,
    arabic:
      'يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ لِلَّهِ شُهَدَاءَ بِالْقِسْطِ ۖ وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا ۚ اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ',
    transliteration:
      'Yaa ayyuhal-ladheena aamanoo, koonoo qawwaameena lillaahi shuhadaa\'a bil-qist. Wa laa yajrimannakum shana\'aanu qawmin \'alaa allaa ta\'diloo. I\'diloo, huwa aqrabu lit-taqwaa.',
    en: '"O you who have believed — be persistently standing firm for Allah, witnesses in justice. And do not let the hatred of a people prevent you from being just. Be just; that is nearer to righteousness."',
    so: '"Kuwa iimaanka leh — xaqqa u xidnaada, markay timaaddo caddaaladda ogaada. Ha yeerin xanaaq koox kale oo kugu horjeeddo sabab aad u cadaaladdarri. Caddaalad u fal — taasina waa wax kugu soo dhowaynaysa Eebe."',
    meaning: {
      en: 'Even toward those you disagree with — even rival clans or political opponents — justice must not be abandoned. If Somalia\'s politicians applied this one verse, the 4.5 system would collapse tomorrow.',
      so: 'Xataa kuwa aad la xanaaqsantahay — xataa qabiilka kuu soo horjeeda ama lidka siyaasadeed — caddaaladda ha daydin. Hadduu masuuliyiinta Soomaaliyeed xataa aayaddaan keliya u dhaqmaan, nidaamka 4.5 berri ayuu dhici lahaa.',
    },
  },

  /* 6 — Al-Isra 17:70 — all humans equally honoured */
  {
    id: 'isra-70',
    ref: 'Al-Isra • 17:70',
    color: '#06b6d4',
    icon: Users,
    highlight: false,
    arabic:
      'وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ',
    transliteration:
      'Wa laqad karramnaa banii Aadam.',
    en: '"And We have certainly honoured the children of Adam."',
    so: '"Runtii annagu waxaan sharrafafnay dhammaan banii Aadamkii."',
    meaning: {
      en: 'Allah did not say He honoured some children of Adam. He said all. Every Somali — from whatever family, region or background — carries this divine honour. No political formula can strip that away.',
      so: 'Eebe kuma yidaahdin wuxuu sharrafafay qaar ka mid ah ilmaha Aadamka. Wuxuu yiri: dhammaan. Soomaali kasta — qoysas ha ka yimid, gobol ha ka yimid, asal ha leeyahay — sharaftaas Eebe baa u dhiibay. Nidaam siyaasadeed ma laha awood ay kala qaadan karto.',
    },
  },

  /* 7 — Sad 38:26 — just leadership commanded to David */
  {
    id: 'sad-26',
    ref: 'Sad • 38:26',
    color: '#ec4899',
    icon: BookOpen,
    highlight: false,
    arabic:
      'يَا دَاوُودُ إِنَّا جَعَلْنَاكَ خَلِيفَةً فِي الْأَرْضِ فَاحْكُم بَيْنَ النَّاسِ بِالْحَقِّ وَلَا تَتَّبِعِ الْهَوَىٰ فَيُضِلَّكَ عَن سَبِيلِ اللَّهِ',
    transliteration:
      'Yaa Daawuudu, innaa ja\'alnaaka khaleefatan fil-ard, fahkum baynan-naasi bil-haqq, wa laa tattabi\'il-hawaa fayudillaka \'an sabeelil-laah.',
    en: '"O David — We have made you a successor upon the earth, so judge between the people in truth and do not follow your own desire, as it will lead you astray from the way of Allah."',
    so: '"Daawuudow — Annagu waxaan kugu dhignay khaliifo dhulka. Dadka dhexdooda xaq ku xukum, hawooyada nafta ha raacin, waayo waxay kaa lexi doonaan jidka toosan."',
    meaning: {
      en: 'Leadership in Islam is not ownership — it is a trust (khalifah). A leader who distributes power among his own clan rather than appointing the most capable person has followed "his own desire" and strayed from Allah\'s way.',
      so: 'Hoggaanka Islaamka waa amaano — ma aha lahaanshaha. Hoggaamiye awood u qaybiya qabiilkiisa halkii uu u xilsaari lahaa kan ugu xirfada badan wuxuu raacay "hawooyada naftiisa" wuxuuna ka lexi jidka Eebe.',
    },
  },
];

/* ─── HADITHS ─────────────────────────────────────────────────────────────── */
const HADITHS = [
  {
    id: 'farewell',
    title: { en: 'The Last Sermon — Khutbat al-Wada\'', so: 'Khudbadiisii Ugu Dambeysay' },
    source: { en: 'Prophet Muhammad ﷺ at Arafah, narrated by Imam Ahmad', so: 'Nabi Muxammad ﷺ, Carafaat, waxaa wariyey Imaam Ahmad' },
    arabic: 'أَلَا لَا فَضْلَ لِعَرَبِيٍّ عَلَى عَجَمِيٍّ وَلَا لِعَجَمِيٍّ عَلَى عَرَبِيٍّ وَلَا لِأَحْمَرَ عَلَى أَسْوَدَ وَلَا لِأَسْوَدَ عَلَى أَحْمَرَ إِلَّا بِالتَّقْوَى',
    transliteration: 'Alaa laa fadla li-\'arabiyyin \'alaa \'ajamiyyin, wa laa li-\'ajamiyyin \'alaa \'arabiyyin, wa laa li-ahmara \'alaa aswad, wa laa aswada \'alaa ahmar, illaa bit-taqwaa.',
    en: '"Know that no Arab has superiority over a non-Arab, nor does a non-Arab have superiority over an Arab; no white person has superiority over a black person, nor does a black person have superiority over a white — except by piety and good action."',
    so: '"Ogaada — Carab ma leh dheeri ka sarreysa mid Carab-ahayn, mana laha mid Carab-ahayn wax ka sarreeya Carabkaba; midab cad ma sarreyso midab madow, mana sarreyso madowgu cad — keliya kii Eebe ka baqaya ayaa ka sharafnaya."',
    note: {
      en: 'This was spoken at Arafah on the Prophet\'s ﷺ last Hajj — one of the most witnessed speeches in human history. It abolished racial and ethnic hierarchy for all time.',
      so: 'Hadalkaan waxaa lagu yiri Carafaat xajkii ugu dambeeyay ee Nabiga ﷺ — mid ka mid ah hadalladii ugu badan ee taariikhda aadanahaan lagu maqlay. Wuxuu bedelay hierarchy jinsi iyo qabiiil waa weligeed.',
    },
  },
  {
    id: 'equal-comb',
    title: { en: '"People are Equal Like the Teeth of a Comb"', so: '"Dadku waa siman yihiin sida ilkaha gereska"' },
    source: { en: 'Al-Bayhaqi — well-known Islamic saying', so: 'Al-Bayhaqi — hadal Islaam caan ah' },
    arabic: 'النَّاسُ سَوَاسِيَةٌ كَأَسْنَانِ الْمِشْطِ',
    transliteration: 'An-naasu sawasiyyatun ka-asnaanil-misht.',
    en: '"The people are equal like the teeth of a comb."',
    so: '"Dadku way is-simanyihiin sida ilkaha geraska — mid kama sarreyso mid kale."',
    note: {
      en: 'Each tooth of a comb is the same size, the same height, the same worth. Not one tooth is "full" and another "half." This simple image destroys the logic of 4.5 completely.',
      so: 'Ilkaha geraska midkood isku dherer, isku weyn, isku qiimo. Ilkood ma laha "buux" halka kale loo yiraahdo "badh." Sawirkaan fudud ayaa si buuxda looga daayan caqliga 4.5.',
    },
  },
  {
    id: 'oppression',
    title: { en: 'Hadith Qudsi — Allah Forbids Oppression', so: 'Xadiis Qudsi — Eebe wuxuu mamnuucay dulliga' },
    source: { en: 'Sahih Muslim — narrated by Abu Dharr al-Ghifari', so: 'Saxiix Muslim — waxaa wariyey Abu Dharr al-Ghifaari' },
    arabic: 'يَا عِبَادِي، إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلَا تَظَالَمُوا',
    transliteration: 'Yaa \'ibaadii, innii harramtud-dhulma \'alaa nafsii wa ja\'altuhoo baynakum muharrama, fa-laa tadhaalamoo.',
    en: '"O My servants — I have made oppression forbidden for Myself and I have made it forbidden among you, so do not oppress one another."',
    so: '"Addoommayaashaydow — Aniga nafteydana dulliga waan ka mamnuucay, idinkana waan idiin mamnuucay, ee ha is-dulmin."',
    note: {
      en: 'Allah Himself — Exalted be He — declared that oppression is forbidden. Denying a Somali citizen equal political rights because of the clan they were born into is oppression (dhulm). This Hadith Qudsi addresses Allah\'s words directly to us.',
      so: 'Eebe Subxaanahu wa Ta\'aala — Isagoo naftiisa — wuxuu ku dhawaaqay in dulliggu yahay mamnuuc. In muwaadin Soomaaliga laga qaado xuquuqda siyaasadeed sababta la dhalay ee qabiilka taasi waa dullin (dhulm). Xadiiskan Qudsiggu si toos ah ayuu Eebe noogu hadlayaa.',
    },
  },
  {
    id: 'best-people',
    title: { en: '"The Best of People Are Those Most Beneficial to Others"', so: '"Kan ugu wanaagsan dadka waa kan ugu faa\'iidada badan dadka kale"' },
    source: { en: 'Al-Mu\'jam al-Awsat — Al-Tabarani', so: 'Al-Mu\'jam al-Awsat — Al-Tabaraani' },
    arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    transliteration: 'Khayrun-naasi anfa\'uhum lin-naas.',
    en: '"The best of people are those most beneficial to people."',
    so: '"Kan ugu sharafta badan dadka waa kan ugu faa\'iidada badan dadka kale — kuma aha kan ugu aasalka sareeya."',
    note: {
      en: 'The Prophet ﷺ did not say the best person is the one from the highest clan. He said the best is the one who brings the most benefit to others. This is the only merit system Islam recognises for leadership.',
      so: 'Nabiga ﷺ kuma yidaahdin kan ugu wanaagsan waa kan aasalka ugu sarreeya. Wuxuu yiri: kan ugu wanaagsan waa kan dadka ugu faa\'iidada badan. Kan keliya ayaa Islaamku aqoonsan yahay oo ah ciyaari-urur xirfadeed hoggaanka.',
    },
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}

/* ─── Verse card — 3 sections: Arabic / Transliteration / Somali ──────────── */
function VerseCard({ v, lang }: { v: typeof VERSES[0]; lang: string }) {
  const Icon = v.icon;
  return (
    <FadeIn>
      <div className={`rounded-2xl border overflow-hidden ${v.highlight ? 'border-gold/35' : 'border-white/10'}`}
        style={{ background: v.highlight ? `${v.color}09` : 'rgba(255,255,255,0.025)' }}>
        {v.highlight && <div className="h-1 w-full" style={{ background: v.color }} />}
        <div className="p-6 sm:p-7">

          {/* Reference badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${v.color}18`, border: `1px solid ${v.color}35` }}>
              <Icon size={15} style={{ color: v.color }} />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${v.color}18`, color: v.color, border: `1px solid ${v.color}30` }}>
              {v.ref}
            </span>
          </div>

          {/* ── Section 1: Arabic ── */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: `${v.color}80` }}>
              ① {lang === 'en' ? 'Arabic — Original Text' : '① Carabi — Qoraalka Asalka ah'}
            </div>
            <p className="text-right text-white/90 text-xl sm:text-2xl leading-loose font-serif" dir="rtl">
              {v.arabic}
            </p>
          </div>

          <div className="border-t border-white/8 my-5" />

          {/* ── Section 2: Transliteration ── */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: `${v.color}80` }}>
              ② {lang === 'en' ? 'Transliteration — How to Read It' : '② Sida Loo Aqriyo — Cod-sifaynta'}
            </div>
            <p className="text-white/65 text-sm sm:text-base leading-relaxed italic font-mono">
              {v.transliteration}
            </p>
          </div>

          <div className="border-t border-white/8 my-5" />

          {/* ── Section 3: Somali translation ── */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: `${v.color}80` }}>
              ③ {lang === 'en' ? 'Meaning in Somali' : '③ Macnaha Af-Soomaaliga'}
            </div>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed">
              {v.so}
            </p>
          </div>

          {lang === 'en' && (
            <>
              <div className="border-t border-white/8 my-5" />
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: `${v.color}80` }}>
                Meaning in English
              </div>
              <p className="text-white/75 text-sm leading-relaxed italic">{v.en}</p>
            </>
          )}

          {/* Commentary */}
          <div className="mt-5 p-4 rounded-xl" style={{ background: `${v.color}09`, border: `1px solid ${v.color}18` }}>
            <p className="text-xs leading-relaxed" style={{ color: `${v.color}c0` }}>
              <span className="font-black uppercase tracking-wide">
                {lang === 'en' ? 'XTS Reading: ' : 'Fahamka XTS: '}
              </span>
              {lang === 'en' ? v.meaning.en : v.meaning.so}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Hadith card — same 3-section format ───────────────────────────────── */
function HadithCard({ h, lang }: { h: typeof HADITHS[0]; lang: string }) {
  return (
    <FadeIn>
      <div className="rounded-2xl border border-gold/20 overflow-hidden"
        style={{ background: 'rgba(201,162,39,0.05)' }}>
        <div className="h-0.5 w-full bg-gold/30" />
        <div className="p-6 sm:p-7">

          {/* Title + source */}
          <div className="mb-5">
            <div className="text-white font-black text-sm mb-1">{lang === 'en' ? h.title.en : h.title.so}</div>
            <div className="text-gold/50 text-[11px]">{lang === 'en' ? h.source.en : h.source.so}</div>
          </div>

          {/* ── Section 1: Arabic ── */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold/50 mb-2">
              ① {lang === 'en' ? 'Arabic' : 'Carabi'}
            </div>
            <p className="text-right text-gold/90 text-lg sm:text-xl leading-loose font-serif" dir="rtl">
              {h.arabic}
            </p>
          </div>

          <div className="border-t border-gold/12 my-4" />

          {/* ── Section 2: Transliteration ── */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold/50 mb-2">
              ② {lang === 'en' ? 'Transliteration' : 'Sida Loo Aqriyo'}
            </div>
            <p className="text-white/60 text-sm leading-relaxed italic font-mono">
              {h.transliteration}
            </p>
          </div>

          <div className="border-t border-gold/12 my-4" />

          {/* ── Section 3: Somali ── */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold/50 mb-2">
              ③ {lang === 'en' ? 'Meaning in Somali' : 'Macnaha Af-Soomaaliga'}
            </div>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed">
              {h.so}
            </p>
          </div>

          {lang === 'en' && (
            <>
              <div className="border-t border-gold/12 my-4" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold/50 mb-2">Meaning in English</div>
              <p className="text-white/70 text-sm leading-relaxed italic">{h.en}</p>
            </>
          )}

          {/* Note */}
          <div className="mt-4 p-4 rounded-xl bg-white/4 border border-white/8">
            <p className="text-white/55 text-xs leading-relaxed">
              <span className="font-black text-white/70 uppercase tracking-wide">
                {lang === 'en' ? 'Context: ' : 'Macno dheeraad ah: '}
              </span>
              {lang === 'en' ? h.note.en : h.note.so}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function SimnantaPage() {
  const { lang } = useLang();

  const FOUR_POINTS = [
    {
      en: 'It distributes political seats by clan — not by ability, experience, or the choice of the people.',
      so: 'Kuraasta siyaasadeed wuxuu u qaybiyaa qabiil — kuma aha kartida, khibradda, ama xulashada dadweynaha.',
    },
    {
      en: 'It permanently labels certain Somali citizens as "half" — half a voice, half a vote, half a human. This has no place in Islam or democracy.',
      so: 'Si joogto ah ayuu qaar ka mid ah muwaadiniinta Soomaaliyeed u calaamadiyaa "badh" — badh cod, badh sawiro, badh aadane. Kani waxba kama leh Islaamka ama dimuqraadiyada.',
    },
    {
      en: 'It blocks the best person from serving: the most qualified candidate cannot lead if they are from the "wrong" clan.',
      so: 'Wuxuu xannibayaa kan ugu habboon inuu adeego: musharaxii ugu kartida badnaa uma kari karo hoggaanka hadduu ka yimaado qabiilka "khaldanaa".',
    },
    {
      en: 'It turns clan identity into a political weapon — something to fight over — instead of a cultural heritage to cherish.',
      so: 'Wuxuu aqoonsiga qabiilka ka dhigayaa hub siyaasadeed — wax lagu dagaalamayo — halkii uu ahaan lahaa dhaxal dhaqameed oo lagu farxo.',
    },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-32 pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040b1c 0%, #07101e 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="text-gold/[0.03] text-[22rem] font-serif leading-none whitespace-nowrap">إِنَّ أَكْرَمَكُمْ</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 mb-6">
            <Scale size={28} className="text-gold" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-[0.22em] uppercase">
              {lang === 'en' ? 'XTS — Principle of Equality' : 'XTS — Mabda\'aaga Sinaanta'}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            Sim<span className="text-gold">nanta</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-gold/60 text-lg mb-6 font-semibold">
            {lang === 'en'
              ? 'Equality — Every Somali is Equal Before Allah and the Law'
              : 'Sinaanta — Soomaali kasta waa la simanyahay Eebe hortii iyo sharcigiiba'}
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-white/65 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {lang === 'en'
              ? 'XTS was built on one truth that cannot be argued with: every Somali citizen is equal — before Allah, before the law, and at the ballot box. We stand against any system that divides people by clan or birth.'
              : 'XTS waxaa lagu dhisay run aan laga dooddoodi karin: muwaadin Soomaaliga kasta waa la simanyahay — Eebe hortii, sharcigiiba, iyo cod-bixintaba. Waxaan ka horjeedna nidaam kasta oo qabiilka ama dhalashada ku kala sooca dadka.'}
          </motion.p>
        </div>
      </section>

      {/* ── 4.5 SYSTEM ── */}
      <section className="py-16" style={{ background: '#070e24' }}>
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 mb-5">
                <AlertTriangle size={13} className="text-red-400" />
                <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
                  {lang === 'en' ? 'What XTS Rejects' : 'Waxa XTS Diidday'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {lang === 'en'
                  ? <>The <span className="text-red-400">4.5 System</span> Is Not Democracy</>
                  : <>Nidaamka <span className="text-red-400">4.5</span> — Dimuqraadiyad ma ahan</>}
              </h2>
              <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
                {lang === 'en'
                  ? 'Somalia\'s current power-sharing formula assigns political seats based on clan. One group of Somali citizens is permanently counted as "half" a person. XTS will never accept this — not now, not ever. We will oppose it through every democratic and legal means available.'
                  : 'Nidaamka qaybinta awoodda ee Soomaaliya hadda jira wuxuu kuraasta u qaybiyaa qabiilka. Koox ka mid ah muwaadiniinta Soomaaliyeed waa la tiriyaa "badh" qof si joogto ah. XTS kuma aqbali weligeed — hadda ma ahan, weligeedna kama ahan. Waxaan ka soo horjeedna hab kasta oo dimuqraadi ah iyo sharciga awood.'}
              </p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {FOUR_POINTS.map((pt, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/15">
                  <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-sm shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed">{lang === 'en' ? pt.en : pt.so}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── QURAN VERSES ── */}
      <section className="py-16" style={{ background: '#040b1c' }}>
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 mb-5">
                <BookOpen size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-bold tracking-widest uppercase">
                  {lang === 'en' ? 'The Quran — Verses on Equality & Governance' : 'Quraanka — Aayaadka Sinaanta & Xukuumadda'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                {lang === 'en' ? <>What <span className="text-gold">Allah</span> Says</> : <>Waxa <span className="text-gold">Eebe</span> Yiri</>}
              </h2>
              <p className="text-white/45 text-sm max-w-lg mx-auto">
                {lang === 'en'
                  ? 'Each verse is shown in three parts: Arabic original, transliteration (how to read it), and Somali meaning.'
                  : 'Aayad kasta waxaa lagu muujinayaa saddex qaybood: Carabi asalka, sida loo aqriyo, iyo macnaha Af-Soomaali.'}
              </p>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {VERSES.map(v => <VerseCard key={v.id} v={v} lang={lang} />)}
          </div>
        </div>
      </section>

      {/* ── HADITHS ── */}
      <section className="py-16" style={{ background: '#070e24' }}>
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 mb-5">
                <Star size={13} className="text-gold" />
                <span className="text-gold text-xs font-bold tracking-widest uppercase">
                  {lang === 'en' ? 'Hadith — Words of the Prophet ﷺ' : 'Xadiis — Erayada Nabiga ﷺ'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {lang === 'en' ? <>The <span className="text-gold">Prophet ﷺ</span> Said It Clearly</> : <>Nabiga <span className="text-gold">ﷺ</span> si cad ayuu u sheegay</>}
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {HADITHS.map(h => <HadithCard key={h.id} h={h} lang={lang} />)}
          </div>
        </div>
      </section>

      {/* ── XTS POSITION ── */}
      <section className="py-20" style={{ background: '#040b1c' }}>
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {lang === 'en'
                  ? <>XTS <span className="text-gold">Position</span> — Clear and Final</>
                  : <>Mowqifka <span className="text-gold">XTS</span> — Cad oo adag</>}
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="p-7 rounded-3xl border border-gold/25 mb-6"
              style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.07) 0%, rgba(201,162,39,0.02) 100%)' }}>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-5">
                {lang === 'en'
                  ? 'XTS was founded on the conviction that the 4.5 clan formula is a political disease that has kept Somalia weak, divided, and trapped. We have never accepted it — we built this party precisely to fight it.'
                  : 'XTS waxaa lagu aasaasay yakin ah in nidaamka qabiilka ee 4.5 uu yahay cudur siyaasadeed oo Soomaaliya ku haya daciifnimo, kala-qaybsan iyo xidid. Weligaanna kuma aqbalin — xisbigaan waxaan dhisannay si aan gacan uga geysano dagaalka ka dhanka ah.'}
              </p>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed">
                {lang === 'en'
                  ? 'We base our politics on what Allah and His Prophet ﷺ declared plainly: the only thing that separates one person from another is their deeds, their service, and their competence. The son of a farmer from Baidoa and the daughter of a merchant from Hargeisa are equal citizens with equal rights — full, not half.'
                  : 'Siyaasaddeena waxaan ku salaynnaa waxa Eebe iyo Nabiga ﷺ si cad u sheegeen: kaliya waxa kala sareeya laba qof waa ficilkooda, adeeggooda, iyo xirfadooda. Wiilka beertiliyaha Baydhabo iyo gabadha ganacsatada Hargeysa waa muwaadiniinta siman — xuquuq isku mid leh — buuxda, ma aha badh.'}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: CheckCircle2, color: '#22c55e',
                en: 'One person, one vote — every Somali citizen counts equally.',
                so: 'Hal qof, hal cod — Soomaali kasta cod isku qiimo leh.' },
              { icon: Scale, color: '#3b82f6',
                en: 'Candidates selected by merit and public trust — never by clan quota.',
                so: 'Musharaxyadu waxaa loo doortaa kartida iyo kalsoonida shacabka — ma aha kooto qabiil.' },
              { icon: Users, color: '#c9a227',
                en: 'Government positions open equally to every qualified citizen — no exceptions.',
                so: 'Xafiisyada dowladdu waa furan yihiin si siman Soomaaligii ugu xeel dheeray — wax ka reeb ah ma leh.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-5 rounded-2xl border h-full"
                    style={{ background: `${item.color}07`, borderColor: `${item.color}28` }}>
                    <Icon size={22} style={{ color: item.color }} className="mb-3" />
                    <p className="text-white/70 text-sm leading-relaxed">{lang === 'en' ? item.en : item.so}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="py-16" style={{ background: '#070e24' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <FadeIn>
            <p className="text-gold/50 text-xs font-bold uppercase tracking-widest mb-5">
              {lang === 'en' ? 'We close with the words of Allah' : 'Waxaan ku xidhannaa erayada Eebe'}
            </p>
            <p className="text-white/25 text-3xl font-serif mb-3" dir="rtl">
              إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ
            </p>
            <p className="text-white/50 text-sm italic font-mono mb-4">
              Inna akramakum \'indal-laahi atqaakum.
            </p>
            <p className="text-white/70 text-base sm:text-lg mb-3">
              {lang === 'en'
                ? '"The most noble of you in the sight of Allah is the most righteous of you." — Al-Hujurat 49:13'
                : '"Kii Eebe u sharafta badan waa kii ugu dhaqanka fiican." — Al-Hujurat 49:13'}
            </p>
            <p className="text-white/40 text-sm mt-6">
              {lang === 'en'
                ? 'Not your clan. Not your lineage. Not your 4.5 category. Your deeds and your service to Somalia.'
                : 'Ma aha qabiilkaaga. Ma aha asalkaaga. Ma aha koontadaada 4.5. Ficilladaada iyo adeegaaga Soomaaliya.'}
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
