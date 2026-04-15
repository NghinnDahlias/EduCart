"use client";

import { motion } from "framer-motion";
import { ArrowRight, Coins, GraduationCap, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: Coins,
    title: "Save more each semester",
    text: "Buy pre-loved books, borrow tools, and avoid overpriced campus stores.",
  },
  {
    icon: GraduationCap,
    title: "Share knowledge at scale",
    text: "Turn old notes, exam sets, and e-books into value for the next generation.",
  },
  {
    icon: ShieldCheck,
    title: "Student-first trust",
    text: "Campus-oriented trading and verified university communities.",
  },
];

export default function LandingPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(11,122,117,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(211,161,42,0.25),transparent_35%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <p className="mb-3 inline-flex w-fit rounded-full bg-ocean-500/10 px-4 py-1 text-sm font-semibold text-ocean-700">
            C2C Marketplace for Students
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            EduCart helps students
            <span className="text-ocean-700"> save money </span>
            and
            <span className="text-gold-400"> share knowledge</span>.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
            One place to buy, rent, and exchange study essentials across your university ecosystem.
            From lab coats to old exams, keep resources circulating and costs under control.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.12 }}
                className="glass-card rounded-2xl p-4"
              >
                <item.icon className="mb-2 h-5 w-5 text-ocean-700" />
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-700">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <div className="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-700">Sign in or create your student account</p>

            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
                  University email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@university.edu.vn"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-ocean-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-ocean-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean-500"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-700">
              New here? <a href="#" className="font-semibold text-ocean-700">Create account</a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
