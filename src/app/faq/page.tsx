'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/hooks/useLang';

const faqs = [
  {
    category: { en: 'Membership', so: 'Xubnimada' },
    items: [
      {
        q: { en: 'How do I join XTS?', so: 'Sideen ugu biiri karaa XTS?' },
        a: { en: 'You can join XTS by filling out the membership application on our Join Us page. After submitting, our team will review your application and contact you within a few days.', so: 'Waad ku biiri kartaa XTS adiga oo buuxinaya codsiga xubnimada ee bogga "Noogu Soo Biir". Kadib markii aad dirto, kooxdayadu waxay dib u eegi doontaa codsigaaga waxayna kula xiriiri doontaa dhowr maalmood gudahood.' },
      },
      {
        q: { en: 'Is there a membership fee?', so: 'Ma jiraa lacag xubnimo?' },
        a: { en: 'No. Membership in XTS is completely free. We believe every Somali citizen should have the opportunity to participate in building their country without financial barriers.', so: 'Maya. Xubnimada XTS waa bilaash. Waxaan aaminnahay in muwaadin kasta oo Soomaali ah uu heli karaa fursadda ka qayb qaadashada dhisidda dalkooda iyada oo aan caqabad dhaqaale jirin.' },
      },
      {
        q: { en: 'Can Somalis in the diaspora become members?', so: 'Ma Soomaalidda masakinta ah ayaa xubin noqon karta?' },
        a: { en: 'Yes! Diaspora Somalis are a vital part of XTS. We have a dedicated Diaspora Wing to support members living abroad. You can register online and participate in our activities remotely.', so: 'Haa! Soomaalidda masakinta ah waa qayb muhiim ah oo XTS. Waxaan leenahay Goob Masakin ah oo u heellan xubnaha dibadda ku nool. Waad ku diiwaangeli kartaa online waxaadna ka qayb qaadan kartaa hawlahayaga fogaan joogta ah.' },
      },
      {
        q: { en: 'What are the rights of XTS members?', so: 'Maxay yihiin xuquuqda xubnaha XTS?' },
        a: { en: 'Approved members can vote in party elections, attend party meetings, receive official communications, and participate in party programs including our Volunteer and Canvasser network.', so: 'Xubnaha la ansixiyey waxay u codeyn karaan doorashooyinka xisbiga, waxay ka qayb qaadan karaan shirarka xisbiga, waxay helaan xiriirka rasmiga ah, waxayna ka qayb qaadan karaan barnaamijyada xisbiga oo ay ku jiraan shabakadda Volunteer iyo Canvasser.' },
      },
    ],
  },
  {
    category: { en: 'Voting & Elections', so: 'Codeynta & Doorashooyinka' },
    items: [
      {
        q: { en: 'How does the Somali voting system work?', so: 'Sidee u shaqeeyaa nidaamka codeynta ee Soomaaliya?' },
        a: { en: 'Somalia currently uses a mixed system. For federal parliament, seats are allocated through the 4.5 clan formula. XTS is committed to moving toward one-person-one-vote (OPOV) universal suffrage.', so: 'Soomaaliya hadda waxay adeegsataa nidaam isku dhafan. Baarlamaanka federaalka, kuraasiga waxaa loo qoondeyaa qaab-dhismeedka beelaha 4.5. XTS waxay ku heellan tahay dhaqaaqida oo lagu socdo codeynta guud ee hal-qof-hal-cod (OPOV).' },
      },
      {
        q: { en: 'Who can vote in Somalia?', so: 'Cidda Soomaaliya ku codeyn karta?' },
        a: { en: 'Under the current system, community elders select delegates who then elect MPs. XTS advocates for direct universal suffrage where every adult Somali citizen can vote directly.', so: 'Hab-nidaamka hadda jira, odayaasha bulshada waxay dooranayaan wakiilada kuwaas oo doorta xildhibaannada. XTS waxay u dooneysaa codeynta guud ee tooska ah halkaas oo muwaadin kasta oo Soomaali ah oo gaaray da\'da uu si toos ah u codeyn karo.' },
      },
      {
        q: { en: 'When are the next Somali elections?', so: 'Goorma ayaa doorashooyinka Soomaaliya ee xiga?' },
        a: { en: 'Somalia holds elections approximately every four years. The next federal elections are expected in 2026. XTS is actively preparing candidates and working to register members ahead of these elections.', so: 'Soomaaliya waxay doorasho qabtaa qiyaastii afar sano walba. Doorashooyinka federaalka ee xiga waxaa la filayaa 2026. XTS si firfircoon ayay u diyaarinaysaa musharrixiinta waxayna shaqaynaysaa diiwaangelinta xubnaha kahor doorashooyinkaas.' },
      },
    ],
  },
  {
    category: { en: 'XTS Party', so: 'Xisbiga XTS' },
    items: [
      {
        q: { en: 'What does XTS stand for?', so: 'Maxay XTS ka dhigan tahay?' },
        a: { en: 'XTS stands for Xisbiga Tallaabada Shacabka — The People\'s Progress Party. We are a progressive political movement dedicated to justice, unity, and prosperity for all Somalis.', so: 'XTS waxay ka dhigan tahay Xisbiga Tallaabada Shacabka. Waa dhaqdhaqaaq siyaasadeed horumarsan oo u heellan xaq, midnimo, iyo barwaaqo Soomaalida oo dhan.' },
      },
      {
        q: { en: 'Is XTS a religious or secular party?', so: 'Ma XTS waa xisbi diini mise madani?' },
        a: { en: 'XTS is an Islamic-values-guided party. We believe Islam is the foundation of Somali society and governance. Our policies are inspired by Islamic principles of justice, consultation (shura), and compassion, while respecting the rights of all citizens.', so: 'XTS waa xisbi ay haga qiyamka Islaamiga ah. Waxaan aaminnahay in Islaamku yahay aasaaska bulshada Soomaalida iyo maamulka. Siyaasadahayada waxaa dhiirigeliya mabaadiida Islaamka ee caddaaladda, shuurada, iyo naxariista, iyadoo la xurumeeynayo xuquuqda muwaadin kasta.' },
      },
      {
        q: { en: 'What is the XTS position on clan politics?', so: 'Maxay tahay mawqifka XTS ee ku aaddan siyaasadda beelaha?' },
        a: { en: 'XTS firmly believes that Somalis are one people and that clan-based politics divides and weakens our nation. We reject the 4.5 formula and advocate for merit-based governance where every citizen is equal regardless of clan.', so: 'XTS si adag ayay u aaminaysaa in Soomaalidu ay yihiin hal shacab iyo in siyaasadda ku salaysan beelahu ay kala qaybiso oo daciifiso qaranka. Waxaan diidinaa qaababka 4.5 waxaanaan u dooneynaa maamul ku salaysan guulaha halkaas oo muwaadin kasta uu siman yahay asal ahaantiis xaaladda beelaha.' },
      },
      {
        q: { en: 'How is XTS funded?', so: 'Sidee ayaa XTS loogu maalgeliyaa?' },
        a: { en: 'XTS is funded entirely by member contributions and public donations. We do not accept foreign government funding or corporate donations that could compromise our independence. Full financial transparency is one of our core commitments.', so: 'XTS si buuxda ayaa loogu maalgeliyaa qashaanka xubnaha iyo xawaaladaha dadweynaha. Maanaan aqbalayn maalgelinta dowladaha shisheeye ama xawaaladaha shirkadaha ee suurtageli karta is-bedbedelka madaxbanaanideena. Hufnaanta dhaqaalaha oo dhan waa mid ka mid ah ballanqaadyadeena aasaasiga ah.' },
      },
    ],
  },
  {
    category: { en: 'Volunteering & Canvassing', so: 'Volunteering & Canvassing' },
    items: [
      {
        q: { en: 'How do I volunteer for XTS?', so: 'Sideen ugu volunteer garayaa XTS?' },
        a: { en: 'Visit our Volunteer page and fill out the registration form. You can choose your skills and availability. We will match you with the most suitable activities in your area.', so: 'Booqo bogga Volunteer-kayaga oo buuxi foomka diiwaangelinta. Waad dooran kartaa xirfadahaaga iyo helitaankaaga. Waxaan kula waafajin doonaa hawlaha ugu habboon ee aagahaaga.' },
      },
      {
        q: { en: 'What is a door-to-door canvasser?', so: 'Maxaa ah canvasser albaab-ilaa-albaab?' },
        a: { en: 'Canvassers are dedicated volunteers who visit homes and communities to speak directly with citizens about XTS policies, register potential members, and gather feedback. It is one of the most effective ways to grow our movement.', so: 'Canvassers waa volunteer-yada heellan ee booqda guryaha iyo bulshada si ay si toos ah uga hadlaan muwaadiniinta siyaasadaha XTS, diiwaangeliyaan xubnaha suurtagalka ah, oo aruuriyaan jawaabcelinta. Waa mid ka mid ah hababka ugu waxkara kobcinta dhaqdhaqaaqayaga.' },
      },
    ],
  },
  {
    category: { en: 'Contact & Support', so: 'Xiriirka & Taageerada' },
    items: [
      {
        q: { en: 'How can I contact XTS?', so: 'Sideen ula xiriiri karaa XTS?' },
        a: { en: 'You can reach us through our Contact page, by email at info@xts.so, or visit one of our regional offices. We aim to respond to all enquiries within 48 hours.', so: 'Waxaad nala xiriiri kartaa adiga oo adeegsanaya bogga Xiriirka, email ahaan info@xts.so, ama booqo mid ka mid ah xafiisyadeena gobollada. Waxaan u baahnnahay inaan ka jawaabno su\'aalaha oo dhammu 48 saac gudahood.' },
      },
      {
        q: { en: 'How do I report a complaint?', so: 'Sideen u soo gudbiyaa cabasho?' },
        a: { en: 'We take all citizen complaints seriously. Visit our Citizen Complaints page to submit a formal complaint. All complaints are reviewed by our team and you will receive a response within 7 working days.', so: 'Cabashada muwaadiniinta oo dhan si dhab ah ayaan u qaadanaa. Booqo bogga Cabashooyinka Muwaadiniinta si aad u gudbiso cabasho rasmi ah. Dhammaan cabashooyinka kooxdayadu waxay dib u eegi doontaa waxaadna heli doontaa jawaab 7 maalmood shaqo gudahood.' },
      },
    ],
  },
];

export default function FAQPage() {
  const { lang } = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const q = item.q[lang].toLowerCase();
      const a = item.a[lang].toLowerCase();
      return search === '' || q.includes(search.toLowerCase()) || a.includes(search.toLowerCase());
    }),
  })).filter(cat => cat.items.length > 0);

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <HelpCircle size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">FAQ</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Frequently Asked Questions' : 'Su\'aalaha Badanaa La Weydiiyo'}
          </h1>
          <p className="text-white/50 text-sm">
            {lang === 'en'
              ? 'Find answers to common questions about XTS, membership, elections, and more.'
              : 'Hel jawaabaha su\'aalaha caadiga ah ee ku saabsan XTS, xubnimada, doorashooyinka, iyo wax kale.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search questions…' : 'Raadi su\'aalaha…'}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/25"
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filtered.map((cat, ci) => (
            <div key={ci}>
              <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-3 px-1">{cat.category[lang]}</h2>
              <div className="space-y-2">
                {cat.items.map((item, ii) => {
                  const key = `${ci}-${ii}`;
                  const isOpen = open === key;
                  return (
                    <div key={ii} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className={`text-sm font-semibold pr-4 ${isOpen ? 'text-gold' : 'text-white/85'}`}>{item.q[lang]}</span>
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
                              {item.a[lang]}
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
              <p>{lang === 'en' ? 'No questions match your search.' : 'Ma jiraan su\'aalo ku habboon raadintaada.'}</p>
            </div>
          )}
        </div>

        {/* Still have questions */}
        <div className="mt-14 text-center bg-gold/5 border border-gold/15 rounded-2xl p-8">
          <p className="text-white font-bold mb-1">{lang === 'en' ? 'Still have questions?' : 'Weli su\'aalo ma qabtaa?'}</p>
          <p className="text-white/40 text-sm mb-4">{lang === 'en' ? 'Our team is happy to help you.' : 'Kooxdayadu way ku faraxsan tahay inay kaa caawiso.'}</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold text-sm rounded-full hover:bg-gold/90 transition-colors">
            {lang === 'en' ? 'Contact Us' : 'Nala Xiriir'}
          </a>
        </div>
      </div>
    </main>
  );
}
