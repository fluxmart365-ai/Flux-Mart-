import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, ProductCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { BANGLADESH_DIVISIONS, calculateShippingFee } from '../../data/bangladeshGeo';
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Check,
  MapPin,
  Clock,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Share2,
  MessageCircle,
  BadgeCheck,
  Smartphone,
  Tag,
  Pill,
  Sparkle,
  Home,
  ChevronDown
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantBuy: (product: Product, quantity: number, variant?: string) => void;
  onSelectRelatedProduct?: (product: Product) => void;
  onNavigateCategory?: (category: ProductCategory) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInstantBuy,
  onSelectRelatedProduct,
  onNavigateCategory
}) => {
  const {
    addToCart,
    language,
    products,
    openLiveSupport,
    openShareModal,
    openSellerPublicProfile
  } = useApp();

  const [currentProduct, setCurrentProduct] = useState<Product | null>(product);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  // Gallery state: index or 'video'
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Video playback state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Category-specific variant selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedDeviceModel, setSelectedDeviceModel] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedPackSize, setSelectedPackSize] = useState<string>('');
  const [selectedDosage, setSelectedDosage] = useState<string>('');

  const [quantity, setQuantity] = useState(1);

  // Delivery Calculator State
  const [selectedDivisionId, setSelectedDivisionId] = useState('dhaka');
  const [selectedDistrictId, setSelectedDistrictId] = useState('dhaka_city');
  const [addedNotice, setAddedNotice] = useState(false);

  // Container ref to scroll to top when switching related product
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize variants when currentProduct changes
  useEffect(() => {
    if (currentProduct) {
      setActiveMedia('image');
      setSelectedImageIndex(0);
      setQuantity(1);

      // Color
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        const available = currentProduct.colors.find((c) => c.inStock) || currentProduct.colors[0];
        setSelectedColor(available.name);
      } else {
        setSelectedColor('');
      }

      // Size
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        const available = currentProduct.sizes.find((s) => s.inStock) || currentProduct.sizes[0];
        setSelectedSize(available.name);
      } else {
        setSelectedSize('');
      }

      // Fabric (Fashion)
      if (currentProduct.fabricTypes && currentProduct.fabricTypes.length > 0) {
        const available = currentProduct.fabricTypes.find((f) => f.inStock) || currentProduct.fabricTypes[0];
        setSelectedFabric(available.name);
      } else {
        setSelectedFabric('');
      }

      // Device Model (Tech / Accessories)
      if (currentProduct.deviceModels && currentProduct.deviceModels.length > 0) {
        const available = currentProduct.deviceModels.find((d) => d.inStock) || currentProduct.deviceModels[0];
        setSelectedDeviceModel(`${available.brand} ${available.model}`);
      } else {
        setSelectedDeviceModel('');
      }

      // Material (Cases / Lifestyle)
      if (currentProduct.materials && currentProduct.materials.length > 0) {
        const available = currentProduct.materials.find((m) => m.inStock) || currentProduct.materials[0];
        setSelectedMaterial(available.name);
      } else {
        setSelectedMaterial('');
      }

      // Pack Size (Medicine / Everyday Goods)
      if (currentProduct.packSizes && currentProduct.packSizes.length > 0) {
        const available = currentProduct.packSizes.find((p) => p.inStock) || currentProduct.packSizes[0];
        setSelectedPackSize(available.label);
      } else {
        setSelectedPackSize('');
      }

      // Dosage (Medicine)
      if (currentProduct.dosageOrUnits && currentProduct.dosageOrUnits.length > 0) {
        setSelectedDosage(currentProduct.dosageOrUnits[0]);
      } else {
        setSelectedDosage('');
      }

      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentProduct]);

  // Build gallery array
  const galleryImages: string[] = useMemo(() => {
    if (currentProduct?.gallery && currentProduct.gallery.length > 0) {
      return currentProduct.gallery;
    }
    return currentProduct ? [currentProduct.image] : [];
  }, [currentProduct]);

  if (!currentProduct) return null;

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== currentProduct.id)
    .sort((a, b) => (a.category === currentProduct.category ? -1 : 1))
    .slice(0, 5);

  const currentDiv = BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivisionId) || BANGLADESH_DIVISIONS[0];
  const shippingCalculation = calculateShippingFee(selectedDivisionId, selectedDistrictId);
  const shippingCharge = shippingCalculation.fee;
  const deliveryEta = shippingCalculation.eta;

  const discountPercent = Math.round(
    ((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100
  );
  const savingsAmount = currentProduct.originalPrice - currentProduct.price;

  // Unified variant summary string
  const variantString = [
    selectedDeviceModel,
    selectedMaterial,
    selectedFabric,
    selectedColor,
    selectedSize,
    selectedPackSize,
    selectedDosage
  ]
    .filter(Boolean)
    .join(' · ');

  const handleAdd = () => {
    addToCart(currentProduct, quantity, variantString || undefined);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNow = () => {
    onInstantBuy(currentProduct, quantity, variantString || undefined);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isVideoMuted;
    setIsVideoMuted(!isVideoMuted);
  };

  const handleSelectRelated = (rel: Product) => {
    setCurrentProduct(rel);
    if (onSelectRelatedProduct) {
      onSelectRelatedProduct(rel);
    }
  };

  const getCategoryLabel = (cat: ProductCategory) => {
    switch (cat) {
      case 'fashion':
        return language === 'bn' ? 'পোশাক ও ফ্যাশন' : 'Apparel & Fashion';
      case 'electronics':
        return language === 'bn' ? 'টেক ও গ্যাজেট' : 'Tech & Mobile Accessories';
      case 'medicine':
        return language === 'bn' ? 'স্বাস্থ্য ও ফার্মাসিউটিক্যালস' : 'Healthcare & Medicine';
      case 'household':
        return language === 'bn' ? 'গৃহস্থালি ও লাইভিং' : 'Household & Artisanal Living';
      default:
        return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        ref={modalScrollRef}
        className="relative w-full max-w-5xl bg-[#131722] border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto text-white my-auto max-h-[94vh] flex flex-col"
      >
        {/* Floating Top Controls: Share & Close */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() =>
              openShareModal({
                id: currentProduct.id,
                title: `${currentProduct.title} on FLUX MART`,
                url: `/?product=${currentProduct.id}`,
                image: currentProduct.image,
                type: 'product'
              })
            }
            className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
            title="Share this product"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
            title="Close Product View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* 1. VIP Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pr-20 flex items-center gap-1.5 text-xs text-neutral-400 flex-wrap">
            <button
              onClick={onClose}
              className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-neutral-500" />
              <span>Home</span>
            </button>
            <span className="text-neutral-600">/</span>
            <button
              onClick={() => {
                if (onNavigateCategory) onNavigateCategory(currentProduct.category);
                onClose();
              }}
              className="hover:text-amber-400 font-medium transition-colors cursor-pointer"
            >
              {getCategoryLabel(currentProduct.category)}
            </button>
            {currentProduct.subCategory && (
              <>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-300 font-medium">{currentProduct.subCategory}</span>
              </>
            )}
            <span className="text-neutral-600">/</span>
            <span className="text-amber-400/90 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {language === 'bn' ? currentProduct.titleBn : currentProduct.title}
            </span>
          </nav>

          {/* 2. Main 2-Column Product Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN: Gallery & Embedded Video Showcase (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Main Media Stage (High-Res Image or Embedded Video Player) */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0B0D13] border border-neutral-800 shadow-xl group">
                {activeMedia === 'image' ? (
                  <img
                    src={galleryImages[selectedImageIndex] || currentProduct.image}
                    alt={currentProduct.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  /* Embedded Video Showcase Player */
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={currentProduct.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                      poster={currentProduct.videoThumbnail || currentProduct.image}
                      autoPlay
                      loop
                      playsInline
                      muted={isVideoMuted}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      className="w-full h-full object-cover"
                    />

                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/75 backdrop-blur-md border border-neutral-700/80 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="p-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
                          title={isVideoPlaying ? 'Pause' : 'Play'}
                        >
                          {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={handleToggleMute}
                          className="p-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          title={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                        >
                          {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                        </button>

                        <span className="text-[11px] font-medium text-amber-200">
                          360° Video Demo
                        </span>
                      </div>

                      <span className="text-[10px] text-neutral-400 font-mono">
                        HD 1080p
                      </span>
                    </div>

                    {/* Live Video Indicator Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/50 text-[10px] font-bold text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>LIVE SHOWCASE</span>
                    </div>
                  </div>
                )}

                {/* SKU Stamp */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/40">
                  {currentProduct.sku}
                </div>

                {/* Next / Prev Navigation for images */}
                {activeMedia === 'image' && galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImageIndex(
                          (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-700 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-700 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails Strip (Including Embedded Video Demo Tab) */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {/* Image Thumbnails */}
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveMedia('image');
                      setSelectedImageIndex(idx);
                    }}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#0B0D13] ${
                      activeMedia === 'image' && selectedImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                        : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}

                {/* Video Showcase Thumbnail Button */}
                <button
                  type="button"
                  onClick={() => setActiveMedia('video')}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#0B0D13] flex flex-col items-center justify-center group ${
                    activeMedia === 'video'
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105 bg-amber-500/10'
                      : 'border-neutral-800 hover:border-amber-500/50 opacity-80 hover:opacity-100'
                  }`}
                  title="Watch Video Showcase"
                >
                  <img
                    src={currentProduct.videoThumbnail || currentProduct.image}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-300 mt-0.5 uppercase tracking-wider font-mono">
                      Video
                    </span>
                  </div>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800 flex flex-col items-center text-center">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] font-semibold text-neutral-300">100% Authentic</span>
                  <span className="text-[9px] text-neutral-500">Verified Seller</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800 flex flex-col items-center text-center">
                  <RotateCcw className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] font-semibold text-neutral-300">7 Days Return</span>
                  <span className="text-[9px] text-neutral-500">Escrow Protected</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800 flex flex-col items-center text-center">
                  <Truck className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] font-semibold text-neutral-300">Express Courier</span>
                  <span className="text-[9px] text-neutral-500">All 64 Districts</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Details, Dynamic Category-Aware Variants, Pricing & Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                
                {/* Brand & Sold By Seller Bar */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
                    <span className="font-bold text-amber-400 tracking-wider uppercase text-[11px]">
                      {currentProduct.brand}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <span>Sold by:</span>
                      <button
                        type="button"
                        onClick={() => openSellerPublicProfile(currentProduct.sellerId || currentProduct.sellerName)}
                        className="text-white hover:text-amber-400 font-semibold underline-offset-2 hover:underline cursor-pointer transition-colors"
                        title="View Official Merchant Profile"
                      >
                        {currentProduct.sellerName}
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => openSellerPublicProfile(currentProduct.sellerId || currentProduct.sellerName)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[10px] text-emerald-400 font-mono font-bold cursor-pointer transition-colors shadow-sm"
                      title="Verified Merchant ID"
                    >
                      <BadgeCheck className="w-3 h-3 text-emerald-400" />
                      <span>{currentProduct.sellerUniqueId || 'FLUX-MART-542'} ✓</span>
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      openLiveSupport({
                        sellerName: currentProduct.sellerName,
                        initialMessage: `Hi, I have a question about ${currentProduct.title}.`
                      })
                    }
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ask Seller</span>
                  </button>
                </div>

                {/* Product Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                  {language === 'bn' ? currentProduct.titleBn : currentProduct.title}
                </h2>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 text-xs text-neutral-300 mb-4 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm text-white">{currentProduct.rating}</span>
                  </div>
                  <span>·</span>
                  <span className="text-neutral-400">{currentProduct.reviewCount} customer reviews</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">In Stock ({currentProduct.stock} units)</span>
                  <span>·</span>
                  <span className="text-amber-400/90 font-mono text-[11px]">98.4% Fast Dispatch</span>
                </div>

                {/* Price Display Block */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-amber-500/30 mb-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold text-[11px] tracking-wide">
                      LIMITED TIME DEAL
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs text-rose-400 font-bold">
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3 my-1 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                      ৳{currentProduct.price.toLocaleString()}
                    </span>
                    {currentProduct.originalPrice > currentProduct.price && (
                      <span className="text-sm sm:text-base text-neutral-500 line-through font-mono tabular-nums">
                        ৳{currentProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {savingsAmount > 0 && (
                      <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        Save ৳{savingsAmount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 mt-1">
                    All taxes & VAT included · Cash on Delivery (COD) supported nationwide · Mandatory advance delivery fee clearance via bKash/Nagad
                  </p>
                </div>

                {/* ========================================================= */}
                {/* CATEGORY-AWARE DYNAMIC VARIANT SELECTORS                   */}
                {/* ========================================================= */}

                {/* 1. TECH & MOBILE ACCESSORIES: Exact Phone Model & Material */}
                {currentProduct.category === 'electronics' && currentProduct.deviceModels && currentProduct.deviceModels.length > 0 && (
                  <div className="space-y-2 mb-4 p-3.5 rounded-2xl bg-[#0B0D13] border border-sky-500/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sky-300 font-medium flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                        <span>Select Mobile Model:</span>
                        <strong className="text-white font-bold ml-1">
                          {selectedDeviceModel || 'Choose Exact Device'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentProduct.deviceModels.map((item, idx) => {
                        const label = `${item.brand} ${item.model}`;
                        const isSelected = selectedDeviceModel === label;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => setSelectedDeviceModel(label)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md ring-1 ring-sky-400/50'
                                : item.inStock
                                ? 'bg-[#131722] border-neutral-700 text-neutral-200 hover:border-sky-400/50'
                                : 'bg-[#131722]/40 border-neutral-800 text-neutral-600 line-through cursor-not-allowed'
                            }`}
                          >
                            {item.model}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TECH & LIVING: Case Type / Material Selector */}
                {currentProduct.materials && currentProduct.materials.length > 0 && (
                  <div className="space-y-2 mb-4 p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Case Material / Finish:</span>
                        <strong className="text-white font-bold ml-1">
                          {selectedMaterial || 'Choose Finish'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentProduct.materials.map((mat, idx) => {
                        const isSelected = selectedMaterial === mat.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!mat.inStock}
                            onClick={() => setSelectedMaterial(mat.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-400 ring-1 ring-amber-400/50'
                                : mat.inStock
                                ? 'bg-[#131722] border-neutral-700 text-neutral-200 hover:border-neutral-600'
                                : 'bg-[#131722]/40 border-neutral-800 text-neutral-600 line-through cursor-not-allowed'
                            }`}
                          >
                            {mat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. APPAREL & FASHION: Fabric Type Selector */}
                {currentProduct.category === 'fashion' && currentProduct.fabricTypes && currentProduct.fabricTypes.length > 0 && (
                  <div className="space-y-2 mb-4 p-3.5 rounded-2xl bg-[#0B0D13] border border-amber-500/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-medium flex items-center gap-1.5">
                        <Sparkle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Fabric & Weave Type:</span>
                        <strong className="text-white font-bold ml-1">
                          {selectedFabric || 'Choose Fabric'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentProduct.fabricTypes.map((fab, idx) => {
                        const isSelected = selectedFabric === fab.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!fab.inStock}
                            onClick={() => setSelectedFabric(fab.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-gold-gradient text-slate-950 font-bold border-amber-400 shadow-md'
                                : fab.inStock
                                ? 'bg-[#131722] border-neutral-700 text-neutral-200 hover:border-amber-400/50'
                                : 'bg-[#131722]/40 border-neutral-800 text-neutral-600 line-through cursor-not-allowed'
                            }`}
                          >
                            {fab.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* APPAREL & FASHION: Standard Size Selectors (S, M, L, XL, XXL, 3XL) */}
                {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">
                        Size / Edition:{' '}
                        <strong className="text-white font-bold">
                          {selectedSize || 'Select Size'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentProduct.sizes.map((size) => {
                        const isSelected = selectedSize === size.name;
                        return (
                          <button
                            key={size.name}
                            type="button"
                            disabled={!size.inStock}
                            onClick={() => setSelectedSize(size.name)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-gold-gradient text-slate-950 font-bold border-amber-400 shadow-md'
                                : size.inStock
                                ? 'bg-[#0B0D13] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                                : 'bg-[#0B0D13]/40 border-neutral-800/40 text-neutral-600 line-through cursor-not-allowed'
                            }`}
                          >
                            {size.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. HEALTHCARE/MEDICINE & EVERYDAY GOODS: Pack Size & Expiry Verification */}
                {currentProduct.category === 'medicine' && (
                  <div className="space-y-3 mb-4 p-3.5 rounded-2xl bg-[#0B0D13] border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pack Size & Quantity:</span>
                        <strong className="text-white font-bold ml-1">
                          {selectedPackSize || 'Select Pack'}
                        </strong>
                      </span>
                    </div>

                    {currentProduct.packSizes && (
                      <div className="flex flex-wrap gap-2">
                        {currentProduct.packSizes.map((pack, idx) => {
                          const isSelected = selectedPackSize === pack.label;
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={!pack.inStock}
                              onClick={() => setSelectedPackSize(pack.label)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                                  : pack.inStock
                                  ? 'bg-[#131722] border-neutral-700 text-neutral-200 hover:border-emerald-400/50'
                                  : 'bg-[#131722]/40 border-neutral-800 text-neutral-600 line-through cursor-not-allowed'
                              }`}
                            >
                              {pack.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Expiry Date, Batch & DGDA Registration Verification */}
                    <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Expiry: {currentProduct.expiryDate || '12/2027'}</span>
                      </div>
                      <span className="font-mono text-neutral-500">
                        Batch: {currentProduct.batchNumber || 'FLX-MED-8821'}
                      </span>
                      <span className="text-amber-400/90 font-mono">
                        {currentProduct.dgdaRegNumber || 'DGDA-AYUR-89241'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. COLOR SWATCHES SELECTOR (Universally Available when configured) */}
                {currentProduct.colors && currentProduct.colors.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">
                        Color / Finish:{' '}
                        <strong className="text-white font-bold">
                          {selectedColor || 'Select Color'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {currentProduct.colors.map((color) => {
                        const isSelected = selectedColor === color.name;
                        return (
                          <button
                            key={color.name}
                            type="button"
                            disabled={!color.inStock}
                            onClick={() => setSelectedColor(color.name)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/40'
                                : color.inStock
                                ? 'bg-[#0B0D13] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                                : 'bg-[#0B0D13]/40 border-neutral-800/40 text-neutral-600 line-through cursor-not-allowed'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Selected Variant Summary Ribbon */}
                {variantString && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Configured Variant:</span>
                    </span>
                    <span className="font-bold text-white font-mono text-[11px] truncate max-w-[280px]">
                      {variantString}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                  {language === 'bn' ? currentProduct.descriptionBn : currentProduct.description}
                </p>

                {/* Specifications Grid */}
                {currentProduct.specifications && currentProduct.specifications.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#0B0D13] border border-neutral-800 mb-5">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Specifications & Authenticity</span>
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {currentProduct.specifications.map((spec, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-neutral-800/60 last:border-b-0">
                          <span className="text-neutral-400">{spec.label}</span>
                          <span className="text-white font-medium text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nationwide Delivery Calculator (All 64 Districts) */}
                <div className="p-4 rounded-xl bg-[#0B0D13] border border-neutral-800 space-y-3 mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-200">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <MapPin className="w-4 h-4" />
                      <span>Nationwide Delivery Hub (All 64 Districts)</span>
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px]">Pathao / RedX</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Division</label>
                      <select
                        value={selectedDivisionId}
                        onChange={(e) => {
                          const divId = e.target.value;
                          setSelectedDivisionId(divId);
                          const div = BANGLADESH_DIVISIONS.find((d) => d.id === divId) || BANGLADESH_DIVISIONS[0];
                          setSelectedDistrictId(div.districts[0].id);
                        }}
                        className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                      >
                        {BANGLADESH_DIVISIONS.map((div) => (
                          <option key={div.id} value={div.id}>
                            {div.nameEn} ({div.nameBn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">District (64 Districts)</label>
                      <select
                        value={selectedDistrictId}
                        onChange={(e) => setSelectedDistrictId(e.target.value)}
                        className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                      >
                        {currentDiv.districts.map((dist) => (
                          <option key={dist.id} value={dist.id}>
                            {dist.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-neutral-400 border-t border-neutral-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Estimated delivery: {deliveryEta}</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-medium">৳{shippingCharge} delivery</span>
                  </div>
                </div>

                {/* Quantity & CTA Purchase Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-300 font-medium">Quantity:</span>
                    <div className="flex items-center bg-[#0B0D13] border border-neutral-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-sm font-mono font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                        className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      Subtotal: ৳{(currentProduct.price * quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleAdd}
                      className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {addedNotice ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-amber-400" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="py-3 px-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Instant Buy Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 3. BELOW PRODUCT DETAILS: "Related Products / You May Also Like" Feed */}
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {language === 'bn'
                      ? 'সম্পর্কিত অন্যান্য পণ্য (You May Also Like)'
                      : 'Related Products / You May Also Like'}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn'
                    ? 'অন্যান্য গ্রাহকরা এই পণ্যের সাথে যেসব আইটেম দেখছেন'
                    : 'Customers who viewed this item also explored these verified collections'}
                </p>
              </div>
            </div>

            {/* Scrollable Related Products Feed */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {relatedProducts.map((rel) => {
                const relDiscount = Math.round(
                  ((rel.originalPrice - rel.price) / rel.originalPrice) * 100
                );
                return (
                  <div
                    key={rel.id}
                    onClick={() => handleSelectRelated(rel)}
                    className="group relative flex flex-col bg-[#0B0D13] hover:bg-[#181E2C] border border-neutral-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer p-2.5"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relDiscount > 0 && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold text-[9px]">
                          -{relDiscount}%
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider truncate">
                      {rel.brand}
                    </span>

                    <h4 className="text-xs font-medium text-white group-hover:text-amber-300 line-clamp-2 leading-tight mt-0.5 mb-1.5">
                      {language === 'bn' ? rel.titleBn : rel.title}
                    </h4>

                    <div className="mt-auto pt-1 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white font-mono tabular-nums">
                          ৳{rel.price.toLocaleString()}
                        </span>
                        {rel.originalPrice > rel.price && (
                          <span className="text-[10px] text-neutral-500 line-through font-mono">
                            ৳{rel.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(rel, 1);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-slate-950 text-neutral-300 transition-colors cursor-pointer"
                        title="Quick Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
