import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Film,
  Plus,
  MessageSquareText,
  User,
  Sparkles,
  Camera,
  Store,
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const LuxuryFloatingBottomNav: React.FC = () => {
  const {
    role,
    setRole,
    activeMainTab,
    setActiveMainTab,
    language,
    isLoggedIn,
    setOtpModalOpen,
    openLiveSupport,
    setIsSellerAdminMessengerOpen,
    socialProfile,
    unreadNotificationCount
  } = useApp();

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  // Unread badge for Messages / Inbox tab
  const messageUnreadCount = unreadNotificationCount > 0 ? unreadNotificationCount : 1;

  const handleTabClick = (tab: 'shop' | 'discover' | 'profile') => {
    if (role !== 'customer') {
      setRole('customer');
    }
    setActiveMainTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      if (role === 'seller') {
        setRole('seller');
      } else {
        setRole('customer');
        setActiveMainTab('profile');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setOtpModalOpen(true);
    }
  };

  const handleInboxClick = () => {
    if (role === 'seller') {
      setIsSellerAdminMessengerOpen(true);
    } else {
      openLiveSupport({
        initialMessage: 'Hello! I need assistance with orders, products, or merchant inquiry.'
      });
    }
  };

  const isShopActive = activeMainTab === 'shop' && role === 'customer';
  const isReelsActive = activeMainTab === 'discover' && role === 'customer';
  const isAccountActive = (activeMainTab === 'profile' && role === 'customer') || role === 'seller';

  return (
    <>
      {/* 1. Luxury Floating Bottom Navigation Bar */}
      <aside
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] z-40 bg-[#0B0D13]/90 backdrop-blur-2xl border border-amber-500/35 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] px-3 py-1.5 flex items-center justify-between select-none transition-all duration-300 ring-1 ring-amber-500/10"
      >
        {/* Subtle Ambient Gold Glow inside the bar */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />

        {/* Tab 1: [Shop] */}
        <button
          onClick={() => handleTabClick('shop')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 group cursor-pointer relative ${
            isShopActive ? 'scale-105' : 'hover:scale-102'
          }`}
          title="Marketplace Shop"
        >
          <div className="relative">
            <div
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isShopActive
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'text-neutral-400 group-hover:text-neutral-200'
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 transition-transform duration-300 ${
                  isShopActive ? 'stroke-[2.3] text-amber-400' : 'stroke-[1.8]'
                }`}
              />
            </div>
            {isShopActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 font-medium transition-colors duration-300 ${
              isShopActive ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-neutral-300'
            }`}
          >
            {language === 'bn' ? 'মার্কেট' : 'Shop'}
          </span>
        </button>

        {/* Tab 2: [Reels Feed] */}
        <button
          onClick={() => handleTabClick('discover')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 group cursor-pointer relative ${
            isReelsActive ? 'scale-105' : 'hover:scale-102'
          }`}
          title="Shoppable Short Reels"
        >
          <div className="relative">
            <div
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isReelsActive
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'text-neutral-400 group-hover:text-neutral-200'
              }`}
            >
              <Film
                className={`w-5 h-5 transition-transform duration-300 ${
                  isReelsActive ? 'stroke-[2.3] text-amber-400' : 'stroke-[1.8]'
                }`}
              />
            </div>
            {/* Live Indicator Pill */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />
            {isReelsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 font-medium transition-colors duration-300 ${
              isReelsActive ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-neutral-300'
            }`}
          >
            {language === 'bn' ? 'রিলস' : 'Reels'}
          </span>
        </button>

        {/* Tab 3: Center Highlight [ + Create / Post FAB ] */}
        <div className="flex-1 flex flex-col items-center justify-center relative -mt-5 z-20">
          <button
            onClick={() => setIsCreateSheetOpen(true)}
            className="group relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#B47B16] via-[#FBBF24] to-[#F59E0B] p-0.5 shadow-xl shadow-amber-500/35 hover:shadow-amber-500/60 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ring-4 ring-[#0B0D13]"
            title="Create: Upload Reel, Post Look, or List Product"
            aria-label="Create new post, reel, or listing"
          >
            {/* Outer Subtle Pulse */}
            <span className="absolute inset-0 rounded-full bg-amber-400 opacity-20 group-hover:animate-ping pointer-events-none" />

            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FBBF24] to-[#D49326] flex items-center justify-center text-slate-950 font-black">
              <Plus className="w-6 h-6 text-slate-950 stroke-[2.7] group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </button>
          <span className="text-[10px] tracking-tight text-amber-300 font-bold mt-0.5 leading-tight">
            {language === 'bn' ? 'তৈরি' : 'Create'}
          </span>
        </div>

        {/* Tab 4: [Messages / Inbox] */}
        <button
          onClick={handleInboxClick}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 group cursor-pointer relative hover:scale-102"
          title="Direct Encrypted Support Desk & Messages"
        >
          <div className="relative">
            <div className="p-1.5 rounded-xl text-neutral-400 group-hover:text-amber-300 transition-all duration-300">
              <MessageSquareText className="w-5 h-5 stroke-[1.8] group-hover:text-amber-400 transition-colors" />
            </div>
            {/* Unread Counter Badge */}
            {messageUnreadCount > 0 && (
              <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-mono font-extrabold flex items-center justify-center shadow-md shadow-amber-950">
                {messageUnreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
            {language === 'bn' ? 'ইনবক্স' : 'Inbox'}
          </span>
        </button>

        {/* Tab 5: [My Account / Merchant Dashboard] */}
        <button
          onClick={handleAccountClick}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 group cursor-pointer relative ${
            isAccountActive ? 'scale-105' : 'hover:scale-102'
          }`}
          title="Account Profile & Settings"
        >
          <div className="relative">
            <div
              className={`p-1 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isAccountActive
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20 ring-1 ring-amber-400/50'
                  : 'text-neutral-400 group-hover:text-neutral-200'
              }`}
            >
              {isLoggedIn && socialProfile.profilePhoto ? (
                <img
                  src={socialProfile.profilePhoto}
                  alt={socialProfile.name}
                  className={`w-6 h-6 rounded-full object-cover border transition-all ${
                    isAccountActive ? 'border-amber-400 ring-1 ring-amber-400/60' : 'border-neutral-700'
                  }`}
                />
              ) : (
                <User
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isAccountActive ? 'stroke-[2.3] text-amber-400' : 'stroke-[1.8]'
                  }`}
                />
              )}
            </div>
            {isAccountActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 font-medium transition-colors duration-300 ${
              isAccountActive ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-neutral-300'
            }`}
          >
            {role === 'seller'
              ? language === 'bn'
                ? 'মার্চেন্ট'
                : 'Merchant'
              : language === 'bn'
              ? 'অ্যাকাউন্ট'
              : 'Account'}
          </span>
        </button>
      </aside>

      {/* 2. Luxury Center Quick-Action Creator Sheet */}
      {isCreateSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#131722] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white space-y-4 my-auto overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-tight">
                    {language === 'bn' ? 'ক্রিয়েটর ও মার্চেন্ট হাব' : 'Creator & Merchant Studio'}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {language === 'bn' ? 'কী শেয়ার বা আপলোড করতে চান?' : 'What would you like to create?'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Shoppable Short Reel */}
              <button
                onClick={() => {
                  setIsCreateSheetOpen(false);
                  if (role !== 'customer') setRole('customer');
                  setActiveMainTab('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full p-3.5 rounded-2xl bg-[#0B0D13] hover:bg-[#0E121B] border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? 'শর্ট রিলস আপলোড' : 'Upload Shoppable Reel'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'bn'
                        ? 'আনবক্সিং ভিডিও শেয়ার করুন ও +১০০ কয়েন পান'
                        : 'Share 9:16 video & earn +100 FLUX Coins'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 2: Community Look Post */}
              <button
                onClick={() => {
                  setIsCreateSheetOpen(false);
                  if (role !== 'customer') setRole('customer');
                  setActiveMainTab('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full p-3.5 rounded-2xl bg-[#0B0D13] hover:bg-[#0E121B] border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? 'কমিউনিটি লুক পোস্ট' : 'Create Community Look Post'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'bn'
                        ? 'ফটো আপলোড ও @ট্যাগিং করে পোস্ট করুন'
                        : 'Outfit photos with social @mentions'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 3: Merchant Catalog Listing */}
              <button
                onClick={() => {
                  setIsCreateSheetOpen(false);
                  setRole('seller');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0B0D13] to-[#0B0D13] hover:bg-[#0E121B] border border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-gradient text-slate-950 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-md">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">
                      {language === 'bn' ? 'মার্চেন্ট প্রোডাক্ট লিস্টিং' : 'List Product (Seller Central)'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'bn'
                        ? 'ফ্লাক্স মার্ট স্মার্ট ক্যাটালগ বিল্ডার খুলুন'
                        : 'FLUX MART Smart Catalog Builder'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
