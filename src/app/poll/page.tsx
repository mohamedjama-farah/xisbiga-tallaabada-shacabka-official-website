'use client';
import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, Loader2, Vote } from 'lucide-react';
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
  endsAt: string | null;
}

export default function PollPage() {
  const { lang } = useLang();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<Record<string, string>>({}); // pollId -> optionId
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/polls').then(r => r.json()).then(d => { setPolls(d.polls ?? []); setLoading(false); }).catch(() => setLoading(false));
    // Load voted from localStorage
    try { setVoted(JSON.parse(localStorage.getItem('xts_votes') ?? '{}')); } catch {}
  }, []);

  const vote = async (pollId: string, optionId: string) => {
    if (voted[pollId] || voting) return;
    setVoting(optionId);
    try {
      const res = await fetch('/api/polls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ optionId }) });
      const data = await res.json();
      if (data.ok && data.poll) {
        setPolls(ps => ps.map(p => p.id === pollId ? { ...p, options: data.poll.options } : p));
        const newVoted = { ...voted, [pollId]: optionId };
        setVoted(newVoted);
        localStorage.setItem('xts_votes', JSON.stringify(newVoted));
      }
    } catch {}
    setVoting(null);
  };

  const totalVotes = (poll: Poll) => poll.options.reduce((s, o) => s + o._count.votes, 0);
  const pct = (poll: Poll, option: PollOption) => {
    const total = totalVotes(poll);
    return total === 0 ? 0 : Math.round((option._count.votes / total) * 100);
  };

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Vote size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Member Polls' : 'Ra\'yiyadda Xubnaha'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Your Voice Matters' : 'Codkaagu Muhiim Yahay'}
          </h1>
          <p className="text-white/50 text-sm">
            {lang === 'en'
              ? 'XTS listens to its members. Vote on current party questions and see what the community thinks.'
              : 'XTS waxay dhegaystaa xubnaha. Ku codeey su\'aalaha xisbiga hadda jira oo arag waxa ay bulshadu u maleynayso.'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="text-gold animate-spin mx-auto" />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
            <BarChart3 size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 font-semibold">{lang === 'en' ? 'No active polls right now.' : 'Ma jiraan codsi firfircoon hadda.'}</p>
            <p className="text-white/25 text-sm mt-1">{lang === 'en' ? 'Check back soon!' : 'Dib u eeg dhawaan!'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map(poll => {
              const myVote = voted[poll.id];
              const hasVoted = !!myVote;
              const total = totalVotes(poll);

              return (
                <div key={poll.id} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-white font-bold text-base leading-snug flex-1 pr-4">
                      {lang === 'en' ? poll.questionEn : poll.questionSo}
                    </h2>
                    {hasVoted && (
                      <div className="flex items-center gap-1 text-green-400 text-xs font-bold flex-shrink-0">
                        <CheckCircle2 size={13} />
                        {lang === 'en' ? 'Voted' : 'La codeeyay'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {poll.options.map(opt => {
                      const p = pct(poll, opt);
                      const isMyVote = myVote === opt.id;
                      const isLeading = hasVoted && poll.options.every(o => o._count.votes <= opt._count.votes);

                      return (
                        <button
                          key={opt.id}
                          onClick={() => !hasVoted && vote(poll.id, opt.id)}
                          disabled={hasVoted || voting === opt.id}
                          className={`w-full text-left relative overflow-hidden rounded-xl border transition-all ${
                            isMyVote
                              ? 'border-gold/50 bg-gold/10'
                              : hasVoted
                              ? 'border-white/8 bg-white/3 cursor-default'
                              : 'border-white/10 bg-white/3 hover:border-gold/30 hover:bg-gold/5 cursor-pointer'
                          }`}
                        >
                          {/* Progress bar bg */}
                          {hasVoted && (
                            <div
                              className={`absolute inset-0 ${isMyVote ? 'bg-gold/15' : 'bg-white/5'} transition-all duration-700`}
                              style={{ width: `${p}%` }}
                            />
                          )}
                          <div className="relative flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-2">
                              {voting === opt.id ? (
                                <Loader2 size={13} className="text-gold animate-spin" />
                              ) : isMyVote ? (
                                <CheckCircle2 size={13} className="text-gold" />
                              ) : (
                                <div className={`w-3.5 h-3.5 rounded-full border-2 ${hasVoted ? 'border-white/20' : 'border-white/30'}`} />
                              )}
                              <span className={`text-sm font-medium ${isMyVote ? 'text-gold' : hasVoted ? 'text-white/60' : 'text-white/80'}`}>
                                {lang === 'en' ? opt.labelEn : opt.labelSo}
                              </span>
                              {isLeading && hasVoted && (
                                <span className="text-[9px] bg-gold/20 text-gold border border-gold/30 rounded-full px-1.5 py-0.5 font-bold uppercase">
                                  {lang === 'en' ? 'Leading' : 'Hogaaminaya'}
                                </span>
                              )}
                            </div>
                            {hasVoted && (
                              <span className="text-xs font-bold text-white/50">{p}%</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-white/25 text-xs">
                      {total} {lang === 'en' ? (total === 1 ? 'vote' : 'votes') : 'codad'}
                    </p>
                    {poll.endsAt && (
                      <p className="text-white/25 text-xs">
                        {lang === 'en' ? 'Ends' : 'Dhammaanaysaa'}: {new Date(poll.endsAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
