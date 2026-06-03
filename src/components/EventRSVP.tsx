'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, CheckCircle2, Users } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import HumanCheck, { useHumanCheck } from './HumanCheck';

interface Props {
  eventId: string;
  eventTitle: string;
  rsvpCount: number;
}

export default function EventRSVP({ eventId, eventTitle, rsvpCount: initialCount }: Props) {
  const { lang } = useLang();
  const humanCheck = useHumanCheck();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(initialCount);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanCheck.verify()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, ...form }),
      });
      if (res.ok) {
        setDone(true);
        setCount(c => c + 1);
      } else {
        const d = await res.json();
        setError(d.error ?? 'Error registering');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Users size={12} />
          <span>{count} {lang === 'en' ? 'registered' : 'diiwaangashay'}</span>
        </div>
        {!done && (
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/15 hover:bg-gold/25 border border-gold/30 rounded-lg text-gold text-xs font-bold transition-colors"
          >
            <UserPlus size={12} />
            {lang === 'en' ? 'Register to Attend' : 'Is Diiwangeli'}
          </button>
        )}
        {done && (
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
            <CheckCircle2 size={14} />
            {lang === 'en' ? 'Registered!' : 'Waa la diiwaangeliyey!'}
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && !done && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="mt-3 space-y-2 overflow-hidden"
          >
            <p className="text-white/50 text-xs mb-2">
              {lang === 'en'
                ? `Register for: "${eventTitle}"`
                : `Diiwangeli: "${eventTitle}"`}
            </p>
            <input
              required
              placeholder={lang === 'en' ? 'Your full name *' : 'Magacaaga buuxa *'}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:border-gold/50"
            />
            <input
              required
              placeholder={lang === 'en' ? 'Phone number *' : 'Lambarka telefoonka *'}
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:border-gold/50"
            />
            <input
              placeholder={lang === 'en' ? 'Email (optional)' : 'Iimeelka (ikhtiyaari)'}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:border-gold/50"
            />
            <HumanCheck state={humanCheck} lang={lang} />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 bg-gold text-navy text-xs font-black rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? '...' : (lang === 'en' ? 'Confirm Registration' : 'Xaqiiji')}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 bg-white/8 text-white/50 text-xs rounded-lg hover:bg-white/12 transition-colors"
              >
                {lang === 'en' ? 'Cancel' : 'Jooji'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
