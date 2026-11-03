import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  DollarSign,
  Tag,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  Check,
  Percent,
  Play
} from 'lucide-react';

interface SmartProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductPublished?: (product: Product) => void;
}

export const SmartProductUploadModal: React.FC<SmartProductUploadModalProps> = ({
  isOpen,
  onClose,
  onProductPublished
}) => {
  const {
    sellerProfile,
    addProduct,
    categoryCommissions,
    setRole,
    setActiveMainTab,
    language
  } = useApp();

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Vital Info
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [category, setCategory] = useState<ProductCategory>('fashion');
  const [brand, setBrand] = useState(sellerProfile.shopName || 'FLUX Exclusive');
  const [sku, setSku] = useState(`FLX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');

  // Step 2: Pricing & Inventory
  const [wholesalePrice, setWholesalePrice] = useState<number>(2400);
  const [sellingPrice, setSellingPrice] = useState<number>(3600);
  const [originalPrice, setOriginalPrice] = useState<number>(4800);
  const [stock, setStock] = useState<number>(45);

  // Step 3: Media (Multi-Photo Gallery + Unboxing Video)
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  ]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [videoThumbnail, setVideoThumbnail] = useState<string>('');

  // Step 4: Variations & Specs
  const [colors, setColors] = useState<{ name: string; hex: string; inStock: boolean }[]>([
    { name: 'Obsidian Jet Black', hex: '#111827', inStock: true },
    { name: 'Royal Gold & White', hex: '#E5A93C', inStock: true },
    { name: 'Midnight Navy', hex: '#1E3A8A', inStock: true }
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#E5A93C');

  const [sizes, setSizes] = useState<{ name: string; inStock: boolean }[]>([
    { name: '38 (S)', inStock: true },
    { name: '40 (M)', inStock: true },
    { name: '42 (L)', inStock: true },
    { name: '44 (XL)', inStock: true }
  ]);
  const [newSizeName, setNewSizeName] = useState('');

  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([
    { label: 'Fabric Composition', value: '100% Pure Rajshahi Silk with Gold Zardozi' },
    { label: 'Country of Origin', value: 'Bangladesh (GI Certified Heritage)' },
    { label: 'Care Instructions', value: 'Dry Clean Only' }
  ]);
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Step 5: Logistics & Compliance
  const [weightKg, setWeightKg] = useState<number>(0.65);
  const [codSupported, setCodSupported] = useState<boolean>(true);
  const [warranty, setWarranty] = useState<string>('7 Days Replacement & Quality Guarantee');
  const [couriers, setCouriers] = useState<('pathao' | 'redx' | 'steadfast')[]>([
    'pathao',
    'redx',
    'steadfast'
  ]);

  // Submission & Sync Notification State
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Commission math
  const commissionRate = categoryCommissions[category] || 10;
  const platformFeePerUnit = Math.round((sellingPrice * commissionRate) / 100);
  const sellerNetPerUnit = sellingPrice - platformFeePerUnit;
  const netProfitPerUnit = sellerNetPerUnit - wholesalePrice;
  const profitMarginPercent = sellingPrice > 0 ? Math.round((netProfitPerUnit / sellingPrice) * 100) : 0;

  // Image Upload via File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setGalleryImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddCustomImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim()) {
      setGalleryImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex >= galleryImages.length - 1) {
      setPrimaryImageIndex(Math.max(0, galleryImages.length - 2));
    }
  };

  // Add Color Variant
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex, inStock: true }]);
    setNewColorName('');
  };

  // Add Size Variant
  const handleAddSize = () => {
    if (!newSizeName.trim()) return;
    setSizes((prev) => [...prev, { name: newSizeName.trim(), inStock: true }]);
    setNewSizeName('');
  };

  // Add Spec
  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setSpecifications((prev) => [
      ...prev,
      { label: newSpecLabel.trim(), value: newSpecValue.trim() }
    ]);
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  // Final Publish Handler
  const handlePublish = () => {
    setIsPublishing(true);

    const primaryImg = galleryImages[primaryImageIndex] || galleryImages[0] || '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg';

    const productToPublish: Omit<Product, 'id'> = {
      title: title.trim() || 'Royal Executive Silk Panjabi',
      titleBn: titleBn.trim() || 'রয়্যাল এক্সিকিউটিভ সিল্ক পাঞ্জাবি',
      category,
      subCategory:
        category === 'fashion'
          ? 'Royal Panjabi & Contemporary Fashion'
          : category === 'electronics'
          ? 'Flagship Mobile & Audio Gear'
          : category === 'medicine'
          ? 'Certified Phytoceuticals & Wellness'
          : 'Artisanal Bengali Decor & Living',
      price: sellingPrice,
      originalPrice,
      stock,
      sku,
      brand: brand || sellerProfile.shopName,
      sellerId: sellerProfile.id,
      sellerName: sellerProfile.shopName,
      sellerUniqueId: sellerProfile.merchantUniqueId || 'FLUX-MART-542',
      sellerVerified: sellerProfile.kycStatus === 'verified' || true,
      rating: 5.0,
      reviewCount: 1,
      image: primaryImg,
      gallery: galleryImages.length > 0 ? galleryImages : [primaryImg],
      videoUrl: videoUrl.trim() || undefined,
      videoThumbnail: videoThumbnail.trim() || primaryImg,
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      specifications: specifications.length > 0 ? specifications : undefined,
      description: description.trim() || 'Premium hand-crafted collection for FLUX MART marketplace.',
      descriptionBn: descriptionBn.trim() || 'ফ্লাক্স মার্টের অনুমোদিত এক্সক্লুসিভ কালেকশন।',
      weightKg,
      codSupported,
      warranty,
      courierSupported: couriers,
      featured: true
    };

    setTimeout(() => {
      addProduct(productToPublish);
      setIsPublishing(false);

      const created: Product = {
        ...productToPublish,
        id: `prod_${category}_${Date.now()}`
      };
      setPublishedProduct(created);

      if (onProductPublished) {
        onProductPublished(created);
      }
    }, 800);
  };

  const handleSwitchToMarketplace = () => {
    setRole('customer');
    setActiveMainTab('shop');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-3xl bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>FLUX MART Smart Catalog Builder</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                Step {wizardStep} of 5
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live multi-media upload, wholesale pricing, variations & real-time customer sync
            </p>
          </div>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="grid grid-cols-5 gap-1.5 mb-6 text-[11px] font-semibold">
          {[
            { step: 1, label: '1. Vital Info' },
            { step: 2, label: '2. Pricing' },
            { step: 3, label: '3. Media' },
            { step: 4, label: '4. Variants' },
            { step: 5, label: '5. Logistics' }
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setWizardStep(item.step as any)}
              className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer truncate ${
                wizardStep === item.step
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-[#0B0D13] border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* SUCCESS PUBLISHED VIEW */}
        {publishedProduct ? (
          <div className="p-6 rounded-2xl bg-[#0B0D13] border border-emerald-500/40 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Product Published & Synchronized Live!
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                <strong className="text-amber-400">{publishedProduct.title}</strong> is now live across the FLUX MART customer home page, category feeds, and search index.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSwitchToMarketplace}
                className="py-2.5 px-5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Live on Customer Store</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublishedProduct(null);
                  setWizardStep(1);
                  setTitle('');
                  setTitleBn('');
                  setSku(`FLX-${Math.floor(1000 + Math.random() * 9000)}`);
                }}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Upload Another Item
              </button>
            </div>
          </div>
        ) : (
          /* STEP FORMS */
          <div className="space-y-5">
            
            {/* STEP 1: VITAL INFO */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Product Title (English / ক্যাটালগ নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Royal Black Silk Panjabi with Hand-Embroidery"
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Product Title (Bengali / বাংলায় নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      placeholder="যেমনঃ হেরিটেজ রয়্যাল ব্ল্যাক সিল্ক পাঞ্জাবি"
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Product Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                    >
                      <option value="fashion">Fashion & Traditional Handloom (পোশাক ও জামদানি)</option>
                      <option value="electronics">Electronics & Audio Tech (ইলেকট্রনিক্স ও গ্যাজেটস)</option>
                      <option value="medicine">Natural Medicine & Botanicals (ভেষজ ও স্বাস্থ্য)</option>
                      <option value="household">Household, Brass & Kitchen (গৃহস্থালি ও পিতলশিল্প)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Brand / Manufacturer *
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Nawab Silk House / Aura Sound"
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      SKU (Stock Keeping Unit) *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium text-xs mb-1">
                    Detailed Product Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe material, specifications, occasions, warranty, and special features..."
                    className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PRICING & INVENTORY */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Wholesale Cost (পাইকারি কেনা দাম ৳)
                    </label>
                    <input
                      type="number"
                      value={wholesalePrice}
                      onChange={(e) => setWholesalePrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Retail Selling Price (বিক্রয় মূল্য ৳) *
                    </label>
                    <input
                      type="number"
                      required
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0B0D13] border border-amber-500/50 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono text-sm font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Catalog MSRP / Original Price (৳)
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-neutral-400 line-through font-mono text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium text-xs mb-1">
                    Available Stock Units (মজুদ সংখ্যা) *
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full sm:w-1/3 bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold outline-none"
                  />
                </div>

                {/* Live Profit Margin & Commission Summary Card */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-amber-500/30 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Percent className="w-4 h-4" />
                      <span>Automated Profit Margin & Platform Cut Calculation</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Category Commission: {commissionRate}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-[11px] text-neutral-400 block">Platform Fee ({commissionRate}%)</span>
                      <span className="text-sm font-mono font-bold text-rose-400">
                        -৳{platformFeePerUnit.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-[11px] text-neutral-400 block">Wholesale Cost</span>
                      <span className="text-sm font-mono font-bold text-neutral-300">
                        ৳{wholesalePrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-[11px] text-neutral-400 block">Net Payout to Wallet</span>
                      <span className="text-sm font-mono font-bold text-amber-400">
                        ৳{sellerNetPerUnit.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-emerald-500/30">
                      <span className="text-[11px] text-emerald-400 block">Net Profit Margin</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        +৳{netProfitPerUnit.toLocaleString()} ({profitMarginPercent}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: MEDIA (MULTI-PHOTO & UNBOXING VIDEO) */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                {/* Photo Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Product Photos Gallery ({galleryImages.length} images uploaded)</span>
                    </label>
                    <span className="text-[11px] text-neutral-400">Click star to select Hero image</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-neutral-900 group ${
                          primaryImageIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-neutral-800'
                        }`}
                      >
                        <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Primary Badge */}
                        {primaryImageIndex === idx ? (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px]">
                            HERO IMAGE
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(idx)}
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 hover:bg-black/90 text-neutral-300 hover:text-white text-[9px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            Set Hero
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Upload New Box */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-neutral-700 hover:border-amber-400/70 bg-[#0B0D13] flex flex-col items-center justify-center p-3 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-xs font-semibold">Upload Photo</span>
                      <span className="text-[10px] text-neutral-500">JPG, PNG, WEBP</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Add via URL */}
                  <form onSubmit={handleAddCustomImageUrl} className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Or paste high-res image URL (e.g. Unsplash or direct CDN)..."
                      className="flex-1 bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      Add URL
                    </button>
                  </form>
                </div>

                {/* Unboxing Video Showcase */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2 text-xs">
                  <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>Embedded Unboxing / 360° Showcase Video URL</span>
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://... (MP4 video showcase stream)"
                    className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white font-mono outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    Enables the 360° interactive video player overlay on customer Product Detail Page.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: VARIATIONS & SPECS */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                {/* Colors Variations */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Color Variations ({colors.length})</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">Click to toggle stock</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131722] border border-neutral-700 text-xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-white font-medium">{c.name}</span>
                        <button
                          type="button"
                          onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-neutral-500 hover:text-rose-400 ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Add Color (e.g. Royal Maroon)"
                      className="flex-1 bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-10 h-9 rounded-xl bg-[#131722] border border-neutral-700 p-0.5 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Size Variations */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>Size & Capacity Variations ({sizes.length})</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131722] border border-neutral-700 text-xs"
                      >
                        <span className="text-white font-medium">{s.name}</span>
                        <button
                          type="button"
                          onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-neutral-500 hover:text-rose-400 ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <input
                      type="text"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      placeholder="Add Size (e.g. 42 / 50ml / 128GB)"
                      className="flex-1 bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
                  <span className="font-bold text-white text-xs block">
                    Product Specifications & Authenticity Sheet
                  </span>

                  <div className="space-y-1.5 text-xs">
                    {specifications.map((sp, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#131722] border border-neutral-800">
                        <span className="text-neutral-400">{sp.label}:</span>
                        <span className="text-white font-medium">{sp.value}</span>
                        <button
                          type="button"
                          onClick={() => setSpecifications((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <input
                      type="text"
                      value={newSpecLabel}
                      onChange={(e) => setNewSpecLabel(e.target.value)}
                      placeholder="Label (e.g. Fabric / Warranty)"
                      className="bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Value (e.g. 100% Pure Silk)"
                        className="flex-1 bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: LOGISTICS & PACKAGING */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Package Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.1)}
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Warranty Policy *
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="e.g. 7 Days Return & Replacement"
                      className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2 text-xs">
                  <span className="font-bold text-white block">Cash on Delivery (COD) Nationwide Policy:</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="codPolicy"
                        checked={codSupported}
                        onChange={() => setCodSupported(true)}
                        className="accent-amber-400"
                      />
                      <span>Supported with Mandatory Advance Delivery Fee clearance via bKash/Nagad</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="codPolicy"
                        checked={!codSupported}
                        onChange={() => setCodSupported(false)}
                        className="accent-amber-400"
                      />
                      <span>100% Full Advance Payment Required</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2 text-xs text-neutral-300">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Express Logistics Partners (All 64 Districts)</span>
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Auto-dispatched via Pathao Express, RedX Nationwide Logistics, and Steadfast Courier Parcel network.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Footer */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((s) => Math.max(1, s - 1) as any)}
                className="py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((s) => Math.min(5, s + 1) as any)}
                  className="py-2.5 px-6 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handlePublish}
                  className="py-2.5 px-7 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isPublishing ? (
                    <span>Publishing & Syncing...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publish & Auto-Sync to Marketplace</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
