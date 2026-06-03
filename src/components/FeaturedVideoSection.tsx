'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Star, ExternalLink } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

interface VideoItem {
  id: string;
  titleEn: string;
  titleSo: string;
  descEn?: string;
  descSo?: string;
  videoId: string;
  videoUrl?: string;
  featured?: boolean;
  date?: string;
}

export default function FeaturedVideoSection() {
  const { lang } = useLang();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/videos/featured')
      .then(r => r.json())
      .then((data: VideoItem | null) => {
        setVideo(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || !video) return null;

  const isLocal = !!video.videoUrl;
  const isYoutube = !isLocal && video.videoId && !video.videoId.startsWith('placeholder');

  if (!isLocal && !isYoutube) return null;

  return (
    <section className="bg-navy py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Star size={13} className="text-gold fill-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Featured Video' : 'Muuqaalka Xiddigta'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {lang === 'en' ? video.titleEn : video.titleSo}
          </h2>
          {(video.descEn || video.descSo) && (
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              {lang === 'en' ? (video.descEn ?? '') : (video.descSo ?? '')}
            </p>
          )}
        </motion.div>

        {/* Video Player */}
        <motion.div
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {isLocal ? (
            <video
              src={video.videoUrl}
              controls
              className="w-full aspect-video object-cover bg-black"
              preload="metadata"
            />
          ) : (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.titleEn}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </motion.div>

        {/* Watch More link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="/media"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 hover:border-gold/30 transition-all text-sm group"
          >
            <PlayCircle size={16} className="text-gold" />
            {lang === 'en' ? 'Watch All Videos' : 'Daawo Dhammaan Muuqaalada'}
            <ExternalLink size={12} className="text-white/40 group-hover:text-gold transition-colors" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
