'use client';
/**
 * HumanCheck — lightweight bot protection for public forms.
 * Two layers:
 *   1. Honeypot hidden field: bots fill it, humans don't.
 *   2. Math CAPTCHA: simple addition question, changes every render.
 *
 * Usage:
 *   const humanCheck = useHumanCheck();
 *   <HumanCheck state={humanCheck} />
 *   Then before submit: if (!humanCheck.verify()) return;
 */
import { useState, useEffect, useCallback } from 'react';

interface HumanCheckState {
  honeypot: string;
  setHoneypot: (v: string) => void;
  answer: string;
  setAnswer: (v: string) => void;
  question: string;
  verify: () => boolean;
  error: string;
}

export function useHumanCheck(): HumanCheckState {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [honeypot, setHoneypot] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setA(Math.floor(Math.random() * 9) + 1);
    setB(Math.floor(Math.random() * 9) + 1);
  }, []);

  const verify = useCallback(() => {
    if (honeypot) {
      // Bot detected — silently fail (don't tell the bot why)
      return false;
    }
    if (parseInt(answer, 10) !== a + b) {
      setError('Wrong answer — please try the math question again.');
      setAnswer('');
      // Refresh numbers
      setA(Math.floor(Math.random() * 9) + 1);
      setB(Math.floor(Math.random() * 9) + 1);
      return false;
    }
    setError('');
    return true;
  }, [honeypot, answer, a, b]);

  return {
    honeypot, setHoneypot,
    answer, setAnswer,
    question: `${a} + ${b} = ?`,
    verify,
    error,
  };
}

interface Props {
  state: HumanCheckState;
  lang?: 'en' | 'so';
}

export default function HumanCheck({ state, lang = 'en' }: Props) {
  return (
    <div>
      {/* Honeypot — hidden from humans, bots fill this automatically */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="website_url">Leave this empty</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.honeypot}
          onChange={e => state.setHoneypot(e.target.value)}
        />
      </div>

      {/* Math CAPTCHA */}
      <div className="bg-white/3 border border-gold/20 rounded-xl p-4">
        <p className="text-white/50 text-xs mb-2 flex items-center gap-1.5">
          <span className="text-gold">🔒</span>
          {lang === 'en'
            ? 'Quick check — prove you\'re human:'
            : 'Hubinta aadanaha — xal su\'aaltan xisaabta ah:'}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm bg-white/8 px-3 py-2 rounded-lg">
            {state.question}
          </span>
          <input
            type="number"
            inputMode="numeric"
            value={state.answer}
            onChange={e => state.setAnswer(e.target.value)}
            placeholder={lang === 'en' ? 'Your answer' : 'Jawaabta'}
            className="w-28 px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-gold/60 transition-colors placeholder-white/30"
          />
        </div>
        {state.error && (
          <p className="text-red-400 text-xs mt-2">{state.error}</p>
        )}
      </div>
    </div>
  );
}
