import React from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_LOGO } from '../../data/mockData';
import { ShoppingBag, Globe, User, Shield, Smartphone, Monitor, Truck, HelpCircle, Package, Sparkles, Headphones, Bell, Users } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenDashboard }) => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    handleLogoClick,
    setSecretPinModalOpen,
    cart,
    isLoggedIn,
    setOtpModalOpen,
    viewMode,
    setViewMode,
    activeMainTab,
    setActiveMainTab,
    openLiveSupport,
    unreadNotificationCount,
    setIsNotificationCenterOpen,
    customerName,
    accounts,
    currentAccountId,
    setIsAccountSwitcherOpen,
    logoutCustomer
  } = useApp();

  const currentAcc = accounts.find((a) => a.id === currentAccountId);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="@container sticky top-0 z-40 bg-[#0B0D13]/95 backdrop-blur-md border-b border-neutral-800 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-2.5 @xs:px-3 @lg:px-4 @2xl:px-6 h-14 @lg:h-16 flex items-center justify-between gap-2 @lg:gap-4">
        
        {/* Zone 1: Single brand wordmark element with Logo */}
        <div className="flex items-center min-w-0 shrink">
          <button
            onClick={handleLogoClick}
            title="FLUX MART - Tap 5 times for Secret Admin Console"
            className="flex items-center gap-1.5 @lg:gap-2.5 min-w-0 focus:outline-none group text-left cursor-pointer select-none"
          >
            <div className="relative w-8 h-8 @lg:w-9 @lg:h-9 shrink-0 rounded-lg overflow-hidden border border-amber-500/40 group-hover:border-amber-400 transition-colors shadow-sm shadow-amber-500/20">
              <img
                src={OFFICIAL_LOGO}
                alt="FLUX MART"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden @md:flex flex-col min-w-0">
              <span className="text-sm @lg:text-base font-extrabold tracking-tight text-white whitespace-nowrap leading-none">
                FLUX <span className="text-gold-gradient">MART</span>
              </span>
              <span className="hidden @3xl:block @5xl:hidden text-[10px] text-amber-200/80 font-medium tracking-wider whitespace-nowrap leading-tight mt-0.5">
                The Premium Global Marketplace
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean Customer-Focused Navigation Links (Strictly no seller links) */}
        <nav className="hidden @5xl:flex items-center gap-4 @6xl:gap-6 text-xs font-medium text-neutral-300">
          <button
            onClick={() => {
              setRole('customer');
              setActiveMainTab('shop');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              role === 'customer' && activeMainTab === 'shop' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-white'
            }`}
          >
            {language === 'bn' ? 'মার্কেটপ্লেস কালেকশন' : 'Collections'}
          </button>

          <button
            onClick={() => {
              setRole('customer');
              setActiveMainTab('discover');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              role === 'customer' && activeMainTab === 'discover' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'শর্ট ভিডিও ও রিলস' : 'Shoppable Reels'}</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1 rounded">HOT</span>
          </button>

          <button
            onClick={onOpenDashboard}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Orders'}</span>
          </button>

          <button
            onClick={() => openLiveSupport()}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-amber-300 flex items-center gap-1.5 cursor-pointer py-1 text-amber-400/90 font-medium"
            title="24/7 Live Desk & WhatsApp Help"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? '২৪/৭ লাইভ সাপোর্ট' : 'Live Support'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Language, Viewport switcher, Auth/Account, Cart) */}
        <div className="flex items-center gap-1 @xs:gap-1.5 @lg:gap-2 @2xl:gap-3 @5xl:gap-2 @6xl:gap-3 shrink-0">
          {/* Secret Admin status if active */}
          {role === 'admin' && (
            <span className="p-1.5 @2xl:px-2.5 @2xl:py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1" title="Admin Mode">
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden @2xl:inline">Admin Mode</span>
            </span>
          )}

          {/* Language Toggle (Bangla / English) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="h-8 @lg:h-9 px-1.5 @md:px-2.5 rounded-lg text-[11px] @lg:text-xs font-semibold bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 text-neutral-300 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            title="Toggle Bangla / English"
          >
            <Globe className="hidden @lg:block w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Mobile Shell Switcher */}
          <button
            onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
            className="hidden @3xl:flex items-center gap-1 h-9 px-2.5 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title={`Switch to ${viewMode === 'desktop' ? 'Mobile App View' : 'Desktop View'}`}
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden @4xl:inline @5xl:hidden">Mobile View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden @4xl:inline @5xl:hidden">Desktop</span>
              </>
            )}
          </button>

          {/* Smart Notification Center Icon with Badge */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative w-8 h-8 @lg:w-9 @lg:h-9 flex items-center justify-center shrink-0 rounded-lg @lg:rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-500/40 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Smart Notifications (Flash drops, Price alerts, Order Memos)"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-mono font-extrabold flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Customer Profile & Multi-Account Switcher */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  if (role === 'seller') {
                    setRole('seller');
                  } else {
                    setRole('customer');
                    setActiveMainTab('profile');
                  }
                }}
                className="h-8 @lg:h-9 min-w-8 @lg:min-w-9 px-1.5 @2xl:px-3 rounded-lg @lg:rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-amber-500/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium"
                title={`${customerName} (${role === 'seller' ? 'Merchant' : 'Customer'})`}
              >
                {currentAcc?.avatar ? (
                  <img
                    src={currentAcc.avatar}
                    alt={customerName}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-400" />
                )}
                <span className="hidden @2xl:inline font-semibold text-white max-w-[90px] truncate">
                  {customerName.split(' ')[0]}
                </span>
                {role === 'seller' && (
                  <span className="hidden @4xl:inline px-1 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono font-bold">
                    STORE
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsAccountSwitcherOpen(true)}
                className="w-8 h-8 @lg:w-9 @lg:h-9 flex items-center justify-center shrink-0 rounded-lg @lg:rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
                title="Switch Account / Add Profile / Log Out"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setOtpModalOpen(true)}
              className="h-8 @lg:h-9 min-w-8 px-1.5 @xs:px-2.5 @lg:px-3 rounded-lg @lg:rounded-xl bg-neutral-900 border border-amber-500/50 hover:bg-neutral-800 text-amber-300 font-bold text-[11px] @lg:text-xs flex items-center justify-center gap-1 @lg:gap-1.5 cursor-pointer transition-all shadow-sm shadow-amber-500/10 shrink-0 whitespace-nowrap"
              title="Sign In or Register"
              aria-label={language === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register'}
            >
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden @xs:inline @3xl:hidden @5xl:inline @6xl:hidden">{language === 'bn' ? 'সাইন ইন' : 'Sign In'}</span>
              <span className="hidden @3xl:inline @5xl:hidden @6xl:inline">{language === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register'}</span>
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="relative h-8 @lg:h-9 px-2 @sm:px-3 @2xl:px-4 rounded-lg @lg:rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span className="hidden @2xl:inline @5xl:hidden @6xl:inline">{language === 'bn' ? 'ব্যাগ' : 'Bag'}</span>
            {totalCartCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
