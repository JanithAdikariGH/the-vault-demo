'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, ChevronLeft, Check, Phone, Mail, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface ClientDetails {
  name: string;
  email: string;
  phone: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  icon: string;
  accent: string;
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

const services: Service[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'The Executive Cut',
    description: 'Precision cut engineered for the modern professional. Sharp lines, impeccable finish.',
    duration: '45 min',
    price: '$65',
    icon: '✦',
    accent: '#00FFFF',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Beard Sculpting',
    description: 'Expert shaping and detailing to define your beard with surgical precision.',
    duration: '30 min',
    price: '$45',
    icon: '◈',
    accent: '#39FF14',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Hot Towel Shave',
    description: 'A classic ritual reimagined. Warm towels, premium lather, flawless finish.',
    duration: '60 min',
    price: '$80',
    icon: '◇',
    accent: '#FFD700',
  },
];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '4:00 PM',
];

// Generate next 7 days
function getNext7Days(): { label: string; sublabel: string; value: string }[] {
  const days: { label: string; sublabel: string; value: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: dayNames[d.getDay()],
      sublabel: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      value: d.toISOString().split('T')[0],
    });
  }
  return days;
}

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── STEP INDICATORS ──────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Service', icon: <User size={14} /> },
  { label: 'Schedule', icon: <Calendar size={14} /> },
  { label: 'Confirm', icon: <Check size={14} /> },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const days = getNext7Days();

  function goTo(nextStep: number) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }

  function handleServiceSelect(service: Service) {
    setSelectedService(service);
    setTimeout(() => goTo(2), 180);
  }

  function handleConfirm() {
    goTo(3);
  }

  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from('appointments').insert([
      {
        template_id: 'vault-cyber-barber',
        service_id: selectedService?.id,
        service_title: selectedService?.title,
        customer_name: clientDetails.name,
        customer_email: clientDetails.email,
        customer_phone: clientDetails.phone,
        appointment_date: selectedDate,
        appointment_time_slot: selectedTime,
        status: 'pending',
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
    } else {
      setIsSuccess(true);
    }
  }

  // ─── STEP 1: SERVICES ───────────────────────────────────────────────────────

  const StepServices = (
    <motion.div
      key="step-1"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <h2
        className="mb-2 text-3xl font-bold text-zinc-50"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        Choose Your Service
      </h2>
      <p className="mb-8 text-zinc-500">Select the experience you want.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service, i) => (
          <motion.button
            key={service.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleServiceSelect(service)}
            className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            aria-label={`Select ${service.title}`}
          >
            {/* Corner accent glow */}
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-20 w-20 rounded-bl-[2.5rem] rounded-tr-2xl opacity-10 blur-xl transition-opacity group-hover:opacity-25"
              style={{ backgroundColor: service.accent }}
            />
            <span className="mb-4 text-3xl" style={{ color: service.accent }}>
              {service.icon}
            </span>
            <h3
              className="mb-2 text-lg font-bold text-zinc-50"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {service.title}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-zinc-400">
              {service.description}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock size={12} /> {service.duration}
              </span>
              <span className="text-base font-bold" style={{ color: service.accent }}>
                {service.price}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  // ─── STEP 2: DATE & TIME ────────────────────────────────────────────────────

  const StepSchedule = (
    <motion.div
      key="step-2"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {/* Service summary pill */}
      {selectedService && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-sm">
          <span style={{ color: selectedService.accent }}>{selectedService.icon}</span>
          {selectedService.title}
          <span className="ml-1 text-zinc-500">·</span>
          <span style={{ color: selectedService.accent }}>{selectedService.price}</span>
        </div>
      )}

      <h2
        className="mb-2 text-3xl font-bold text-zinc-50"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        Pick a Date & Time
      </h2>
      <p className="mb-8 text-zinc-500">Select your preferred slot.</p>

      {/* Date scroll */}
      <div className="mb-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500 uppercase">
          <Calendar size={13} /> Date
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {days.map((day) => {
            const isSelected = selectedDate === day.value;
            return (
              <motion.button
                key={day.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day.value)}
                aria-pressed={isSelected}
                aria-label={`Select ${day.label} ${day.sublabel}`}
                className={`flex min-w-[72px] flex-col items-center rounded-xl border px-3 py-3 text-center transition-all ${
                  isSelected
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/8 hover:text-zinc-200'
                }`}
              >
                <span className="text-xs font-medium">{day.label}</span>
                <span
                  className="mt-1 text-lg font-bold"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {day.sublabel.split(' ')[1]}
                </span>
                <span className="text-[10px] text-zinc-500">{day.sublabel.split(' ')[0]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="mb-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500 uppercase">
          <Clock size={13} /> Time Slot
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <motion.button
                key={time}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTime(time)}
                aria-pressed={isSelected}
                aria-label={`Select time ${time}`}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/8 hover:text-zinc-200'
                }`}
              >
                {time}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Next button — only shown when both selected */}
      <AnimatePresence>
        {selectedDate && selectedTime && (
          <motion.button
            key="next-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            className="w-full rounded-xl py-3.5 text-sm font-semibold text-zinc-950 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00FFFF, #39FF14)' }}
          >
            Continue →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ─── STEP 3: CLIENT INFO ────────────────────────────────────────────────────

  const StepClientInfo = (
    <motion.div
      key="step-3"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {/* Booking summary */}
      {selectedService && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <p className="mb-2 text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Booking Summary
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-300">
            <span>
              <span style={{ color: selectedService.accent }}>{selectedService.icon}</span>{' '}
              {selectedService.title}
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Calendar size={12} /> {selectedDate}
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Clock size={12} /> {selectedTime}
            </span>
            <span className="font-bold" style={{ color: selectedService.accent }}>
              {selectedService.price}
            </span>
          </div>
        </div>
      )}

      <h2
        className="mb-2 text-3xl font-bold text-zinc-50"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        Your Details
      </h2>
      <p className="mb-8 text-zinc-500">Almost there — just a few details.</p>

      <form onSubmit={handleSubmitBooking} className="flex flex-col gap-4">
        {/* Name */}
        <div className="group flex flex-col gap-1.5">
          <label htmlFor="client-name" className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <User size={12} /> Full Name
          </label>
          <input
            id="client-name"
            type="text"
            required
            placeholder="John Doe"
            value={clientDetails.name}
            onChange={(e) =>
              setClientDetails((d) => ({ ...d, name: e.target.value }))
            }
            disabled={isSubmitting}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 backdrop-blur-sm outline-none transition-colors focus:border-cyan-400/40 focus:bg-white/[0.08] disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-email" className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <Mail size={12} /> Email Address
          </label>
          <input
            id="client-email"
            type="email"
            required
            placeholder="john@example.com"
            value={clientDetails.email}
            onChange={(e) =>
              setClientDetails((d) => ({ ...d, email: e.target.value }))
            }
            disabled={isSubmitting}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 backdrop-blur-sm outline-none transition-colors focus:border-cyan-400/40 focus:bg-white/[0.08] disabled:opacity-50"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-phone" className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <Phone size={12} /> Phone Number
          </label>
          <input
            id="client-phone"
            type="tel"
            required
            placeholder="+1 (555) 000-0000"
            value={clientDetails.phone}
            onChange={(e) =>
              setClientDetails((d) => ({ ...d, phone: e.target.value }))
            }
            disabled={isSubmitting}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 backdrop-blur-sm outline-none transition-colors focus:border-cyan-400/40 focus:bg-white/[0.08] disabled:opacity-50"
          />
        </div>

        {/* Error message */}
        <AnimatePresence>
          {submitError && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={isSubmitting ? {} : { scale: 1.02 }}
          whileTap={isSubmitting ? {} : { scale: 0.97 }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-zinc-950 shadow-lg disabled:cursor-not-allowed disabled:opacity-80"
          style={{ background: 'linear-gradient(135deg, #00FFFF, #39FF14)' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Securing Slot...
            </>
          ) : (
            <>Confirm Booking ✓</>
          )}
        </motion.button>
      </form>
    </motion.div>
  );

  // ─── STEP 4: SUCCESS ────────────────────────────────────────────────────────

  const StepSuccess = (
    <motion.div
      key="step-success"
      initial={{ opacity: 0, scale: 0.95, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-8 text-center"
    >
      {/* Glowing checkmark */}
      <div className="relative mb-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: '#39FF14', opacity: 0.25 }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10"
          style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(0,255,255,0.1))' }}
        >
          <Check size={40} style={{ color: '#39FF14' }} strokeWidth={2.5} />
        </motion.div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-zinc-400 uppercase">
          <Sparkles size={11} style={{ color: '#39FF14' }} />
          Booking Confirmed
        </div>
        <h2
          className="mt-4 text-4xl font-bold text-zinc-50 md:text-5xl"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          You&apos;re All Set!
        </h2>
        <p className="mt-3 text-zinc-400">
          Your appointment has been secured. See you soon.
        </p>
      </motion.div>

      {/* Booking summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md"
      >
        <p className="mb-4 text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Booking Details
        </p>
        <div className="space-y-3">
          {selectedService && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Service</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
                <span style={{ color: selectedService.accent }}>{selectedService.icon}</span>
                {selectedService.title}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Date</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
              <Calendar size={13} className="text-zinc-500" />
              {selectedDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Time</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
              <Clock size={13} className="text-zinc-500" />
              {selectedTime}
            </span>
          </div>
          {clientDetails.name && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Name</span>
              <span className="text-sm font-medium text-zinc-200">{clientDetails.name}</span>
            </div>
          )}
          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Pending Confirmation
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Return CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-8"
      >
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            ← Return to Home
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  const stepContent = [StepServices, StepSchedule, StepClientInfo];

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-[500px] w-[700px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[500px] rounded-full bg-emerald-400/5 blur-[90px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
          aria-label="Back to home"
        >
          <ChevronLeft size={16} />
          Back
        </Link>
        <span
          className="text-lg font-bold tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-space-grotesk)', color: '#00FFFF' }}
        >
          The Vault
        </span>
        <div className="w-16" aria-hidden="true" />
      </header>

      {/* Step indicator — hidden on success */}
      <AnimatePresence>
        {!isSuccess && (
          <motion.div
            key="step-indicator"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 mx-auto mb-10 flex max-w-xs items-center justify-center gap-0"
          >
            {STEPS.map((s, i) => {
              const num = i + 1;
              const isDone = step > num;
              const isActive = step === num;
              return (
                <div key={s.label} className="flex items-center">
                  <motion.div
                    animate={{
                      backgroundColor: isDone
                        ? '#00FFFF'
                        : isActive
                        ? 'rgba(0,255,255,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      borderColor: isDone || isActive ? '#00FFFF40' : 'rgba(255,255,255,0.1)',
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                  >
                    {isDone ? (
                      <Check size={13} className="text-zinc-950" />
                    ) : (
                      <span className={isActive ? 'text-cyan-300' : 'text-zinc-600'}>
                        {s.icon}
                      </span>
                    )}
                  </motion.div>
                  <div className="hidden flex-col items-start sm:flex" style={{ marginLeft: 6 }}>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider ${
                        isActive ? 'text-cyan-300' : isDone ? 'text-zinc-400' : 'text-zinc-600'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="mx-2 h-px w-8 transition-colors duration-300 sm:w-12"
                      style={{ backgroundColor: step > num ? '#00FFFF40' : 'rgba(255,255,255,0.08)' }}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content area */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 md:px-12">
        {/* Back button — hidden on success */}
        <AnimatePresence>
          {step > 1 && !isSuccess && (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              onClick={() => goTo(step - 1)}
              className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              aria-label="Go back to previous step"
            >
              <ChevronLeft size={15} />
              {step === 2 ? 'Change Service' : 'Change Schedule'}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          {isSuccess ? StepSuccess : stepContent[step - 1]}
        </AnimatePresence>
      </div>
    </main>
  );
}
