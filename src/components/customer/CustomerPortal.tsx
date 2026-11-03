import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { PromotionalHeroBannerCarousel } from './PromotionalHeroBannerCarousel';
import {
  Search,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Tag,
  Filter,
  Flame,
  Zap,
  ShoppingBag,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';

interface CustomerPortalProps {
  onOpenCart: () => void;
  onInstantBuy: (product: Product, quantity: number, variant?: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onOpenCart, onInstantBuy }) => {
  const { products, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating' | 'discount';
  const PAGE_SIZE = 24;
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Real-time synchronized filtered + sorted products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = products.filter((prod) => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        prod.title.toLowerCase().includes(query) ||
        prod.titleBn.toLowerCase().includes(query) ||
        prod.brand.toLowerCase().includes(query) ||
        (prod.subCategory && prod.subCategory.toLowerCase().includes(query)) ||
        (prod.sellerName && prod.sellerName.toLowerCase().includes(query)) ||
        (prod.sellerUniqueId && prod.sellerUniqueId.toLowerCase().includes(query)) ||
        prod.sku.toLowerCase().includes(query)
      );
    });

    const discountOf = (p: Product) => (p.originalPrice - p.price) / (p.originalPrice || 1);
    switch (sortBy) {
      case 'price_asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case 'discount':
        return [...list].sort((a, b) => discountOf(b) - discountOf(a));
      default:
        return list;
    }
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Reset pagination whenever the filter/sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Infinite scroll: load the next page when the sentinel comes into view
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => c + PAGE_SIZE);
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      
      {/* 1. Sleek Search Header & Live Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="tracking-widest uppercase text-[10px]">
                {language === 'bn' ? 'প্রিমিয়াম গ্লোবাল মার্কেটপ্লেস' : 'The Premium Global Marketplace'}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400 font-mono text-[10px]">All 64 Districts Courier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'bn' ? (
                <>অভিজাত ফ্যাশন, গ্যাজেটস ও <span className="text-gold-gradient">প্রিমিয়াম কালেকশন</span></>
              ) : (
                <>VIP Lifestyle, Flagship Tech & <span className="text-gold-gradient">Authentic Living</span></>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{products.length.toLocaleString()} Items Live</span>
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex items-center bg-[#131722] border border-amber-500/30 focus-within:border-amber-400 rounded-2xl shadow-xl overflow-hidden transition-all">
          <Search className="w-5 h-5 text-amber-400 ml-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'পণ্য, ব্র্যান্ড, সিল্ক পাঞ্জাবি, অডিও ইয়ারবাডস বা মডেল খুঁজুন...'
                : 'Search products, brands, iPhone cases, Silk Panjabi, ANC earbuds or seller ID...'
            }
            className="w-full bg-transparent px-3 py-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. Dynamic Promotional Hero Slider Banner (Under Search Bar) */}
      <section className="w-full">
        <PromotionalHeroBannerCarousel
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenProduct={(prod) => setActiveProduct(prod)}
        />
      </section>

      {/* 3. Category Selector Tabs & Real-Time Product Feed */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'মার্কেটপ্লেস কালেকশন' : 'Marketplace Collections'}</span>
            </h2>
            <p className="text-xs text-neutral-400">
              {filteredProducts.length.toLocaleString()}{' '}
              {language === 'bn' ? 'টি প্রিমিয়াম পণ্য সরাসরি ডিসপ্যাচের জন্য প্রস্তুত' : 'verified items ready for instant dispatch'}
            </p>
          </div>

          {/* Category Tabs (Segmented Control per Frontend Guidelines) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#131722] border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: 'all', label: language === 'bn' ? 'সব কালেকশন' : 'All Collections' },
              { id: 'fashion', label: language === 'bn' ? 'পোশাক ও ফ্যাশন' : 'Apparel & Fashion' },
              { id: 'electronics', label: language === 'bn' ? 'টেক ও গ্যাজেট' : 'Tech & Mobile' },
              { id: 'medicine', label: language === 'bn' ? 'স্বাস্থ্য ও ফার্মাসিউটিক্যালস' : 'Health & Medicine' },
              { id: 'household', label: language === 'bn' ? 'গৃহস্থালি ও লাইভিং' : 'Household & Living' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gold-gradient text-slate-950 shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & result summary */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-neutral-500">
            {language === 'bn'
              ? `${Math.min(visibleCount, filteredProducts.length).toLocaleString()} / ${filteredProducts.length.toLocaleString()} টি পণ্য দেখানো হচ্ছে`
              : `Showing ${Math.min(visibleCount, filteredProducts.length).toLocaleString()} of ${filteredProducts.length.toLocaleString()}`}
          </span>
          <label className="flex items-center gap-1.5 text-neutral-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#131722] border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="default">{language === 'bn' ? 'প্রস্তাবিত' : 'Recommended'}</option>
              <option value="price_asc">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price_desc">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'bn' ? 'সেরা রেটিং' : 'Top Rated'}</option>
              <option value="discount">{language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Biggest Discount'}</option>
            </select>
          </label>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 space-y-3 bg-[#131722]/50 border border-neutral-800 rounded-2xl">
            <Filter className="w-10 h-10 mx-auto text-neutral-600" />
            <p className="text-sm font-medium">No products match your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-amber-400 hover:bg-neutral-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(prod) => setActiveProduct(prod)}
                />
              ))}
            </div>
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-5 py-2.5 rounded-xl bg-[#131722] border border-amber-500/30 text-xs font-semibold text-amber-400 hover:bg-neutral-800 cursor-pointer"
                >
                  {language === 'bn'
                    ? `আরও পণ্য দেখুন (${(filteredProducts.length - visibleCount).toLocaleString()} টি বাকি)`
                    : `Load more (${(filteredProducts.length - visibleCount).toLocaleString()} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. National Logistics & Guarantee Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800/80 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5">Pathao & RedX Express</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Same-day & 24h parcel delivery within Dhaka. 48-72h nationwide tracking to all 64 districts.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800/80 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5">bKash & Nagad Verified</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Automated TrxID validation with advance delivery clearance, plus Cash on Delivery (COD).
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800/80 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5">NID & Trade KYC Vetted</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every merchant is vetted through Bangladesh National ID (NID), biometric checks, and trade licenses.
            </p>
          </div>
        </div>
      </section>

      {/* Product Details Modal (FLUX MART VIP PDP) */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onSelectRelatedProduct={(rel) => setActiveProduct(rel)}
        onNavigateCategory={(cat) => setSelectedCategory(cat)}
        onInstantBuy={(prod, qty, variant) => {
          setActiveProduct(null);
          onInstantBuy(prod, qty, variant);
        }}
      />
    </div>
  );
};
