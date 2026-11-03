import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PromotionalBanner, ProductCategory, Product } from '../../types';
import {
  Sparkles,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Copy,
  Zap
} from 'lucide-react';

interface PromotionalHeroBannerCarouselProps {
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  onOpenProduct?: (product: Product) => void;
}

export const PromotionalHeroBannerCarousel: React.FC<PromotionalHeroBannerCarouselProps> = ({
  onSelectCategory,
  onOpenProduct
}) => {
  const { promotionalBanners, language, products, applyVoucherCode } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Countdown timer simulation for flash deals
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 13,
    minutes: 48,
    seconds: 25
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    if (isPaused || promotionalBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotionalBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, promotionalBanners.length]);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % promotionalBanners.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentBanner = promotionalBanners[currentIndex] || promotionalBanners[0];
  if (!currentBanner) return null;

  const handleCtaClick = (banner: PromotionalBanner) => {
    if (banner.couponCode) {
      applyVoucherCode(banner.couponCode);
      setCopiedCode(banner.couponCode);
      setTimeout(() => setCopiedCode(null), 2500);
    }

    if (banner.targetProductId && onOpenProduct) {
      const targetProd = products.find((p) => p.id === banner.targetProductId);
      if (targetProd) {
        onOpenProduct(targetProd);
        return;
      }
    }

    if (banner.targetCategory && onSelectCategory) {
      onSelectCategory(banner.targetCategory);
    }
  };

  const handleCopyCoupon = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    applyVoucherCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0B0D13] shadow-2xl transition-all select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Banner Slides */}
      <div className="relative min-h-[260px] sm:min-h-[290px] md:min-h-[320px] overflow-hidden flex items-center">
        {promotionalBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-out flex items-center ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
            >
              {/* Dynamic Gradient Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient || 'from-amber-950/90 via-[#18130B] to-[#0B0D13]'}`}
              />

              {/* Ambient Gold Radial Glow */}
              <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />

              {/* Content Grid */}
              <div className="relative z-10 w-full h-full px-5 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Left Text & CTA Block */}
                <div className="max-w-xl space-y-3.5 text-left">
                  
                  {/* Top Flash Tag & Timer */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{banner.tag}</span>
                    </span>

                    <span className="text-neutral-500">·</span>

                    {/* Countdown Clock */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300/90 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>

                    {banner.discountPercentage > 0 && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {banner.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Banner Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {language === 'bn' && banner.titleBn ? banner.titleBn : banner.title}
                  </h3>

                  {/* Banner Subtitle */}
                  <p className="text-xs sm:text-sm text-neutral-300/90 line-clamp-2 leading-relaxed">
                    {language === 'bn' && banner.subtitleBn ? banner.subtitleBn : banner.subtitle}
                  </p>

                  {/* Voucher Code Strip & Interactive CTA Button */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => handleCtaClick(banner)}
                      className="px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>
                        {language === 'bn' && banner.ctaTextBn ? banner.ctaTextBn : banner.ctaText || 'Grab Offer Now'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {banner.couponCode && (
                      <button
                        onClick={(e) => handleCopyCoupon(banner.couponCode!, e)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/40 text-xs font-mono text-amber-300 transition-colors cursor-pointer"
                        title="Click to copy and auto-apply"
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>Code: {banner.couponCode}</span>
                        {copiedCode === banner.couponCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Visual Image Showcase */}
                {banner.imageUrl && (
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-neutral-950 group-hover:scale-102 transition-transform duration-500">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Discount Badge */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-gold-gradient text-slate-950 font-black text-xs shadow-lg">
                        SAVE {banner.discountPercentage}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Chevrons (Desktop & Hover Visible) */}
      {promotionalBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length)}
            aria-label="Previous Deal"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-neutral-950/80 hover:bg-amber-500 text-neutral-300 hover:text-slate-950 border border-neutral-700 hover:border-amber-400 transition-all flex items-center justify-center cursor-pointer shadow-md opacity-80 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % promotionalBanners.length)}
            aria-label="Next Deal"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-neutral-950/80 hover:bg-amber-500 text-neutral-300 hover:text-slate-950 border border-neutral-700 hover:border-amber-400 transition-all flex items-center justify-center cursor-pointer shadow-md opacity-80 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Carousel Navigation Dot Indicators */}
      {promotionalBanners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {promotionalBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentIndex
                  ? 'w-7 bg-amber-400 shadow-sm'
                  : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
