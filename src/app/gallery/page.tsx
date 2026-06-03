'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLang } from '@/hooks/useLang';
import { Image as ImageIcon, X, Calendar, MapPin } from 'lucide-react';

interface MediaItem {
  id: string;
  titleEn: string;
  titleSo: string;
  caption: string | null;
  imageUrl: string;
  eventName: string | null;
  eventDate: string | null;
  createdAt: string;
}

export default function GalleryPage() {
  const { lang } = useLang();
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(d => { setItems(d.items ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12" ref={heroRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <ImageIcon size={13} />
            {lang === 'en' ? 'Media Gallery' : 'Gallariya Warbaahinta'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {lang === 'en' ? 'XTS in Action' : 'XTS Hawlgalka Gudaheeda'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Photos and media from XTS events, rallies, and community engagements across Somalia and the diaspora.'
              : 'Sawirrada iyo warbaahinta dhacdooyinka XTS, xafladaha, iyo kulmida bulshada Soomaaliya oo dhan iyo masakinta.'}
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <ImageIcon size={52} className="text-white/15 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-semibold">
              {lang === 'en' ? 'No photos yet.' : 'Wali sawiro ma jiraan.'}
            </p>
            <p className="text-white/20 text-sm mt-2">
              {lang === 'en' ? 'Check back after our first events.' : 'Dib u soo eeg dhacdooyinkeenna ugu horeeyay ka dib.'}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.06 }}
                onClick={() => setSelected(item)}
                className="break-inside-avoid cursor-pointer group rounded-2xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={lang === 'en' ? item.titleEn : item.titleSo}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="bg-white/5 p-3">
                  <p className="text-white text-xs font-semibold line-clamp-1">{lang === 'en' ? item.titleEn : item.titleSo}</p>
                  {item.eventName && <p className="text-white/40 text-[10px] mt-0.5">{item.eventName}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl w-full bg-[#0a1128] border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.imageUrl} alt={lang === 'en' ? selected.titleEn : selected.titleSo} className="w-full max-h-[60vh] object-contain bg-black" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{lang === 'en' ? selected.titleEn : selected.titleSo}</h3>
                  {selected.caption && <p className="text-white/50 text-sm mt-1">{selected.caption}</p>}
                  <div className="flex flex-wrap gap-3 mt-2 text-white/30 text-xs">
                    {selected.eventName && <span className="flex items-center gap-1"><MapPin size={10} /> {selected.eventName}</span>}
                    {selected.eventDate && <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(selected.eventDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
