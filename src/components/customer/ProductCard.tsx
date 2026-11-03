import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Truck, CheckCircle2, ShoppingBag, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, language, t } = useApp();

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-[#131722] hover:bg-[#181E2C] border border-neutral-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/20 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-[#0B0D13] overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // High fidelity fallback container
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-[#1A1F2C] text-amber-400">
                  <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                    <span class="text-xl font-bold font-mono">FM</span>
                  </div>
                  <span class="text-xs text-neutral-300 text-center font-medium">${product.title}</span>
                </div>
              `;
            }
          }}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] tracking-wide shadow-sm">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Courier Fast Badge */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-amber-200 flex items-center gap-1">
          <Truck className="w-3 h-3 text-amber-400" />
          <span>Pathao Express 24h</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 mb-1 sm:mb-1.5 truncate">
            <span className="uppercase tracking-wider text-amber-400/90 font-medium text-[9px] sm:text-[10px] truncate">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-400 truncate text-[10px] sm:text-[11px]">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span className="truncate">{product.sellerName}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1.5 sm:mb-2">
            {language === 'bn' ? product.titleBn : product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-400 mb-2 sm:mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-semibold text-white text-[11px] sm:text-xs">{product.rating}</span>
            </div>
            <span aria-hidden="true">·</span>
            <span className="text-[10px] sm:text-[11px]">({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
          </div>
        </div>

        {/* Price and Action Row */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-neutral-500 line-through font-mono tabular-nums">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-400 font-medium block truncate">
              {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'COD Available'}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 hover:bg-gold-gradient text-amber-400 hover:text-slate-950 border border-amber-500/30 hover:border-transparent transition-all cursor-pointer shadow-sm shrink-0"
            title="Add to Shopping Bag"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
