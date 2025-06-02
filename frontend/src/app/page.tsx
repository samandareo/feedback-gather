"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col overflow-hidden">
      {/* Animated background pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden fill="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e7ef" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <header className="w-full py-6 px-8 flex justify-between items-center bg-white/80 shadow-sm z-10 relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl font-bold text-blue-700 tracking-tight"
        >
          Customer Feedback System
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="space-x-4"
        >
          <Link href="/login" className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Log In</Link>
          <Link href="/signup" className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-medium hover:bg-blue-50 transition">Sign Up</Link>
        </motion.div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mt-8 mb-8">
          {/* Animated Hero Illustration */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.svg
              width="340"
              height="240"
              viewBox="0 0 340 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            >
              <defs>
                <radialGradient id="heroGradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#fff" />
                </radialGradient>
              </defs>
              <rect x="20" y="40" width="300" height="150" rx="28" fill="url(#heroGradient)" stroke="#2563eb" strokeWidth="2" />
              <motion.rect x="40" y="65" width="90" height="20" rx="6" fill="#dbeafe" animate={{ x: [40, 60, 40] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} />
              <rect x="40" y="100" width="60" height="16" rx="5" fill="#e0e7ff" />
              <rect x="40" y="130" width="100" height="16" rx="5" fill="#e0e7ff" />
              <motion.rect x="170" y="65" width="120" height="16" rx="5" fill="#f1f5f9" animate={{ width: [120, 80, 120] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} />
              <rect x="170" y="100" width="80" height="16" rx="5" fill="#f1f5f9" />
              <rect x="170" y="130" width="60" height="16" rx="5" fill="#f1f5f9" />
              <motion.circle cx="70" cy="180" r="10" fill="#2563eb" animate={{ cy: [180, 170, 180] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} />
              <rect x="90" y="174" width="60" height="12" rx="4" fill="#dbeafe" />
              <motion.circle cx="200" cy="180" r="10" fill="#22c55e" animate={{ cy: [180, 170, 180] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.5 }} />
              <rect x="220" y="174" width="60" height="12" rx="4" fill="#bbf7d0" />
            </motion.svg>
          </motion.div>
          {/* Hero Text */}
          <motion.div
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Collect, Analyze, and <span className="text-blue-600">Act</span> on Customer Feedback with GraphQL
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              A modern, minimalistic platform to create surveys, share them, and gain actionable insights—all powered by GraphQL.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              <Link href="/signup" className="px-8 py-3 rounded bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 shadow transition">Get Started Free</Link>
              <Link href="/login" className="px-8 py-3 rounded border border-blue-600 text-blue-700 font-semibold text-lg hover:bg-blue-50 transition">Log In</Link>
            </motion.div>
          </motion.div>
        </div>
        {/* Features Section */}
        <motion.div
          className="flex flex-wrap gap-6 justify-center mb-16 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="bg-white/90 rounded-xl shadow p-6 w-72 text-left border border-blue-50 hover:shadow-lg transition"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(37,99,235,0.10)" }}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span> Easy Survey Creation
            </h3>
            <p className="text-gray-500">Design custom surveys with multiple-choice and open-ended questions in minutes.</p>
          </motion.div>
          <motion.div
            className="bg-white/90 rounded-xl shadow p-6 w-72 text-left border border-blue-50 hover:shadow-lg transition"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(34,197,94,0.10)" }}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span> Share & Collect
            </h3>
            <p className="text-gray-500">Share surveys via unique links and collect feedback from your customers instantly.</p>
          </motion.div>
          <motion.div
            className="bg-white/90 rounded-xl shadow p-6 w-72 text-left border border-blue-50 hover:shadow-lg transition"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(251,191,36,0.10)" }}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span> Powerful Analytics
            </h3>
            <p className="text-gray-500">Visualize results with charts and gain actionable insights to grow your business.</p>
          </motion.div>
          <motion.div
            className="bg-white/90 rounded-xl shadow p-6 w-72 text-left border border-blue-50 hover:shadow-lg transition"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(139,92,246,0.10)" }}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span> GraphQL API
            </h3>
            <p className="text-gray-500">Efficiently query and manage your data with our powerful GraphQL API.</p>
          </motion.div>
        </motion.div>
      </main>
      <footer className="w-full py-6 text-center text-gray-400 text-sm bg-white/80 mt-8 z-10 relative">
        &copy; {new Date().getFullYear()} Customer Feedback System. All rights reserved.
      </footer>
    </div>
  );
}
