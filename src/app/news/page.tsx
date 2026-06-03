'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';

interface Post {
  id: string;
  titleEn: string;
  titleSo: string;
  excerpt: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function NewsPage() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?limit=20')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-[#0a1128] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-widest text-sm uppercase font-semibold mb-3">XTS</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white">{t('news.title', lang)}</h1>
          <div className="mt-6 w-24 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-white/40 text-xl"
          >
            {t('news.noNews', lang)}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden bg-white/5 border border-gold/10 hover:border-gold/30 transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-navy to-[#0f1a3e] flex items-center justify-center relative">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-20">
                      <polygon points="52,16 42,54 50,54 38,84 62,46 54,46" fill="#c9a227" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gold/60 text-xs mb-3">
                    <Calendar size={12} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-white font-bold text-lg mb-3 group-hover:text-gold transition-colors leading-snug">
                    {lang === 'en' ? post.titleEn : post.titleSo}
                  </h2>
                  {post.excerpt && (
                    <p className="text-white/50 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/news/${post.id}`}
                    className="flex items-center gap-1 text-gold text-sm font-semibold hover:gap-2 transition-all"
                  >
                    {t('news.readMore', lang)} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
