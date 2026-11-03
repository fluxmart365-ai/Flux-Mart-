import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { OFFICIAL_LOGO } from '../../data/mockData';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

interface SplashScreenProps {
  /** How long the splash stays on screen before it starts to fade out (ms). */
  duration?: number;
  /** Called once when the splash should close (timer elapsed or user skipped). */
  onFinish: () => void;
  language?: 'en' | 'bn' | string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const SplashScreen: React.FC<SplashScreenProps> = ({ duration = 2500, onFinish, language = 'en' }) => {
  const reduceMotion = useReducedMotion();
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinishRef.current();
  };

  useEffect(() => {
    const timer = window.setTimeout(finish, duration);
    // Lock page scroll while the splash covers the screen
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  });

  const slogan = 'The Premium Global Marketplace';

  return (
    <motion.div
      key="flux-splash"
      role="dialog"
      aria-label="FLUX MART"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.04, filter: reduceMotion ? 'none' : 'blur(6px)' }}
      transition={{ duration: 0.6, ease }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 bg-[#0B0D13] text-white overflow-hidden"
    >
      {/* Background radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,175,55,0.18),transparent_75%)] pointer-events-none" />
      <motion.div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease }}
      />

      {/* Top Bar Branding */}
      <motion.div
        {...rise(0.05)}
        className="w-full flex items-center justify-between text-xs text-neutral-400 z-10 pt-4 max-w-md mx-auto"
      >
        <span className="tracking-widest uppercase text-[#D4AF37] font-semibold text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Bangladesh Exclusive</span>
        </span>
        <span className="font-mono text-neutral-500 text-[11px]">FLUX MART v2.8</span>
      </motion.div>

      {/* Center Logo Showcase */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-sm px-4">
        {/* Logo badge with gold aura and shine sweep */}
        <motion.div
          className="relative mb-6"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <motion.div
            className="absolute -inset-6 bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-600/30 rounded-3xl blur-2xl"
            animate={reduceMotion ? undefined : { opacity: [0.5, 0.95, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative w-40 sm:w-48 h-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-950/60 bg-[#0B0D13] p-1 flex items-center justify-center">
            <img
              src={OFFICIAL_LOGO}
              alt="FLUX MART Official Logo"
              className="w-full h-full object-cover rounded-xl"
            />
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] pointer-events-none"
                initial={{ x: '0%' }}
                animate={{ x: '400%' }}
                transition={{ duration: 1.1, delay: 0.7, ease: 'easeInOut' }}
              />
            )}
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          {...rise(0.35)}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5"
        >
          FLUX <span className="text-gold-gradient">MART</span>
        </motion.h1>

        {/* Slogan — letter-by-letter reveal */}
        <motion.p
          className="text-amber-200 text-sm font-semibold tracking-wider uppercase mb-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduceMotion ? 0 : 0.022, delayChildren: 0.55 } },
          }}
          aria-label={slogan}
        >
          {slogan.split('').map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 6 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.p>

        {/* Gold divider */}
        <motion.div
          className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-3"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0, ease }}
        />

        <motion.p {...rise(1.05)} className="text-neutral-400 text-xs leading-relaxed max-w-xs mb-5">
          {language === 'bn'
            ? 'খাঁটি আভিজাত্য, বিকাশ ও নগদ অটো-পেমেন্ট এবং ৬৪ জেলায় পাঠাও এক্সপ্রেস ডেলিভারি।'
            : 'Nationwide curated luxury commerce. Direct bKash & Nagad gateway with Pathao 64-district express delivery.'}
        </motion.p>

        {/* Feature Badges */}
        <motion.div
          {...rise(1.2)}
          className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-300 mb-6"
        >
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Direct MFS Gateway</span>
          </span>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3 text-red-400" />
            <span>Pathao 64 Districts</span>
          </span>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Smart NID Verified</span>
          </span>
        </motion.div>

        {/* Progress bar (tracks the splash duration) & skip */}
        <motion.div {...rise(1.3)} className="w-full max-w-xs space-y-3">
          <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
            <motion.div
              className="bg-gold-gradient h-full rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>

          <button
            onClick={finish}
            className="group flex items-center justify-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{language === 'bn' ? 'মার্কেটপ্লেসে প্রবেশ' : 'Enter Storefront'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Footer copyright */}
      <motion.div {...rise(1.4)} className="text-center text-[10px] text-neutral-500 z-10 pb-3">
        © 2026 FLUX MART Bangladesh Ltd. All Rights Reserved.
      </motion.div>
    </motion.div>
  );
};
