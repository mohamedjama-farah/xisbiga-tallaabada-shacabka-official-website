'use client';
import { useState } from 'react';
import { AlertCircle, Send, CheckCircle2, Shield, Clock, Users } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import HumanCheck, { useHumanCheck } from '@/components/HumanCheck';

const categories = [
  { id: 'CORRUPTION', en: 'Corruption / Bribery', so: 'Musuqmaasuq / Rashwad' },
  { id: 'INJUSTICE', en: 'Injustice / Unfair Treatment', so: 'Dulmi / Xaqdarris' },
  { id: 'SECURITY', en: 'Security Issue', so: 'Arrin Amniga' },
  { id: 'PUBLIC_SERVICES', en: 'Poor Public Services', so: 'Adeegyada Bulshada ee Xun' },
  { id: 'HUMAN_RIGHTS', en: 'Human Rights Violation', so: 'Xadgudubka Xuquuqda Aadanaha' },
  { id: 'ELECTIONS', en: 'Election Related', so: 'Ku Saabsan Doorashada' },
  { id: 'OTHER', en: 'Other', so: 'Kale' },
];

export default function ComplaintPage() {
  const { lang } = useLang();
  const humanCheck = useHumanCheck();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', city: '', category: '', subject: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanCheck.verify()) return;
    if (!form.fullName || !form.city || !form.category || !form.subject || !form.body) {
      setError(lang === 'en' ? 'Please fill in all required fields.' : 'Fadlan buuxi dhammaan goobaha loo baahan yahay.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/complaint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        setDone(true);
      } else {
        const d = await res.json();
        setError(d.error ?? (lang === 'en' ? 'Submission failed. Please try again.' : 'Gudbinta waxay ku guuldareysatay. Fadlan dib u isku day.'));
      }
    } catch {
      setError(lang === 'en' ? 'Network error. Please try again.' : 'Khalad shabakad. Fadlan dib u isku day.');
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
            <AlertCircle size={14} className="text-red-400" />
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Citizen Complaints' : 'Cabashooyinka Muwaadiniinta'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Report an Issue' : 'Soo Gudbi Arrin'}
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            {lang === 'en'
              ? 'XTS takes every citizen complaint seriously. Your voice matters. We will review your report and respond within 7 working days.'
              : 'XTS si dhab ah ayay u qaadanaysaa cabasho kasta oo muwaadin ah. Codkaagu waa muhiim. Waxaan dib u eegi doonaa warbixintaada waxaanaan kula xiriiri doonnaa 7 maalmood shaqo gudahood.'}
          </p>
        </div>

        {/* Promises */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Shield, en: 'Confidential', so: 'Sir' },
            { icon: Clock, en: '7-day response', so: 'Jawaab 7 maalmood' },
            { icon: Users, en: 'Reviewed by team', so: 'Koox eegta' },
          ].map(({ icon: Icon, en, so }) => (
            <div key={en} className="bg-white/3 border border-white/8 rounded-xl p-3 text-center">
              <Icon size={18} className="text-gold mx-auto mb-1" />
              <p className="text-white/60 text-xs">{lang === 'en' ? en : so}</p>
            </div>
          ))}
        </div>

        {done ? (
          <div className="text-center py-16 bg-green-500/5 border border-green-500/20 rounded-2xl">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">
              {lang === 'en' ? 'Complaint Submitted!' : 'Cabashadii La Gudbiyay!'}
            </h2>
            <p className="text-white/50 text-sm max-w-xs mx-auto">
              {lang === 'en'
                ? 'Thank you for reporting. Our team will review your complaint and respond within 7 working days.'
                : 'Mahadsanid soo gudbinta. Kooxdayadu waxay dib u eegi doontaa cabashadaada waxaanaan kula xiriiri doonnaa 7 maalmood shaqo gudahood.'}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/10 pb-3">
                {lang === 'en' ? 'Your Information' : 'Macluumaadkaaga'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                    {lang === 'en' ? 'Full Name *' : 'Magaca Buuxa *'}
                  </label>
                  <input value={form.fullName} onChange={e => set('fullName', e.target.value)} required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    placeholder={lang === 'en' ? 'Your full name' : 'Magacaaga buuxa'} />
                </div>
                <div>
                  <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                    {lang === 'en' ? 'Phone' : 'Telefoon'}
                  </label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} type="tel"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    placeholder="+252..." />
                </div>
                <div>
                  <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                    {lang === 'en' ? 'Email' : 'Email'}
                  </label>
                  <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    placeholder="email@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                    {lang === 'en' ? 'City / District *' : 'Magaalo / Degmo *'}
                  </label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                    placeholder={lang === 'en' ? 'e.g. Mogadishu, Dharkenley' : 'Tusaale: Muqdisho, Dharkanley'} />
                </div>
              </div>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/10 pb-3">
                {lang === 'en' ? 'Complaint Details' : 'Faahfaahinta Cabashadda'}
              </h2>

              <div>
                <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                  {lang === 'en' ? 'Category *' : 'Nooca *'}
                </label>
                <select value={form.category} onChange={e => set('category', e.target.value)} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40">
                  <option value="">{lang === 'en' ? '— Select a category —' : '— Dooro nooca —'}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'en' ? c.en : c.so}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                  {lang === 'en' ? 'Subject *' : 'Cinwaanka *'}
                </label>
                <input value={form.subject} onChange={e => set('subject', e.target.value)} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20"
                  placeholder={lang === 'en' ? 'Brief description of the issue' : 'Sharaxaad gaaban oo arrimaha'} />
              </div>

              <div>
                <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                  {lang === 'en' ? 'Full Details *' : 'Faahfaahin Dhammaystiran *'}
                </label>
                <textarea value={form.body} onChange={e => set('body', e.target.value)} required rows={5}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/20 resize-none"
                  placeholder={lang === 'en'
                    ? 'Please describe the issue in as much detail as possible. Include dates, locations, and names of those involved if known.'
                    : 'Fadlan si faahfaahsan u sharax arrimaha. Ku dar taariikhaha, meelaha, iyo magacyada dadka ku lug leh haddii la garanayo.'} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <HumanCheck state={humanCheck} lang={lang} />

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold text-navy font-black rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60">
              <Send size={16} />
              {submitting
                ? (lang === 'en' ? 'Submitting…' : 'La gudbinayaa…')
                : (lang === 'en' ? 'Submit Complaint' : 'Gudbi Cabashadda')}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
