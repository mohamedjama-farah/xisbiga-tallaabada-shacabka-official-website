'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLang } from '@/hooks/useLang';
import { FileText, Download, Mail, ExternalLink, Newspaper, Image as ImageIcon } from 'lucide-react';

const PARTY_FACTS = [
  { en: { label: 'Party Name', value: 'Xisbiga Tallaabada Shacabka (XTS)' }, so: { label: 'Magaca Xisbiga', value: 'Xisbiga Tallaabada Shacabka (XTS)' } },
  { en: { label: 'English Name', value: "The People's Progress Party" }, so: { label: 'Magaca Ingiriisiga', value: "The People's Progress Party" } },
  { en: { label: 'Founded', value: '2025' }, so: { label: 'La Aasaasay', value: '2025' } },
  { en: { label: 'Headquarters', value: 'Mogadishu, Somalia' }, so: { label: 'Xarunta Guud', value: 'Muqdisho, Soomaaliya' } },
  { en: { label: 'Position', value: 'Progressive Centre — Democratic Reform' }, so: { label: 'Xaalad Siyaasadeed', value: 'Bartamaha Horumarista — Dib u Habaynta Dimuqraadiga' } },
  { en: { label: 'Key Issue', value: 'End the 4.5 clan system — one person, one vote' }, so: { label: 'Arrinta Muhiimka ah', value: 'Dhammaadka nidaamka 4.5 — hal qof, hal cod' } },
];

const MEDIA_ASSETS = [
  { icon: ImageIcon, en: { name: 'XTS Logo (PNG, transparent)', desc: 'High resolution logo for print and digital use' }, so: { name: 'Logo XTS (PNG, shaffaf)', desc: 'Logo qiimo sare leh ee daabacadda iyo isticmaalka dhijitaalka' }, href: '/logo.png' },
  { icon: FileText, en: { name: 'Party Fact Sheet (PDF)', desc: 'One-page overview of XTS — key facts, positions, and contacts' }, so: { name: 'Warqadda Xaqiiqooyinka Xisbiga (PDF)', desc: 'Guud ahaan hal bog ee XTS — xaqiiqooyinka muhiimka, xaaladdaha, iyo xiriirka' }, href: '#' },
  { icon: FileText, en: { name: 'Party Constitution (PDF)', desc: 'Full founding document and party rules' }, so: { name: 'Dastuurka Xisbiga (PDF)', desc: 'Dukumiintiga aasaasiga ee buuxa iyo xeerarka xisbiga' }, href: '/party/constitution' },
];

export default function PressPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });
  const [news, setNews] = useState<{ id: string; titleEn: string; titleSo: string; excerpt: string; createdAt: string }[]>([]);

  useEffect(() => {
    fetch('/api/news?limit=5').then(r => r.json()).then(d => setNews(d.posts ?? [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Newspaper size={13} />
            {lang === 'en' ? 'Press Room' : 'Qolka Saxaafadda'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'XTS Press Room' : 'Qolka Saxaafadda ee XTS'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Resources, statements, and contacts for journalists and media covering XTS and Somali politics.'
              : 'Agabka, bayaanadda, iyo xiriirka saxafiyiinta iyo warbaahinta daboolaysa XTS iyo siyaasadda Soomaaliya.'}
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Party Quick Facts */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">{lang === 'en' ? 'Party Quick Facts' : 'Xaqiiqooyinka Degdegga ah ee Xisbiga'}</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {PARTY_FACTS.map((fact, i) => {
                const content = fact[lang];
                return (
                  <div key={i} className={`flex gap-4 px-5 py-3.5 ${i < PARTY_FACTS.length - 1 ? 'border-b border-white/8' : ''}`}>
                    <span className="text-white/40 text-sm w-36 flex-shrink-0">{content.label}</span>
                    <span className="text-white text-sm font-semibold">{content.value}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Statements */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">{lang === 'en' ? 'Recent Statements & News' : 'Bayaanadda & Wararka Dhowaan'}</h2>
            {news.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-white/40 text-sm text-center">
                {lang === 'en' ? 'No statements published yet.' : 'Wali bayaan la ma daabicin.'}
              </div>
            ) : (
              <div className="space-y-3">
                {news.map((post, i) => (
                  <motion.a
                    key={post.id}
                    href={`/news`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-gold transition-colors">
                        {lang === 'en' ? post.titleEn : post.titleSo}
                      </p>
                      <p className="text-white/40 text-xs mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ExternalLink size={14} className="text-white/20 group-hover:text-gold transition-colors flex-shrink-0 mt-1" />
                  </motion.a>
                ))}
              </div>
            )}
          </section>

          {/* Media Assets */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">{lang === 'en' ? 'Media Assets' : 'Agabka Warbaahinta'}</h2>
            <div className="space-y-3">
              {MEDIA_ASSETS.map((asset, i) => {
                const Icon = asset.icon;
                const content = asset[lang];
                return (
                  <a key={i} href={asset.href} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition-colors group">
                    <div className="p-2.5 rounded-lg bg-gold/10 border border-gold/20">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{content.name}</p>
                      <p className="text-white/40 text-xs">{content.desc}</p>
                    </div>
                    <Download size={14} className="text-white/20 group-hover:text-gold transition-colors" />
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column — Contact */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-1">{lang === 'en' ? 'Media Contact' : 'Xiriirka Warbaahinta'}</h3>
            <p className="text-white/50 text-xs mb-4">{lang === 'en' ? 'For interviews, press releases, and media enquiries.' : 'Wareysiyada, bayaanadda saxaafadda, iyo su\'aalaha warbaahinta.'}</p>
            <a href="mailto:press@xts.so" className="flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors">
              <Mail size={15} /> press@xts.so
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3 text-sm">{lang === 'en' ? 'XTS Party Statement' : 'Bayaanka Xisbiga XTS'}</h3>
            <p className="text-white/60 text-xs leading-relaxed italic">
              {lang === 'en'
                ? '"XTS is committed to full transparency with the media and public. We welcome scrutiny because we have nothing to hide — our finances, our policies, and our membership are open to examination."'
                : '"XTS waxay u heellan tahay shafafnaan buuxda oo warbaahinta iyo dadweynaha. Xoogagga baarista ayaan soo dhaweynaa sababtoo ah waxba ma qarino — maaraynteenna, qorshahayaga, iyo xubnaha xisbigayagu furan ayay u yihiin baarista."'}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3 text-sm">{lang === 'en' ? 'Official Social Media' : 'Baraha Bulshada Rasmiga ah'}</h3>
            <div className="space-y-2 text-sm text-white/60">
              <p>Facebook: <span className="text-gold">@XTSSomalia</span></p>
              <p>Twitter/X: <span className="text-gold">@XTS_Somalia</span></p>
              <p>YouTube: <span className="text-gold">XTS Somalia</span></p>
              <p>TikTok: <span className="text-gold">@xtssomalia</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
