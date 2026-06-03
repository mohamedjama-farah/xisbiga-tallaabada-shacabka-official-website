'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, AlertCircle, Calendar, MapPin, Phone, FileText, HelpCircle } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const STEPS = [
  {
    en: 'Go to your nearest NIEC registration center or official NIEC website.',
    so: 'Tag xarunta diiwaangelinta NIEC ee kuugu dhow ama bogga rasmiga ah ee NIEC.',
  },
  {
    en: 'Bring a valid national ID card, birth certificate, or any government-issued document.',
    so: 'Keen kaadhka aqoonsiga qaran ee sax ah, shahaadada dhalashada, ama dukumiinti kasta oo dowladdu soo saartay.',
  },
  {
    en: 'Complete the voter registration form. Staff will take your photo and fingerprints.',
    so: 'Buuxi foomka diiwaangelinta codbixiyaha. Shaqaalaha ayaa sawir iyo faraha kaa qaadi doona.',
  },
  {
    en: 'Receive your voter registration card. Keep it safe — you will need it on election day.',
    so: 'Hel kaagaaga diiwaangelinta codbixiyaha. Aad u xifso — waxaad u baahan doontaa maalinta doorashada.',
  },
  {
    en: 'On election day, go to your assigned polling station with your voter card and ID.',
    so: 'Maalinta doorashada, tag xaruntaada codka oo lagu qoondeeyay oo wata kaagaaga codbixiyaha iyo aqoonsigaaga.',
  },
  {
    en: 'Cast your vote privately. Your vote is secret — no one can know how you voted.',
    so: 'Cod gaar ahaan. Codkaagu waa sir — cidna ma garanayso sida aad u codeysay.',
  },
];

const CENTERS = [
  { city: 'Mogadishu', address: 'NIEC National HQ, Banadir', phone: '+252 61 XXX XXXX' },
  { city: 'Garowe', address: 'NIEC Puntland Office, Garowe', phone: '+252 90 XXX XXXX' },
  { city: 'Kismayo', address: 'NIEC Jubaland Office, Kismayo', phone: '+252 61 XXX XXXX' },
  { city: 'Baidoa', address: 'NIEC South West Office, Baidoa', phone: '+252 61 XXX XXXX' },
  { city: 'Jowhar', address: 'NIEC Hirshabelle Office, Jowhar', phone: '+252 61 XXX XXXX' },
  { city: 'Dhusamareb', address: 'NIEC Galmudug Office, Dhusamareb', phone: '+252 61 XXX XXXX' },
];

const FAQS = [
  {
    q: { en: 'Who can register to vote?', so: 'Cidda diiwaangeli karta codbixinta?' },
    a: { en: 'Any Somali citizen aged 16 or older who is a resident of Somalia can register to vote in Somali elections.', so: 'Muwaadin Soomaali kasta oo da\'diisu tahay 16 sano ama ka weyn oo deggan Soomaaliya ayaa diiwaangeli kara codbixinta doorashada Soomaaliya.' },
  },
  {
    q: { en: 'Is voter registration free?', so: 'Diiwaangelinta codbixiyayaashu ma bilaash bay tahay?' },
    a: { en: 'Yes. Voter registration in Somalia is completely free. Do not pay anyone who asks for money to register you.', so: 'Haa. Diiwaangelinta codbixiyayaashu Soomaaliya waa bilaash buuxda. Ha bixin cidda lacag weydiisa si ay kuu diiwaangeliso.' },
  },
  {
    q: { en: 'What if I lost my ID card?', so: 'Maxaa dhacaya haddaan kaadhi aqoonsigayga ku luntay?' },
    a: { en: 'Visit your local district office for a replacement ID. Some NIEC centers accept alternative identification — contact your nearest center to confirm.', so: 'Tag xafiiska degmada maxalliga ah si aad u hesho kaadhka beddelka. Xarumaha NIEC qaarkood waxay aqbalaan aqoonsiga beddelka — la xiriir xarunta kuugu dhow si aad u xaqiijiso.' },
  },
  {
    q: { en: 'Can diaspora Somalis vote?', so: 'Ma codayn karaan Soomaali dibadda ku nool?' },
    a: { en: 'Currently, Somali citizens must be physically present in Somalia to vote. NIEC is working on diaspora voting plans for future elections.', so: 'Hadda, muwaadiniinta Soomaaliya waa inay jiri karaan Soomaaliya si ay u codayn karaan. NIEC waxay shaqeynaysaa qorshayaasha codbixinta dibadda doorashooyinka mustaqbalka.' },
  },
];

export default function NIECPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-400/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-4">
            <FileText size={14} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">NIEC</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Voter Registration Guide' : 'Hagaha Diiwaangelinta Codbixiyaha'}
          </h1>
          <p className="text-white/60 text-base max-w-2xl mx-auto">
            {lang === 'en'
              ? 'The National Independent Electoral Commission (NIEC) of Somalia manages all voter registration. This guide explains how to register and how to vote.'
              : 'Guddiga Doorashooyinka Qaranka ee Madaxbannaan (NIEC) ee Soomaaliya ayaa maareeya dhammaan diiwaangelinta codbixiyeyaasha. Hagahan wuxuu sharraxayaa sida loo diiwaangeliyo iyo sida loo codeyn karo.'}
          </p>
        </div>

        {/* NIEC Official link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-blue-500/8 border border-blue-500/20 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-1">
              {lang === 'en' ? 'Official NIEC Website' : 'Bogga Rasmiga ah ee NIEC'}
            </p>
            <p className="text-white/60 text-xs mb-3">
              {lang === 'en'
                ? 'Always use the official NIEC website for registration deadlines, polling station locations, and official announcements.'
                : 'Mar walba isticmaal bogga rasmiga ah ee NIEC xaaladaha dambayntanka diiwaangelinta, goobaha xarumaha codbixinta, iyo xayeysiisyada rasmiga ah.'}
            </p>
            <a href="https://niec.so" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-xl text-sm font-bold transition-colors">
              <ExternalLink size={14} /> niec.so — {lang === 'en' ? 'Official NIEC Website' : 'Bogga Rasmiga NIEC'}
            </a>
          </div>
        </motion.div>

        {/* Steps */}
        <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-5">
          {lang === 'en' ? 'Step-by-Step: How to Register & Vote' : 'Talaabo-Talaabooyinka: Sida Loo Diiwaangeliyo & Loo Codeyn'}
        </h2>
        <div className="space-y-4 mb-12">
          {STEPS.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-4 bg-white/3 border border-white/8 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-gold text-navy font-black text-sm flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <p className="text-white/70 text-sm leading-relaxed pt-1">
                {lang === 'en' ? step.en : step.so}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Key dates */}
        <div className="bg-gold/8 border border-gold/20 rounded-2xl p-5 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-gold" />
            <h3 className="text-gold font-bold text-sm">
              {lang === 'en' ? 'Important Dates' : 'Taariikhdaha Muhiimka ah'}
            </h3>
          </div>
          <p className="text-white/50 text-sm">
            {lang === 'en'
              ? 'Registration and election dates are announced by NIEC. Visit niec.so or follow @NIEC_Somalia on Twitter/X for the latest official dates.'
              : 'Taariikhdaha diiwaangelinta iyo doorashada waxaa ku dhawaaqaya NIEC. Booqo niec.so ama raac @NIEC_Somalia Twitter/X si aad u aragto taariikhdaha rasmiga ah ee ugu dambeeyay.'}
          </p>
        </div>

        {/* Registration centers */}
        <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <MapPin size={14} /> {lang === 'en' ? 'NIEC Registration Centers' : 'Xarumaha Diiwaangelinta NIEC'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CENTERS.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="p-4 bg-white/3 border border-white/8 rounded-xl">
              <p className="text-white font-bold text-sm mb-1">{c.city}</p>
              <p className="text-white/40 text-xs mb-2">{c.address}</p>
              <div className="flex items-center gap-1.5 text-white/30 text-xs">
                <Phone size={11} /> {c.phone}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <HelpCircle size={14} /> {lang === 'en' ? 'Common Questions' : 'Su\'aalaha Caadiga ah'}
        </h2>
        <div className="space-y-4 mb-10">
          {FAQS.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="p-5 bg-white/3 border border-white/8 rounded-2xl">
              <p className="text-white font-bold text-sm mb-2 flex items-start gap-2">
                <CheckCircle2 size={14} className="text-gold mt-0.5 shrink-0" />
                {lang === 'en' ? faq.q.en : faq.q.so}
              </p>
              <p className="text-white/60 text-xs leading-relaxed pl-5">
                {lang === 'en' ? faq.a.en : faq.a.so}
              </p>
            </motion.div>
          ))}
        </div>

        {/* XTS commitment */}
        <div className="text-center bg-white/3 border border-white/8 rounded-2xl p-8">
          <p className="text-white font-black text-lg mb-2">
            {lang === 'en' ? 'XTS Supports Your Right to Vote' : 'XTS Waxay Taageeraysaa Xuquuqdaada Codbixinta'}
          </p>
          <p className="text-white/50 text-sm mb-5 max-w-xl mx-auto">
            {lang === 'en'
              ? 'We believe democracy starts with participation. XTS volunteers across Somalia are helping citizens register. Contact us if you need help finding your nearest registration center.'
              : 'Waxaan aaminsan nahay dimuqraadiyadu waxay ku bilaabataa ka qeybgalka. Gudoomiyeyaasha XTS ee Soomaaliya oo dhan waxay caawiyaan muwaadiniinta inay is diiwaangeliyaan. Nala xiriir haddaad u baahantahay caawimo helista xarunta diiwaangelinta ee kuugu dhow.'}
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold text-sm rounded-full hover:bg-gold/90 transition-colors">
            {lang === 'en' ? 'Contact XTS for Help' : 'La Xiriir XTS Caawimo Ahaaneed'}
          </a>
        </div>
      </div>
    </main>
  );
}
