'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { Globe, Heart, DollarSign, Users, Plane, Phone, Mail, CheckCircle2, MapPin } from 'lucide-react';

const CITIES = [
  { city: 'Minneapolis', country: 'USA', flag: '🇺🇸', somali: 'Mineaapolis' },
  { city: 'London', country: 'UK', flag: '🇬🇧', somali: 'London' },
  { city: 'Toronto', country: 'Canada', flag: '🇨🇦', somali: 'Toronto' },
  { city: 'Stockholm', country: 'Sweden', flag: '🇸🇪', somali: 'Stokholm' },
  { city: 'Oslo', country: 'Norway', flag: '🇳🇴', somali: 'Oslo' },
  { city: 'Copenhagen', country: 'Denmark', flag: '🇩🇰', somali: 'Koobenhafn' },
  { city: 'Dubai', country: 'UAE', flag: '🇦🇪', somali: 'Dubai' },
  { city: 'Nairobi', country: 'Kenya', flag: '🇰🇪', somali: 'Nairobi' },
  { city: 'Columbus', country: 'USA', flag: '🇺🇸', somali: 'Kolombes' },
  { city: 'Helsinki', country: 'Finland', flag: '🇫🇮', somali: 'Helsinki' },
  { city: 'Melbourne', country: 'Australia', flag: '🇦🇺', somali: 'Melboorn' },
  { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', somali: 'Amsterdam' },
];

const HOW_YOU_CAN_HELP = [
  {
    icon: Heart,
    color: '#ef4444',
    en: { title: 'Volunteer Remotely', desc: 'Help with social media, translation, graphic design, video editing, or outreach in your city. You do not need to be in Somalia to contribute.' },
    so: { title: 'Iska Volanteer Si Fog', desc: 'Ka caawi baraha bulshada, turjumaadda, naqshadaynta, tifatirka muuqaalka, ama xiriirka magaalaadaada. Kuma jiraan in aad Soomaaliya ku joogto si aad u gacan seyso.' },
  },
  {
    icon: DollarSign,
    color: '#22c55e',
    en: { title: 'Donate to the Cause', desc: 'Financial support from the diaspora powers our campaigns, printing, events and staff. Every dollar helps. 100% of donations go directly to party operations.' },
    so: { title: 'Ku Deeq Haybadda', desc: 'Taageerada maaliyadeed ee qurbojoogtu waxay awoodaysaa ololeheenna, daabacadda, dhacdooyinka iyo shaqaalaha. Doolarka kasta wuu caawiyaa. 100% deeqaha si toos ah ayay u tagaan hawlgalka xisbiga.' },
  },
  {
    icon: Users,
    color: '#8b5cf6',
    en: { title: 'Organise Events', desc: 'Host a community meeting, town hall, or fundraiser in your city. XTS will provide materials, talking points, and remote speakers.' },
    so: { title: 'Diyaari Dhacdooyin', desc: 'Martigeliso shir bulshada, xaflad magaalaada ah, ama ururinta lacagta magaalaadaada. XTS waxay bixin doontaa agabka, dhinacyada hadlista, iyo hadlayaasha fog.' },
  },
  {
    icon: Globe,
    color: '#3b82f6',
    en: { title: 'Spread the Message', desc: 'Share XTS content on Facebook, TikTok, YouTube, and WhatsApp. Many Somalis get their news from social media — your share reaches hundreds.' },
    so: { title: 'Faafi Farriinta', desc: 'La wadaag nuxurka XTS Facebook, TikTok, YouTube, iyo WhatsApp. Soomaali badan ayaa warkooda ka helaysa baraha bulshada — wadaagidaadu waxay gaartaa boqolaal.' },
  },
  {
    icon: Plane,
    color: '#c9a227',
    en: { title: 'Visit & Engage', desc: 'If you plan to visit Somalia, connect with XTS on the ground. Meet local party members, attend rallies, and register to vote if you are eligible.' },
    so: { title: 'Booqo & La Dhadhanso', desc: 'Haddaad qorsheynayso booqashada Soomaaliya, ku xiriir XTS dhulka. La kulmiyso xubnaha xisbiga ee maxalliga ah, ka qayb gal xafladaha, oo diiwaangeli codeynta haddaad xaq u leedahay.' },
  },
  {
    icon: Phone,
    color: '#f97316',
    en: { title: 'Register a Diaspora Chapter', desc: 'Start an official XTS chapter in your city. Contact us to get registered, receive materials, and be connected to the national party structure.' },
    so: { title: 'Diiwaangeli Qaybta Qurbojoog', desc: 'Bilow qaybta rasmi ah ee XTS magaalaadaada. Nala xiriir si aad u diiwaangashan tahay, agabka hesho, oo lala xidho qaab-dhismeedka xisbiga qaranka.' },
  },
];

const XTS_COMMITMENTS = [
  { en: 'Push for dual citizenship rights for all Somali diaspora', so: 'U diririda xuquuqda dhalashada laba-geesood ee dhammaan qurbojoogta Soomaaliyeed' },
  { en: 'Online voter registration so diaspora can vote from abroad', so: 'Diiwaangelinta cod-bixinta online si qurbojoogtu u codeeyaan dibedda' },
  { en: 'Ministry of Diaspora Affairs with real budget and power', so: 'Wasaaradda Arrimaha Qurbojoog oo haysata miisaaniye iyo awood runta ah' },
  { en: 'Consular services expanded to all major diaspora cities', so: 'Adeegyada qunsuliyadda oo u fidsan dhammaan magaalooyinka qurbojoogta ee weyn' },
  { en: 'Diaspora investment protections and business incentives', so: 'Ilaalinada maalgashiga qurbojoogta iyo dhiirigelinta ganacsiga' },
  { en: 'Regular diaspora town halls and feedback sessions', so: 'Shirarka bulshada ee qurbojoogta iyo xaladaha jawaab-celinta si joogto ah' },
];

export default function DiasporaPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', city: '', country: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, subject: `Diaspora inquiry — ${form.city}, ${form.country}`, message: form.message }),
    });
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-20" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Globe size={13} />
            {lang === 'en' ? 'Somali Diaspora' : 'Qurbojoogta Soomaaliyeed'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'The Diaspora Is Part of Somalia' : 'Qurbojoogtu Waa Qayb Ka Mid Ah Soomaaliya'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Whether you are in Minneapolis, London, or Dubai — XTS is your party too. The diaspora sends billions to Somalia every year. Now it\'s time your voice is heard in its politics.'
              : 'Mineaapolis, London, ama Dubai ha joogteen — XTS xisbigaaga ayuu yahay. Qurbojoogtu sannad kasta bilyan ayay u diraysaa Soomaaliya. Hadda waa waqtiga cod-haynta siyaasaddeeda la maqlo.'}
          </p>
        </motion.div>
      </div>

      {/* Diaspora Cities */}
      <div className="max-w-5xl mx-auto px-4 mb-20">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {lang === 'en' ? 'Somalis Around the World' : 'Soomaalida Adduunka Oo Dhan'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CITIES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:border-gold/20 transition-colors"
            >
              <div className="text-2xl mb-1">{c.flag}</div>
              <div className="text-white text-xs font-semibold">{c.city}</div>
              <div className="text-white/40 text-[10px]">{c.country}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How You Can Help */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">
          {lang === 'en' ? 'How You Can Help From Abroad' : 'Sida Aad Ka Cawin Karto Dibedda'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOW_YOU_CAN_HELP.map((item, i) => {
            const Icon = item.icon;
            const content = item[lang];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="p-3 rounded-xl w-fit mb-4" style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{content.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{content.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* XTS Commitments to Diaspora */}
      <div className="max-w-3xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            {lang === 'en' ? 'XTS Commitments to the Diaspora' : 'Ballanqaadyada XTS ee Qurbojoogta'}
          </h2>
          <div className="space-y-3">
            {XTS_COMMITMENTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">{item[lang]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Form */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Mail size={20} className="text-gold" />
            {lang === 'en' ? 'Connect With XTS Diaspora' : 'La Xiriir XTS Qurbojoog'}
          </h2>
          <p className="text-white/50 text-sm mb-6">
            {lang === 'en' ? 'Tell us where you are and how you want to help. We will be in touch.' : 'Noo sheeg halkaad joogto iyo sida aad u caawin lahayd. Waan kula soo xidhiidhi doonaa.'}
          </p>
          {formSent ? (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <CheckCircle2 size={20} className="text-green-400" />
              <p className="text-green-300 text-sm font-semibold">
                {lang === 'en' ? 'Message received! We will contact you soon.' : 'Farriinta la helay! Dhaw ayaan kula soo xidhiidhi doonaa.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Full Name' : 'Magaca Buuxa'}</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20" placeholder={lang === 'en' ? 'Your name' : 'Magacaaga'} />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold mb-1 uppercase tracking-wide">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20" placeholder="your@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'City' : 'Magaalada'}</label>
                  <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20" placeholder={lang === 'en' ? 'London, Minneapolis...' : 'London, Mineaapolis...'} />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Country' : 'Dalka'}</label>
                  <input required value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20" placeholder={lang === 'en' ? 'UK, USA, Sweden...' : 'UK, USA, Iswiidhan...'} />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'How would you like to help?' : 'Sida aad u caawin lahayd?'}</label>
                <textarea required rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20 resize-none" placeholder={lang === 'en' ? 'Tell us about yourself and how you want to get involved...' : 'Noo sheeg naftigaaga iyo sida aad ku lug lahayd...'} />
              </div>
              <button type="submit" className="w-full py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold/90 transition-all">
                {lang === 'en' ? 'Send Message' : 'Dir Farrinta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
