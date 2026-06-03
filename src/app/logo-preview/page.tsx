'use client';
import { useState } from 'react';
import XTSLogo from '@/components/XTSLogo';
import XTSLogoBolt from '@/components/XTSLogoBolt';
import XTSLogoCrescent from '@/components/XTSLogoCrescent';

const LOGOS = [
  {
    key: 'A',
    label: 'Logo A — Star Emblem',
    sub: 'Classic seal · Star · Shield · Arrow',
    desc: 'Official seal style. 5-pointed star with shield and upward arrow. Curved text around the ring. Feels like a government emblem.',
    Component: XTSLogo,
    color: 'from-blue-900/40',
  },
  {
    key: 'B',
    label: 'Logo B — Bolt Circle  ✦ Your Choice',
    sub: 'Thick ring · Gold + White bolt · Power',
    desc: 'Inspired by PAP. Navy ring with a big bold lightning bolt striking through — white highlight at the top fading to gold. Bold, modern, energetic.',
    Component: XTSLogoBolt,
    color: 'from-yellow-900/30',
  },
  {
    key: 'C',
    label: 'Logo C — Crescent & Star',
    sub: 'Crescent moon · White star · Somali identity',
    desc: 'Deep Somali identity. Gold crescent moon + white star on a navy disc. Patriotic, elegant, recognised across the Muslim world.',
    Component: XTSLogoCrescent,
    color: 'from-indigo-900/40',
  },
] as const;

export default function LogoPreviewPage() {
  const [key, setKey] = useState(0);

  return (
    <main className="min-h-screen bg-navy pb-24">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-navy/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <p className="text-white/40 text-xs uppercase tracking-widest">XTS Logo Comparison — 3 Designs</p>
        <button onClick={() => setKey(k => k + 1)}
          className="px-4 py-1.5 text-xs font-bold text-navy bg-gold rounded-full hover:bg-gold/90 transition-colors">
          ▶ Replay All Animations
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-14 space-y-20">

        {/* ══ HERO — all 3 large ══ */}
        <div className="grid md:grid-cols-3 gap-5">
          {LOGOS.map(({ key: k, label, sub, desc, Component, color }) => (
            <div key={k} className={`bg-gradient-to-b ${color} to-white/3 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-7`}>
              <div className="text-center">
                <span className="inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-gold/15 text-gold border border-gold/30 rounded-full mb-2">
                  {label}
                </span>
                <p className="text-white/30 text-[10px]">{sub}</p>
              </div>
              <Component key={`${k}-hero-${key}`} size="xl" animate={true} darkBg={true} />
              <p className="text-white/25 text-[11px] text-center leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ══ SIZE ROWS ══ */}
        {LOGOS.map(({ key: k, label, Component }) => (
          <div key={k}>
            <p className="text-white/25 text-[10px] uppercase tracking-widest mb-6 text-center">{label} — All Sizes</p>
            <div className="flex flex-wrap gap-8 justify-center items-end">
              {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(s => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Component size={s} animate={false} darkBg={true} />
                  <span className="text-white/20 text-[9px] uppercase tracking-widest">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ══ NAVBAR SIMULATION ══ */}
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-widest mb-5 text-center">How each looks in the navbar</p>
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            {LOGOS.map(({ key: k, label, Component }) => (
              <div key={k} className="bg-[#0e1640] border border-white/10 rounded-xl px-6 py-4 flex items-center gap-6">
                <span className="text-white/20 text-[8px] uppercase tracking-widest w-10 shrink-0">{k}</span>
                <Component size="sm" animate={false} darkBg={true} />
              </div>
            ))}
          </div>
        </div>

        {/* ══ LIGHT BACKGROUND ══ */}
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-widest mb-5 text-center">On a white / light background</p>
          <div className="grid md:grid-cols-3 gap-5">
            {LOGOS.map(({ key: k, label, Component }) => (
              <div key={k} className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
                <p className="text-navy/30 text-[9px] uppercase tracking-widest">{k}</p>
                <Component size="md" animate={false} darkBg={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/20 text-xs pb-4 space-y-2">
          <p>Tell me which one — <strong className="text-white/40">A</strong>, <strong className="text-white/40">B</strong>, or <strong className="text-white/40">C</strong> — and I will apply it to the entire site immediately.</p>
          <p className="text-white/10">Navbar · Footer · Admin panel · Homepage · All pages</p>
        </div>
      </div>
    </main>
  );
}
