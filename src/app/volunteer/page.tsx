'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { Heart, MapPin, CheckCircle2, Users, Megaphone, Wifi, Car, Languages, Printer, ChevronRight } from 'lucide-react';

const SKILL_OPTIONS = [
  { id: 'social_media', icon: Wifi, en: 'Social Media', so: 'Baraha Bulshada' },
  { id: 'translation', icon: Languages, en: 'Translation (Somali/English)', so: 'Turjumaad (Soomaali/Ingiriisi)' },
  { id: 'driving', icon: Car, en: 'Driving / Transport', so: 'Wadidda / Gaadiidka' },
  { id: 'printing', icon: Printer, en: 'Printing & Distribution', so: 'Daabacadda & Qaybinta' },
  { id: 'organizing', icon: Users, en: 'Event Organizing', so: 'Qorsheynta Dhacdooyinka' },
  { id: 'speaking', icon: Megaphone, en: 'Public Speaking', so: 'Hadlista Dadweynaha' },
  { id: 'door_to_door', icon: MapPin, en: 'Door to Door Canvassing', so: 'Albaabka Albaabka' },
  { id: 'data_entry', icon: Wifi, en: 'Data Entry / Admin', so: 'Gelinta Xogta / Maamulka' },
];

const AVAILABILITY_OPTIONS = [
  { id: 'WEEKDAYS', en: 'Weekdays', so: 'Maalmaha Shaqada' },
  { id: 'WEEKENDS', en: 'Weekends', so: 'Maalmaha Fasaxa' },
  { id: 'EVENINGS', en: 'Evenings', so: 'Fiidmeerka' },
  { id: 'ANYTIME', en: 'Any time', so: 'Goor kastaba' },
];

type FormType = 'GENERAL' | 'CANVASSER';

export default function VolunteerPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });
  const [formType, setFormType] = useState<FormType>('GENERAL');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', region: '', district: '', area: '',
    skills: [] as string[], availability: 'WEEKENDS', message: '',
  });

  const toggleSkill = (id: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(id) ? f.skills.filter(s => s !== id) : [...f.skills, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: formType }),
      });
      if (res.ok) setSent(true);
      else {
        const d = await res.json();
        setError(d.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Heart size={13} />
            {lang === 'en' ? 'Get Involved' : 'Ka Qayb Noqo'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'Volunteer for XTS' : 'Ku Volunteerso XTS'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Two ways to help. General volunteers support the party remotely or at events. Door-to-door canvassers go directly into communities to talk to people face to face.'
              : 'Laba hab oo gargaar. Volonteerada guud waxay taagerayaan xisbiga fog ama dhacdooyinka. Xoogga albaabka-albaabka ah si toos ah ayay ugu tagaan bulshada si ay dadka ula hadlaan wejiga-wejiga.'}
          </p>
        </motion.div>
      </div>

      {/* Type selector */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setFormType('GENERAL')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${formType === 'GENERAL' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
            <Users size={20} className={`mb-2 ${formType === 'GENERAL' ? 'text-gold' : 'text-white/40'}`} />
            <p className={`font-bold text-sm ${formType === 'GENERAL' ? 'text-white' : 'text-white/60'}`}>
              {lang === 'en' ? 'General Volunteer' : 'Volunteerka Guud'}
            </p>
            <p className={`text-xs mt-1 ${formType === 'GENERAL' ? 'text-white/60' : 'text-white/30'}`}>
              {lang === 'en' ? 'Social media, events, translation, admin' : 'Baraha bulshada, dhacdooyinka, turjumaad, maamul'}
            </p>
          </button>
          <button onClick={() => setFormType('CANVASSER')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${formType === 'CANVASSER' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
            <MapPin size={20} className={`mb-2 ${formType === 'CANVASSER' ? 'text-gold' : 'text-white/40'}`} />
            <p className={`font-bold text-sm ${formType === 'CANVASSER' ? 'text-white' : 'text-white/60'}`}>
              {lang === 'en' ? 'Door-to-Door Canvasser' : 'Xoogga Albaabka-Albaabka'}
            </p>
            <p className={`text-xs mt-1 ${formType === 'CANVASSER' ? 'text-white/60' : 'text-white/30'}`}>
              {lang === 'en' ? 'Visit homes, talk to people directly' : 'Booqo guryaha, si toos ah dadka ula hadal'}
            </p>
          </button>
        </div>
      </div>

      {/* Canvasser info */}
      {formType === 'CANVASSER' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4 mb-6">
          <div className="bg-gold/8 border border-gold/20 rounded-2xl p-5">
            <h3 className="font-bold text-gold mb-3 text-sm">
              {lang === 'en' ? 'What Does a Door-to-Door Canvasser Do?' : 'Maxay Samaynayaan Xoogga Albaabka-Albaabka?'}
            </h3>
            <div className="space-y-2">
              {[
                { en: 'Go door to door in your assigned neighbourhood', so: 'Tag albaabka-albaabka xaafaddaada loo xilsaaray' },
                { en: 'Explain XTS policies to neighbours in Somali', so: 'Sharax qorshaha XTS deriskiisa Soomaali ku ah' },
                { en: 'Help people register to vote', so: 'Ka caawi dadka diiwaangelinta codeynta' },
                { en: 'Collect questions and feedback for the party', so: 'Ururi su\'aalaha iyo jawaab-celinta xisbiga' },
                { en: 'Report back to your XTS area coordinator', so: 'La warbixin xidmeerahaaga aagga XTS' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight size={13} className="text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 text-xs">{item[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4">
        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-10 text-center">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === 'en' ? 'Thank you for volunteering!' : 'Mahadsanid volunteerigaaga!'}
            </h2>
            <p className="text-white/60">
              {lang === 'en'
                ? 'We have received your registration. An XTS coordinator will contact you soon.'
                : 'Waxaan helay diiwaangelinkaaga. Xidmeer XTS ah ayaa dhaw kula soo xidhiidhi doona.'}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-bold text-white">
              {formType === 'CANVASSER'
                ? (lang === 'en' ? 'Canvasser Registration' : 'Diiwaangelinta Xoogga')
                : (lang === 'en' ? 'Volunteer Registration' : 'Diiwaangelinta Volunteerka')}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'First Name *' : 'Magaca Koowaad *'}</label>
                <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder={lang === 'en' ? 'First name' : 'Magaca koowaad'} />
              </div>
              <div>
                <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Last Name *' : 'Magaca Dambe *'}</label>
                <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder={lang === 'en' ? 'Last name' : 'Magaca dambe'} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Phone *' : 'Telefoon *'}</label>
                <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder="+252..." />
              </div>
              <div>
                <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Email (optional)' : 'Email (ikhtiyaari)'}</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder="your@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'City *' : 'Magaalo *'}</label>
                <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder={lang === 'en' ? 'Mogadishu, Las Anod...' : 'Muqdisho, Laascaanood...'} />
              </div>
              <div>
                <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Region' : 'Gobolka'}</label>
                <input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder={lang === 'en' ? 'Region / State' : 'Gobol / Dowlad'} />
              </div>
            </div>

            {formType === 'CANVASSER' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'District / Neighbourhood *' : 'Degmo / Xaafad *'}</label>
                  <input required value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    placeholder={lang === 'en' ? 'District name' : 'Magaca degmada'} />
                </div>
                <div>
                  <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Specific Area' : 'Aagga Gaar ah'}</label>
                  <input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    placeholder={lang === 'en' ? 'Street / Area' : 'Wadada / Aagga'} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/40 text-[11px] font-semibold mb-2 uppercase tracking-wide">{lang === 'en' ? 'Skills / How Can You Help?' : 'Xirfadaha / Sidee Kaa Caawin Kartaa?'}</label>
              <div className="grid grid-cols-2 gap-2">
                {SKILL_OPTIONS.map(skill => {
                  const Icon = skill.icon;
                  const selected = form.skills.includes(skill.id);
                  return (
                    <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all ${selected ? 'bg-gold/15 border-gold/40 text-gold' : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20'}`}>
                      <Icon size={13} className="flex-shrink-0" />
                      <span>{skill[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-white/40 text-[11px] font-semibold mb-2 uppercase tracking-wide">{lang === 'en' ? 'Availability' : 'Waqtiga'}</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button key={opt.id} type="button" onClick={() => setForm(f => ({ ...f, availability: opt.id }))}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all ${form.availability === opt.id ? 'bg-gold/15 border-gold/40 text-gold' : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20'}`}>
                    {opt[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/40 text-[11px] font-semibold mb-1 uppercase tracking-wide">{lang === 'en' ? 'Anything else?' : 'Wax kale?'}</label>
              <textarea rows={2} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20 resize-none"
                placeholder={lang === 'en' ? 'Tell us about yourself...' : 'Noo sheeg naftigaaga...'} />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold/90 disabled:opacity-50 transition-all">
              {submitting
                ? (lang === 'en' ? 'Registering…' : 'La diiwaangeliyaa…')
                : formType === 'CANVASSER'
                  ? (lang === 'en' ? 'Register as Canvasser' : 'Isdiiwaangeli Xooge ahaan')
                  : (lang === 'en' ? 'Register as Volunteer' : 'Isdiiwaangeli Volunteerka ahaan')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
