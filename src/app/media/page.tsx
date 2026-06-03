'use client';
import { motion } from 'framer-motion';
import { Play, PlayCircle, ExternalLink, Radio, Mic2 } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

// ── Replace these with your real YouTube video IDs ──────────────────────────
// To get a video ID: https://www.youtube.com/watch?v=VIDEO_ID_HERE
const VIDEOS = [
  {
    id: 'placeholder1', // Replace with real YouTube video ID
    titleEn: 'XTS Party Launch — Founding Speech',
    titleSo: 'Xafladda Aasaaska XTS — Khudbadda Aasaasaha',
    descEn: 'Watch the official launch of Xisbiga Tallaabada Shacabka.',
    descSo: 'Daawo bilowga rasmiga ah ee Xisbiga Tallaabada Shacabka.',
    date: '2024',
  },
  {
    id: 'placeholder2',
    titleEn: 'XTS Policy Explained — Education & Youth',
    titleSo: 'Siyaasadda XTS — Waxbarashada & Dhalinyarada',
    descEn: 'A detailed look at XTS education and youth policy.',
    descSo: 'Eegis faahfaahsan oo ku saabsan siyaasadda waxbarashada iyo dhalinyarada XTS.',
    date: '2024',
  },
  {
    id: 'placeholder3',
    titleEn: 'Town Hall — Questions from the People',
    titleSo: 'Shir Bulshada — Su\'aalaha Shacabka',
    descEn: 'XTS leadership answers questions from citizens across Somalia.',
    descSo: 'Hoggaanka XTS waxay ka jawaabayaan su\'aalaha muwaadiniinta Soomaaliya oo dhan.',
    date: '2024',
  },
];

// ── Radio stations that cover Somalia ───────────────────────────────────────
const RADIO = [
  { name: 'Radio Mogadishu',  freq: '97.9 FM', city: 'Mogadishu',  url: 'http://radiomogadishu.com' },
  { name: 'Radio Daljir',     freq: '88.7 FM', city: 'Mogadishu',  url: 'http://radiodaljir.com' },
  { name: 'Radio Kulmiye',    freq: '93.5 FM', city: 'Hargeisa',   url: '#' },
  { name: 'Radio Garowe',     freq: '101.5 FM',city: 'Garowe',     url: '#' },
  { name: 'Universal TV',     freq: 'Online',  city: 'Global',     url: 'https://universaltv.net' },
  { name: 'SNTV',             freq: 'Online',  city: 'Mogadishu',  url: '#' },
];

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@XTSParty'; // Replace with real channel

function VideoCard({ video, lang }: { video: typeof VIDEOS[0]; lang: 'en' | 'so' }) {
  const isPlaceholder = video.id.startsWith('placeholder');
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-gold/20 transition-all group">
      {isPlaceholder ? (
        <div className="aspect-video bg-white/5 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center">
            <Play size={24} className="text-red-400 translate-x-0.5" />
          </div>
          <span className="text-white/30 text-xs">{lang === 'en' ? 'Video coming soon' : 'Muuqaalka dhawaan'}</span>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.titleEn}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm mb-1">
          {lang === 'en' ? video.titleEn : video.titleSo}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed">
          {lang === 'en' ? video.descEn : video.descSo}
        </p>
        <span className="text-white/20 text-xs mt-2 block">{video.date}</span>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
            <PlayCircle size={14} className="text-red-400" />
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'XTS Media' : 'Warbaahinta XTS'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Watch & Listen' : 'Daawo & Dhagayso'}
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto mb-6">
            {lang === 'en'
              ? 'Speeches, town halls, policy discussions, and party events — all in one place.'
              : 'Khudbadaha, shirarka bulshada, wadahadallada siyaasadeed, iyo dhacdooyinka xisbiga — dhammaan meel.'}
          </p>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors text-sm">
            <PlayCircle size={16} />
            {lang === 'en' ? 'Subscribe on YouTube' : 'Ku Biir YouTube'}
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Videos */}
        <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-4">
          {lang === 'en' ? 'Latest Videos' : 'Muuqaalada Ugu Dambeeyay'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {VIDEOS.map(v => <VideoCard key={v.id} video={v} lang={lang} />)}
        </div>

        {/* Radio */}
        <h2 className="text-gold text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <Radio size={14} className="text-gold" />
          {lang === 'en' ? 'Find XTS on Radio & TV' : 'Hel XTS Raadiyaha & TV'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {RADIO.map((r, i) => (
            <motion.a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 bg-white/3 border border-white/8 rounded-xl hover:border-gold/20 hover:bg-white/5 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Mic2 size={15} className="text-gold" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-bold truncate group-hover:text-gold transition-colors">{r.name}</div>
                <div className="text-white/30 text-xs">{r.freq} · {r.city}</div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Note for admin */}
        <div className="bg-gold/5 border border-gold/15 rounded-xl px-5 py-3 text-center">
          <p className="text-white/40 text-xs">
            {lang === 'en'
              ? '📹 To add real videos: replace the YouTube video IDs in src/app/media/page.tsx with your actual YouTube video IDs.'
              : '📹 Si aad muuqaal dhabta ah u ku dartid: bedel aqoonsiga fiidiyawyada YouTube ee src/app/media/page.tsx aqoonsiga dhabta ah ee YouTube.'}
          </p>
        </div>
      </div>
    </main>
  );
}
