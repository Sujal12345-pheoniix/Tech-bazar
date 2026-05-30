"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signUpAction } from "@/actions/auth";
import { toast } from "sonner";
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[0-9]/, "One number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const password = watch("password", "");

  const passwordChecks = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "One uppercase", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const result = await signUpAction({ name: data.name, email: data.email, password: data.password });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.push("/auth/signin");
      }
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
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 linear-grid opacity-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

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
              background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 80%)`
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

          <h1 className="text-xl font-display font-black text-white mb-1.5 text-center uppercase tracking-wider">Create account</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Register your hardware node</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-20">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="signup-name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="First and last name"
                  {...register("name")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all text-sm",
                    errors.name ? "border-red-500/30" : "border-white/8"
                  )}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="signup-email">Email Interface</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-email"
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
              <label className="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="signup-password">Password Code</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3.5 bg-white/[0.02] border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all text-sm",
                    errors.password ? "border-red-500/30" : "border-white/8"
                  )}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer" id="signup-show-password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password checks */}
              {password && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 ml-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", check.valid ? "text-green-400" : "text-gray-500")}>
                      <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="signup-confirm-password">Confirm Password Code</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all text-sm",
                    errors.confirmPassword ? "border-red-500/30" : "border-white/8"
                  )}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 btn-premium-primary text-sm font-semibold disabled:opacity-60 mt-2 cursor-pointer active:scale-98"
              id="signup-submit-btn"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have a node?{" "}
            <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-semibold">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
