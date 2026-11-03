import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppableShortVideoFeed } from './ShoppableShortVideoFeed';
import { SocialPostFeed } from './SocialPostFeed';
import { Product } from '../../types';
import { Film, Users, Sparkles, Gift } from 'lucide-react';

interface SocialCommerceHubProps {
  onInstantBuy: (product: Product, quantity: number) => void;
}

export const SocialCommerceHub: React.FC<SocialCommerceHubProps> = ({ onInstantBuy }) => {
  const { socialProfile, language } = useApp();
  const [subTab, setSubTab] = useState<'reels' | 'feed'>('reels');

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner with Gamified Points Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#181E2C] via-[#12151E] to-[#0B0D13] border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {language === 'bn' ? 'সোশ্যাল কমার্স ও শর্ট ভিডিও' : 'Social Commerce & Shoppable Reels'}
            </h2>
            <p className="text-xs text-neutral-400">
              Watch authentic unboxings, buy tagged items instantly, and earn FLUX Coins!
            </p>
          </div>
        </div>

        {/* Gamified Points summary pill */}
        <div className="flex items-center gap-2 bg-[#0B0D13] px-3.5 py-1.5 rounded-full border border-amber-500/30 text-xs">
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="text-neutral-300">Your Rewards:</span>
          <strong className="text-amber-400 font-mono font-bold">
            {socialProfile.loyaltyPoints} Coins
          </strong>
        </div>
      </div>

      {/* Segmented Switcher (Reels vs Community Feed) */}
      <div className="max-w-md mx-auto flex items-center p-1 bg-[#131722] border border-neutral-800 rounded-2xl">
        <button
          onClick={() => setSubTab('reels')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'reels'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Shoppable Short Reels</span>
        </button>

        <button
          onClick={() => setSubTab('feed')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'feed'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Community Looks Feed</span>
        </button>
      </div>

      {/* Tab View */}
      {subTab === 'reels' ? (
        <ShoppableShortVideoFeed onInstantBuy={onInstantBuy} />
      ) : (
        <SocialPostFeed onInstantBuy={onInstantBuy} />
      )}

    </div>
  );
};
