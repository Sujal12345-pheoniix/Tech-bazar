"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { signInWithCredentials, signInWithGoogle, signInWithGitHub } from "@/actions/auth";
import { toast } from "sonner";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const result = await signInWithCredentials(data);
      if (result?.error) toast.error(result.error);
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
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div
          ref={formRef}
          onMouseMove={handleMouseMove}
          className="glass-premium rounded-[32px] border border-white/5 p-8 sm:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.85)] cursor-spotlight-card relative overflow-hidden"
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

          <h1 className="text-xl font-display font-black text-white mb-1.5 text-center uppercase tracking-wider">Welcome back</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Sign in to your control panel</p>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6 relative z-20">
            <form action={signInWithGoogle}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.02] border border-white/8 hover:border-white/15 hover:bg-white/[0.05] rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all cursor-pointer" id="signin-google-btn">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#ea4335" d="M12 5.04c1.67 0 3.12.57 4.3 1.7l3.22-3.22C17.58 1.63 15.01.5 12 .5 7.42.5 3.52 3.12 1.58 6.97l3.85 2.99C6.37 7.07 8.98 5.04 12 5.04z"/>
                  <path fill="#4285f4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.58z"/>
                  <path fill="#fbbc05" d="M5.43 14.04c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.58 6.53C.57 8.56 0 10.82 0 13.18s.57 4.62 1.58 6.65l3.85-2.99c-.24-.71-.38-1.47-.38-2.26l.38-5.53z"/>
                  <path fill="#34a853" d="M12 21.32c2.97 0 5.46-.98 7.28-2.67l-3.69-2.87c-1 .67-2.28 1.07-3.59 1.07-3.02 0-5.63-2.03-6.57-4.92H1.58v2.99c1.94 3.85 5.84 6.4 10.42 6.4z"/>
                </svg>
                Google
              </button>
            </form>
            <form action={signInWithGitHub}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.02] border border-white/8 hover:border-white/15 hover:bg-white/[0.05] rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all cursor-pointer" id="signin-github-btn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">or email interface</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-20">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="signin-email">Email Interface</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signin-email"
                  type="email"
                  placeholder="name@domain.com"
                  {...register("email")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all text-sm",
                    errors.email ? "border-red-500/30" : "border-white/8"
                  )}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider" htmlFor="signin-password">Password Code</label>
                <Link href="/auth/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">Forgot Key?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3.5 bg-white/[0.02] border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all text-sm",
                    errors.password ? "border-red-500/30" : "border-white/8"
                  )}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer" id="signin-show-password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 btn-premium-primary text-sm font-semibold disabled:opacity-60 mt-2 cursor-pointer active:scale-98"
              id="signin-submit-btn"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            New to Tech-Baazar?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold">Register Node</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
