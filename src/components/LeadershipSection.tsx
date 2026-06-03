'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/hooks/useLang';
import { Star } from 'lucide-react';

const leaders = [
  {
    initials: 'MA',
    en: { name: 'Mohamed Ahmed', role: 'Party Chairman' },
    so: { name: 'Maxamed Axmed', role: 'Guddoomiyaha Xisbiga' },
    bg: 'from-gold/20 to-gold/5',
  },
  {
    initials: 'FH',
    en: { name: 'Faadumo Hassan', role: 'Secretary General' },
    so: { name: 'Faadumo Xasan', role: 'Xoghayaha Guud' },
    bg: 'from-red-500/20 to-red-500/5',
  },
  {
    initials: 'AO',
    en: { name: 'Abdi Omar', role: 'Head of Policy' },
    so: { name: 'Cabdi Cumar', role: 'Madaxa Siyaasadda' },
    bg: 'from-blue-500/20 to-blue-500/5',
  },
  {
    initials: 'HM',
    en: { name: 'Hodan Muuse', role: 'Youth Wing Leader' },
    so: { name: 'Hodan Muuse', role: 'Hogaamiyaha Dhalinyarada' },
    bg: 'from-green-500/20 to-green-500/5',
  },
];

export default function LeadershipSection() {
  const { lang } = useLang();

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold tracking-widest text-sm uppercase font-bold mb-3">
            {lang === 'en' ? 'Leadership' : 'Hogaanka'}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            {lang === 'en' ? 'Meet Our Leaders' : 'La Xiriir Hogaankeenna'}
          </h2>
          <div className="mt-5 w-20 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, i) => {
            const content = lang === 'en' ? leader.en : leader.so;
            return (
              <motion.div
                key={leader.initials}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="text-center group"
              >
                <div className={`relative w-24 h-24 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${leader.bg} border border-white/10 flex items-center justify-center group-hover:border-gold/40 transition-colors duration-300`}>
                  <span className="text-2xl font-black text-white/80">{leader.initials}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star size={12} className="text-navy fill-navy" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-base">{content.name}</h3>
                <p className="text-gold/70 text-xs mt-1 font-medium">{content.role}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
