import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/common/SplashScreen';
import { Header } from './components/common/Header';
import { SecretPinModal } from './components/common/SecretPinModal';
import { CustomerLoginModal } from './components/customer/CustomerLoginModal';
import { SubAdminStaffLoginModal } from './components/admin/SubAdminStaffLoginModal';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { SocialCommerceHub } from './components/social/SocialCommerceHub';
import { FacebookStyleProfile } from './components/customer/FacebookStyleProfile';
import { SocialShareModal } from './components/social/SocialShareModal';
import { PointsToast } from './components/social/PointsToast';
import { SecretAdminPortal } from './components/admin/SecretAdminPortal';
import { SubAdminPortal } from './components/admin/SubAdminPortal';
import { SellerPortal } from './components/seller/SellerPortal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { LiveSupportModal } from './components/common/LiveSupportModal';
import { NotificationCenterModal } from './components/common/NotificationCenterModal';
import { DigitalInvoiceMemoModal } from './components/common/DigitalInvoiceMemoModal';
import { AccountSwitcherModal } from './components/common/AccountSwitcherModal';
import { LuxuryFloatingBottomNav } from './components/common/LuxuryFloatingBottomNav';
import { SellerPublicProfileModal } from './components/seller/SellerPublicProfileModal';
import { LegalComplianceModal } from './components/common/LegalComplianceModal';
import { SmsGatewayViewerModal } from './components/common/SmsGatewayViewerModal';
import { Product, Order } from './types';
import {
  ShoppingBag,
  Package,
  User,
  Shield,
  Smartphone,
  ArrowLeft,
  Film,
  Sparkles,
  Store,
  Lock
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    role,
    setRole,
    viewMode,
    setViewMode,
    language,
    cart,
    addToCart,
    activeMainTab,
    setActiveMainTab,
    isLoggedIn,
    isSellerPublicProfileOpen,
    selectedSellerProfile,
    closeSellerPublicProfile,
    activeSubAdminTeam,
    openLegalModal,
    setIsSmsViewerOpen,
    openDigitalInvoice
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Auto-detect isolated sub-admin staff routing param (?portal=staff or ?portal=subadmin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'staff' || params.get('portal') === 'subadmin' || params.get('admin') === 'staff') {
      setIsStaffLoginOpen(true);
    }
  }, []);

  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleInstantBuy = (product: Product, quantity: number, variant?: string) => {
    addToCart(product, quantity, variant);
    setIsCartOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setLastCompletedOrder(order);
    openDigitalInvoice(order);
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-[#F3F4F6] flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      <SplashScreen />
      <SecretPinModal />
      <CustomerLoginModal />
      <SubAdminStaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
      />
      <SocialShareModal />
      <PointsToast />
      <LiveSupportModal />
      <NotificationCenterModal />
      <DigitalInvoiceMemoModal />
      <AccountSwitcherModal />
      <LegalComplianceModal />
      <SmsGatewayViewerModal />
      <SellerPublicProfileModal
        isOpen={isSellerPublicProfileOpen}
        onClose={closeSellerPublicProfile}
        seller={selectedSellerProfile}
      />

      {/* Wrapper depending on viewMode (Desktop Full Width vs Mobile App Shell) */}
      <div className={`w-full flex-1 flex flex-col ${viewMode === 'mobile' ? 'items-center py-4 sm:py-8 bg-[#07090D]' : ''}`}>
        
        {/* If Mobile Shell Mode active on larger screens */}
        {viewMode === 'mobile' && (
          <div className="mb-3 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Mobile App View (390px Viewport)</span>
            <button
              onClick={() => setViewMode('desktop')}
              className="text-amber-400 font-semibold underline hover:text-white cursor-pointer ml-1"
            >
              Exit to Desktop
            </button>
          </div>
        )}

        <div
          className={`w-full flex-1 flex flex-col ${
            viewMode === 'mobile'
              ? 'max-w-[420px] min-h-[844px] bg-[#0B0D13] rounded-3xl border-4 border-neutral-800 shadow-2xl overflow-hidden relative'
              : 'max-w-7xl mx-auto'
          }`}
        >
          {/* Top Header (Clean customer top bar) */}
          <Header
            onOpenCart={() => setIsCartOpen(true)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
          />

          {/* Discreet Admin Mode Alert Banner if admin mode unlocked */}
          {role === 'admin' && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Secret Admin Console Active (Confidential)</span>
              </span>
              <button
                onClick={() => setRole('customer')}
                className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:brightness-105 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Store</span>
              </button>
            </div>
          )}

          {/* Sub-Admin Sentinel Mode Alert Banner */}
          {role === 'subadmin' && (
            <div className="bg-sky-500/15 border-b border-sky-500/30 px-4 py-2 flex items-center justify-between text-xs text-sky-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-4 h-4 text-sky-400" />
                <span>
                  Sub-Admin Sentinel Squad Active ({activeSubAdminTeam ? activeSubAdminTeam.toUpperCase().replace(/_/g, ' ') : 'OPERATIONS'})
                </span>
              </span>
              <button
                onClick={() => setRole('customer')}
                className="px-3 py-1 rounded bg-sky-500 text-slate-950 font-bold hover:brightness-105 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Console</span>
              </button>
            </div>
          )}

          {/* Merchant Mode Alert Banner if seller role is active */}
          {role === 'seller' && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Merchant & Seller Portal Active (Digital Wallet & Catalog)</span>
              </span>
              <button
                onClick={() => setRole('customer')}
                className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:brightness-105 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch to Customer Store</span>
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 px-4 sm:px-6 py-6 pb-28 sm:pb-32">
            {role === 'admin' ? (
              <SecretAdminPortal />
            ) : role === 'subadmin' ? (
              <SubAdminPortal />
            ) : role === 'seller' ? (
              <SellerPortal />
            ) : activeMainTab === 'discover' ? (
              <SocialCommerceHub onInstantBuy={handleInstantBuy} />
            ) : activeMainTab === 'profile' ? (
              <FacebookStyleProfile />
            ) : (
              <CustomerPortal
                onOpenCart={() => setIsCartOpen(true)}
                onInstantBuy={handleInstantBuy}
              />
            )}
          </main>

          {/* Luxury Floating Bottom Navigation Bar (5-Tab Layout with Center FAB) */}
          <LuxuryFloatingBottomNav />

          {/* Quiet Footer with Legal, DBID, and Telecom Gateway triggers */}
          <footer className="mt-auto border-t border-neutral-900 bg-[#07090D] py-6 px-4 sm:px-6 text-xs text-neutral-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white tracking-tight">FLUX MART</span>
                <span>·</span>
                <span>The Premium Global Marketplace</span>
                <span>·</span>
                <span className="text-amber-400/80">Social Commerce & Shoppable Reels</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => openLegalModal('dbid')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
                >
                  DBID-892401
                </button>
                <span>·</span>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
                >
                  Terms & 7-Day Escrow
                </button>
                <span>·</span>
                <button
                  onClick={() => openLegalModal('dgda')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
                >
                  DGDA Compliance
                </button>
                <span>·</span>
                <button
                  onClick={() => setIsSmsViewerOpen(true)}
                  className="text-amber-400/90 hover:text-amber-300 font-mono transition-colors cursor-pointer text-[11px] flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3 text-amber-400" />
                  <span>SMS Gateway</span>
                </button>
                <span>·</span>
                <button
                  onClick={() => setIsStaffLoginOpen(true)}
                  className="text-neutral-500 hover:text-sky-400 font-mono transition-colors cursor-pointer text-[11px] flex items-center gap-1"
                  title="Staff Authentication Gateway (Restricted to Operations Personnel)"
                >
                  <Lock className="w-3 h-3 text-sky-400" />
                  <span>Staff Gateway</span>
                </button>
                <span>·</span>
                <button
                  onClick={() => {
                    setRole('seller');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/30 text-xs ml-1"
                  title="Launch FLUX MART Seller Portal"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Seller Central</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Cart Drawer & Checkout with 64 Districts selector */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Customer Dashboard Modal with Orders & Nationwide Address Book */}
      <CustomerDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
