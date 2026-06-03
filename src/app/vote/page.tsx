'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/hooks/useLang';
import { CheckCircle2, AlertCircle, Phone, MapPin, FileText, Users, Clock, HelpCircle } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    icon: FileText,
    en: { title: 'Get Your National ID', desc: 'You must have a valid Somali National ID (Kaardhka Aqoonsiga Qaranka) before registering to vote. If you do not have one, visit your nearest district office.', note: 'Bring: birth certificate or two witnesses from your community.' },
    so: { title: 'Hel Kaardhkaaga Qaranka', desc: 'Waa inaad leedahay Kaardhka Aqoonsiga Qaranka ee Soomaaliya oo ansax ah kahor intaadan diiwaangelin cod-bixinta. Haddaanad lahayn, booqo xafiiska degmadaada ugu dhow.', note: 'Keen: shahaadada dhalashada ama laba markhaati oo bulshadaada ka ah.' },
  },
  {
    step: 2,
    icon: MapPin,
    en: { title: 'Find Your Registration Center', desc: 'Go to the Independent Electoral Commission (ICES) registration center in your district. Centers are open in all 18 regions of Somalia during registration periods.', note: 'Check ices.so or call 1551 for center locations.' },
    so: { title: 'Raadi Xaruntaada Diiwaangelinta', desc: 'Tag xarunta diiwaangelinta ee Guddiga Doorashada ee Madaxbanaan (ICES) ee degmadaada. Xarumaha waa furan yihiin dhammaan 18 gobol ee Soomaaliya inta lagu jiro xilliga diiwaangelinta.', note: 'Hubi ices.so ama wac 1551 goobaha xarumaha.' },
  },
  {
    step: 3,
    icon: Users,
    en: { title: 'Register in Person', desc: 'Bring your National ID to the registration center. An official will record your information: name, ID number, region, district, and constituency. You will receive a voter card.', note: 'Registration is free. No payment should ever be requested.' },
    so: { title: 'Diiwaangeli Jidhkaaga', desc: 'Keen Kaardhkaaga Qaranka xarunta diiwaangelinta. Mas\'uul ayaa diiwaangeliya macluumaadkaaga: magacaaga, lambarka kaardhka, gobolka, degmada, iyo xaafadda. Waxaad helaysaa kaardhka codbixiyaha.', note: 'Diiwaangelinta waa bilaash. Lacag abid lama codsado.' },
  },
  {
    step: 4,
    icon: CheckCircle2,
    en: { title: 'Verify Your Registration', desc: 'After registering, you can verify your registration status online at ices.so or by calling 1551. Keep your voter card safe — you will need it on election day.', note: 'If your name is not on the list, report it to ICES immediately.' },
    so: { title: 'Xaqiiji Diiwaangelinkaaga', desc: 'Diiwaangelinta ka dib, waxaad xaqiijin kartaa xaaladda diiwaangelinkaaga online ices.so ama adigoo wacaya 1551. Kaydi kaardhkaaga codbixiyaha si xasaasi ah — waxaad u baahan doontaa maalinta doorashada.', note: 'Haddaan magacaagu liiska ku jirin, si deg-deg ah ugu warbixin ICES.' },
  },
  {
    step: 5,
    icon: Clock,
    en: { title: 'Vote on Election Day', desc: 'Bring your voter card and National ID to your designated polling station. Vote for your chosen candidate by marking the ballot. Your vote is secret — no one can see it.', note: 'Polling stations open 07:00 and close 17:00.' },
    so: { title: 'Codeey Maalinta Doorashada', desc: 'Keen kaardhkaaga codbixiyaha iyo Kaardhkaaga Qaranka xarunta codeynta ku qoran. U codeey musharaxaagaaga adigoo summad ku dhigaya warqadda. Codkaagu sir ahaan yahay — qof kama arki karo.', note: 'Xarumaha codeynta way furma 07:00 oo way xidhmaan 17:00.' },
  },
];

const FAQS = [
  { en: { q: 'Who can vote?', a: 'Any Somali citizen aged 18 or over with a valid National ID.' }, so: { q: 'Cidda codeyn karta?', a: 'Muwaadin Soomaali ah oo 18 jir oo ka weyn ama leh kaardhka qaranka ee ansax ah.' } },
  { en: { q: 'Can diaspora Somalis vote?', a: 'XTS is pushing for diaspora voting rights. Currently, you must be physically present in Somalia to vote. We are working to change this.' }, so: { q: 'Qurbojoogta Soomaaliyeed ma codeeyn karaan?', a: 'XTS waxay u diriraysaa xuquuqda codeynta qurbojoogta. Hadda, waa inaad jidhkaaga ku joogto Soomaaliya si aad u codeeyso. Waxaan u shaqaynaa in tan la beddelo.' } },
  { en: { q: 'Is voting free?', a: 'Yes. Voting and registration are completely free. If anyone asks you to pay to vote, report it immediately to ICES.' }, so: { q: 'Codeyntu bilaash ma tahay?', a: 'Haa. Codeynta iyo diiwaangelinta waa bilaash buuxa. Hadduu qof ku codsado lacag si aad u codeeyso, si deg-deg ah ugu warbixin ICES.' } },
  { en: { q: 'What if I lost my voter card?', a: 'Go to your district registration center with your National ID. They can re-issue your voter card.' }, so: { q: 'Maxaa haddaan lumiyay kaardhkayga codbixiyaha?', a: 'Tag xarunta diiwaangelinta degmadaada oo keesha Kaardhkaaga Qaranka. Waxay ku soo celin karaan kaardhkaaga codbixiyaha.' } },
  { en: { q: 'What is the 4.5 system and will it change?', a: 'The 4.5 system allocates parliamentary seats by clan. XTS is committed to replacing it with one-person-one-vote for all Somalis regardless of clan.' }, so: { q: 'Nidaamka 4.5 waa maxay oo ma beddeli doonaa?', a: 'Nidaamka 4.5 wuxuu u qaybinayaa kuraasta baarlamaanka qabiilka. XTS waxay u heellan tahay in la beddelo hal qof-hal cod oo Soomaali kasta u ah qabiilkiisa ha noqdee.' } },
];

export default function VotePage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <CheckCircle2 size={13} />
            {lang === 'en' ? 'Your Vote Matters' : 'Codkaagu Muhiim Yahay'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'How to Register & Vote' : 'Sida Loo Diiwaangeliyo & Loo Codeyn'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Your vote is your voice. Follow these five steps to make sure you are registered and ready to vote in Somalia\'s next election.'
              : 'Codkaagu waa codkaaga. Raac shanta tallaabo ee hoose si aad u hubiso inaad diiwaangashan tahay oo aad u diyaar u tahay doorashada xigta ee Soomaaliya.'}
          </p>
        </motion.div>
      </div>

      {/* Important Notice */}
      <div className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200 text-sm">
            {lang === 'en'
              ? 'This guide is based on current ICES procedures. Always verify the latest information at ices.so or call 1551, as dates and procedures may change.'
              : 'Hagahan wuxuu ku salaysan yahay habdhaqanada ICES ee hadda. Had iyo jeer xaqiiji macluumaadka ugu dambeeyay ices.so ama wac 1551, maadaama taariikhaha iyo habdhaqanadu bedeli karaan.'}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 mb-20">
        <div className="space-y-6">
          {STEPS.map((item, i) => {
            const Icon = item.icon;
            const content = item[lang];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gold text-navy font-black text-sm flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-gold/20 mt-2" />}
                </div>
                <div className="pb-8 flex-1">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={18} className="text-gold" />
                      <h3 className="font-bold text-white">{content.title}</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-3">{content.desc}</p>
                    <div className="flex items-start gap-2 bg-gold/5 border border-gold/15 rounded-lg px-3 py-2">
                      <CheckCircle2 size={13} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-gold/80 text-xs">{content.note}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <HelpCircle size={22} className="text-gold" />
          {lang === 'en' ? 'Frequently Asked Questions' : 'Su\'aalaha Inta Badan La Weydiiya'}
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const content = faq[lang];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <p className="font-semibold text-white mb-2">{content.q}</p>
                <p className="text-white/60 text-sm leading-relaxed">{content.a}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Contact ICES */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">{lang === 'en' ? 'Need Help?' : 'Caawimo Ma Rabtaa?'}</h3>
            <p className="text-white/60 text-sm">{lang === 'en' ? 'Contact the Independent Electoral Commission of Somalia directly.' : 'Xiriir si toos ah Guddiga Doorashada ee Madaxbanaan ee Soomaaliya.'}</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="tel:1551" className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-2 rounded-full text-sm font-semibold hover:bg-gold/20 transition-colors">
              <Phone size={15} /> 1551 (ICES Hotline)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
