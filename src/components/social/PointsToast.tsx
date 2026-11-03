import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Gift } from 'lucide-react';

export const PointsToast: React.FC = () => {
  const { recentPointsAwarded, dismissPointsNotice, socialProfile } = useApp();

  useEffect(() => {
    if (!recentPointsAwarded) return;
    const timer = setTimeout(() => {
      dismissPointsNotice();
    }, 4000);
    return () => clearTimeout(timer);
  }, [recentPointsAwarded, dismissPointsNotice]);

  if (!recentPointsAwarded) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-[#131722] border border-amber-500/50 shadow-2xl shadow-amber-950/60 text-white max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-slate-950 font-extrabold shrink-0 shadow-md">
          <Gift className="w-5 h-5 text-slate-950 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-amber-400 text-sm font-mono">
              +{recentPointsAwarded.amount} FLUX Coins!
            </span>
            <span className="text-[10px] text-neutral-400">· Reward</span>
          </div>
          <p className="text-xs text-neutral-300 truncate">
            {recentPointsAwarded.reason}
          </p>
          <span className="text-[10px] text-amber-300/80 font-mono">
            Wallet Balance: {socialProfile.loyaltyPoints} Coins
          </span>
        </div>
        <button
          onClick={dismissPointsNotice}
          className="text-neutral-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
