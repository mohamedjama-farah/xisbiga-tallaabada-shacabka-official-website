'use client';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Star, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const principles = [
  {
    icon: Heart,
    en: { title: 'Every Clan. One Somalia.', body: 'XTS does not belong to any clan. Our party was built by Somalis from every region, every clan, every background. We believe the future of Somalia cannot be built on tribalism — it must be built on citizenship.' },
    so: { title: 'Qabiil Kasta. Hal Soomaaliya.', body: 'XTS ma laha qabiil gaar ah. Xisbigayagu waxaa dhisay Soomaali ka socota gobol kasta, qabiil kasta, asalka kasta. Waxaan aaminsan nahay mustaqbalka Soomaaliya lama dhisi karo qabiilnimo — waa inuu ku dhisto muwaatinimo.' },
    color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20',
  },
  {
    icon: Shield,
    en: { title: 'Zero Tolerance for Clan Politics', body: 'XTS has a strict policy: no member, candidate, or official may use clan as a political tool. Anyone who does will be removed from the party. We enforce this rule without exception.' },
    so: { title: 'Eber Dulqaad ah oo Siyaasad Qabiil ah', body: 'XTS waxay leedahay siyaasad adag: xubin, musharax, ama mas\'uul kama isticmaali karo qabiilka qalabka siyaasadeed. Cidda tani tarto waxaa laga saari doonaa xisbiga. Sharcigan waxaan ku fulinaa la\'aanta ka reebnaanta.' },
    color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20',
  },
  {
    icon: Users,
    en: { title: 'Leadership From Every Region', body: 'Our party leadership includes Somalis from Puntland, Jubaland, South West State, Hirshabelle, Galmudug, Banadir and the diaspora. This is intentional. We believe leadership must reflect all of Somalia.' },
    so: { title: 'Hoggaan Ka Socda Gobol Kasta', body: 'Hoggaanka xisbigayagu waxaa ka mid ah Soomaali ka socota Puntland, Jubaland, Koonfur Galbeed, Hirshabelle, Galmudug, Banaadir iyo dadka dibadda. Tani waa mid loo qorsheeyay. Waxaan aaminsan nahay hoggaanku waa inuu ka tarjumaa dhammaan Soomaaliya.' },
    color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20',
  },
  {
    icon: Star,
    en: { title: 'Merit Over Blood', body: 'In XTS, you advance based on what you do — not who your father is. Candidates are selected based on qualifications, community contribution, and character. A woman from Galmudug and a man from Puntland are equal in our eyes.' },
    so: { title: 'Sharaf Halkii Dhiig', body: 'Xisbiga XTS, waxaad ku horumartaa waxa aad sameyso — ma aha cidda aad tahay. Musharaxiinta waxaa lagu doortaa xirfadda, waxqabadka bulshada, iyo dabeecadda. Naag ka socota Galmudug iyo nin ka socota Puntland waa siman yihiin inagaga arrintayada.' },
    color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20',
  },
];

const commitments = [
  { en: 'No candidate will be selected based on clan', so: 'Musharax kama dooran qabiil' },
  { en: 'No government position will be allocated by clan quota', so: 'Xilal dowladeed lama qoondayn doono quota qabiil' },
  { en: 'Clan-based language is banned in all XTS communications', so: 'Luuqadda qabiilka waa mamnuuc barnaamijyada XTS oo dhan' },
  { en: 'Our constitution explicitly forbids clan-based discrimination', so: 'Dastuurkayagu si cad ayuu u mamnuucayaa takoorka ku salaysan qabiilka' },
  { en: 'We will build a Somalia where your clan does not determine your future', so: 'Waxaan dhisaynaa Soomaaliya halka qabiilkaagu aanuu go\'aansan mustaqbalahaaga' },
];

export default function UnityPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">

        {/* Hero */}
        <div className="text-center mb-14">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-yellow-300 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Heart size={36} className="text-navy" />
          </motion.div>
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Users size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'National Unity' : 'Midnimada Qaran'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            {lang === 'en'
              ? 'XTS Belongs to Every Somali'
              : 'XTS Waxay Leeyihiin Soomaali Kasta'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'We make this clear, publicly and permanently: XTS is a non-clan party. Here is exactly what that means, and how we enforce it.'
              : 'Waxaan caddeyneynaa, si dadweyne ah oo joogto ah: XTS waa xisbi aan qabiil lahayn. Halkan waxaa ku qoran waxa tani macnaheedu yahay, iyo sida aan ku fulinno.'}
          </p>
        </div>

        {/* Principles */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {principles.map((p, i) => {
            const Icon = p.icon;
            const content = p[lang];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`${p.bg} border ${p.border} rounded-2xl p-6`}>
                <div className={`w-10 h-10 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center mb-4`}>
                  <Icon size={18} className={p.color} />
                </div>
                <h3 className={`font-bold text-base mb-2 ${p.color}`}>{content.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{content.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Commitments */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-10">
          <h2 className="text-white font-black text-xl mb-6">
            {lang === 'en' ? 'Our Formal Commitments' : 'Ballamahayaga Rasmiga ah'}
          </h2>
          <div className="space-y-3">
            {commitments.map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-white/70 text-sm leading-relaxed">
                  {lang === 'en' ? c.en : c.so}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="border-l-4 border-gold pl-6 py-2 mb-10">
          <p className="text-white/80 text-lg italic leading-relaxed">
            {lang === 'en'
              ? '"Tribalism is the disease. Unity is the cure. Somalia will never reach its potential until every Somali is valued not for their clan — but for their contribution."'
              : '"Qabiilnimadu waa cudurka. Midnimadu waa daawada. Soomaaliya mar hore ma gaadhi karto awooddeeda ilaa Soomaali kasta loo qiimeeyo maaha qabiilkooda — laakiin waxqabadkooda."'}
          </p>
          <footer className="text-gold text-sm font-bold mt-3">— XTS Party Leadership</footer>
        </motion.blockquote>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-8">
          <p className="text-white font-black text-xl mb-2">
            {lang === 'en' ? 'Join the Movement for All Somalis' : 'Ku Biir Dhaqdhaqaaqa Soomaali Kasta'}
          </p>
          <p className="text-white/50 text-sm mb-6">
            {lang === 'en'
              ? 'Whatever your clan, whatever your region — you are welcome in XTS.'
              : 'Qabiilkaaga ha ahaadee, gobolkaaga ha ahaadee — waxaad ku soo dhawaataa XTS.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/join" className="px-6 py-3 bg-gold text-navy font-black rounded-full hover:bg-gold/90 transition-colors text-sm">
              {lang === 'en' ? 'Join XTS Today' : 'Ku Biir XTS Maanta'}
            </a>
            <a href="/manifesto" className="px-6 py-3 bg-white/8 text-white font-bold rounded-full hover:bg-white/12 transition-colors text-sm border border-white/15">
              {lang === 'en' ? 'Read Our Manifesto' : 'Akhri Barnaamijkayaga'}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
