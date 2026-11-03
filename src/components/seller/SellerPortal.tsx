import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KycDocument, ProductCategory, Product, WithdrawalRequest, Order } from '../../types';
import { SellerRegistrationKYCModal } from './SellerRegistrationKYCModal';
import { SmartProductUploadModal } from './SmartProductUploadModal';
import { SellerAdminMessengerModal } from './SellerAdminMessengerModal';
import {
  Store,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Plus,
  Package,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  DollarSign,
  HelpCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Truck,
  Check,
  Eye,
  MessageSquare,
  Lock,
  Percent,
  Search,
  ExternalLink,
  Shield,
  CreditCard,
  Building2,
  Smartphone,
  PhoneCall,
  BadgeCheck,
  Camera,
  Edit3,
  Share2,
  Copy,
  Users
} from 'lucide-react';

export const SellerPortal: React.FC = () => {
  const {
    sellerProfile,
    updateSellerProfile,
    updateSellerKyc,
    simulateKycStatusChange,
    requestSellerWithdrawal,
    withdrawalRequests,
    addProduct,
    products,
    categoryCommissions,
    language,
    orders,
    updateOrderStatus,
    openDigitalInvoice,
    openSellerPublicProfile,
    setRole,
    setActiveMainTab,
    isSellerAdminMessengerOpen,
    setIsSellerAdminMessengerOpen,
    accounts,
    setIsAccountSwitcherOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'catalog' | 'kyc' | 'profile'>('dashboard');

  // Modals state
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isProductUploadOpen, setIsProductUploadOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Store Profile Customization Form
  const [editShopName, setEditShopName] = useState(sellerProfile.shopName);
  const [editOwnerName, setEditOwnerName] = useState(sellerProfile.ownerName);
  const [editBio, setEditBio] = useState(
    sellerProfile.bio ||
      'Premier verified tech gear, smart audio & luxury artisanal apparel with official brand warranty in Bangladesh.'
  );
  const [editAvatar, setEditAvatar] = useState(
    sellerProfile.avatar ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const [editCoverImage, setEditCoverImage] = useState(
    sellerProfile.coverImage ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );
  const [editWarehouse, setEditWarehouse] = useState(
    sellerProfile.warehouseLocation || 'Tejgaon Industrial Area, Dhaka'
  );
  const [editSuccess, setEditSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  const merchantUniqueId = sellerProfile.merchantUniqueId || 'FLUX-MART-542';

  const handleCopyMerchantId = () => {
    navigator.clipboard?.writeText(merchantUniqueId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile({
      shopName: editShopName,
      ownerName: editOwnerName,
      bio: editBio,
      avatar: editAvatar,
      coverImage: editCoverImage,
      warehouseLocation: editWarehouse
    });
    setEditSuccess('Store profile successfully customized & synchronized with public store!');
    setTimeout(() => {
      setEditSuccess('');
      setIsEditProfileOpen(false);
    }, 1500);
  };

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState('15000');
  const [payoutMethod, setPayoutMethod] = useState<WithdrawalRequest['payoutMethod']>('bkash_merchant');
  const [accountDetails, setAccountDetails] = useState(
    sellerProfile.payoutAccountDetails || '01712-345678 (bKash Merchant Account)'
  );
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  // Seller's specific items
  const myProducts = products.filter(
    (p) => p.sellerId === sellerProfile.id || p.sellerName === sellerProfile.shopName
  );

  // Seller's orders
  const myOrders = orders.filter((o) =>
    o.items.some(
      (item) => item.product.sellerId === sellerProfile.id || item.product.sellerName === sellerProfile.shopName
    )
  );

  // Metrics calculations
  const pendingOrdersCount = myOrders.filter((o) => o.orderStatus === 'to_ship' || o.orderStatus === 'to_pay').length;
  const shippedOrdersCount = myOrders.filter((o) => o.orderStatus === 'to_receive' || o.orderStatus === 'completed').length;
  const totalSalesRevenue = sellerProfile.totalEarnings || 218000;
  const productViews = sellerProfile.productViewsCount || 14820;

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawMsg('Please enter a valid withdrawal amount.');
      return;
    }
    const success = requestSellerWithdrawal(amt, payoutMethod, accountDetails);
    if (!success) {
      setWithdrawMsg('Insufficient available wallet balance.');
    } else {
      setWithdrawMsg('');
      setWithdrawSuccess(`Payout request for ৳${amt.toLocaleString()} submitted successfully!`);
      setTimeout(() => {
        setWithdrawSuccess('');
        setIsWithdrawOpen(false);
      }, 1800);
    }
  };

  const handleDispatchOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'to_receive');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Modals */}
      <SellerRegistrationKYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
      />
      <SmartProductUploadModal
        isOpen={isProductUploadOpen}
        onClose={() => setIsProductUploadOpen(false)}
      />
      <SellerAdminMessengerModal />

      {/* 1. FLUX MART Seller Hub Brand & Verification Header */}
      <div className="p-6 rounded-3xl bg-[#131722] border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-2xl shadow-lg shrink-0 group">
            {sellerProfile.avatar ? (
              <img
                src={sellerProfile.avatar}
                alt={sellerProfile.shopName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="w-8 h-8" />
            )}
            {sellerProfile.kycStatus === 'verified' && (
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md border border-[#131722]">
                <BadgeCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {sellerProfile.shopName}
              </h1>

              {sellerProfile.kycStatus === 'verified' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{merchantUniqueId} ✓ Verified Merchant</span>
                </span>
              ) : sellerProfile.kycStatus === 'pending' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>ID: {merchantUniqueId} · KYC In Review</span>
                </span>
              ) : (
                <button
                  onClick={() => setIsKYCModalOpen(true)}
                  className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-rose-500/30"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>KYC Gate Action Required</span>
                </button>
              )}

              <button
                onClick={handleCopyMerchantId}
                className="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Click to copy Assigned Merchant Unique ID"
              >
                <span>ID: {merchantUniqueId}</span>
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <p className="text-xs text-neutral-400 mt-1">
              Owner: <strong className="text-white">{sellerProfile.ownerName}</strong> · Hub: {sellerProfile.warehouseLocation} · {sellerProfile.businessCategory}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          {/* Public Store Preview */}
          <button
            onClick={() => openSellerPublicProfile(sellerProfile)}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Preview how customers view your store"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>View Public Store</span>
          </button>

          {/* Customize Profile Space */}
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Edit Store Profile, Cover Photo & Bio"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Customize Profile</span>
          </button>

          {/* Super-Admin Direct Messenger Button */}
          <button
            onClick={() => setIsSellerAdminMessengerOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Open End-to-End Encrypted Support Desk"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Admin Messenger</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </button>

          {/* List New Product */}
          <button
            onClick={() => setIsProductUploadOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List Product</span>
          </button>
        </div>
      </div>

      {/* Dynamic Account Status Notice */}
      {sellerProfile.kycStatus === 'pending' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#131722] to-amber-500/10 border border-amber-500/50 shadow-xl space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span>Merchant Verification Desk</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold">
                    PENDING ADMIN REVIEW
                  </span>
                </h4>
                <p className="text-amber-200/90 font-medium mt-0.5 leading-relaxed text-xs">
                  Your identity verification is currently under Admin review. Features will be fully unlocked upon approval.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => simulateKycStatusChange('verified')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all"
              >
                ⚡ Fast-Track Approval
              </button>
              <button
                onClick={() => setIsKYCModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer transition-colors"
              >
                View 3-Step Documents
              </button>
            </div>
          </div>

          {/* 4-Step Progress Verification Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-500/20 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Shop Details (Done)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2. NID Document (Done)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Face Match (99.4%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300 font-bold animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>4. Super-Admin Review</span>
            </div>
          </div>
        </div>
      )}

      {sellerProfile.kycStatus === 'not_submitted' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4 text-xs text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">
                Mandatory Merchant KYC Gate Active (Bangladesh E-Commerce Regulations)
              </h4>
              <p className="text-neutral-300 mt-0.5 leading-relaxed">
                Your shop is pending National ID / Trade License compliance and face matching. Verify now to unlock full features.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsKYCModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0 hover:brightness-105 transition-all cursor-pointer"
          >
            Complete KYC Gate →
          </button>
        </div>
      )}

      {sellerProfile.kycStatus === 'rejected' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-start justify-between gap-4 text-xs text-rose-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Identity Verification Rejected</h4>
              <p className="text-neutral-300 mt-0.5 leading-relaxed">
                {sellerProfile.kycDocument?.rejectionReason || 'Document illegible or photo mismatch. Please re-submit your verification documents.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsKYCModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shrink-0 hover:brightness-105 transition-all cursor-pointer"
          >
            Re-submit Verification →
          </button>
        </div>
      )}

      {/* 2. FLUX MART Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131722] border border-amber-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span className="font-medium">Gross Sales Revenue</span>
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
            ৳{totalSalesRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <span>+14.2%</span>
            <span className="text-neutral-500">vs last month</span>
          </span>
        </div>

        {/* Metric 2: Pending Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131722] border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span className="font-medium">Pending Orders</span>
            <span className="p-1.5 rounded-lg bg-neutral-800 text-amber-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
            {pendingOrdersCount}
          </span>
          <span className="text-[11px] text-amber-300 font-semibold mt-1 block">
            Awaiting courier dispatch
          </span>
        </div>

        {/* Metric 3: Shipped Items */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131722] border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span className="font-medium">Shipped & In Transit</span>
            <span className="p-1.5 rounded-lg bg-neutral-800 text-emerald-400">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
            {shippedOrdersCount}
          </span>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Via Pathao & Steadfast
          </span>
        </div>

        {/* Metric 4: Product Views */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131722] border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span className="font-medium">Traffic & Views</span>
            <span className="p-1.5 rounded-lg bg-neutral-800 text-amber-400">
              <Eye className="w-4 h-4" />
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
            {productViews.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            +18.4% this week
          </span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#131722] border border-neutral-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Dashboard & Live Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Financial Wallet & Payouts (৳{sellerProfile.walletBalance.toLocaleString()})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>My Catalog & Inventory ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kyc'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>KYC Document Gate ({sellerProfile.kycStatus.toUpperCase()})</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD & LIVE ORDERS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Customer Orders & Nationwide Dispatch</span>
            </h3>
            <span className="text-xs text-neutral-400">
              Mandatory advance delivery fee verified on all active orders
            </span>
          </div>

          {myOrders.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[#131722] border border-neutral-800 text-center space-y-2">
              <Package className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Customer Orders Yet</p>
              <p className="text-xs text-neutral-400">
                New orders placed from the customer marketplace will appear here for courier dispatch.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#131722] border border-neutral-800 hover:border-amber-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold font-mono text-amber-400">
                        #{order.id}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-300 font-medium">{order.customerName}</span>
                      <span className="text-xs font-mono text-emerald-400">({order.customerPhone})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-800 text-amber-300">
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Advance Delivery Fee Cleared
                      </span>
                    </div>
                  </div>

                  {/* Order Details & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* Items */}
                    <div className="md:col-span-6 space-y-2">
                      <span className="font-semibold text-neutral-400 block">Ordered Items:</span>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover border border-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-white font-medium block truncate">
                              {item.product.title}
                            </span>
                            <span className="text-neutral-400 text-[11px] font-mono">
                              Qty: {item.quantity} · ৳{item.product.price.toLocaleString()} each
                              {item.selectedVariant && ` (${item.selectedVariant})`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address (Structured 6-Field) */}
                    <div className="md:col-span-6 space-y-1 p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                      <span className="font-semibold text-amber-400 block mb-1">
                        Nationwide Delivery Address (All 64 Districts):
                      </span>
                      <p className="text-neutral-300 leading-relaxed text-[11px]">
                        {order.shippingAddress.fullAddress}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                        <span>Courier: {order.courier.provider.toUpperCase()}</span>
                        <span>COD Due at Doorstep: ৳{order.dueAmountOnDelivery.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                    <span className="text-xs text-neutral-400 font-mono">
                      Total Payout Credit: <strong className="text-emerald-400">৳{order.sellerPayout?.toLocaleString() || (order.subtotal * 0.9).toLocaleString()}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDigitalInvoice(order)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Digital Memo</span>
                      </button>

                      {order.orderStatus === 'to_ship' && (
                        <button
                          onClick={() => handleDispatchOrder(order.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow hover:brightness-105 transition-all cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch with Courier</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FINANCIAL WALLET & AUTOMATED PAYOUTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-5">
          {/* Wallet Header & Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cleared Balance */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181E2C] to-[#12151E] border border-amber-500/40 shadow-xl space-y-2">
              <span className="text-xs font-semibold text-neutral-400 block">
                Cleared Wallet Balance (Available Now)
              </span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums block">
                ৳{sellerProfile.walletBalance.toLocaleString()}
              </span>
              <button
                onClick={() => setIsWithdrawOpen(true)}
                className="w-full mt-2 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Request Automated Payout</span>
              </button>
            </div>

            {/* Pending Escrow Balance */}
            <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800 shadow-xl space-y-2">
              <span className="text-xs font-semibold text-neutral-400 block">
                Pending Escrow Balance (In Transit)
              </span>
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums block">
                ৳{sellerProfile.pendingBalance.toLocaleString()}
              </span>
              <p className="text-[11px] text-neutral-500 leading-tight">
                Held in escrow until courier doorstep delivery confirmation and cash collection.
              </p>
            </div>

            {/* Lifetime Disbursed */}
            <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800 shadow-xl space-y-2">
              <span className="text-xs font-semibold text-neutral-400 block">
                Lifetime Total Earnings
              </span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums block">
                ৳{sellerProfile.totalEarnings.toLocaleString()}
              </span>
              <p className="text-[11px] text-neutral-500 leading-tight">
                Disbursed to verified bKash Merchant and BEFTN commercial banking channels.
              </p>
            </div>
          </div>

          {/* Category Platform Commission Tracker */}
          <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-amber-400">
              <Percent className="w-4 h-4" />
              <span>Deducted Platform Commission Rates by Category</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                <span className="text-neutral-400 block text-[11px]">Fashion & Apparel</span>
                <span className="text-base font-bold font-mono text-white">{categoryCommissions.fashion}% Cut</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                <span className="text-neutral-400 block text-[11px]">Consumer Electronics</span>
                <span className="text-base font-bold font-mono text-white">{categoryCommissions.electronics}% Cut</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                <span className="text-neutral-400 block text-[11px]">Medicine & Wellness</span>
                <span className="text-base font-bold font-mono text-white">{categoryCommissions.medicine}% Cut</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                <span className="text-neutral-400 block text-[11px]">Household & Kitchen</span>
                <span className="text-base font-bold font-mono text-white">{categoryCommissions.household}% Cut</span>
              </div>
            </div>
          </div>

          {/* Payout & Withdrawal Requests Log */}
          <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Disbursement & Withdrawal Request History</span>
            </h4>

            <div className="space-y-2">
              {withdrawalRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-[#0B0D13] border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{req.id}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ৳{req.amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 block">
                      {req.accountDetails} ({req.requestedAt})
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY CATALOG & INVENTORY */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Published Inventory & Active Listings ({myProducts.length})</span>
            </h3>
            <button
              onClick={() => setIsProductUploadOpen(true)}
              className="py-2 px-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {myProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 hover:border-amber-500/40 transition-all flex gap-3.5"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-[9px] font-mono text-amber-300">
                    {prod.category}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {prod.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                      SKU: {prod.sku} · Stock: <strong className="text-emerald-400">{prod.stock} units</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                    <span className="text-xs font-bold font-mono text-white">
                      ৳{prod.price.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Live on Store
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KYC VERIFICATION GATE */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#131722] border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Mandatory National ID & Trade License Compliance Record
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                  sellerProfile.kycStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {sellerProfile.kycStatus}
              </span>
            </div>

            {sellerProfile.kycDocument ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                    <span className="text-neutral-400 text-[11px] block">Document Type</span>
                    <span className="text-white font-bold uppercase">{sellerProfile.kycDocument.documentType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                    <span className="text-neutral-400 text-[11px] block">Document ID Number</span>
                    <span className="text-amber-400 font-mono font-bold">{sellerProfile.kycDocument.documentNumber}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                    <span className="text-neutral-400 text-[11px] block">Full Name (English / Bengali)</span>
                    <span className="text-white font-semibold">
                      {sellerProfile.kycDocument.fullNameEnglish} ({sellerProfile.kycDocument.fullNameBengali})
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                    <span className="text-neutral-400 text-[11px] block">Trade License</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {sellerProfile.kycDocument.tradeLicenseNumber || 'N/A (Individual)'}
                    </span>
                  </div>
                </div>

                {/* 3 Document Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-neutral-400 text-[11px] block">1. NID Front Side:</span>
                    <div className="aspect-video rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                      <img
                        src={sellerProfile.kycDocument.frontImage}
                        alt="NID Front"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-400 text-[11px] block">2. NID Back Side:</span>
                    <div className="aspect-video rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center text-neutral-500 text-xs">
                      {sellerProfile.kycDocument.backImage ? (
                        <img
                          src={sellerProfile.kycDocument.backImage}
                          alt="NID Back"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>No back image attached</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-400 text-[11px] block">3. Biometric Face Scan:</span>
                    <div className="aspect-video rounded-xl bg-neutral-900 border border-emerald-500/30 overflow-hidden flex items-center justify-center relative">
                      {sellerProfile.kycDocument.faceScanImage ? (
                        <>
                          <img
                            src={sellerProfile.kycDocument.faceScanImage}
                            alt="Face Scan"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500/80 text-[9px] text-slate-950 font-mono font-bold">
                            99.4% Match
                          </div>
                        </>
                      ) : (
                        <span>No face scan attached</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">
                No KYC documents submitted yet. Please complete the 3-step verification gate to activate your store.
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <button
                onClick={() => setIsKYCModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Update / Re-Upload Documents</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => simulateKycStatusChange('verified')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 cursor-pointer"
                >
                  ⚡ Simulate Verified
                </button>
                <button
                  onClick={() => simulateKycStatusChange('pending')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 cursor-pointer"
                >
                  Set Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WITHDRAWAL MODAL */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsWithdrawOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-1">Request Merchant Payout</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Disburse cleared funds from FLUX MART wallet to your verified Bangladeshi account.
            </p>

            {withdrawSuccess && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
                {withdrawSuccess}
              </div>
            )}

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">Withdrawal Amount (৳)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 font-mono text-white text-base font-bold outline-none"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Max cleared available: ৳{sellerProfile.walletBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Disbursement Channel</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="bkash_merchant">bKash Merchant Account (Instant)</option>
                  <option value="nagad_merchant">Nagad Merchant Account (Instant)</option>
                  <option value="bank_transfer">Commercial Bank Transfer (BEFTN / NPSB)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Account & Routing Details</label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="e.g. 01712-345678 or DBBL A/C"
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              {withdrawMsg && (
                <div className="text-rose-400 text-xs">{withdrawMsg}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                Confirm Payout Disbursement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. EDIT STORE PROFILE & SOCIAL SPACE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-auto space-y-4">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Customize Merchant Store Profile</h3>
                <p className="text-xs text-neutral-400">
                  Update your public Facebook-style store presentation, avatar, cover photo & bio.
                </p>
              </div>
            </div>

            {editSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveStoreProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Shop Name (দোকানের নাম)
                </label>
                <input
                  type="text"
                  required
                  value={editShopName}
                  onChange={(e) => setEditShopName(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Owner Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={editOwnerName}
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Store Bio / Official Guarantee (বর্ণনা)
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl p-3 text-white outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Profile Avatar URL</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] outline-none"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
                    ].map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditAvatar(img)}
                        className="w-7 h-7 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-400 cursor-pointer"
                      >
                        <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Cover Photo URL</label>
                  <input
                    type="text"
                    value={editCoverImage}
                    onChange={(e) => setEditCoverImage(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] outline-none"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
                    ].map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditCoverImage(img)}
                        className="w-7 h-7 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-400 cursor-pointer"
                      >
                        <img src={img} alt="Preset Cover" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Warehouse Location
                </label>
                <input
                  type="text"
                  value={editWarehouse}
                  onChange={(e) => setEditWarehouse(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openSellerPublicProfile(sellerProfile)}
                  className="py-2.5 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview Store</span>
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  Save Store Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. FLOATING ADMIN MESSENGER TRIGGER BUTTON (BOTTOM RIGHT) */}
      <button
        onClick={() => setIsSellerAdminMessengerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-2 shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-slate-950"
        title="Open Super-Admin Support Desk (End-to-End Encrypted)"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <span className="hidden sm:inline">Admin Messenger Desk</span>
      </button>
    </div>
  );
};
