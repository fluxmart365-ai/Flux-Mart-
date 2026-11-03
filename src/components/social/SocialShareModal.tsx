import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Gift
} from 'lucide-react';

export const SocialShareModal: React.FC = () => {
  const { activeShareModalItem, closeShareModal, socialProfile, addLoyaltyPoints, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [sharedRewardGranted, setSharedRewardGranted] = useState(false);

  if (!activeShareModalItem) return null;

  const currentUrl = window.location.origin + activeShareModalItem.url;
  const shareText = `Check out "${activeShareModalItem.title}" on FLUX MART (The Premium Global Marketplace)! Use my referral code ${socialProfile.referralCode} to get ৳250 discount: ${currentUrl}?ref=${socialProfile.referralCode}`;

  const triggerReward = (channel: string) => {
    if (!sharedRewardGranted) {
      addLoyaltyPoints(50, `Shared on ${channel}`);
      setSharedRewardGranted(true);
      setTimeout(() => setSharedRewardGranted(false), 3000);
    }
  };

  const handleShareFacebook = () => {
    triggerReward('Facebook');
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbShareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleShareMessenger = () => {
    triggerReward('Messenger');
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(currentUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(currentUrl)}`;
    window.open(messengerUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleShareWhatsApp = () => {
    triggerReward('WhatsApp');
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`${currentUrl}?ref=${socialProfile.referralCode}`);
    setCopied(true);
    triggerReward('Direct Link Copy');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center-safe justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={closeShareModal}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Share & Earn Rewards</h3>
            <span className="text-[11px] text-amber-400 font-medium">Earn +50 FLUX Coins for sharing</span>
          </div>
        </div>

        {/* Item Preview Strip */}
        <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 flex items-center gap-3 mb-5">
          {activeShareModalItem.image && (
            <img
              src={activeShareModalItem.image}
              alt={activeShareModalItem.title}
              className="w-12 h-12 object-cover rounded-xl border border-neutral-700/60 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              {activeShareModalItem.type.toUpperCase()}
            </span>
            <h4 className="text-xs font-semibold text-white truncate">
              {activeShareModalItem.title}
            </h4>
          </div>
        </div>

        {/* 1-Click Social Sharing Buttons (Facebook, Messenger, WhatsApp) */}
        <div className="space-y-2.5 mb-5">
          {/* Facebook Share */}
          <button
            onClick={handleShareFacebook}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Share to Facebook Feed</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">+50 pts</span>
          </button>

          {/* Messenger */}
          <button
            onClick={handleShareMessenger}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00B2FF] to-[#006AFF] hover:opacity-95 text-white font-semibold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.518 3.734 7.221V22l3.376-1.853c.92.255 1.89.394 2.89.394 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.055 12.443l-2.696-2.875-5.263 2.875 5.79-6.145 2.763 2.875 5.195-2.875-5.789 6.145z" />
              </svg>
              <span>Send via Facebook Messenger</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">+50 pts</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>Share to WhatsApp Contacts</span>
            </div>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-mono">+50 pts</span>
          </button>
        </div>

        {/* Referral Link & Code Box */}
        <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Your Referral Code:</span>
            <span className="font-mono font-bold text-amber-400 text-xs">
              {socialProfile.referralCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${currentUrl}?ref=${socialProfile.referralCode}`}
              className="flex-1 bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <span className="text-[10px] text-neutral-500 block">
            Friends get ৳250 off · You earn +500 points when they place their first order!
          </span>
        </div>

      </div>
    </div>
  );
};
