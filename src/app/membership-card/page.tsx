'use client';
import { useState, useRef } from 'react';
import { Shield, Download, Printer, Search, CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  status: string;
  createdAt: string;
}

export default function MembershipCardPage() {
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMember(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/membership-card?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (res.ok && data.member) {
        setMember(data.member);
      } else {
        setError(data.error ?? (lang === 'en' ? 'Member not found.' : 'Xubin lama helin.'));
      }
    } catch {
      setError(lang === 'en' ? 'Network error. Please try again.' : 'Khalad shabakad. Fadlan dib u isku day.');
    }
    setLoading(false);
  };

  const print = () => window.print();

  const memberNumber = member ? `XTS-${member.id.slice(-6).toUpperCase()}` : '';
  const joinYear = member ? new Date(member.createdAt).getFullYear() : '';

  return (
    <main className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <Shield size={14} className="text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Membership Card' : 'Kaarka Xubnimada'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {lang === 'en' ? 'Your XTS Member Card' : 'Kaarkaga XTS ee Xubnimada'}
          </h1>
          <p className="text-white/50 text-sm">
            {lang === 'en'
              ? 'Enter your registered email to view and download your official XTS membership card.'
              : 'Geli emailkaaga diiwaansan si aad u aragto oo u soo dejiso kaarka xubnimada rasmiga ah ee XTS.'}
          </p>
        </div>

        {/* Lookup form */}
        {!member && (
          <form onSubmit={lookup} className="mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={lang === 'en' ? 'Your registered email address' : 'Cinwaankaaga emailka diiwaansan'}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/40 placeholder-white/25"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 bg-gold text-navy font-bold text-sm rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                {lang === 'en' ? 'Look Up' : 'Raadi'}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-3 flex items-center gap-1.5">
                <Shield size={13} /> {error}
              </p>
            )}
          </form>
        )}

        {/* Card */}
        {member && (
          <div>
            {member.status !== 'APPROVED' ? (
              <div className="text-center py-10 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                <Shield size={40} className="text-yellow-400 mx-auto mb-3" />
                <p className="text-yellow-300 font-bold">{lang === 'en' ? 'Application Pending' : 'Codsiga Sugaya'}</p>
                <p className="text-white/40 text-sm mt-2">
                  {lang === 'en'
                    ? 'Your application is still being reviewed. Your card will be available once approved.'
                    : 'Codsigaaga wali la eegayaa. Kaarkaga waa la heli karaa marka la ansixiyo.'}
                </p>
                <button onClick={() => { setMember(null); setEmail(''); }} className="mt-4 text-white/40 hover:text-white text-xs underline">
                  {lang === 'en' ? 'Search again' : 'Dib u raadi'}
                </button>
              </div>
            ) : (
              <>
                {/* Membership Card Design */}
                <div
                  ref={cardRef}
                  className="print:shadow-none relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-[#1a2454] via-[#0d1835] to-[#1a2454] p-6 shadow-2xl shadow-black/40"
                  style={{ aspectRatio: '1.586' }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="absolute w-32 h-32 rounded-full border border-gold"
                        style={{ top: `${(i * 30) - 20}%`, left: `${(i * 20) - 10}%` }} />
                    ))}
                  </div>

                  {/* Gold bar top */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

                  <div className="relative h-full flex flex-col justify-between">
                    {/* Top: Logo + Party name */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="XTS" className="w-10 h-10 rounded-full border-2 border-gold/40 object-contain p-0.5 bg-[#1a2454]" />
                        <div>
                          <p className="text-gold font-black text-xs leading-tight">Xisbiga Tallaabada</p>
                          <p className="text-gold font-black text-xs leading-tight">Shacabka</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[9px] uppercase tracking-widest">Member Card</p>
                        <p className="text-gold font-black text-sm">{memberNumber}</p>
                      </div>
                    </div>

                    {/* Middle: Name */}
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Member Name</p>
                      <p className="text-white font-black text-xl">{member.firstName} {member.lastName}</p>
                      <p className="text-gold/70 text-xs">{member.city}</p>
                    </div>

                    {/* Bottom: Status + Year */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/30 text-[9px] uppercase tracking-widest mb-0.5">Status</p>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span className="text-green-400 font-bold text-xs uppercase">Approved Member</span>
                        </div>
                        <p className="text-white/25 text-[9px] mt-0.5">Member since {joinYear}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                          <QrCode size={20} className="text-white/30" />
                        </div>
                        <p className="text-white/20 text-[8px] mt-1">xts.so/verify</p>
                      </div>
                    </div>
                  </div>

                  {/* Gold bar bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={print}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Printer size={15} />
                    {lang === 'en' ? 'Print Card' : 'Daabac Kaarka'}
                  </button>
                  <button
                    onClick={print}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-navy text-sm font-bold rounded-xl hover:bg-gold/90 transition-colors"
                  >
                    <Download size={15} />
                    {lang === 'en' ? 'Save as PDF' : 'Keydi PDF ahaan'}
                  </button>
                </div>

                <button onClick={() => { setMember(null); setEmail(''); }} className="w-full mt-3 text-white/30 hover:text-white text-xs py-2 transition-colors">
                  {lang === 'en' ? 'Look up a different member' : 'Raadi xubin kale'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Info box */}
        <div className="mt-10 bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/60 font-semibold text-sm mb-2">
            {lang === 'en' ? 'About Your Membership Card' : 'Kaarka Xubnimadaada'}
          </p>
          <ul className="space-y-1.5 text-white/35 text-xs">
            <li>• {lang === 'en' ? 'Only approved members can access their card.' : 'Xubnaha la ansixiyey oo keliya ayaa kaarka la heli kara.'}</li>
            <li>• {lang === 'en' ? 'Print it or save as PDF to use at XTS events.' : 'Daabac ama keydi PDF ahaan si aad ugu isticmaasho dhacdooyinka XTS.'}</li>
            <li>• {lang === 'en' ? 'Your card number is unique and permanent.' : 'Lambarka kaarkaga si gaar ah ayaa loogu talagalay oo joogto ah.'}</li>
            <li>• {lang === 'en' ? 'Not yet a member? Join us today!' : 'Weli xubin ma ahaatid? Maanta noogu soo biir!'}</li>
          </ul>
          <a href="/join" className="inline-flex items-center gap-1.5 mt-3 text-gold text-xs font-bold hover:underline">
            {lang === 'en' ? 'Join XTS →' : 'Ku Biir XTS →'}
          </a>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none; }
          .print-card { display: block !important; }
        }
      `}</style>
    </main>
  );
}
