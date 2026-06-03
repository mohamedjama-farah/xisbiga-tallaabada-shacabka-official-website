'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';
import { User, Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import HumanCheck, { useHumanCheck } from '@/components/HumanCheck';

export default function JoinPage() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);
  const humanCheck = useHumanCheck();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', city: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanCheck.verify()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('join.success', lang));
        setForm({ firstName: '', lastName: '', email: '', phone: '', city: '', message: '' });
      } else {
        toast.error(data.error ?? 'Error submitting form');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', key: 'join.firstName', icon: User, type: 'text', required: true },
    { name: 'lastName', key: 'join.lastName', icon: User, type: 'text', required: true },
    { name: 'email', key: 'join.email', icon: Mail, type: 'email', required: true },
    { name: 'phone', key: 'join.phone', icon: Phone, type: 'tel', required: false },
    { name: 'city', key: 'join.city', icon: MapPin, type: 'text', required: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-[#0a1128] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-gold tracking-widest text-sm uppercase font-semibold mb-3">XTS</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{t('join.title', lang)}</h1>
          <p className="text-white/60 text-lg">{t('join.subtitle', lang)}</p>
          <div className="mt-6 w-24 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          onSubmit={handleSubmit}
          className="bg-white/5 border border-gold/20 rounded-3xl p-8 sm:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map(({ name, key, icon: Icon, type, required }) => (
              <div key={name} className={name === 'email' ? 'sm:col-span-2' : ''}>
                <label className="block text-gold/80 text-sm font-semibold mb-2">
                  {t(key, lang)} {required && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input
                    type={type}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    required={required}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors duration-200"
                    placeholder={t(key, lang)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gold/80 text-sm font-semibold mb-2">
              {t('join.message', lang)}
            </label>
            <div className="relative">
              <MessageSquare size={18} className="absolute left-4 top-4 text-gold/40" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors duration-200 resize-none"
                placeholder={t('join.message', lang)}
              />
            </div>
          </div>

          <HumanCheck state={humanCheck} lang={lang} />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gold text-navy font-black text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-gold/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
            ) : (
              <>
                <Send size={20} />
                {t('join.submit', lang)}
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
