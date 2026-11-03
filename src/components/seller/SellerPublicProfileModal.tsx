import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerProfile } from '../../types';
import {
  X,
  BadgeCheck,
  Star,
  MapPin,
  Calendar,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Package,
  ShieldCheck,
  Truck,
  Building,
  Award,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

interface SellerPublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller?: SellerProfile | null;
  onSelectProduct?: (productId: string) => void;
}

export const SellerPublicProfileModal: React.FC<SellerPublicProfileModalProps> = ({
  isOpen,
  onClose,
  seller: propSeller,
  onSelectProduct
}) => {
  const {
    sellerProfile: currentGlobalSeller,
    products,
    openLiveSupport,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'reviews' | 'about'>('catalog');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // If specific seller prop passed, use it; otherwise fallback to the current global seller profile
  const seller: SellerProfile = propSeller || currentGlobalSeller;
  const merchantId = seller.merchantUniqueId || 'FLUX-MART-542';
  const isVerified = seller.kycStatus === 'verified' || seller.verifiedBadge !== false;

  // Products belonging to this seller
  const sellerProducts = products.filter(
    (p) =>
      p.sellerId === seller.id ||
      p.sellerName?.toLowerCase() === seller.shopName?.toLowerCase() ||
      p.sellerUniqueId === merchantId
  );

  const fallbackReviews = seller.reviews && seller.reviews.length > 0 ? seller.reviews : [
    {
      id: 'rev_1',
      customerName: 'Rahim Chowdhury',
      rating: 5,
      comment: 'Authentic products and super fast Pathao delivery within Dhaka. Packaging was immaculate!',
      date: '3 days ago'
    },
    {
      id: 'rev_2',
      customerName: 'Nusrat Jahan',
      rating: 5,
      comment: 'Verified merchant guarantee gave me full confidence. The silk Panjabi is original Rajshahi silk.',
      date: '1 week ago'
    },
    {
      id: 'rev_3',
      customerName: 'Shakil Ahmed',
      rating: 4.8,
      comment: 'Quick response on live messenger and genuine warranty card included with the smartwatch.',
      date: '2 weeks ago'
    }
  ];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(merchantId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(`https://fluxmart.bd/store/${merchantId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0F121A] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto text-white">
        
        {/* Cover Photo Area with Facebook-style Social Header */}
        <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 overflow-hidden shrink-0">
          <img
            src={
              seller.coverImage ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
            }
            alt={`${seller.shopName} Cover`}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F121A] via-[#0F121A]/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-neutral-700/80 text-xs text-neutral-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              title="Share Merchant Profile"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share Store'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Left Tag */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shadow-md">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Merchant Profile</span>
            </span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-5 sm:px-8 pb-4 relative -mt-16 sm:-mt-20 flex-1 overflow-y-auto space-y-6">
          
          {/* Avatar and Basic Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-neutral-800/80">
            <div className="flex items-end gap-4">
              {/* Store Avatar */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#131722] border-4 border-[#0F121A] shadow-2xl shrink-0 group">
                <img
                  src={
                    seller.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={seller.shopName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {isVerified && (
                  <div
                    className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg border-2 border-[#0F121A]"
                    title="Verified Merchant"
                  >
                    <BadgeCheck className="w-4 h-4 text-slate-950 fill-slate-950" />
                  </div>
                )}
              </div>

              {/* Names and Unique ID */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {seller.shopName}
                  </h2>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[11px] text-emerald-400 font-semibold shadow-sm">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Merchant</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 flex-wrap text-xs text-neutral-400">
                  <span>Owner: <strong className="text-neutral-200">{seller.ownerName}</strong></span>
                  <span>·</span>
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold transition-colors cursor-pointer"
                    title="Click to copy Unique Merchant ID"
                  >
                    <span>ID: {merchantId}</span>
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Messenger Button */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
              <button
                onClick={() => {
                  onClose();
                  openLiveSupport({
                    sellerName: seller.shopName,
                    initialMessage: `Hello, I'm reaching out directly from your verified merchant profile (${merchantId}).`
                  });
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Live Chat with Seller</span>
              </button>
            </div>
          </div>

          {/* Key Merchant Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#131722] border border-neutral-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Rating Score</span>
                <span className="text-sm font-bold text-white font-mono">{seller.rating || 4.85} ★</span>
                <span className="text-[10px] text-neutral-500 block">128+ Reviews</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131722] border border-neutral-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">KYC Trust</span>
                <span className="text-xs font-bold text-emerald-400">DBID Verified</span>
                <span className="text-[10px] text-neutral-500 block">NID & Trade License</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131722] border border-neutral-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Live Products</span>
                <span className="text-sm font-bold text-white font-mono">{sellerProducts.length || 6} Items</span>
                <span className="text-[10px] text-neutral-500 block">Instant Dispatch</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131722] border border-neutral-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Logistics</span>
                <span className="text-xs font-bold text-neutral-200">64 Districts</span>
                <span className="text-[10px] text-neutral-500 block">Pathao & RedX Express</span>
              </div>
            </div>
          </div>

          {/* Merchant Bio & Announcement */}
          <div className="p-4 rounded-2xl bg-[#131722]/80 border border-neutral-800 space-y-1.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>About Store & Official Guarantee</span>
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {seller.bio ||
                'Premier verified tech gear, smart audio & luxury artisanal apparel with official brand warranty in Bangladesh. All orders undergo dual-party inspection before dispatch.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400 border-t border-neutral-800/60 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{seller.address || 'Level 4, Police Plaza Concord, Gulshan-1, Dhaka'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Joined {seller.joinedDate || 'Jan 2026'}</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Catalog, Reviews, About & Credentials) */}
          <div>
            <div className="flex items-center gap-2 p-1 bg-[#131722] border border-neutral-800 rounded-2xl mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'catalog'
                    ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Product Catalog ({sellerProducts.length || 6})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Customer Reviews ({fallbackReviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'about'
                    ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>KYC Credentials</span>
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* Tab 1: Product Catalog */}
            {activeTab === 'catalog' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(sellerProducts.length > 0 ? sellerProducts : products.slice(0, 4)).map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl bg-[#131722] border border-neutral-800/80 hover:border-amber-500/40 transition-all flex items-center gap-3.5 group"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-800 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block truncate">
                        {product.brand} · SKU: {product.sku}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                        {language === 'bn' ? product.titleBn : product.title}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-extrabold text-white font-mono">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-neutral-500 line-through font-mono">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct?.(product.id);
                      }}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer shrink-0"
                      title="View Product"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {fallbackReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#131722] border border-neutral-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                          {rev.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {rev.customerName}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            Verified Buyer · {rev.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(rev.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: About & Credentials */}
            {activeTab === 'about' && (
              <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Merchant Unique ID</span>
                    <span className="font-mono font-bold text-amber-400">{merchantId}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Government Verification</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>DBID & NID Verified</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Trade License</span>
                    <span className="font-mono text-neutral-300">
                      {seller.kycDocument?.tradeLicenseNumber || 'TRAD/DSCC/019482/2024'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Central Fulfillment Hub</span>
                    <span className="text-neutral-300">{seller.warehouseLocation || 'Tejgaon I/A, Dhaka'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-neutral-300 space-y-1">
                  <span className="font-bold text-amber-400 block">FLUX Escrow & Buyer Protection</span>
                  <p>
                    Every purchase from this verified merchant is covered under the FLUX MART 100% Escrow Protection. Payments are held in security escrow until package delivery is authenticated by our courier partners.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
