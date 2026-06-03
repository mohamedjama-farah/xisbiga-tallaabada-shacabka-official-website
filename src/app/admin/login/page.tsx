'use client';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (result?.ok) {
      router.push('/admin/dashboard');
    } else if (result?.error?.startsWith('LOCKED:')) {
      const mins = result.error.split(':')[1];
      setError(`Account temporarily locked. Too many failed attempts. Try again in ${mins} minute(s).`);
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070e24] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold/50 bg-[#1a2454]">
            <Image src="/logo.png" alt="XTS Logo" fill sizes="44px" className="object-contain p-1" priority />
          </div>
          <h1 className="text-3xl font-black text-white">Admin Portal</h1>
          <p className="text-white/40 text-sm mt-2">Xisbiga Tallaabada Shacabka</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-gold/20 rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-gold/80 text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors"
                placeholder="admin@xts-party.so"
              />
            </div>
          </div>
          <div>
            <label className="block text-gold/80 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-gold/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold/70"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-navy font-black text-lg rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
            ) : (
              <><Lock size={20} /> Sign In</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
