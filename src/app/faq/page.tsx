'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/hooks/useLang';

interface FAQItem {
  id: string;
  questionEn: string;
  questionSo: string;
  answerEn: string;
  answerSo: string;
  category: string;
}

// Hardcoded fallback — shown while DB loads or if DB is empty
const FALLBACK_FAQS: FAQItem[] = [
  { id: 'f1', category: 'Membership', questionEn: 'How do I join XTS?', questionSo: 'Sideen ugu biiri karaa XTS?', answerEn: 'You can join XTS by filling out the membership application on our Join Us page. After submitting, our team will review your application and contact you within a few days.', answerSo: 'Waad ku biiri kartaa XTS adiga oo buuxinaya codsiga xubnimada ee bogga "Noogu Soo Biir". Kadib markii aad dirto, kooxdayadu waxay dib u eegi doontaa codsigaaga waxayna kula xiriiri doontaa dhowr maalmood gudahood.' },
  { id: 'f2', category: 'Membership', questionEn: 'Is there a membership fee?', questionSo: 'Ma jiraa lacag xubnimo?', answerEn: 'No. Membership in XTS is completely free. We believe every Somali citizen should have the opportunity to participate in building their country without financial barriers.', answerSo: 'Maya. Xubnimada XTS waa bilaash. Waxaan aaminnahay in muwaadin kasta oo Soomaali ah uu heli karaa fursadda ka qayb qaadashada dhisidda dalkooda iyada oo aan caqabad dhaqaale jirin.' },
  { id: 'f3', category: 'Membership', questionEn: 'Can Somalis in the diaspora become members?', questionSo: 'Ma Soomaalidda qurbojoog ah ayaa xubin noqon karta?', answerEn: 'Yes! Diaspora Somalis are a vital part of XTS. We have a dedicated Diaspora Wing to support members living abroad. You can register online and participate in our activities remotely.', answerSo: 'Haa! Soomaalidda qurbojoog ah waa qayb muhiim ah oo XTS. Waxaan leenahay Goobta Qurbojoog ah oo u heellan xubnaha dibadda ku nool.' },
  { id: 'f4', category: 'XTS Party', questionEn: 'What does XTS stand for?', questionSo: 'Maxay XTS ka dhigan tahay?', answerEn: "XTS stands for Xisbiga Tallaabada Shacabka — The People's Progress Party. We are a progressive political movement dedicated to justice, unity, and prosperity for all Somalis.", answerSo: 'XTS waxay ka dhigan tahay Xisbiga Tallaabada Shacabka. Waa dhaqdhaqaaq siyaasadeed horumarsan oo u heellan xaq, midnimo, iyo barwaaqo Soomaalida oo dhan.' },
  { id: 'f5', category: 'XTS Party', questionEn: 'What is the XTS position on clan politics?', questionSo: 'Maxay tahay mawqifka XTS ee ku aaddan siyaasadda beelaha?', answerEn: 'XTS firmly believes that Somalis are one people and that clan-based politics divides and weakens our nation. We reject the 4.5 formula and advocate for merit-based governance.', answerSo: 'XTS si adag ayay u aaminaysaa in Soomaalidu ay yihiin hal shacab iyo in siyaasadda ku salaysan beelahu ay kala qaybiso oo daciifiso qaranka. Waxaan diidinaa qaababka 4.5.' },
  { id: 'f6', category: 'Voting & Elections', questionEn: 'When are the next Somali elections?', questionSo: 'Goorma ayaa doorashooyinka Soomaaliya ee xiga?', answerEn: 'Somalia holds elections approximately every four years. The next federal elections are expected in 2026. XTS is actively preparing candidates and working to register members ahead of these elections.', answerSo: 'Soomaaliya waxay doorasho qabtaa qiyaastii afar sano walba. Doorashooyinka federaalka ee xiga waxaa la filayaa 2026.' },
  { id: 'f7', category: 'Contact & Support', questionEn: 'How can I contact XTS?', questionSo: 'Sideen ula xiriiri karaa XTS?', answerEn: 'You can reach us through our Contact page, by email at info@xts.so, or visit one of our regional offices. We aim to respond to all enquiries within 48 hours.', answerSo: 'Waxaad nala xiriiri kartaa adiga oo adeegsanaya bogga Xiriirka, email ahaan info@xts.so, ama booqo mid ka mid ah xafiisyadeena gobollada.' },
];

export default function FAQPage() {
  const { lang } = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>(FALLBACK_FAQS);

  useEffect(() => {
    fetch('/api/faq')
      .then(r => r.json())
      .then((data: FAQItem[]) => { if (data.length > 0) setFaqs(data); })
      .catch(() => {});
  }, []);

  // Group by category
  const categories = Array.from(new Set(faqs.map(f => f.category)));

  const filtered = categories.map(cat => ({
    category: cat,
    items: faqs.filter(f => f.category === cat && (
      search === '' ||
      f.questionEn.toLowerCase().includes(search.toLowerCase()) ||
      f.questionSo.toLowerCase().includes(search.toLowerCase()) ||
      f.answerEn.toLowerCase().includes(search.toLowerCase())
    )),
  })).filter(g => g.items.length > 0);

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <HelpCircle size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">FAQ</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Frequently Asked Questions' : "Su'aalaha Badanaa La Weydiiyo"}
          </h1>
          <p className="text-white/50 text-sm">
            {lang === 'en'
              ? 'Find answers to common questions about XTS, membership, elections, and more.'
              : "Hel jawaabaha su'aalaha caadiga ah ee ku saabsan XTS, xubnimada, doorashooyinka, iyo wax kale."}
          </p>
        </div>

        <div className="relative mb-10">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search questions…' : "Raadi su'aalaha…"}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/25"
          />
        </div>

        <div className="space-y-8">
          {filtered.map((group) => (
            <div key={group.category}>
              <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-3 px-1">{group.category}</h2>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const isOpen = open === item.id;
                  return (
                    <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : item.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className={`text-sm font-semibold pr-4 ${isOpen ? 'text-gold' : 'text-white/85'}`}>
                          {lang === 'en' ? item.questionEn : item.questionSo}
                        </span>
                        <ChevronDown size={15} className={`flex-shrink-0 text-gold/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-4 text-white/55 text-sm leading-relaxed border-t border-white/8 pt-3">
                              {lang === 'en' ? item.answerEn : item.answerSo}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <HelpCircle size={36} className="mx-auto mb-3 opacity-30" />
              <p>{lang === 'en' ? 'No questions match your search.' : "Ma jiraan su'aalo ku habboon raadintaada."}</p>
            </div>
          )}
        </div>

        <div className="mt-14 text-center bg-gold/5 border border-gold/15 rounded-2xl p-8">
          <p className="text-white font-bold mb-1">{lang === 'en' ? 'Still have questions?' : "Weli su'aalo ma qabtaa?"}</p>
          <p className="text-white/40 text-sm mb-4">{lang === 'en' ? 'Our team is happy to help you.' : 'Kooxdayadu way ku faraxsan tahay inay kaa caawiso.'}</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold text-sm rounded-full hover:bg-gold/90 transition-colors">
            {lang === 'en' ? 'Contact Us' : 'Na la Xiriir'}
          </a>
        </div>
      </div>
    </main>
  );
}
