'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Send } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

export default function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setDone(true);
      else { const d = await res.json(); setError(d.error ?? 'Error'); }
    } catch { setError('Network error.'); }
    setSubmitting(false);
  };

  if (done) return (
    <div className={`flex items-center gap-2 text-green-400 font-bold text-sm ${compact ? '' : 'justify-center'}`}>
      <CheckCircle2 size={16} />
      {lang === 'en' ? 'Subscribed! You\'ll hear from us soon.' : 'Waa la diiwaangeliyey! Waxaad maqli doontaa dhawaan.'}
    </div>
  );

  if (compact) return (
    <form onSubmit={submit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder={lang === 'en' ? 'Your email address' : 'Iimeelkaaga'}
          className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50" />
      </div>
      <button type="submit" disabled={submitting}
        className="px-4 py-2.5 bg-gold text-navy font-black text-sm rounded-xl hover:bg-gold/90 disabled:opacity-50 transition-colors flex items-center gap-1.5">
        <Send size={13} />
        {lang === 'en' ? 'Subscribe' : 'Diiwangeli'}
      </button>
      {error && <p className="text-red-400 text-xs absolute mt-10">{error}</p>}
    </form>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-gradient-to-r from-gold/10 to-navy border border-gold/20 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-4">
        <Mail size={22} className="text-gold" />
      </div>
      <h3 className="text-white font-black text-xl mb-2">
        {lang === 'en' ? 'Stay in the Loop' : 'La Joogso Wararka'}
      </h3>
      <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
        {lang === 'en'
          ? 'Get XTS news, event announcements, and campaign updates — straight to your inbox. No spam, ever.'
          : 'Hel wararka XTS, xayeysiisyada dhacdooyinka, iyo wararka olalaha — si toos ah iimaylkaaga. Wax spam ah ma jiraan, abid.'}
      </p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder={lang === 'en' ? 'your@email.com' : 'iimaylkaaga@email.com'}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors" />
        </div>
        <button type="submit" disabled={submitting}
          className="px-6 py-3 bg-gold text-navy font-black rounded-xl hover:bg-gold/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          <Send size={15} />
          {lang === 'en' ? 'Subscribe' : 'Diiwangeli'}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      <p className="text-white/20 text-xs mt-4">
        {lang === 'en' ? 'Free. Unsubscribe anytime.' : 'Bilaash. Ka bax xilligaad doonto.'}
      </p>
    </motion.div>
  );
}
