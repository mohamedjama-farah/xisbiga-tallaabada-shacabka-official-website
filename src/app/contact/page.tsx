'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';
import { User, Mail, MessageSquare, Tag, Send, MapPin, Phone } from 'lucide-react';
import HumanCheck, { useHumanCheck } from '@/components/HumanCheck';

export default function ContactPage() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);
  const humanCheck = useHumanCheck();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanCheck.verify()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(t('contact.success', lang));
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Error sending message');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-[#0a1128] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-widest text-sm uppercase font-semibold mb-3">XTS</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{t('contact.title', lang)}</h1>
          <div className="mt-6 w-24 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {lang === 'en' ? 'Get in Touch' : 'Na la Xiriir'}
              </h2>
              <p className="text-white/60 leading-relaxed">
                {lang === 'en'
                  ? 'We welcome your questions, suggestions, and support. Our team will respond within 48 hours.'
                  : 'Su\'aalahaaga, soo jeedinnahaaga, iyo taageerkeyga waan soo dhawaynayaa. Kooxdayadu 48 saacadood gudahood ayay ka jawaabi doontaa.'}
              </p>
            </div>
            {[
              { icon: Mail, label: 'info@xts-party.so' },
              { icon: Phone, label: '+252 61 XXX XXXX' },
              { icon: MapPin, label: 'Mogadishu, Somalia' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon size={22} className="text-gold" />
                </div>
                <span className="text-white/70">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-white/5 border border-gold/20 rounded-3xl p-8 space-y-6"
          >
            {[
              { name: 'name', key: 'contact.name', icon: User, type: 'text' },
              { name: 'email', key: 'contact.email', icon: Mail, type: 'email' },
              { name: 'subject', key: 'contact.subject', icon: Tag, type: 'text' },
            ].map(({ name, key, icon: Icon, type }) => (
              <div key={name}>
                <label className="block text-gold/80 text-sm font-semibold mb-2">{t(key, lang)}</label>
                <div className="relative">
                  <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input
                    type={type}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors"
                    placeholder={t(key, lang)}
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-gold/80 text-sm font-semibold mb-2">{t('contact.message', lang)}</label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-4 top-4 text-gold/40" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors resize-none"
                  placeholder={t('contact.message', lang)}
                />
              </div>
            </div>
            <HumanCheck state={humanCheck} lang={lang} />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gold text-navy font-black text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-gold/90 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
              ) : (
                <><Send size={20} />{t('contact.send', lang)}</>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
