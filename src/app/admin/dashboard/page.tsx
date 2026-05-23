'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Activity,
  Terminal,
  Users,
  Calendar,
  TrendingUp,
  RefreshCw,
  Inbox,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_title: string;
  appointment_date: string;
  appointment_time_slot: string;
  status: string;
  created_at: string;
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending: {
      bg: 'bg-yellow-400/10 border-yellow-400/20',
      text: 'text-yellow-400',
      dot: 'bg-yellow-400',
      label: 'Pending',
    },
    confirmed: {
      bg: 'bg-cyan-400/10 border-cyan-400/20',
      text: 'text-cyan-400',
      dot: 'bg-cyan-400',
      label: 'Confirmed',
    },
    completed: {
      bg: 'bg-emerald-400/10 border-emerald-400/20',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-red-400/10 border-red-400/20',
      text: 'text-red-400',
      dot: 'bg-red-400',
      label: 'Cancelled',
    },
  };

  const s = styles[status] ?? styles['pending'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── SKELETON ROW ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-3.5 animate-pulse rounded-md bg-white/10"
            style={{ width: `${40 + i * 10}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchAppointments(isManualRefresh = false) {
    if (isManualRefresh) setIsRefreshing(true);
    setFetchError(null);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError(error.message);
    } else {
      setAppointments((data as Appointment[]) ?? []);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function updateAppointmentStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    // Optimistically update local state for instant UI feedback
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) {
      // Roll back on failure and re-fetch ground truth
      setFetchError(error.message);
      await fetchAppointments();
    }
    setUpdatingId(null);
  }

  // Derived stats
  const totalBookings = appointments.length;
  const uniqueClients = new Set(appointments.map((a) => a.customer_email)).size;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const STATS = [
    {
      label: 'Total Bookings',
      value: isLoading ? '—' : String(totalBookings),
      icon: <Calendar size={16} />,
      accent: '#00FFFF',
    },
    {
      label: 'Unique Clients',
      value: isLoading ? '—' : String(uniqueClients),
      icon: <Users size={16} />,
      accent: '#39FF14',
    },
    {
      label: 'Pending Review',
      value: isLoading ? '—' : String(pendingCount),
      icon: <TrendingUp size={16} />,
      accent: '#FFD700',
    },
    {
      label: 'System Status',
      value: fetchError ? 'Error' : 'Online',
      icon: <Activity size={16} />,
      accent: fetchError ? '#f87171' : '#39FF14',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── TOP NAV ────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 px-6 py-4 backdrop-blur-md md:px-10"
        style={{ backgroundColor: 'rgba(9,9,11,0.90)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,255,255,0.15), rgba(57,255,20,0.08))',
            }}
          >
            <Terminal size={14} style={{ color: '#00FFFF' }} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold tracking-wide text-zinc-50"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Arclix Labs
            </span>
            <span className="text-zinc-700">|</span>
            <span
              className="text-zinc-400 uppercase tracking-widest"
              style={{ fontSize: '0.65rem', fontWeight: 600 }}
            >
              Command Center
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Live status pill */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live Feed
          </div>

          {/* Refresh */}
          <motion.button
            onClick={() => fetchAppointments(true)}
            disabled={isRefreshing || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Refresh appointments"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-zinc-200 disabled:opacity-40"
          >
            <RefreshCw
              size={12}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            Refresh
          </motion.button>

          {/* Lock Vault */}
          <Link href="/admin/login">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <Lock size={12} />
              Lock Vault
            </motion.span>
          </Link>
        </div>
      </motion.header>

      {/* ─── BODY ────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Ambient glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[400px] w-[600px] rounded-full bg-cyan-500/4 blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 h-[300px] w-[400px] rounded-full bg-emerald-400/4 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="mb-10"
          >
            <p className="mb-1 text-xs font-medium tracking-[0.3em] text-zinc-600 uppercase">
              Control Room
            </p>
            <h1
              className="text-3xl font-bold text-zinc-50 md:text-4xl"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Appointment Matrix
            </h1>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span style={{ color: stat.accent }}>{stat.icon}</span>
                  <span className="text-[10px] font-medium tracking-widest text-zinc-600 uppercase">
                    {stat.label}
                  </span>
                </div>
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    color: stat.value === '—' ? '#3f3f46' : stat.accent,
                  }}
                >
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* ─── DATA TABLE ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          >
            {/* Table header bar */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div>
                <h2
                  className="text-sm font-semibold text-zinc-200"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Live Appointments
                </h2>
                <p className="mt-0.5 text-xs text-zinc-600">
                  template_id: vault-cyber-barber · ordered by newest
                </p>
              </div>
              {!isLoading && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-zinc-400">
                  {appointments.length} record{appointments.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Error state */}
            <AnimatePresence>
              {fetchError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 border-b border-red-500/10 bg-red-500/5 px-6 py-3"
                >
                  <AlertCircle size={14} className="text-red-400" />
                  <p className="text-sm text-red-400">{fetchError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Client', 'Service', 'Date', 'Time Slot', 'Status'].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-widest text-zinc-600 uppercase"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Loading skeletons */}
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}

                  {/* Empty state */}
                  {!isLoading && appointments.length === 0 && !fetchError && (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Inbox size={32} className="text-zinc-700" />
                          <p className="text-sm font-medium text-zinc-500">
                            No appointments found
                          </p>
                          <p className="text-xs text-zinc-700">
                            Bookings submitted via /book will appear here in real time.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Data rows */}
                  <AnimatePresence>
                    {!isLoading &&
                      appointments.map((appt, i) => (
                        <motion.tr
                          key={appt.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: i * 0.04,
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="group border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                        >
                          {/* Client */}
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-zinc-200">
                                {appt.customer_name}
                              </p>
                              <p className="mt-0.5 text-xs text-zinc-600">
                                {appt.customer_email}
                              </p>
                            </div>
                          </td>

                          {/* Service */}
                          <td className="px-5 py-4">
                            <span className="text-zinc-300">
                              {appt.service_title ?? '—'}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs text-zinc-400">
                              {appt.appointment_date}
                            </span>
                          </td>

                          {/* Time slot */}
                          <td className="px-5 py-4">
                            <span
                              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-zinc-300"
                            >
                              {appt.appointment_time_slot}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <div className="relative flex items-center gap-2">
                              {/* Spinner while this row is updating */}
                              {updatingId === appt.id && (
                                <Loader2
                                  size={12}
                                  className="shrink-0 animate-spin text-zinc-500"
                                />
                              )}
                              <select
                                value={appt.status}
                                disabled={updatingId === appt.id}
                                onChange={(e) =>
                                  updateAppointmentStatus(appt.id, e.target.value)
                                }
                                aria-label={`Update status for ${appt.customer_name}`}
                                className={`cursor-pointer appearance-none rounded-full border px-3 py-1 text-xs font-medium outline-none transition-all disabled:cursor-wait disabled:opacity-60
                                  ${
                                    appt.status === 'pending'
                                      ? 'border-yellow-400/25 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                                      : appt.status === 'confirmed'
                                      ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20'
                                      : appt.status === 'completed'
                                      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20'
                                      : appt.status === 'cancelled'
                                      ? 'border-red-400/25 bg-red-400/10 text-red-400 hover:bg-red-400/20'
                                      : 'border-white/10 bg-white/5 text-zinc-400'
                                  }`}
                                style={{
                                  // Kill default select arrow on all browsers
                                  WebkitAppearance: 'none',
                                  MozAppearance: 'none',
                                }}
                              >
                                <option value="pending"  style={{ background: '#18181b', color: '#facc15' }}>⏳ Pending</option>
                                <option value="confirmed" style={{ background: '#18181b', color: '#22d3ee' }}>✓ Confirmed</option>
                                <option value="completed" style={{ background: '#18181b', color: '#34d399' }}>✦ Completed</option>
                                <option value="cancelled" style={{ background: '#18181b', color: '#f87171' }}>✕ Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
