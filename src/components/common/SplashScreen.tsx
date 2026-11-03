import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_LOGO } from '../../data/mockData';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { showSplash, setShowSplash, language } = useApp();
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSplash) return;
    setFading(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 60);

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setShowSplash(false), 550);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [showSplash, setShowSplash]);

  const handleEnter = () => {
    setFading(true);
    setTimeout(() => setShowSplash(false), 350);
  };

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#0B0D13] text-white transition-opacity duration-600 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial gold glow with animated speed lines aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,175,55,0.18),transparent_75%)] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Bar Branding */}
      <div className="w-full flex items-center justify-between text-xs text-neutral-400 z-10 pt-4 max-w-md mx-auto">
        <span className="tracking-widest uppercase text-[#D4AF37] font-semibold text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Bangladesh Exclusive</span>
        </span>
        <span className="font-mono text-neutral-500 text-[11px]">FLUX MART v2.8</span>
      </div>

      {/* Center Cinematic Logo Showcase Sequence */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-sm px-4">
        
        {/* Speed-line Logo Badge with dynamic gold ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-600/30 rounded-3xl blur-2xl opacity-80 animate-pulse" />
          
          <div className="relative w-44 sm:w-52 h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-950/60 bg-[#0B0D13] p-1 flex items-center justify-center">
            <img
              src={OFFICIAL_LOGO}
              alt="FLUX MART Official Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">
          FLUX <span className="text-gold-gradient">MART</span>
        </h1>

        {/* Tagline */}
        <p className="text-amber-200 text-sm font-semibold tracking-wider uppercase mb-3">
          The Premium Global Marketplace
        </p>

        <p className="text-neutral-400 text-xs leading-relaxed max-w-xs mb-6">
          {language === 'bn'
            ? 'খাঁটি আভিজাত্য, বিকাশ ও নগদ অটো-পেমেন্ট এবং ৬৪ জেলায় পাঠাও এক্সপ্রেস ডেলিভারি।'
            : 'Nationwide curated luxury commerce. Direct bKash & Nagad gateway with Pathao 64-district express delivery.'}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-300 mb-6">
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
        </div>

        {/* Progress Bar & Skip */}
        <div className="w-full max-w-xs space-y-3">
          <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
            <div
              className="bg-gold-gradient h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={handleEnter}
            className="group flex items-center justify-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{language === 'bn' ? 'মার্কেটপ্লেসে প্রবেশ' : 'Enter Storefront'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-neutral-500 z-10 pb-3">
        © 2026 FLUX MART Bangladesh Ltd. All Rights Reserved.
      </div>
    </div>
  );
};
