'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Star, Search, Flag } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  state: string | null;
  region: string | null;
  district: string | null;
  constituency: string | null;
  notes: string | null;
}

const LEVEL_LABELS: Record<string, { en: string; so: string; color: string }> = {
  FEDERAL_UPPER:  { en: 'Senate (Upper House)',    so: 'Golaha Sare (Senate)',      color: 'text-gold border-gold/30 bg-gold/10' },
  FEDERAL_LOWER:  { en: "People's Assembly",       so: 'Golaha Shacabka',           color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  STATE:          { en: 'State Parliament',        so: 'Golaha Gobolka',            color: 'text-green-400 border-green-400/30 bg-green-400/10' },
};

const STATES = [
  'Puntland','Jubaland','South West State','Hirshabelle','Galmudug','Banadir','All'
];

export default function CandidatesPage() {
  const { lang } = useLang();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterState, setFilterState] = useState('All');

  useEffect(() => {
    fetch('/api/candidates')
      .then(r => r.json())
      .then(d => { setCandidates(d.candidates ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = candidates.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    const q = search.toLowerCase();
    if (q && !name.includes(q) && !(c.region ?? '').toLowerCase().includes(q) && !(c.constituency ?? '').toLowerCase().includes(q)) return false;
    if (filterLevel !== 'ALL' && c.level !== filterLevel) return false;
    if (filterState !== 'All' && (c.state ?? '') !== filterState) return false;
    return true;
  });

  const grouped: Record<string, Candidate[]> = {};
  for (const c of filtered) {
    const key = c.level;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  }

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Star size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Our Candidates' : 'Musharaxiintayada'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'XTS Party Candidates' : 'Musharaxiinta Xisbiga XTS'}
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            {lang === 'en'
              ? 'Meet the XTS candidates standing for election across Somalia — federal and state level.'
              : 'Baro musharaxiinta XTS ee u taagan doorashada Soomaaliya — heerka federaalka iyo gobolka.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search by name, region…' : 'Ku raadi magac, gobol…'}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50"
            />
          </div>
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/50"
          >
            <option value="ALL">{lang === 'en' ? 'All Levels' : 'Dhammaan Heerarka'}</option>
            <option value="FEDERAL_UPPER">{lang === 'en' ? 'Senate' : 'Golaha Sare'}</option>
            <option value="FEDERAL_LOWER">{lang === 'en' ? "People's Assembly" : 'Golaha Shacabka'}</option>
            <option value="STATE">{lang === 'en' ? 'State Parliament' : 'Golaha Gobolka'}</option>
          </select>
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/50"
          >
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-white/50 mb-2">
              {lang === 'en' ? 'Candidates Coming Soon' : 'Musharaxiinta Dhawaan'}
            </p>
            <p className="text-sm">
              {lang === 'en'
                ? 'XTS is in the process of finalising its candidate list. Check back soon.'
                : 'XTS waxay ku jirtaa hannaanka dhammaystirka liiska musharaxiinta. Dib u eeg dhawaan.'}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            {lang === 'en' ? 'No candidates match your search.' : 'Musharax ka mid ah raadintaadu ma jiraan.'}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([level, group]) => {
              const info = LEVEL_LABELS[level] ?? { en: level, so: level, color: 'text-white/50 border-white/10 bg-white/5' };
              return (
                <div key={level}>
                  <div className="flex items-center gap-3 mb-4">
                    <Flag size={16} className="text-gold" />
                    <h2 className="text-gold text-sm font-black uppercase tracking-widest">
                      {lang === 'en' ? info.en : info.so}
                      <span className="ml-2 text-white/30 font-normal normal-case text-xs tracking-normal">({group.length})</span>
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-gold/30 transition-all"
                      >
                        {/* Avatar initials */}
                        <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-3">
                          <span className="text-gold font-black text-sm">
                            {c.firstName[0]}{c.lastName[0]}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-sm mb-1">
                          {c.firstName} {c.lastName}
                        </h3>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${info.color}`}>
                          {lang === 'en' ? info.en : info.so}
                        </span>
                        {(c.state || c.region || c.constituency) && (
                          <div className="flex items-start gap-1.5 text-white/40 text-xs mt-1">
                            <MapPin size={11} className="mt-0.5 shrink-0" />
                            <span className="leading-relaxed">
                              {[c.constituency, c.region, c.state].filter(Boolean).join(' · ')}
                            </span>
                          </div>
                        )}
                        {c.notes && (
                          <p className="text-white/30 text-xs mt-2 leading-relaxed line-clamp-2">{c.notes}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center bg-white/3 border border-white/8 rounded-2xl p-8">
          <p className="text-white font-bold mb-1">
            {lang === 'en' ? 'Want to run for XTS?' : 'Ma rabtaa inaad u tartamto XTS?'}
          </p>
          <p className="text-white/40 text-sm mb-4">
            {lang === 'en'
              ? 'Candidate registration is handled through the party leadership. Contact us to learn more.'
              : 'Diiwaangelinta musharaxiintu waxay ku socotaa hoggaanka xisbiga. Nala xiriir si aad wax badan u ogaato.'}
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold text-sm rounded-full hover:bg-gold/90 transition-colors">
            {lang === 'en' ? 'Contact Party Leadership' : 'La Xiriir Hoggaanka Xisbiga'}
          </a>
        </div>
      </div>
    </main>
  );
}
