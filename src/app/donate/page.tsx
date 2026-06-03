'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, CheckCircle, Copy, ChevronDown, ChevronUp, Smartphone, Building2, Globe2, AlertCircle } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import HumanCheck, { useHumanCheck } from '@/components/HumanCheck';
import DonationProgressBar from '@/components/DonationProgressBar';


import toast, { Toaster } from 'react-hot-toast';

// ── Payment methods with full USSD/instructions ──────────────────────────────
const paymentMethods = [
  // ── LOCAL MOBILE MONEY ──
  {
    id: 'evc',
    category: 'mobile',
    name: 'EVC Plus',
    provider: 'Hormuud Telecom',
    region: 'South & Central Somalia',
    color: 'from-red-600 to-red-800',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    logo: '📱',
    ussd: '*712*AMOUNT*XTS_MERCHANT#',
    steps: {
      en: [
        'Open your phone dialer',
        'Dial: *712*[amount]*[XTS merchant number]#',
        'Confirm with your EVC PIN',
        'You will receive an SMS confirmation',
        'Enter the transaction ID below',
      ],
      so: [
        'Fur daylarka telefoonkaaga',
        'Wac: *712*[qadarka]*[lambarka ganacsiga XTS]#',
        'Xaqiiji PIN-kaaga EVC',
        'Waxaad heli doontaa xaqiijin SMS ah',
        'Geli lambarka macaamilka hoosta',
      ],
    },
    note: { en: 'Most widely used in Somalia. Works on any phone.', so: 'Ugu badan isticmaalka Soomaaliya. Waxay ku shaqeysaa taleefon kasta.' },
    popular: true,
  },
  {
    id: 'zaad',
    category: 'mobile',
    name: 'ZAAD',
    provider: 'Telesom',
    region: 'Somaliland',
    color: 'from-green-600 to-green-800',
    badge: 'bg-green-500/20 text-green-300 border-green-500/30',
    logo: '📱',
    ussd: '*880*AMOUNT*XTS_MERCHANT#',
    steps: {
      en: [
        'Open your phone dialer',
        'Dial: *880*[amount]*[XTS merchant number]#',
        'Enter your ZAAD PIN',
        'Confirm the transaction',
        'Enter the confirmation code below',
      ],
      so: [
        'Fur daylarka telefoonkaaga',
        'Wac: *880*[qadarka]*[lambarka ganacsiga XTS]#',
        'Geli PIN-kaaga ZAAD',
        'Xaqiiji macaamilka',
        'Geli koodhka xaqiijinta hoosta',
      ],
    },
    note: { en: 'Dominant in Somaliland region.', so: 'Ugu baahsan gobolka Somaliland.' },
    popular: true,
  },
  {
    id: 'sahal',
    category: 'mobile',
    name: 'SAHAL',
    provider: 'Golis Telecom',
    region: 'Puntland',
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    logo: '📱',
    ussd: '*622*AMOUNT*XTS_MERCHANT#',
    steps: {
      en: [
        'Open your phone dialer',
        'Dial: *622*[amount]*[XTS merchant number]#',
        'Enter your SAHAL PIN',
        'Confirm the payment',
        'Enter the transaction reference below',
      ],
      so: [
        'Fur daylarka telefoonkaaga',
        'Wac: *622*[qadarka]*[lambarka ganacsiga XTS]#',
        'Geli PIN-kaaga SAHAL',
        'Xaqiiji lacag-bixinta',
        'Geli tixraaca macaamilka hoosta',
      ],
    },
    note: { en: 'Primary mobile money in Puntland.', so: 'Lacag guurinta ugu weyn Puntland.' },
    popular: false,
  },
  {
    id: 'edahab',
    category: 'mobile',
    name: 'E-Dahab',
    provider: 'Dahabshiil',
    region: 'All Somalia',
    color: 'from-yellow-600 to-yellow-800',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    logo: '💛',
    ussd: 'E-Dahab App / *346#',
    steps: {
      en: [
        'Open the E-Dahab app or dial *346#',
        'Select "Send Money" or "Pay Merchant"',
        'Enter XTS account number',
        'Enter donation amount',
        'Confirm with your PIN',
      ],
      so: [
        'Fur abka E-Dahab ama wac *346#',
        'Dooro "Dir Lacagta" ama "Bixi Ganacsiga"',
        'Geli lambarka xisaabta XTS',
        'Geli qadarka xiwaalada',
        'Xaqiiji PIN-kaaga',
      ],
    },
    note: { en: 'Available across all Somalia regions.', so: 'Ku dhawaad dhammaan gobolada Soomaaliya.' },
    popular: false,
  },
  // ── BANKS ──
  {
    id: 'premier',
    category: 'bank',
    name: 'Premier Wallet',
    provider: 'Premier Bank',
    region: 'All Somalia + International',
    color: 'from-purple-600 to-purple-800',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    logo: '🏦',
    ussd: 'Premier Bank App / *677#',
    steps: {
      en: [
        'Open Premier Wallet app or dial *677#',
        'Select "Transfer" or "Pay"',
        'Enter XTS Party account number',
        'Enter your donation amount',
        'Confirm with your PIN or biometrics',
      ],
      so: [
        'Fur abka Premier Wallet ama wac *677#',
        'Dooro "Wareejin" ama "Bixi"',
        'Geli lambarka xisaabta Xisbiga XTS',
        'Geli qadarka xiwaalada',
        'Xaqiiji PIN-kaaga ama biometrics',
      ],
    },
    note: { en: 'Accepts Mastercard. Available internationally.', so: 'Waxay aqbashaa Mastercard. Caalamiga ah ayaa heli kara.' },
    popular: false,
  },
  {
    id: 'salaam',
    category: 'bank',
    name: 'Salaam Bank',
    provider: 'Salaam Somali Bank',
    region: 'All Somalia',
    color: 'from-teal-600 to-teal-800',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    logo: '🏦',
    ussd: 'Salaam Mobile App',
    steps: {
      en: [
        'Open Salaam Somali Bank app',
        'Log in to your account',
        'Select "Transfer Funds"',
        'Enter XTS party account details',
        'Enter amount and confirm',
      ],
      so: [
        'Fur abka Salaam Somali Bank',
        'Gal xisaabta aad leedahay',
        'Dooro "Wareejin Lacagta"',
        'Geli xogta xisaabta Xisbiga XTS',
        'Geli qadarka oo xaqiiji',
      ],
    },
    note: { en: 'Islamic banking — no interest. Halal finance.', so: 'Bangiga Islaamiga — xalaasha. Maaliyadda xalaasha.' },
    popular: false,
  },
  {
    id: 'amal',
    category: 'bank',
    name: 'Amal Bank',
    provider: 'Amal Bank Somalia',
    region: 'All Somalia',
    color: 'from-emerald-600 to-emerald-800',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    logo: '🏦',
    ussd: 'Amal Mobile App',
    steps: {
      en: [
        'Open Amal Bank mobile app',
        'Navigate to "Payments"',
        'Select "Organization Payment"',
        'Enter XTS party reference code',
        'Enter amount and confirm with PIN',
      ],
      so: [
        'Fur abka Amal Bank',
        'Tag "Lacag-bixinta"',
        'Dooro "Lacag-bixinta Hay\'adda"',
        'Geli koodhka tixraaca Xisbiga XTS',
        'Geli qadarka oo xaqiiji PIN',
      ],
    },
    note: { en: 'Full Islamic banking compliance.', so: 'Buuxda waxay raacaysaa sharciga bangiyada Islaamiga.' },
    popular: false,
  },
  {
    id: 'ibs',
    category: 'bank',
    name: 'IBS Mobile',
    provider: 'International Bank of Somalia',
    region: 'All Somalia',
    color: 'from-indigo-600 to-indigo-800',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    logo: '🏦',
    ussd: 'IBS App / Branch',
    steps: {
      en: [
        'Open the IBS mobile banking app',
        'Select "Fund Transfer"',
        'Choose "To XTS Party Account"',
        'Enter your donation amount',
        'Confirm the transfer',
      ],
      so: [
        'Fur abka bangiga IBS',
        'Dooro "Wareejinta Lacagta"',
        'Dooro "Xisaabta Xisbiga XTS"',
        'Geli qadarka xiwaalada',
        'Xaqiiji wareejinta',
      ],
    },
    note: { en: 'Licensed international banking in Somalia.', so: 'Bangiyada caalamiga ah ee ruqsad leh ee Soomaaliya.' },
    popular: false,
  },
  // ── INTERNATIONAL REMITTANCE ──
  {
    id: 'dahabshiil',
    category: 'remittance',
    name: 'Dahabshiil',
    provider: 'Dahabshiil Transfer',
    region: 'Worldwide → Somalia',
    color: 'from-orange-600 to-orange-800',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    logo: '🌍',
    ussd: 'dahabshiil.com / Agent',
    steps: {
      en: [
        'Visit dahabshiil.com or nearest agent',
        'Select "Send Money to Somalia"',
        'Enter XTS party name and location (Mogadishu)',
        'Enter your donation amount',
        'Keep the reference number and enter below',
      ],
      so: [
        'Booqo dahabshiil.com ama wakiilka ugu dhow',
        'Dooro "Dir Lacagta Soomaaliya"',
        'Geli magaca Xisbiga XTS iyo goobta (Muqdisho)',
        'Geli qadarka xiwaalada',
        'Hayso lambarka tixraaca oo geli hoosta',
      ],
    },
    note: { en: 'Africa\'s largest money transfer. Used by Somali diaspora worldwide.', so: 'Wareejinta lacagta ugu weyn Afrika. Uu isticmaalo qurbajoogta Soomaaliyeed adduunka oo dhan.' },
    popular: true,
  },
  {
    id: 'worldremit',
    category: 'remittance',
    name: 'WorldRemit',
    provider: 'WorldRemit',
    region: 'Worldwide → Somalia',
    color: 'from-pink-600 to-pink-800',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    logo: '🌐',
    ussd: 'worldremit.com / App',
    steps: {
      en: [
        'Download WorldRemit app or visit worldremit.com',
        'Choose "Somalia" as destination',
        'Select "Mobile Money" (EVC Plus / ZAAD)',
        'Enter XTS mobile money number',
        'Send your donation',
      ],
      so: [
        'Soo degso abka WorldRemit ama booqo worldremit.com',
        'Dooro "Soomaaliya" meesha la gudbinayo',
        'Dooro "Lacagta Mobilka" (EVC Plus / ZAAD)',
        'Geli lambarka lacag-guurinta Xisbiga XTS',
        'Dir xiwaaladaada',
      ],
    },
    note: { en: 'Fast international transfer. Sends directly to mobile money wallets.', so: 'Wareejinta caalamiga ah ee degdeg ah. Toos u dira jeebka lacag-guurinta mobilka.' },
    popular: false,
  },
  {
    id: 'taaj',
    category: 'remittance',
    name: 'Taaj Money',
    provider: 'Taaj Transfer',
    region: 'East Africa → Somalia',
    color: 'from-rose-600 to-rose-800',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    logo: '💸',
    ussd: 'Taaj Agent / App',
    steps: {
      en: [
        'Visit a Taaj agent or use the Taaj app',
        'Select "Send to Somalia"',
        'Enter XTS party recipient details',
        'Enter the amount in USD or SOS',
        'Get reference number and enter below',
      ],
      so: [
        'Booqo wakiil Taaj ama isticmaal abka Taaj',
        'Dooro "Dir Soomaaliya"',
        'Geli xogta qaabilaha Xisbiga XTS',
        'Geli qadarka USD ama SOS',
        'Hel lambarka tixraaca oo geli hoosta',
      ],
    },
    note: { en: 'Popular in East Africa and Horn of Africa.', so: 'Caaanka ah Afrika Bariga iyo Geeska Afrika.' },
    popular: false,
  },
  {
    id: 'westernunion',
    category: 'remittance',
    name: 'Western Union',
    provider: 'Western Union',
    region: 'Worldwide → Somalia',
    color: 'from-yellow-500 to-yellow-700',
    badge: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    logo: '🌎',
    ussd: 'westernunion.com / Agent',
    steps: {
      en: [
        'Visit westernunion.com or nearest agent',
        'Select "Send to Somalia"',
        'Choose cash pickup in Mogadishu',
        'Fill in XTS party recipient info',
        'Enter your donation amount and send',
      ],
      so: [
        'Booqo westernunion.com ama wakiilka ugu dhow',
        'Dooro "Dir Soomaaliya"',
        'Dooro qaadashada lacagta Muqdisho',
        'Buuxi xogta qaabilaha Xisbiga XTS',
        'Geli qadarka xiwaaladaada oo dir',
      ],
    },
    note: { en: 'Available in 200+ countries. Agent pickup in Somalia.', so: 'Ku dhawaad 200+ dal ayuu ka heli karaa. Wakiilka ayaa ka qaata Soomaaliya.' },
    popular: false,
  },
];

const categories = [
  { id: 'all', en: 'All Methods', so: 'Dhammaan' },
  { id: 'mobile', en: 'Mobile Money', so: 'Mobilka' },
  { id: 'bank', en: 'Banks', so: 'Baangiyada' },
  { id: 'remittance', en: 'International', so: 'Caalamiga' },
];

const presetAmounts = [5, 10, 25, 50, 100, 250];

export default function DonatePage() {
  const { lang } = useLang();
  const humanCheck = useHumanCheck();
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'SOS'>('USD');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', message: '', transactionId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const filtered = category === 'all' ? paymentMethods : paymentMethods.filter(m => m.category === category);
  const selectedMethod = paymentMethods.find(m => m.id === selected);
  const finalAmount = customAmount || amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanCheck.verify()) return;
    if (!selected || !finalAmount || !form.fullName || !form.phone) {
      toast.error(lang === 'en' ? 'Please fill all required fields' : 'Fadlan buuxi dhammaan goobaha looga baahdo');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || undefined,
          amount: parseFloat(finalAmount),
          currency,
          method: selectedMethod?.name ?? selected,
          message: form.message || undefined,
          transactionId: form.transactionId || undefined,
        }),
      });
      const text = await res.text();
      let data: { success?: boolean; error?: string } = {};
      try { data = JSON.parse(text); } catch { data = {}; }
      if (data.success) {
        setDone(true);
        toast.success(lang === 'en' ? 'Thank you for your donation! 🇸🇴' : 'Mahadsanid xiwaaladaada! 🇸🇴');
      } else {
        toast.error(data.error ?? 'Error');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a2454', color: '#fff', border: '1px solid #c9a227' } }} />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#060d20] to-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Heart size={36} className="text-gold fill-gold/30" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl font-black text-white mb-4">
            {lang === 'en' ? <>Support <span className="text-gold">Somalia&apos;s</span> Future</> : <>Taageera <span className="text-gold">Mustaqbalka</span> Soomaaliya</>}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            {lang === 'en'
              ? 'Every donation directly funds our mission to build a peaceful, just, and prosperous Somalia. All Somali payment methods accepted.'
              : 'Xiwaalad kasta waxay si toos ah u maalgelisaa hawsheenna si aan Soomaaliya nabadeed, cadaalad leh, oo barwaaqaysan u dhisno. Dhammaan hababka lacag-bixinta Soomaaliya ayaa la aqbalaa.'}
          </motion.p>

        </div>
      </section>

      <section className="py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Campaign progress bar */}
          <div className="max-w-lg mx-auto mb-10">
            <DonationProgressBar />
          </div>

          {done ? (
            /* ── Success screen ── */
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-20">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">
                {lang === 'en' ? 'Donation Recorded!' : 'Xiwaaladda Waa La Diiwaangeliyey!'}
              </h2>
              <p className="text-white/60 mb-8">
                {lang === 'en'
                  ? 'Thank you for supporting Somalia\'s future. Our team will verify your donation within 24 hours.'
                  : 'Mahadsanid taageeridaada mustaqbalka Soomaaliya. Kooxdayadu waxay xaqiijin doontaa xiwaaladaada 24 saacadood gudahood.'}
              </p>
              <button onClick={() => { setDone(false); setSelected(null); setAmount(''); setForm({ fullName: '', phone: '', email: '', message: '', transactionId: '' }); }}
                className="px-8 py-3 bg-gold text-navy font-black rounded-full hover:bg-gold/90 transition-all">
                {lang === 'en' ? 'Donate Again' : 'Mar Kale Xiwaal'}
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* ── LEFT: Method picker ── */}
              <div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {lang === 'en' ? '1. Choose Payment Method' : '1. Dooro Hab Lacag-bixinta'}
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  {lang === 'en' ? 'All major Somali payment methods supported' : 'Dhammaan hababka lacag-bixinta Soomaaliya ee weyn ayaa la taageeraa'}
                </p>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setCategory(c.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${category === c.id ? 'bg-gold text-navy' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                      {lang === 'en' ? c.en : c.so}
                    </button>
                  ))}
                </div>

                {/* Category header */}
                {category !== 'all' && (
                  <div className="flex items-center gap-2 mb-4 text-white/40 text-xs uppercase tracking-widest">
                    {category === 'mobile' && <><Smartphone size={14} />{lang === 'en' ? 'Mobile Money Services' : 'Adeegyada Lacag-guurinta Mobilka'}</>}
                    {category === 'bank' && <><Building2 size={14} />{lang === 'en' ? 'Somali Banks' : 'Baangiyada Soomaalida'}</>}
                    {category === 'remittance' && <><Globe2 size={14} />{lang === 'en' ? 'International Transfers' : 'Wareejimaha Caalamiga ah'}</>}
                  </div>
                )}

                {/* Method cards */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                  {filtered.map(method => (
                    <motion.div key={method.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      {/* Card header */}
                      <div
                        onClick={() => { setSelected(method.id); setExpanded(expanded === method.id ? null : method.id); }}
                        className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selected === method.id
                          ? 'border-gold bg-gold/10 shadow-lg shadow-gold/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected === method.id ? 'border-gold bg-gold' : 'border-white/30'}`}>
                            {selected === method.id && <div className="w-2 h-2 rounded-full bg-navy" />}
                          </div>

                          {/* Logo */}
                          <span className="text-2xl">{method.logo}</span>

                          {/* Name + region */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white font-bold text-base">{method.name}</span>
                              {method.popular && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-bold">
                                  {lang === 'en' ? 'POPULAR' : 'CAANKA'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${method.badge} font-medium`}>{method.provider}</span>
                              <span className="text-white/35 text-xs">{method.region}</span>
                            </div>
                          </div>

                          {/* Expand toggle */}
                          <button onClick={e => { e.stopPropagation(); setExpanded(expanded === method.id ? null : method.id); }}
                            className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
                            {expanded === method.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded instructions */}
                      <AnimatePresence>
                        {expanded === method.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden">
                            <div className="mt-1 p-4 rounded-xl bg-navy/50 border border-white/10 text-sm">
                              {/* USSD code */}
                              <div className="flex items-center justify-between mb-3 p-2.5 rounded-lg bg-black/30 border border-white/10">
                                <code className="text-gold font-mono text-sm">{method.ussd}</code>
                                <button onClick={() => { navigator.clipboard.writeText(method.ussd); toast.success('Copied!'); }}
                                  className="text-white/50 hover:text-gold transition-colors">
                                  <Copy size={14} />
                                </button>
                              </div>
                              {/* Steps */}
                              <ol className="space-y-2 mb-3">
                                {(lang === 'en' ? method.steps.en : method.steps.so).map((step, i) => (
                                  <li key={i} className="flex gap-3 text-white/65">
                                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                              {/* Note */}
                              <div className="flex gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <AlertCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <span className="text-blue-300/80 text-xs">{lang === 'en' ? method.note.en : method.note.so}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Amount + form ── */}
              <div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {lang === 'en' ? '2. Complete Your Donation' : '2. Dhammee Xiwaaladaada'}
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  {lang === 'en' ? 'Fill in your details after completing the payment' : 'Buuxi xogta aad leedahay kadib marka aad lacag-bixinta dhamaysato'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Amount */}
                  <div>
                    <label className="block text-white/70 text-sm font-semibold mb-3">
                      {lang === 'en' ? 'Donation Amount' : 'Qadarka Xiwaaladda'} *
                    </label>
                    {/* Currency toggle */}
                    <div className="flex gap-2 mb-3">
                      {(['USD', 'SOS'] as const).map(c => (
                        <button key={c} type="button" onClick={() => setCurrency(c)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${currency === c ? 'bg-gold text-navy' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                          {c === 'USD' ? '🇺🇸 USD' : '🇸🇴 SOS'}
                        </button>
                      ))}
                    </div>
                    {/* Preset amounts */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {presetAmounts.map(a => (
                        <button key={a} type="button"
                          onClick={() => { setAmount(String(a)); setCustomAmount(''); }}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${amount === String(a) && !customAmount ? 'bg-gold text-navy shadow-lg shadow-gold/20' : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'}`}>
                          {currency === 'USD' ? `$${a}` : `${(a * 570).toLocaleString()} SOS`}
                        </button>
                      ))}
                    </div>
                    {/* Custom amount */}
                    <input
                      type="number"
                      min="1"
                      placeholder={lang === 'en' ? `Custom amount (${currency})` : `Qadarka kuu gaar ah (${currency})`}
                      value={customAmount}
                      onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>

                  {/* Selected method badge */}
                  {selectedMethod && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gold/10 border border-gold/30">
                      <span className="text-xl">{selectedMethod.logo}</span>
                      <div>
                        <div className="text-gold font-bold text-sm">{selectedMethod.name}</div>
                        <div className="text-white/50 text-xs">{selectedMethod.provider}</div>
                      </div>
                      <Phone size={16} className="text-gold/50 ml-auto" />
                    </motion.div>
                  )}

                  {/* Personal info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wider">
                        {lang === 'en' ? 'Full Name' : 'Magaca Buuxa'} *
                      </label>
                      <input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                        placeholder={lang === 'en' ? 'Your full name' : 'Magacaaga buuxa'}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wider">
                        {lang === 'en' ? 'Phone Number' : 'Lambarka Taleefoonka'} *
                      </label>
                      <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+252 ..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wider">
                      {lang === 'en' ? 'Email (Optional)' : 'Email (Ikhtiyaari)'}
                    </label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder={lang === 'en' ? 'your@email.com' : 'emailkaaga@...'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wider">
                      {lang === 'en' ? 'Transaction ID / Reference' : 'Lambarka Macaamilka'}
                      <span className="text-white/30 font-normal ml-1">({lang === 'en' ? 'from your payment confirmation SMS' : 'SMS-ka xaqiijinta lacag-bixintaada'})</span>
                    </label>
                    <input value={form.transactionId} onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))}
                      placeholder={lang === 'en' ? 'e.g. TXN-12345678' : 'TXN-12345678'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wider">
                      {lang === 'en' ? 'Message (Optional)' : 'Fariin (Ikhtiyaari)'}
                    </label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={3}
                      placeholder={lang === 'en' ? 'Why are you donating? (optional)' : 'Maxaad u xiwaalaysaa? (ikhtiyaari)'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors resize-none" />
                  </div>

                  {/* Summary */}
                  {(finalAmount && selectedMethod) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-transparent border border-gold/20">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/60">{lang === 'en' ? 'Payment via' : 'Lacag-bixinta iyada'}</span>
                        <span className="text-white font-semibold">{selectedMethod.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{lang === 'en' ? 'Donation amount' : 'Qadarka xiwaaladda'}</span>
                        <span className="text-gold font-black text-lg">{currency === 'USD' ? `$${finalAmount}` : `${parseInt(finalAmount).toLocaleString()} SOS`}</span>
                      </div>
                    </motion.div>
                  )}

                  <HumanCheck state={humanCheck} lang={lang} />

                  <motion.button
                    type="submit"
                    disabled={submitting || !selected || !finalAmount}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(201,162,39,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gold text-navy font-black text-lg rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <Heart size={20} className="fill-navy/40" />
                    {submitting
                      ? (lang === 'en' ? 'Submitting...' : 'Diraya...')
                      : (lang === 'en' ? 'Confirm Donation' : 'Xaqiiji Xiwaaladda')}
                  </motion.button>

                  <p className="text-white/25 text-xs text-center">
                    {lang === 'en'
                      ? 'Your donation is recorded and verified by our finance team within 24 hours.'
                      : 'Xiwaaladaada waxaa diiwaangeliya kooxda maaliyadda 24 saacadood gudahood.'}
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      
    </>
  );
}
