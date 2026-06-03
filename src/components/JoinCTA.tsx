'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

export default function JoinCTA() {
  const { lang } = useLang();

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0f1a3e] to-navy">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-32 -top-32 w-96 h-96 rounded-full border-2 border-gold/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full border border-gold/5"
      />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            {lang === 'en' ? (
              <>Ready to Make a <span className="text-gold">Difference?</span></>
            ) : (
              <>U Diyaar Garoow inaad <span className="text-gold">Farqi Sameyso?</span></>
            )}
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10">
            {lang === 'en'
              ? 'Join thousands of Somalis who are working together to build a brighter future. Your voice matters.'
              : 'Ku biir kumaan Soomaali ah oo wada shaqaynaya si ay mustaqbal iftiimoon u dhisaan. Codkaagu muhiim ayuu yahay.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="px-10 py-4 bg-gold text-navy font-black text-lg rounded-full hover:bg-gold/90 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/40 hover:-translate-y-1"
            >
              {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'}
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border-2 border-gold/50 text-gold font-bold text-lg rounded-full hover:border-gold hover:bg-gold/10 transition-all duration-300 hover:-translate-y-1"
            >
              {lang === 'en' ? 'Get in Touch' : 'Nala Xiriir'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
