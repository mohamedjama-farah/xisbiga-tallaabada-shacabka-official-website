'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Share2, MessageCircle, PlayCircle } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-[#070e24] border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <svg viewBox="0 0 100 100" className="w-14 h-14">
                <circle cx="50" cy="50" r="48" fill="#1a2454" stroke="#c9a227" strokeWidth="3" />
                <path d="M28 50 A22 22 0 1 0 28 50.5 A14 14 0 1 1 28 50Z" fill="#c9a227" />
                <polygon points="52,16 42,54 50,54 38,84 62,46 54,46" fill="#dc2626" />
                <text x="56" y="70" fontSize="13" fontWeight="900" fill="white" fontFamily="Georgia,serif">XTS</text>
              </svg>
              <div>
                <div className="text-gold font-bold text-base leading-tight">Xisbiga Tallaabada</div>
                <div className="text-gold font-bold text-base leading-tight">Shacabka</div>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed max-w-sm mb-6">
              {lang === 'en'
                ? 'A new political movement dedicated to justice, unity, and progress for all Somali people.'
                : 'Dhaqdhaqaaq siyaasadeed cusub oo u heellan cadaalad, midnimo, iyo horumar oo loogu talagalay dhammaan shacabka Soomaaliyeed.'}
            </p>
            <div className="flex gap-4">
              {[Share2, MessageCircle, PlayCircle].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">
              {lang === 'en' ? 'Quick Links' : 'Xiriiriyaasha Degdega ah'}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/about', en: 'About XTS', so: 'Xisbiga XTS' },
                { href: '/policy', en: 'Policy Platform', so: 'Qorshaha Siyaasadeed' },
                { href: '/rights', en: 'Constitutional Rights', so: 'Xuquuqda Dastuuriga' },
                { href: '/system', en: 'How Somalia Works', so: 'Nidaamka Soomaaliya' },
                { href: '/events', en: 'Events', so: 'Dhacdooyinka' },
                { href: '/gallery', en: 'Gallery', so: 'Gallariya' },
                { href: '/news', en: 'News', so: 'Wararka' },
                { href: '/faq', en: 'FAQ', so: "Su'aalaha" },
                { href: '/candidates',    en: 'Our Candidates',      so: 'Musharaxiideena' },
                { href: '/petition',      en: 'Petitions',           so: 'Codsiyo' },
                { href: '/unity',         en: 'Clan-Neutral Unity',  so: 'Midnimada Qabiilka' },
                { href: '/states',        en: 'Federal States',      so: 'Gobolada Federaalka' },
                { href: '/niec',          en: 'Voter Registration',  so: 'Diiwaangelinta' },
                { href: '/media',         en: 'Videos & Media',      so: 'Fiidiyowyada' },
                { href: '/complaint',     en: 'Report an Issue',     so: 'Soo Gudbi Arrin' },
                { href: '/poll',          en: 'Member Polls',        so: "Ra'yiyadda" },
                { href: '/membership-card', en: 'Membership Card',  so: 'Kaarka Xubnimada' },
                { href: '/materials',     en: 'Party Materials',     so: 'Agabka Xisbiga' },
                { href: '/branches',      en: 'Branch Offices',      so: 'Xafiisyada' },
                { href: '/volunteer',     en: 'Volunteer',           so: 'Volunteer' },
                { href: '/diaspora',      en: 'Diaspora',            so: 'Masakinta' },
                { href: '/vote',          en: 'How to Vote',         so: 'Sida Loo Codeyn' },
                { href: '/join',          en: 'Join Us',             so: 'Noogu Soo Biir' },
                { href: '/donate',        en: 'Donate',              so: 'Xiwaal' },
                { href: '/contact',       en: 'Contact',             so: 'Xiriir' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-gold transition-colors text-sm">
                    {lang === 'en' ? link.en : link.so}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">
              {lang === 'en' ? 'Contact' : 'Xiriir'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                info@xts-party.so
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                +252 61 XXX XXXX
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                Mogadishu, Somalia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} {t('footer.party', lang)}. {t('footer.rights', lang)}
          </p>
          <p className="text-white/20 text-xs">
            {lang === 'en' ? 'Built with integrity and transparency.' : 'Daacadnimo iyo caddaansho lagu dhisay.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
