"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      // Simulate API network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    formRef.current.style.setProperty("--mouse-x", `${x}px`);
    formRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 linear-grid opacity-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div
          ref={formRef}
          onMouseMove={handleMouseMove}
          className="glass-premium rounded-[32px] border border-white/5 p-5 sm:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.85)] cursor-spotlight-card relative overflow-hidden"
        >
          {/* Spotlight reflection */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 82, 255, 0.08), transparent 80%)`
            }}
          />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 justify-center group">
            <img 
              src="/icon.png" 
              alt="Tech-Baazar Logo" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display font-black text-xl tracking-tight text-white uppercase">TECH-BAAZAR</span>
          </Link>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="text-xl font-display font-black text-white mb-1.5 text-center uppercase tracking-wider">Reset Passkey</h1>
                <p className="text-gray-400 text-sm text-center mb-8">Enter email to recover access node</p>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="forgot-email">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/8 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || !email}
                    className="w-full flex items-center justify-center gap-2 py-4 btn-premium-primary text-sm font-semibold disabled:opacity-60 mt-2 cursor-pointer active:scale-98"
                    id="forgot-submit-btn"
                  >
                    {isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Request Reset Link <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,82,255,0.15)]">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-display font-black text-white mb-2 uppercase tracking-wider">Transmission Sent</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  We have dispatched a passkey recovery sequence to <br />
                  <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded mt-1 inline-block">{email}</span>. Check your inbox.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back button */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Access Panel
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
