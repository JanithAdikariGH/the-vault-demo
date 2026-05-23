'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    id: 'executive-cut',
    title: 'The Executive Cut',
    description:
      'A precision cut engineered for the modern professional. Sharp lines, impeccable finish.',
    duration: '45 min',
    price: '$65',
    icon: '✦',
    accent: '#00FFFF',
  },
  {
    id: 'beard-sculpting',
    title: 'Beard Sculpting',
    description:
      'Expert shaping and detailing to define your beard with surgical precision.',
    duration: '30 min',
    price: '$45',
    icon: '◈',
    accent: '#39FF14',
  },
  {
    id: 'hot-towel-shave',
    title: 'Hot Towel Shave',
    description:
      'A classic ritual reimagined. Warm towels, premium lather, and a flawless finish.',
    duration: '60 min',
    price: '$80',
    icon: '◇',
    accent: '#FFD700',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-emerald-400/5 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16"
      >
        <span
          className="text-xl font-bold tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-space-grotesk)', color: '#00FFFF' }}
        >
          The Vault
        </span>
        <nav className="hidden gap-8 text-sm text-zinc-400 md:flex">
          <a href="#services" className="transition-colors hover:text-zinc-50">Services</a>
          <a href="#about" className="transition-colors hover:text-zinc-50">About</a>
          <a href="#contact" className="transition-colors hover:text-zinc-50">Contact</a>
        </nav>
        <Link href="/book">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="hidden cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-200 backdrop-blur-md transition-colors hover:bg-white/10 md:flex"
          >
            Book Now
          </motion.span>
        </Link>
      </motion.header>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pb-12 pt-20 text-center md:pt-28">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-zinc-400 uppercase backdrop-blur-sm"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: '#39FF14' }}
          />
          Arclix Labs · Vault Cyber Barber
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-6xl font-bold leading-[1.05] tracking-tight text-zinc-50 md:text-8xl"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Elevate&nbsp;
          <span
            className="relative"
            style={{
              background: 'linear-gradient(135deg, #00FFFF 0%, #39FF14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Style
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          Precision cuts and luxury grooming, meticulously crafted for those
          who demand nothing less than exceptional.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/book">
            <motion.span
              id="book"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #00FFFF, #39FF14)',
              }}
            >
              Book Appointment
              <span className="text-base">→</span>
            </motion.span>
          </Link>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            View Services
          </motion.a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-10 border-t border-white/5 pt-10 text-center"
        >
          {[
            { label: 'Happy Clients', value: '2,400+' },
            { label: 'Years Experience', value: '12+' },
            { label: 'Services', value: '15+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="text-3xl font-bold"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  background: 'linear-gradient(135deg, #fff 60%, #a1a1aa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs tracking-widest text-zinc-500 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── SERVICE GRID ─────────────────────────────────────── */}
      <section
        id="services"
        className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-16"
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">
            Our Craft
          </p>
          <h2
            className="text-4xl font-bold text-zinc-50 md:text-5xl"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Premium Services
          </h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-500">
            Every service is a ritual. Every visit, an experience.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-6 md:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              {/* Corner glow */}
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] rounded-tr-2xl opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: service.accent }}
              />

              {/* Icon */}
              <span
                className="mb-6 text-3xl"
                style={{ color: service.accent }}
                aria-hidden="true"
              >
                {service.icon}
              </span>

              {/* Content */}
              <h3
                className="mb-3 text-xl font-bold text-zinc-50"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {service.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-zinc-400">
                {service.description}
              </p>

              {/* Meta */}
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                <span className="text-xs text-zinc-500">{service.duration}</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: service.accent }}
                >
                  {service.price}
                </span>
              </div>

              {/* Book CTA */}
              <Link href="/book" className="mt-5 block">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:bg-white/10"
                  aria-label={`Book ${service.title}`}
                >
                  Book This Service
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} The Vault · Arclix Labs · All rights reserved.
      </footer>
    </main>
  );
}
