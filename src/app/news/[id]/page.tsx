'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

interface Post {
  id: string;
  titleEn: string;
  titleSo: string;
  contentEn: string;
  contentSo: string;
  excerpt: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function NewsArticlePage() {
  const { lang } = useLang();
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news/${id}`)
      .then(async r => {
        const text = await r.text();
        try { return JSON.parse(text); } catch { return null; }
      })
      .then(data => {
        if (data?.post) { setPost(data.post); }
        else { setNotFound(true); }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const title   = post ? (lang === 'en' ? post.titleEn   : post.titleSo)   : '';
  const content = post ? (lang === 'en' ? post.contentEn : post.contentSo) : '';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070e24' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: '#070e24' }}>
      <div className="text-6xl mb-4">📰</div>
      <h1 className="text-3xl font-black text-white mb-3">{lang === 'en' ? 'Article not found' : 'Maqaalka lama helin'}</h1>
      <p className="text-white/50 mb-8">{lang === 'en' ? 'This article may have been removed.' : 'Maqaalkan laga yaabaa in la qaaday.'}</p>
      <Link href="/news" className="flex items-center gap-2 px-6 py-3 bg-gold text-navy font-black rounded-full hover:bg-gold/90 transition-all">
        <ArrowLeft size={16} /> {lang === 'en' ? 'Back to News' : 'Ku Noqo Wararka'}
      </Link>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden" style={{ background: 'linear-gradient(180deg, #040b1c 0%, #070e24 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)', backgroundSize: '38px 38px' }} />

        {post?.imageUrl && (
          <div className="absolute inset-0 z-0">
            <img src={post.imageUrl} alt="" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040b1c]/80 via-[#040b1c]/90 to-[#040b1c]" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/news" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-sm font-semibold mb-8 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {lang === 'en' ? 'All News' : 'Dhammaan Wararka'}
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/25 bg-gold/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-bold tracking-widest uppercase">XTS</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
            {title}
          </motion.h1>

          {post?.excerpt && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-white/60 text-lg leading-relaxed mb-6 italic border-l-2 border-gold/40 pl-4">
              {post.excerpt}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-5 text-white/40 text-sm">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-gold/60" />
              {new Date(post!.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-gold/60" />
              {lang === 'en' ? `${Math.ceil(content.split(' ').length / 200)} min read` : `${Math.ceil(content.split(' ').length / 200)} daqiiqo`}
            </span>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              className="flex items-center gap-2 hover:text-gold transition-colors ml-auto">
              <Share2 size={14} /> {lang === 'en' ? 'Share' : 'Wadaag'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-12" style={{ background: '#070e24' }}>
        <div className="max-w-3xl mx-auto px-4">
          {post?.imageUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden mb-10 border border-white/10">
              <img src={post.imageUrl} alt={title} className="w-full h-72 object-cover" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none">
            {content.split('\n\n').map((para, i) => (
              <p key={i} className="text-white/75 text-lg leading-[1.85] mb-6 first:text-xl first:text-white/85 first:font-medium">
                {para}
              </p>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 text-center">
            <h3 className="text-2xl font-black text-white mb-3">
              {lang === 'en' ? 'Be Part of the Change' : 'Ka Noqo Qayb Isbedelka'}
            </h3>
            <p className="text-white/55 mb-6">
              {lang === 'en' ? 'XTS is building a better Somalia. Join us today.' : 'XTS waxay dhisaysaa Soomaali ka wanaagsan. Maanta noogu soo biir.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/join" className="px-7 py-3 bg-gold text-navy font-black rounded-full hover:bg-gold/90 transition-all shadow-lg shadow-gold/20">
                {lang === 'en' ? 'Join the Movement' : 'Ku Biir Dhaqdhaqaaqa'}
              </Link>
              <Link href="/news" className="px-7 py-3 border border-white/20 text-white/70 font-semibold rounded-full hover:border-white/40 transition-all">
                {lang === 'en' ? 'More News' : 'Wararka Kale'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
