'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import HumanCheck, { useHumanCheck } from '@/components/HumanCheck';

interface Petition {
  id: string;
  titleEn: string;
  titleSo: string;
  descEn: string;
  descSo: string;
  goal: number;
  _count: { signatures: number };
}

function PetitionCard({ petition, lang }: { petition: Petition; lang: 'en' | 'so' }) {
  const humanCheck = useHumanCheck();
  const [form, setForm] = useState({ name: '', city: '' });
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(petition._count.signatures);

  const percent = Math.min(100, Math.round((count / petition.goal) * 100));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanCheck.verify()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petitionId: petition.id, ...form }),
      });
      const d = await res.json();
      if (res.ok) { setDone(true); setCount(d.count); }
      else setError(d.error ?? 'Failed. Please try again.');
    } catch { setError('Network error.'); }
    setSubmitting(false);
  };

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-gold/20 transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-base mb-2">
            {lang === 'en' ? petition.titleEn : petition.titleSo}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">
            {lang === 'en' ? petition.descEn : petition.descSo}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <FileSignature size={18} className="text-gold" />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gold font-bold flex items-center gap-1.5"><Users size={11} /> {count.toLocaleString()} {lang === 'en' ? 'signatures' : 'saxiix'}</span>
          <span className="text-white/30">{lang === 'en' ? 'Goal:' : 'Hadafka:'} {petition.goal.toLocaleString()} ({percent}%)</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300"
          />
        </div>
      </div>

      {done ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-bold py-2">
          <CheckCircle2 size={16} />
          {lang === 'en' ? 'Thank you — your signature is recorded!' : 'Mahadsanid — saxiixaaga waa la diiwaangeliyey!'}
        </div>
      ) : (
        <>
          <button onClick={() => setOpen(o => !o)}
            className="w-full py-2.5 bg-gold text-navy font-black text-sm rounded-xl hover:bg-gold/90 transition-colors flex items-center justify-center gap-2">
            <FileSignature size={15} />
            {open
              ? (lang === 'en' ? 'Cancel' : 'Jooji')
              : (lang === 'en' ? 'Sign This Petition' : 'Saxiix Arintan')}
          </button>
          <AnimatePresence>
            {open && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                onSubmit={submit} className="mt-4 space-y-3 overflow-hidden">
                <input required placeholder={lang === 'en' ? 'Your full name *' : 'Magacaaga buuxa *'}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50" />
                <input required placeholder={lang === 'en' ? 'Your city *' : 'Magaaladaada *'}
                  value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50" />
                <HumanCheck state={humanCheck} lang={lang} />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full py-2.5 bg-gold text-navy font-black text-sm rounded-xl hover:bg-gold/90 disabled:opacity-50 transition-colors">
                  {submitting ? '...' : (lang === 'en' ? 'Submit Signature' : 'Dir Saxiixga')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function PetitionPage() {
  const { lang } = useLang();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/petition').then(r => r.json()).then(d => { setPetitions(d.petitions ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <TrendingUp size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'People\'s Voice' : 'Codka Shacabka'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Sign Our Petitions' : 'Saxiix Arrimahayaga'}
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            {lang === 'en'
              ? 'Add your voice to XTS campaigns. Every signature counts and is presented to decision-makers.'
              : 'Ku dar codkaaga olalaha XTS. Saxiix kastaa waa muhiim waxaana loo gudbin doona go\'aansamayaasha.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : petitions.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <FileSignature size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-white/50 font-bold mb-2">{lang === 'en' ? 'No Active Petitions' : 'Codsiyada Firfircoon Jiran Maayo'}</p>
            <p className="text-sm">{lang === 'en' ? 'Check back soon — new petitions are being prepared.' : 'Dib u eeg dhawaan — waxaa la diyaarinayaa codsiyada cusub.'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {petitions.map(p => <PetitionCard key={p.id} petition={p} lang={lang} />)}
          </div>
        )}
      </div>
    </main>
  );
}
