'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, FileText, Calendar, Newspaper, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

interface Result {
  type: string;
  titleEn: string;
  titleSo: string;
  desc: string | null;
  href: string;
  date: string | null;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  news: Newspaper,
  event: Calendar,
  document: FileText,
  page: Globe,
};

const TYPE_LABELS: Record<string, { en: string; so: string }> = {
  news: { en: 'News', so: 'War' },
  event: { en: 'Event', so: 'Dhacdada' },
  document: { en: 'Document', so: 'Dukumeenti' },
  page: { en: 'Page', so: 'Bog' },
};

const TYPE_COLORS: Record<string, string> = {
  news: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  event: 'text-green-400 bg-green-400/10 border-green-400/20',
  document: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  page: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

export default function SearchPage() {
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < 2) { setResults([]); setSearched(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setSearched(true);
      } catch { setResults([]); }
      setLoading(false);
    }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">
            {lang === 'en' ? 'Search XTS' : 'Raadi XTS'}
          </h1>
          <p className="text-white/40 text-sm">
            {lang === 'en' ? 'Find news, events, documents, and pages.' : 'Hel wararka, dhacdooyinka, dukumeentiyada, iyo bogaga.'}
          </p>
        </div>

        {/* Search Box */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search anything…' : 'Raadi wax kasta…'}
            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/15 rounded-2xl text-white text-base focus:outline-none focus:border-gold/50 placeholder-white/25"
          />
          {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold animate-spin" />}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-white/30 text-xs mb-4">
              {lang === 'en' ? `${results.length} results for "${query}"` : `${results.length} natiijo "${query}" ahaaneed`}
            </p>
            {results.map((r, i) => {
              const Icon = TYPE_ICONS[r.type] ?? Globe;
              const colorClass = TYPE_COLORS[r.type] ?? 'text-white/40 bg-white/5 border-white/10';
              const label = TYPE_LABELS[r.type] ?? { en: r.type, so: r.type };
              return (
                <Link key={i} href={r.href} className="flex items-start gap-4 p-4 bg-white/3 border border-white/8 rounded-xl hover:border-gold/30 hover:bg-white/5 transition-all group">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase border px-1.5 py-0.5 rounded ${colorClass}`}>
                        {label[lang]}
                      </span>
                      {r.date && (
                        <span className="text-white/25 text-[10px]">
                          {new Date(r.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'so-SO')}
                        </span>
                      )}
                    </div>
                    <p className="text-white font-semibold text-sm group-hover:text-gold transition-colors truncate">
                      {lang === 'en' ? r.titleEn : r.titleSo}
                    </p>
                    {r.desc && <p className="text-white/35 text-xs mt-0.5 truncate">{r.desc}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : searched && !loading ? (
          <div className="text-center py-16">
            <Search size={40} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/40">{lang === 'en' ? `No results for "${query}"` : `Ma jiraan natiijo "${query}" ahaaneed`}</p>
            <p className="text-white/25 text-sm mt-1">{lang === 'en' ? 'Try different keywords.' : 'Isku day ereyyo kala duwan.'}</p>
          </div>
        ) : !searched ? (
          <div className="text-center py-10 text-white/20">
            <p className="text-sm">{lang === 'en' ? 'Start typing to search…' : 'Bilow qorida si aad u raadiso…'}</p>
          </div>
        ) : null}

        {/* Quick Links */}
        {!searched && (
          <div className="mt-6">
            <p className="text-white/30 text-xs uppercase tracking-wide mb-3">{lang === 'en' ? 'Popular Pages' : 'Bogaga Caanka ah'}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { en: 'Policy', so: 'Siyaasad', href: '/policy' },
                { en: 'Join Us', so: 'Biir', href: '/join' },
                { en: 'Events', so: 'Dhacdooyin', href: '/events' },
                { en: 'News', so: 'Wararka', href: '/news' },
                { en: 'Gallery', so: 'Sawirrada', href: '/gallery' },
                { en: 'Contact', so: 'Xiriir', href: '/contact' },
                { en: 'FAQ', so: "Su'aal", href: '/faq' },
              ].map(p => (
                <Link key={p.href} href={p.href}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/50 text-xs hover:text-gold hover:border-gold/30 transition-all">
                  {lang === 'en' ? p.en : p.so}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
