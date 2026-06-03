'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

interface DonationStats {
  raised: number;
  goal: number;
  percent: number;
  donorCount: number;
}

export default function DonationProgressBar() {
  const { lang } = useLang();
  const [stats, setStats] = useState<DonationStats | null>(null);

  useEffect(() => {
    fetch('/api/donation-goal')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-gold fill-gold/30" />
          <span className="text-white font-bold text-sm">
            {lang === 'en' ? 'Campaign Fund' : 'Sanduuqa Olalaha'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Users size={12} />
          <span>{stats.donorCount} {lang === 'en' ? 'donors' : 'deeq-bixiye'}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-white/8 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.percent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #c9a227, #f0c940)' }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gold font-bold">
          ${stats.raised.toLocaleString()} {lang === 'en' ? 'raised' : 'la ururiyey'}
        </span>
        <span className="text-white/40">
          {lang === 'en' ? 'Goal:' : 'Hadafka:'} ${stats.goal.toLocaleString()} ({stats.percent}%)
        </span>
      </div>
    </div>
  );
}
