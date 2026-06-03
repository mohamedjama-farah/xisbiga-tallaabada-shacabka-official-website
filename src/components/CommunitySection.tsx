'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Vote, AlertCircle, HelpCircle, Shield, ArrowRight, BarChart3 } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

interface PollOption {
  id: string;
  labelEn: string;
  labelSo: string;
  _count: { votes: number };
}

interface Poll {
  id: string;
  questionEn: string;
  questionSo: string;
  options: PollOption[];
}

export default function CommunitySection() {
  const { lang } = useLang();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState(false);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetch('/api/polls').then(r => r.json()).then(d => {
      if (d.polls?.length) setPoll(d.polls[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!poll) return;
    try {
      const savedVotes = JSON.parse(localStorage.getItem('xts_votes') ?? '{}');
      if (savedVotes[poll.id]) {
        setVoted(true);
        setMyVote(savedVotes[poll.id]);
      }
    } catch {}
  }, [poll]);

  const doVote = async (optionId: string) => {
    if (!poll || voted || voting) return;
    setVoting(true);
    try {
      const res = await fetch('/api/polls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ optionId }) });
      const data = await res.json();
      if (data.ok && data.poll) {
        setPoll(data.poll);
        setVoted(true);
        setMyVote(optionId);
        const saved = JSON.parse(localStorage.getItem('xts_votes') ?? '{}');
        localStorage.setItem('xts_votes', JSON.stringify({ ...saved, [poll.id]: optionId }));
      }
    } catch {}
    setVoting(false);
  };

  const total = poll?.options.reduce((s, o) => s + o._count.votes, 0) ?? 0;

  const cards = [
    {
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/20',
      href: '/complaint',
      en: { title: 'Report an Issue', desc: 'Submit a citizen complaint. We investigate and respond within 7 days.' },
      so: { title: 'Soo Gudbi Arrin', desc: 'Gudbi cabasho muwaadin. Waxaan baarannaa oo jawaabno 7 maalmood gudahood.' },
    },
    {
      icon: HelpCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
      href: '/faq',
      en: { title: 'Got Questions?', desc: 'Browse our FAQ for answers about membership, elections, and XTS policies.' },
      so: { title: "Su'aalo Qabtaa?", desc: "Eeg FAQ-keenna jawaabaha ku saabsan xubnimada, doorashooyinka, iyo siyaasadaha XTS." },
    },
    {
      icon: Shield,
      color: 'text-gold',
      bg: 'bg-gold/10',
      border: 'border-gold/20',
      href: '/membership-card',
      en: { title: 'Your Member Card', desc: 'Download your official XTS membership card — available for approved members.' },
      so: { title: 'Kaarkaga Xubnimada', desc: 'Soo daji kaarka xubnimada rasmiga ah ee XTS — la heli karaa xubnaha la ansixiyey.' },
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-navy to-[#0a1128]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold tracking-widest text-sm uppercase font-bold mb-3">
            {lang === 'en' ? 'Community' : 'Bulshada'}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            {lang === 'en' ? 'Your Voice, Your Party' : 'Codkaaga, Xisbigaaga'}
          </h2>
          <div className="mt-5 w-20 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Poll widget */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/3 border border-white/8 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-gold" />
              <span className="text-gold text-xs font-bold uppercase tracking-wide">
                {lang === 'en' ? 'Community Poll' : "Ra'yiga Bulshada"}
              </span>
            </div>

            {poll ? (
              <>
                <h3 className="text-white font-bold text-base mb-4 leading-snug">
                  {lang === 'en' ? poll.questionEn : poll.questionSo}
                </h3>
                <div className="space-y-2.5">
                  {poll.options.map(opt => {
                    const pct = total === 0 ? 0 : Math.round((opt._count.votes / total) * 100);
                    const isMyVote2 = myVote === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => doVote(opt.id)}
                        disabled={voted || voting}
                        className={`w-full text-left relative overflow-hidden rounded-xl border transition-all py-2.5 px-3 ${
                          isMyVote2
                            ? 'border-gold/40 bg-gold/10'
                            : voted
                            ? 'border-white/8 bg-white/3 cursor-default'
                            : 'border-white/10 bg-white/3 hover:border-gold/30 cursor-pointer'
                        }`}
                      >
                        {voted && (
                          <div className={`absolute inset-0 ${isMyVote2 ? 'bg-gold/10' : 'bg-white/3'} transition-all`}
                            style={{ width: `${pct}%` }} />
                        )}
                        <div className="relative flex items-center justify-between">
                          <span className={`text-sm ${isMyVote2 ? 'text-gold font-bold' : voted ? 'text-white/50' : 'text-white/80'}`}>
                            {lang === 'en' ? opt.labelEn : opt.labelSo}
                          </span>
                          {voted && <span className="text-xs font-bold text-white/40">{pct}%</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-white/25 text-xs">{total} {lang === 'en' ? 'votes' : 'codad'}</p>
                  <Link href="/poll" className="text-gold text-xs font-bold hover:underline flex items-center gap-1">
                    {lang === 'en' ? 'See all polls' : 'Dhammaan codsiyada'} <ArrowRight size={11} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Vote size={32} className="text-white/15 mx-auto mb-2" />
                <p className="text-white/30 text-sm">{lang === 'en' ? 'No active polls right now.' : 'Ma jiraan codsi hadda firfircoon.'}</p>
                <p className="text-white/20 text-xs mt-1">{lang === 'en' ? 'Check back soon!' : 'Dib u eeg dhawaan!'}</p>
              </div>
            )}
          </motion.div>

          {/* 3 quick action cards */}
          <div className="grid gap-4">
            {cards.map((card, i) => {
              const Icon = card.icon;
              const content = lang === 'en' ? card.en : card.so;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={card.href}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${card.border} ${card.bg} hover:opacity-90 transition-all group`}>
                    <div className={`w-10 h-10 rounded-xl bg-white/5 border ${card.border} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className={card.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{content.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{content.desc}</p>
                    </div>
                    <ArrowRight size={15} className={`${card.color} flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity`} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
