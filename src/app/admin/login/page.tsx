'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Mock auth — 1-second delay then redirect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push('/admin/dashboard');
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-emerald-400/5 blur-[90px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Top accent line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent, #00FFFF60, transparent)',
          }}
        />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 16 }}
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.12), rgba(57,255,20,0.08))' }}
        >
          <ShieldCheck size={26} style={{ color: '#00FFFF' }} />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <p className="mb-1 text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">
            Arclix Labs
          </p>
          <h1
            className="text-3xl font-bold text-zinc-50"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Vault Access
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Restricted. Authorised personnel only.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-email"
              className="flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500 uppercase"
            >
              <Mail size={11} /> Email Address
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@arclix.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none backdrop-blur-sm transition-all focus:border-cyan-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-cyan-400/20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              className="flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500 uppercase"
            >
              <Lock size={11} /> Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-zinc-50 placeholder-zinc-600 outline-none backdrop-blur-sm transition-all focus:border-cyan-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-cyan-400/20 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="login-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={isLoading ? {} : { scale: 1.02 }}
            whileTap={isLoading ? {} : { scale: 0.97 }}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-zinc-950 shadow-lg transition-opacity disabled:cursor-not-allowed disabled:opacity-80"
            style={{ background: 'linear-gradient(135deg, #00FFFF, #39FF14)' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock size={14} />
                Authenticate
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Footer note */}
        <p className="mt-6 text-center text-[11px] text-zinc-600">
          Template ID:{' '}
          <span className="font-mono text-zinc-500">vault-cyber-barber</span>
        </p>
      </motion.div>
    </main>
  );
}
