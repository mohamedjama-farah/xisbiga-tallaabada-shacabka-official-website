'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

export default function NewsletterSection() {
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gold relative overflow-hidden">
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 w-1/4 bg-white/15 skew-x-12"
      />
      <motion.div
        animate={{ x: ['200%', '-100%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 8 }}
        className="absolute inset-y-0 w-1/6 bg-white/10 skew-x-12"
      />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Mail size={40} className="text-navy/60 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-black text-navy mb-3">
            {lang === 'en' ? 'Stay Informed' : 'Wargelinta Raac'}
          </h2>
          <p className="text-navy/70 mb-8 text-lg">
            {lang === 'en'
              ? 'Get the latest XTS news, events, and updates delivered to your inbox.'
              : 'Hel wararka ugu dambeeyay ee XTS, dhacdooyinka, iyo cusbooneysiinta loo soo diray inboxkaaga.'}
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 text-navy font-bold text-lg"
            >
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                <Check size={20} className="text-gold" />
              </div>
              {lang === 'en' ? 'Thank you! You are subscribed.' : 'Mahadsanid! Waad diiwaan-gashatay.'}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={lang === 'en' ? 'Your email address' : 'Cinwaankaaga emailka'}
                className="flex-1 px-5 py-4 rounded-full bg-white/20 placeholder-navy/50 text-navy font-medium border border-navy/20 focus:outline-none focus:border-navy/50 transition-colors"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-4 bg-navy text-gold font-black rounded-full flex items-center gap-2 hover:bg-navy/90 transition-colors disabled:opacity-60"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  : <><span>{lang === 'en' ? 'Subscribe' : 'Diiwaan-gali'}</span><ArrowRight size={16} /></>
                }
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
