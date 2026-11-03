import {
  Product,
  CourierConfig,
  Voucher,
  SellerProfile,
  Order,
  UserAccountProfile,
  SubAdminMember,
  FlaggedChatMessage,
  ModerationAuditItem,
  OrderDispute,
  SmsGatewayLog,
  DailyPayoutSummary,
  PromotionalBanner
} from '../types';

export const OFFICIAL_LOGO = '/assets/aistudio/1790658673053_abd6ce4e.jpg';

export const INITIAL_USER_ACCOUNTS: UserAccountProfile[] = [
  {
    id: 'acc_cust_01',
    name: 'Rahim Chowdhury',
    phone: '+8801799887766',
    email: 'rahim.chowdhury@fluxmart.bd',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tagline: 'VIP Gold Connoisseur · Gulshan, Dhaka',
    loyaltyPoints: 1250
  },
  {
    id: 'acc_seller_02',
    name: 'Tanvir Hossain',
    phone: '+8801712345678',
    email: 'tanvir@auralifestyle.bd',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    shopName: 'Aura Lifestyle & Tech BD',
    tagline: 'Verified Official Merchant · 4.85★'
  },
  {
    id: 'acc_cust_03',
    name: 'Nusrat Jahan',
    phone: '+8801822334455',
    email: 'nusrat.jahan@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    tagline: 'Fashion & Handloom Lover · Dhanmondi, Dhaka',
    loyaltyPoints: 850
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_fash_01',
    title: 'Heritage Royal Black Silk Panjabi with Hand-Embroidery',
    titleBn: 'হেরিটেজ রয়্যাল ব্ল্যাক সিল্ক পাঞ্জাবি (জরীর সূক্ষ্ম কাজসহ)',
    category: 'fashion',
    subCategory: 'Royal Panjabi & Kurtas',
    price: 4950,
    originalPrice: 6500,
    stock: 42,
    sku: 'FLX-FSH-001',
    brand: 'Nawab Silk House',
    sellerId: 'seller_dhaka_01',
    sellerName: 'Nawab Exclusive Dhaka',
    sellerUniqueId: 'FLUX-MART-542',
    sellerVerified: true,
    rating: 4.9,
    reviewCount: 128,
    image: '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg',
    gallery: [
      '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Obsidian Jet Black', hex: '#111827', inStock: true },
      { name: 'Royal Gold & White', hex: '#E5A93C', inStock: true },
      { name: 'Imperial Maroon', hex: '#7F1D1D', inStock: true },
      { name: 'Midnight Navy Blue', hex: '#1E3A8A', inStock: false }
    ],
    sizes: [
      { name: 'S (38")', inStock: true },
      { name: 'M (40")', inStock: true },
      { name: 'L (42")', inStock: true },
      { name: 'XL (44")', inStock: true },
      { name: 'XXL (46")', inStock: true },
      { name: '3XL (48")', inStock: false }
    ],
    fabricTypes: [
      { name: '100% Pure Rajshahi Silk', inStock: true },
      { name: 'Combed Egyptian Cotton Weave', inStock: true },
      { name: 'Organic Royal Linen Blend', inStock: true },
      { name: 'Zari Metallic Hand-Woven Silk', inStock: false }
    ],
    specifications: [
      { label: 'Fabric Composition', value: '100% Pure Rajshahi Silk with Gold Weave' },
      { label: 'Collar Style', value: 'High Mandarin Collar with Hand Zardozi Embroidery' },
      { label: 'Buttons', value: 'Pure Brass Custom Engraved FLUX Metal Buttons' },
      { label: 'Care Instructions', value: 'Dry Clean Recommended' },
      { label: 'Country of Origin', value: 'Bangladesh (Artisanal Heritage)' }
    ],
    description: 'Masterfully woven pure Rajshahi silk blended with intricate gold zardozi stitching on collar and placket. Designed for Eid festivals, weddings, and executive banquets.',
    descriptionBn: 'খাঁটি রাজশাহী সিল্ক কাপড়ে স্বর্ণালী জর্দোসি কাজের নজরকাড়া কারুকাজ। ঈদ উৎসব, বিবাহ এবং ভিআইপি অনুষ্ঠানের জন্য প্রিমিয়াম পছন্দ।',
    weightKg: 0.65,
    codSupported: true,
    warranty: '100% Pure Silk Guarantee (7 days exchange)',
    courierSupported: ['pathao', 'redx', 'steadfast'],
    featured: true
  },
  {
    id: 'prod_elec_02',
    title: 'Aura Pro Gold Edition Wireless ANC Earbuds (38h Playtime)',
    titleBn: 'অরা প্রো গোল্ড এডিশন ওয়্যারলেস এএনসি ইয়ারবাডস (৩৮ ঘণ্টা প্লেটাইম)',
    category: 'electronics',
    subCategory: 'Audio & Wireless Acoustics',
    price: 3890,
    originalPrice: 5200,
    stock: 65,
    sku: 'FLX-ELC-002',
    brand: 'Aura Sound BD',
    sellerId: 'seller_chittagong_02',
    sellerName: 'ElectroHub Agrabad',
    sellerUniqueId: 'FLUX-MART-889',
    sellerVerified: true,
    rating: 4.8,
    reviewCount: 94,
    image: '/src/assets/images/electronics_earbuds_gold_1793376787374.jpg',
    gallery: [
      '/src/assets/images/electronics_earbuds_gold_1793376787374.jpg',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Champagne Gold', hex: '#E5A93C', inStock: true },
      { name: 'Matte Stealth Black', hex: '#1E293B', inStock: true },
      { name: 'Pure Pearl White', hex: '#F8FAFC', inStock: true }
    ],
    sizes: [
      { name: 'Standard ANC (38h Case)', inStock: true },
      { name: 'Pro Wireless Qi Case (+৳400)', inStock: true }
    ],
    deviceModels: [
      { brand: 'Universal', model: 'iOS & Android Dual Pairing (BT 5.3)', inStock: true },
      { brand: 'Apple', model: 'Optimized for iPhone / iPad / Mac AAC', inStock: true },
      { brand: 'Samsung', model: 'Seamless Scalable Codec 24-Bit', inStock: true }
    ],
    specifications: [
      { label: 'Active Noise Cancellation', value: 'Hybrid ANC up to -35dB Depth' },
      { label: 'Driver Size', value: '11mm Dual Titanium Diaphragm Drivers' },
      { label: 'Battery Life', value: '8.5h Single Charge, 38h with Charging Case' },
      { label: 'Water Resistance', value: 'IPX5 Sweat & Splash Resistant' },
      { label: 'Bluetooth Codec', value: 'Bluetooth 5.3 with LDAC & AAC Hi-Res' }
    ],
    description: 'Active Noise Cancellation (-35dB), dual titanium drivers, 24-bit Hi-Res audio codec, IPX5 water resistance, and fast Type-C quick charging.',
    descriptionBn: '৩৫ ডেসিবল পর্যন্ত হাইব্রিড অ্যাক্টিভ নয়েজ ক্যান্সেলেশন, টাইটানিয়াম ড্রাইভার, ক্রিস্টাল ক্লিয়ার কল কোয়ালিটি এবং টাইপ-সি ফাস্ট চার্জিং।',
    weightKg: 0.28,
    codSupported: true,
    warranty: '1 Year Official Brand Warranty with Replacement',
    courierSupported: ['pathao', 'redx', 'steadfast'],
    featured: true
  },
  {
    id: 'prod_tech_07',
    title: 'Aura Armor MagSafe Kevlar Case for Flagship Smartphones',
    titleBn: 'অরা আর্মার ম্যাগসেফ কেভলার ফোন কেস (ফ্ল্যাগশিপ স্মার্টফোনের জন্য)',
    category: 'electronics',
    subCategory: 'Mobile Accessories & Protection',
    price: 1950,
    originalPrice: 2800,
    stock: 88,
    sku: 'FLX-ELC-007',
    brand: 'Aura Armor Labs',
    sellerId: 'seller_chittagong_02',
    sellerName: 'ElectroHub Agrabad',
    sellerUniqueId: 'FLUX-MART-889',
    sellerVerified: true,
    rating: 4.92,
    reviewCount: 114,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Matte Carbon Black', hex: '#111827', inStock: true },
      { name: 'Dark Titanium Gray', hex: '#4B5563', inStock: true },
      { name: 'Royal Gold Accent Trim', hex: '#E5A93C', inStock: true },
      { name: 'Deep Midnight Blue', hex: '#1E3A8A', inStock: true }
    ],
    deviceModels: [
      { brand: 'Apple', model: 'iPhone 16 Pro Max', inStock: true },
      { brand: 'Apple', model: 'iPhone 16 Pro', inStock: true },
      { brand: 'Apple', model: 'iPhone 15 Pro Max', inStock: true },
      { brand: 'Samsung', model: 'Galaxy S24 Ultra', inStock: true },
      { brand: 'Samsung', model: 'Galaxy S23 Ultra', inStock: true },
      { brand: 'Google', model: 'Pixel 8 Pro', inStock: true },
      { brand: 'OnePlus', model: 'OnePlus 12', inStock: false }
    ],
    materials: [
      { name: '600D Real Aramid Fiber (Kevlar)', inStock: true },
      { name: 'Matte Liquid Silicone (Velvet Lining)', inStock: true },
      { name: 'Aerospace Aluminum Armor Bumper', inStock: true },
      { name: 'Italian Nappa Vegan Leather', inStock: false }
    ],
    specifications: [
      { label: 'MagSafe Magnetics', value: 'N52 Ultra-Strong 15W Alignment Ring' },
      { label: 'Drop Protection', value: 'Military Grade MIL-STD-810G (3.5m / 12ft)' },
      { label: 'Camera Guard', value: '1.8mm Raised Aviation Aluminum Bezel' },
      { label: 'Screen Bezel', value: '1.2mm Raised Screen Corner Cushions' },
      { label: 'Wireless Charging', value: 'Fully compatible with Qi & MagSafe pucks' }
    ],
    description: 'Precision engineered 600D ballistic aramid fiber case with embedded N52 neodymium magnetic ring. Military drop-tested to 12 feet with zero signal interference.',
    descriptionBn: 'আসল ৬০০ডি অ্যারামিড ফাইবার এবং এন৫২ শক্তিশালী ম্যাগনেটিক রিং সমৃদ্ধ ফোন কেস। ৩.৫ মিটার ড্রপ প্রটেকশন এবং ম্যাগসেফ ফাস্ট চার্জিং সাপোর্টেড।',
    weightKg: 0.08,
    codSupported: true,
    warranty: 'Lifetime Structural Integrity Guarantee',
    courierSupported: ['pathao', 'redx', 'steadfast'],
    featured: true
  },
  {
    id: 'prod_med_03',
    title: 'Botanical Alchemy Royal Restorative Herbal Extract (30ml)',
    titleBn: 'বোটানিক্যাল অ্যালকেমি রয়েল হার্বাল রিস্টোরেটিভ এসেন্স (৩০ মি.লি.)',
    category: 'medicine',
    subCategory: 'Natural Phytoceuticals & Wellness',
    price: 1850,
    originalPrice: 2400,
    stock: 80,
    sku: 'FLX-MED-003',
    brand: 'Apex Phytoceuticals',
    sellerId: 'seller_dhaka_01',
    sellerName: 'Nawab Exclusive Dhaka',
    sellerUniqueId: 'FLUX-MART-542',
    sellerVerified: true,
    rating: 4.9,
    reviewCount: 56,
    image: '/src/assets/images/health_wellness_serum_1793376788053.jpg',
    gallery: [
      '/src/assets/images/health_wellness_serum_1793376788053.jpg',
      'https://images.unsplash.com/photo-1608248597359-53e7f415307a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1608248597359-53e7f415307a?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Amber Gold Dropper', hex: '#D97706', inStock: true },
      { name: 'Frosted Glass Flacon', hex: '#E2E8F0', inStock: true }
    ],
    packSizes: [
      { label: '30ml Dropper Bottle', inStock: true },
      { label: '60ml Family Duo Pack', inStock: true },
      { label: '100ml Value Clinic Pack', inStock: false }
    ],
    dosageOrUnits: ['5-10 Drops Twice Daily', '100% Cold-Pressed Organic Extract', 'Alcohol-Free Formulation'],
    expiryDate: '12/2027',
    batchNumber: 'FLX-MED-8821',
    dgdaRegNumber: 'DGDA-AYUR-89241',
    specifications: [
      { label: 'Certification', value: 'DGDA Approved & GMP Compliant' },
      { label: 'Active Ingredients', value: 'Organic Ashwagandha, Moringa Seed, Vitamin E' },
      { label: 'Formulation', value: 'Cold-pressed 100% Organic Bio-Extract' },
      { label: 'Recommended Dosage', value: '5-10 drops in warm water twice daily' },
      { label: 'Shelf Life', value: '24 Months from Manufacture (Exp: 12/2027)' }
    ],
    description: 'GMP certified therapeutic botanicals formulated with organic ashwagandha, moringa seed extract, and vitamin E antioxidants. Boosts immunity and cellular vitality.',
    descriptionBn: 'জিএমপি সার্টিফাইড ভেষজ এসেন্স। অর্গানিক অশ্বগন্ধা, সজিনা বীজ ও ভিটামিন ই সমৃদ্ধ প্রাকৃতিক রোগ প্রতিরোধক ড্রপ।',
    weightKg: 0.22,
    codSupported: true,
    warranty: 'DGDA Approved Ayurvedic Formulation (Strict Batch Verification)',
    courierSupported: ['pathao', 'redx'],
    featured: true
  },
  {
    id: 'prod_house_04',
    title: 'Artisanal Hand-Hammered Royal Brass Tea Kettle & Cup Set',
    titleBn: 'হস্তশিল্পে নির্মিত রয়্যাল খাঁটি পিতলের চা কেটলি ও পেয়ালা সেট',
    category: 'household',
    subCategory: 'Artisanal Brass & Living',
    price: 4200,
    originalPrice: 5800,
    stock: 24,
    sku: 'FLX-HSE-004',
    brand: 'Bengal Artisan Guild',
    sellerId: 'seller_chittagong_02',
    sellerName: 'ElectroHub Agrabad',
    sellerUniqueId: 'FLUX-MART-889',
    sellerVerified: true,
    rating: 4.7,
    reviewCount: 43,
    image: '/src/assets/images/household_brass_kettle_1793376787692.jpg',
    gallery: [
      '/src/assets/images/household_brass_kettle_1793376787692.jpg',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Antique Hand-Polished Brass', hex: '#CA8A04', inStock: true },
      { name: 'Vintage Oxidized Copper', hex: '#B45309', inStock: true }
    ],
    sizes: [
      { name: 'Single Kettle (1.2L)', inStock: true },
      { name: 'Full Set: Kettle + 4 Brass Cups', inStock: true },
      { name: 'Imperial Banquet Set (+ Serving Tray)', inStock: false }
    ],
    materials: [
      { name: '100% Solid Dhamrai Brass', inStock: true },
      { name: 'Pure Hammered Copper Interior', inStock: true }
    ],
    specifications: [
      { label: 'Material', value: '100% Solid Bengali Brass (Dhamrai Guild)' },
      { label: 'Handle Material', value: 'Heat-Insulated Carved Teakwood' },
      { label: 'Capacity', value: '1.2 Liters (approx 6-8 traditional cups)' },
      { label: 'Stovetop Compatibility', value: 'Gas, Electric, Ceramic, Flame safe' },
      { label: 'Craftsmanship', value: 'Hand-hammered traditional mastercraft' }
    ],
    description: 'Hand-beaten solid brass kettle with carved rosewood insulated grip. Crafted by hereditary metalsmiths of Dhamrai, Dhaka. Collector quality home accent.',
    descriptionBn: 'ধামরাইয়ের ঐতিহ্যবাহী কারিগরদের হাতে তৈরি খাঁটি পিতলের কেটলি। রোজউড কাঠের হাতলসহ যা আধুনিক খাবার টেবিলে আভিজাত্য এনে দেয়।',
    weightKg: 1.45,
    codSupported: true,
    warranty: 'Lifetime Metal Purity Guarantee',
    courierSupported: ['pathao', 'redx', 'steadfast'],
    featured: true
  },
  {
    id: 'prod_fash_05',
    title: 'Exquisite Dhakai Jamdani Handloom Saree (Pure Zari Floral)',
    titleBn: 'ঐতিহ্যবাহী এক্সক্লুসিভ ঢাকাই জামদানি শাড়ি (খাঁটি জরির কাজ)',
    category: 'fashion',
    subCategory: 'Dhakai Jamdani & Silk Heritage',
    price: 8900,
    originalPrice: 12500,
    stock: 18,
    sku: 'FLX-FSH-005',
    brand: 'Nawab Silk House',
    sellerId: 'seller_dhaka_01',
    sellerName: 'Nawab Exclusive Dhaka',
    sellerUniqueId: 'FLUX-MART-542',
    sellerVerified: true,
    rating: 4.95,
    reviewCount: 79,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Royal Crimson & Gold', hex: '#991B1B', inStock: true },
      { name: 'Ivory White & Gold Zari', hex: '#FEF08A', inStock: true },
      { name: 'Emerald Forest Green', hex: '#065F46', inStock: true }
    ],
    sizes: [
      { name: 'Standard 12 Haat with Unstitched Blouse Piece (80cm)', inStock: true }
    ],
    fabricTypes: [
      { name: '84-Count Fine Cotton & Gold Zari', inStock: true },
      { name: '100-Count Ultra-Light Mulberry Jamdani', inStock: true },
      { name: 'Organza Silk Blend', inStock: false }
    ],
    specifications: [
      { label: 'Weaving Technique', value: '100% Traditional Handloom Shuttle Weaving' },
      { label: 'Count', value: '84 Count High-Grade Cotton & Metallic Zari' },
      { label: 'Origin', value: 'Rupganj, Narayanganj (GI Certified)' },
      { label: 'Includes', value: 'Unstitched matching blouse piece (80cm)' }
    ],
    description: 'Authentic UNESCO-recognized Dhakai Jamdani hand-woven over 4 weeks by master artisans. Intricate geometric floral buti work with real gold luster.',
    descriptionBn: 'নারায়ণগঞ্জের ঐতিহ্যবাহী তাঁতিদের ৪ সপ্তাহের পরম যত্নে বোনা খাঁটি ঢাকাই জামদানি। রেশমি সুতা ও সোনালী জরির জাদুকরী কাজ।',
    weightKg: 0.55,
    codSupported: true,
    warranty: 'GI Certified Authentic Jamdani Guarantee',
    courierSupported: ['pathao', 'redx', 'steadfast'],
    featured: true
  },
  {
    id: 'prod_elec_06',
    title: 'Titan Aero AMOLED Smartwatch with Bluetooth Calling & GPS',
    titleBn: 'টাইটান অ্যারো অ্যামোলেড স্মার্টওয়াচ (ব্লুটুথ কলিং ও জিপিএস)',
    category: 'electronics',
    subCategory: 'Wearables & Smart Tech',
    price: 5490,
    originalPrice: 7500,
    stock: 35,
    sku: 'FLX-ELC-006',
    brand: 'Aura Sound BD',
    sellerId: 'seller_chittagong_02',
    sellerName: 'ElectroHub Agrabad',
    sellerUniqueId: 'FLUX-MART-889',
    sellerVerified: true,
    rating: 4.82,
    reviewCount: 62,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Space Black with Sport Band', hex: '#0F172A', inStock: true },
      { name: 'Titanium Gold with Milanese Loop', hex: '#E5A93C', inStock: true },
      { name: 'Silver Steel Edition', hex: '#94A3B8', inStock: true }
    ],
    sizes: [
      { name: '46mm AMOLED (Display 1.43")', inStock: true },
      { name: '42mm Slim Edition', inStock: true }
    ],
    deviceModels: [
      { brand: 'Universal', model: 'Syncs with iOS 14+ & Android 8.0+', inStock: true }
    ],
    materials: [
      { name: 'Titanium Alloy Bezel + Ceramic Back', inStock: true },
      { name: 'Stainless Steel Case + Sapphire Glass', inStock: true }
    ],
    specifications: [
      { label: 'Display', value: '1.43" Ultra HD AMOLED (1000 nits Peak)' },
      { label: 'Battery Life', value: 'Up to 14 days standby, 7 days typical use' },
      { label: 'Sensors', value: 'SpO2, Heart Rate, Stress, Sleep, Pedometer' },
      { label: 'Connectivity', value: 'Dual-mic Bluetooth 5.3 Calling & Notifications' },
      { label: 'Water Resistance', value: '5ATM (50 meters swimming proof)' }
    ],
    description: 'Crisp 1.43" AMOLED display with Always-On feature, HD speaker for mobile calls, Bangladesh prayer time notification widget, and 100+ fitness tracking modes.',
    descriptionBn: 'উচ্চ ব্রাইটনেস অ্যামোলেড ডিসপ্লে, সরাসরি ঘড়ি থেকেই কথা বলার জন্য এইচডি স্পিকার ও মাইক্রোফোন, ৫ এটিএম ওয়াটারপ্রুফ এবং টানা ১৪ দিন ব্যাটারি লাইফ।',
    weightKg: 0.35,
    codSupported: true,
    warranty: '18 Months Official Warranty with Replacement',
    courierSupported: ['pathao', 'redx', 'steadfast'],
    featured: true
  }
];

export const INITIAL_PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'banner_eid_flash',
    tag: '⚡ 24H FLASH SALE',
    tagColor: 'from-amber-500 to-yellow-400',
    title: 'Grand Eid Luxury Collection',
    titleBn: 'গ্র্যান্ড ঈদ লাক্সারি কালেকশন',
    subtitle: 'Pure Rajshahi Silk Panjabi & GI Certified Jamdani Sarees with instant Pathao express dispatch.',
    subtitleBn: 'খাঁটি রাজশাহী সিল্ক পাঞ্জাবি ও ঢাকাই জামদানিতে বিশেষ ছাড় এবং দ্রুততম কুরিয়ার ডেলিভারি।',
    discountPercentage: 50,
    couponCode: 'EID2026',
    targetCategory: 'fashion',
    targetProductId: 'prod_fash_01',
    bgGradient: 'from-amber-950/90 via-[#18130B] to-[#0B0D13]',
    imageUrl: '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg',
    expiryHours: 14,
    ctaText: 'Claim 50% Flash Offer',
    ctaTextBn: '৫০% অফার নিন'
  },
  {
    id: 'banner_tech_gala',
    tag: '🎧 AUDIO & FLAGSHIP GEAR',
    tagColor: 'from-sky-500 to-indigo-400',
    title: 'Aura Sound & Protection Gala',
    titleBn: 'অরা সাউন্ড ও ফ্ল্যাগশিপ গ্যাজেট গালা',
    subtitle: 'Hybrid ANC Earbuds (-35dB) & Military Drop-Tested MagSafe Aramid Kevlar cases.',
    subtitleBn: 'হাইব্রিড এএনসি ইয়ারবাডস এবং মিলিটারি-গ্রেড ম্যাগসেফ অ্যারামিড কেস স্পেশাল ডিসকাউন্টে।',
    discountPercentage: 30,
    couponCode: 'FLUXTECH',
    targetCategory: 'electronics',
    targetProductId: 'prod_elec_02',
    bgGradient: 'from-blue-950/80 via-[#0F1626] to-[#0B0D13]',
    imageUrl: '/src/assets/images/electronics_earbuds_gold_1793376787374.jpg',
    expiryHours: 28,
    ctaText: 'Shop Flagship Audio',
    ctaTextBn: 'অডিও গ্যাজেট দেখুন'
  },
  {
    id: 'banner_pharma_wellness',
    tag: '🌿 DGDA CERTIFIED WELLNESS',
    tagColor: 'from-emerald-500 to-teal-400',
    title: 'Pure Herbal Alchemy & Immunity',
    titleBn: 'খাঁটি অর্গানিক ভেষজ ও স্বাস্থ্য সুরক্ষায় বিশেষ ছাড়',
    subtitle: 'Cold-pressed Ashwagandha restorative drops & certified organic botanicals with verified batch QR.',
    subtitleBn: 'ডিজিডিএ অনুমোদিত অর্গানিক অশ্বগন্ধা এসেন্স ও রোগ প্রতিরোধক ভেষজ পণ্য।',
    discountPercentage: 25,
    couponCode: 'HEALTH25',
    targetCategory: 'medicine',
    targetProductId: 'prod_med_03',
    bgGradient: 'from-emerald-950/80 via-[#0B1A14] to-[#0B0D13]',
    imageUrl: '/src/assets/images/health_wellness_serum_1793376788053.jpg',
    expiryHours: 36,
    ctaText: 'Explore Phytoceuticals',
    ctaTextBn: 'ভেষজ পণ্য দেখুন'
  },
  {
    id: 'banner_vip_gold',
    tag: '👑 VIP CONNOISSEUR PASS',
    tagColor: 'from-amber-400 to-yellow-600',
    title: 'Flat 15% VIP Coupon: FLUXGOLD',
    titleBn: 'ভিআইপি মেম্বারদের জন্য ফ্ল্যাট ১৫% ছাড়: FLUXGOLD',
    subtitle: 'Applicable sitewide on verified merchant stores with advance delivery clearance via bKash/Nagad.',
    subtitleBn: 'মার্কেটপ্লেসের সকল ভেরিফাইড মার্চেন্ট স্টোরে বিকাশ ও নগদ পেমেন্টে প্রযোজ্য।',
    discountPercentage: 15,
    couponCode: 'FLUXGOLD',
    targetCategory: 'all',
    bgGradient: 'from-amber-900/60 via-[#1B1710] to-[#0B0D13]',
    imageUrl: '/src/assets/images/household_brass_kettle_1793376787692.jpg',
    expiryHours: 72,
    ctaText: 'Apply VIP Voucher',
    ctaTextBn: 'ভাউচার ব্যবহার করুন'
  }
];

export const INITIAL_COURIERS: CourierConfig[] = [
  {
    id: 'pathao',
    name: 'Pathao Express Parcel',
    enabled: true,
    insideDhakaRate: 60,
    outsideDhakaRate: 120,
    expressRate: 140,
    avgDeliveryHours: 24,
    logoColor: '#DC2626'
  },
  {
    id: 'redx',
    name: 'RedX Nationwide Logistics',
    enabled: true,
    insideDhakaRate: 65,
    outsideDhakaRate: 115,
    expressRate: 150,
    avgDeliveryHours: 36,
    logoColor: '#E11D48'
  },
  {
    id: 'steadfast',
    name: 'Steadfast Courier BD',
    enabled: true,
    insideDhakaRate: 60,
    outsideDhakaRate: 110,
    expressRate: 130,
    avgDeliveryHours: 48,
    logoColor: '#2563EB'
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    code: 'FLUXGOLD',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 2000,
    description: '15% Off VIP Gold privilege (Min ৳2,000)'
  },
  {
    code: 'EID2026',
    discountType: 'fixed',
    discountValue: 250,
    minOrderValue: 1200,
    description: '৳250 Flat Eid discount on orders above ৳1,200'
  },
  {
    code: 'DHAKAFAST',
    discountType: 'fixed',
    discountValue: 60,
    minOrderValue: 800,
    description: 'Free Delivery inside Dhaka (৳60 shipping waive)'
  }
];

export const INITIAL_SELLER_PROFILE: SellerProfile = {
  id: 'seller_current',
  merchantUniqueId: 'FLUX-MART-542',
  shopName: 'Aura Lifestyle & Tech BD',
  ownerName: 'Tanvir Hossain',
  phone: '+8801712345678',
  email: 'tanvir@auralifestyle.bd',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  bio: 'Premier verified tech gear, smart audio & luxury artisanal apparel with official brand warranty in Bangladesh.',
  division: 'Dhaka',
  district: 'Dhaka North',
  address: 'Level 4, Police Plaza Concord, Gulshan-1, Dhaka',
  warehouseLocation: 'Tejgaon Industrial Area, Dhaka',
  kycStatus: 'verified',
  verifiedBadge: true,
  tier: 'platinum',
  fastDispatchScore: 98.4,
  returnRate: 0.6,
  isSuspended: false,
  isListingFrozen: false,
  strikes: [],
  kycDocument: {
    documentType: 'nid',
    documentNumber: '1992269550001429',
    fullNameBengali: 'তানভীর হোসেন',
    fullNameEnglish: 'Tanvir Hossain',
    dateOfBirth: '1992-08-14',
    tradeLicenseNumber: 'TRAD/DSCC/019482/2024',
    frontImage: '/assets/aistudio/1790658673053_abd6ce4e.jpg',
    backImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    faceScanImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    submittedAt: '2026-10-15T11:20:00Z'
  },
  businessCategory: 'Consumer Electronics & Luxury Fashion',
  payoutMethod: 'bkash_merchant',
  payoutAccountDetails: '01712-345678 (bKash Merchant Account)',
  bankName: 'Dutch Bangla Bank Ltd (DBBL)',
  bankAccountNumber: '110.120.482910',
  bankRoutingNumber: '090273415',
  walletBalance: 46800,
  pendingBalance: 12450,
  totalEarnings: 218000,
  rating: 4.85,
  reviews: [
    { id: 'rev_1', customerName: 'Rahim Chowdhury', rating: 5, comment: 'Authentic products and super fast Pathao delivery within Dhaka. Packaging was immaculate!', date: '3 days ago' },
    { id: 'rev_2', customerName: 'Nusrat Jahan', rating: 5, comment: 'Verified merchant guarantee gave me full confidence. The silk Panjabi is original Rajshahi silk.', date: '1 week ago' },
    { id: 'rev_3', customerName: 'Shakil Ahmed', rating: 4.8, comment: 'Quick response on live messenger and genuine warranty card included with the smartwatch.', date: '2 weeks ago' }
  ],
  productViewsCount: 14820,
  joinedDate: 'Jan 2026'
};

export const INITIAL_SELLER_ADMIN_MESSAGES: import('../types').SellerAdminMessage[] = [
  {
    id: 'sam_01',
    sender: 'admin',
    senderName: 'Farhan Kabir (FLUX Super-Admin Desk)',
    senderRole: 'Senior Merchant Operations',
    message: 'Welcome to the FLUX MART Merchant Support Desk. Your shop "Aura Lifestyle & Tech BD" is monitored under our VIP Seller Operations SLA. How can our team assist you today?',
    timestamp: 'Today at 09:30 AM',
    category: 'general'
  },
  {
    id: 'sam_02',
    sender: 'admin',
    senderName: 'Compliance Automated Sentinel',
    senderRole: 'Security Bot',
    message: 'Your NID and Trade License (TRAD/DSCC/019482/2024) are on file. Priority payout clearance is enabled for bKash Merchant and BEFTN commercial banking.',
    timestamp: 'Today at 10:15 AM',
    category: 'kyc'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FLX-2026-9041',
    customerId: 'cust_01',
    customerName: 'Rahim Chowdhury',
    customerPhone: '+8801799887766',
    shippingAddress: {
      division: 'Dhaka',
      district: 'Dhaka (City Core)',
      thana: 'Banani',
      wardNo: '19',
      roadOrBlock: 'Road 11, Block D',
      houseOrVillage: 'House 42, Apt 5B',
      city: 'Dhaka',
      area: 'Banani Block D, Road 11',
      fullAddress: 'House 42, Apt 5B, Road 11, Block D, Ward #19, Banani, Dhaka',
      postalCode: '1213'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariant: 'Size 42 / Black Silk'
      }
    ],
    sellerUniqueId: 'FLUX-MART-542',
    sellerShopName: 'Aura Lifestyle & Tech BD',
    sellerVerified: true,
    subtotal: 4950,
    discount: 742,
    shippingFee: 60,
    advanceDeliveryFeePaid: 60,
    advancePaymentMethod: 'bkash',
    dueAmountOnDelivery: 4208,
    total: 4268,
    paymentMethod: 'bkash',
    paymentStatus: 'advance_paid_cod_pending',
    transactionId: 'BK-ADV-DELIVERY-984210',
    orderStatus: 'to_receive',
    courier: {
      provider: 'pathao',
      trackingNumber: 'PTH-984210',
      estimatedDelivery: 'Tomorrow, by 4:00 PM',
      shippingCharge: 60,
      currentStatus: 'Out for Delivery (Rider: Asadul Islam, 01844-902188)',
      checkpoints: [
        {
          time: 'Today, 08:30 AM',
          status: 'Out for Delivery',
          location: 'Banani Delivery Hub, Dhaka',
          description: 'Rider Asadul Islam is en route to customer doorstep.'
        },
        {
          time: 'Yesterday, 10:15 PM',
          status: 'Hub Inscan & Sorting',
          location: 'Tejgaon Central Sorting Facility',
          description: 'Package arrived at regional hub and cleared automated barcoding.'
        },
        {
          time: 'Yesterday, 04:00 PM',
          status: 'Picked Up by Courier',
          location: 'Gulshan Merchant Warehouse',
          description: 'Parcel collected from seller Nawab Exclusive Dhaka.'
        }
      ]
    },
    orderDate: '2026-10-28 14:22',
    voucherCode: 'FLUXGOLD',
    sellerPayout: 3755,
    platformFee: 513
  },
  {
    id: 'FLX-2026-8812',
    customerId: 'cust_01',
    customerName: 'Rahim Chowdhury',
    customerPhone: '+8801799887766',
    shippingAddress: {
      division: 'Dhaka',
      district: 'Dhaka (City Core)',
      thana: 'Dhanmondi',
      wardNo: '15',
      roadOrBlock: 'Road 8A',
      houseOrVillage: 'House 14, Flat 3A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      fullAddress: 'House 14, Flat 3A, Road 8A, Ward #15, Dhanmondi, Dhaka',
      postalCode: '1209'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1
      }
    ],
    subtotal: 3890,
    discount: 250,
    shippingFee: 65,
    advanceDeliveryFeePaid: 3705,
    advancePaymentMethod: 'nagad',
    dueAmountOnDelivery: 0,
    total: 3705,
    paymentMethod: 'nagad',
    paymentStatus: 'paid',
    transactionId: 'NG-AUTODIR-77218402',
    orderStatus: 'to_ship',
    courier: {
      provider: 'redx',
      trackingNumber: 'RDX-44218',
      estimatedDelivery: 'In 2 days',
      shippingCharge: 65,
      currentStatus: 'Ready for Pickup at Merchant Hub',
      checkpoints: [
        {
          time: 'Today, 09:15 AM',
          status: 'Order Verified',
          location: 'Chittagong Hub',
          description: 'Merchant packaged product. RedX pickup manifest generated.'
        }
      ]
    },
    orderDate: '2026-10-29 17:45',
    voucherCode: 'EID2026',
    sellerPayout: 3408,
    platformFee: 297
  }
];

export const INITIAL_SUB_ADMINS: SubAdminMember[] = [
  // Team Group A: KYC & Seller Operations (5 Members)
  {
    id: 'subadmin_kyc_01',
    name: 'Anisur Rahman',
    email: 'kyc.subadmin@fluxmart.bd',
    phone: '+8801911000001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    team: 'group_a_kyc',
    roleTitle: 'Lead KYC & Merchant Verification Auditor',
    onDuty: true,
    tasksCompleted: 142,
    currentStatus: 'Reviewing Dhaka Merchant NID Submissions'
  },
  {
    id: 'subadmin_kyc_02',
    name: 'Sabina Yasmin',
    email: 'sabina.kyc@fluxmart.bd',
    phone: '+8801911000005',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    team: 'group_a_kyc',
    roleTitle: 'Biometric Face Match Specialist',
    onDuty: true,
    tasksCompleted: 98,
    currentStatus: 'Verifying Liveness Biometric Tests'
  },
  {
    id: 'subadmin_kyc_03',
    name: 'Farhan Kabir',
    email: 'farhan.kyc@fluxmart.bd',
    phone: '+8801911000006',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    team: 'group_a_kyc',
    roleTitle: 'Merchant Onboarding & Stock Monitor',
    onDuty: true,
    tasksCompleted: 115,
    currentStatus: 'Auditing Warehouse Inventories'
  },
  {
    id: 'subadmin_kyc_04',
    name: 'Tanjila Akter',
    email: 'tanjila.kyc@fluxmart.bd',
    phone: '+8801911000007',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    team: 'group_a_kyc',
    roleTitle: 'Trade License & DBID Compliance Inspector',
    onDuty: false,
    tasksCompleted: 87,
    currentStatus: 'Off-Duty (Standby)'
  },
  {
    id: 'subadmin_kyc_05',
    name: 'Rayhan Siddique',
    email: 'rayhan.kyc@fluxmart.bd',
    phone: '+8801911000008',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    team: 'group_a_kyc',
    roleTitle: 'Merchant Disciplinary & Strikes Officer',
    onDuty: true,
    tasksCompleted: 76,
    currentStatus: 'Issuing Formal Warning Notices'
  },

  // Team Group B: Customer Support, Fraud Prevention & Chat Monitoring (5 Members)
  {
    id: 'subadmin_fraud_01',
    name: 'Mahinul Islam',
    email: 'support.subadmin@fluxmart.bd',
    phone: '+8801911000002',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    team: 'group_b_support_fraud',
    roleTitle: 'Lead Fraud Prevention & Anti-Circumvention Officer',
    onDuty: true,
    tasksCompleted: 184,
    currentStatus: 'Auditing In-App Messages for Phone Leaks'
  },
  {
    id: 'subadmin_fraud_02',
    name: 'Nusrat Parveen',
    email: 'nusrat.fraud@fluxmart.bd',
    phone: '+8801911000009',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    team: 'group_b_support_fraud',
    roleTitle: 'Off-Platform MFS Transaction Auditor',
    onDuty: true,
    tasksCompleted: 129,
    currentStatus: 'Investigating bKash Bypass Patterns'
  },
  {
    id: 'subadmin_fraud_03',
    name: 'Shakil Ahmed',
    email: 'shakil.support@fluxmart.bd',
    phone: '+8801911000010',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    team: 'group_b_support_fraud',
    roleTitle: 'Live Chat Sentinel & Customer Advocate',
    onDuty: true,
    tasksCompleted: 210,
    currentStatus: 'Handling Active Customer Inquiries'
  },
  {
    id: 'subadmin_fraud_04',
    name: 'Fariha Chowdhury',
    email: 'fariha.support@fluxmart.bd',
    phone: '+8801911000011',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    team: 'group_b_support_fraud',
    roleTitle: 'VIP Customer Support Executive',
    onDuty: false,
    tasksCompleted: 94,
    currentStatus: 'Off-Duty (Standby)'
  },
  {
    id: 'subadmin_fraud_05',
    name: 'Zubair Hossain',
    email: 'zubair.fraud@fluxmart.bd',
    phone: '+8801911000012',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    team: 'group_b_support_fraud',
    roleTitle: 'Disciplinary Enforcement & Seller Sanctions',
    onDuty: true,
    tasksCompleted: 163,
    currentStatus: 'Executing Chat Restrictions'
  },

  // Team Group C: Content Moderation, Product Audit & Quality Control (5 Members)
  {
    id: 'subadmin_content_01',
    name: 'Ariful Haque',
    email: 'content.subadmin@fluxmart.bd',
    phone: '+8801911000003',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    team: 'group_c_content',
    roleTitle: 'Lead Content Moderation & Catalog Gatekeeper',
    onDuty: true,
    tasksCompleted: 230,
    currentStatus: 'Screening New Product Uploads'
  },
  {
    id: 'subadmin_content_02',
    name: 'Shamima Nasrin',
    email: 'shamima.audit@fluxmart.bd',
    phone: '+8801911000013',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    team: 'group_c_content',
    roleTitle: 'Catalog High-Res Image & Description Auditor',
    onDuty: true,
    tasksCompleted: 174,
    currentStatus: 'Verifying Real Product Photography'
  },
  {
    id: 'subadmin_content_03',
    name: 'Kamrul Hasan',
    email: 'kamrul.reels@fluxmart.bd',
    phone: '+8801911000014',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    team: 'group_c_content',
    roleTitle: 'Shoppable Reels & Video Screener',
    onDuty: true,
    tasksCompleted: 145,
    currentStatus: 'Reviewing Trending Reels for Appropriateness'
  },
  {
    id: 'subadmin_content_04',
    name: 'Nafis Iqbal',
    email: 'nafis.audit@fluxmart.bd',
    phone: '+8801911000015',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    team: 'group_c_content',
    roleTitle: 'Counterfeit & Intellectual Property Specialist',
    onDuty: true,
    tasksCompleted: 89,
    currentStatus: 'Checking Brand Authorizations & Trademarks'
  },
  {
    id: 'subadmin_content_05',
    name: 'Sadia Jahan',
    email: 'sadia.content@fluxmart.bd',
    phone: '+8801911000016',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    team: 'group_c_content',
    roleTitle: 'DGDA & Drug Formulation Compliance Officer',
    onDuty: false,
    tasksCompleted: 102,
    currentStatus: 'Off-Duty (Standby)'
  },

  // Team Group D: Logistics & Courier Reconciliation (5 Members)
  {
    id: 'subadmin_logistics_01',
    name: 'Tareq Mahmud',
    email: 'logistics.subadmin@fluxmart.bd',
    phone: '+8801911000004',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
    team: 'group_d_logistics',
    roleTitle: 'Logistics Commander & Courier Reconciliation Lead',
    onDuty: true,
    tasksCompleted: 268,
    currentStatus: 'Monitoring 64 Districts Parcel Hubs'
  },
  {
    id: 'subadmin_logistics_02',
    name: 'Imran Hossain',
    email: 'imran.logistics@fluxmart.bd',
    phone: '+8801911000017',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    team: 'group_d_logistics',
    roleTitle: 'Pathao Express Liaison Officer',
    onDuty: true,
    tasksCompleted: 195,
    currentStatus: 'Syncing Same-Day Metro Dispatch Barcodes'
  },
  {
    id: 'subadmin_logistics_03',
    name: 'Bilkis Begum',
    email: 'bilkis.logistics@fluxmart.bd',
    phone: '+8801911000018',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    team: 'group_d_logistics',
    roleTitle: 'RedX Parcel Reconciliation Officer',
    onDuty: true,
    tasksCompleted: 160,
    currentStatus: 'Reconciling Cash-On-Delivery Handover'
  },
  {
    id: 'subadmin_logistics_04',
    name: 'Ashraful Alam',
    email: 'ashraful.steadfast@fluxmart.bd',
    phone: '+8801911000019',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    team: 'group_d_logistics',
    roleTitle: 'Steadfast Courier Coordinator',
    onDuty: false,
    tasksCompleted: 142,
    currentStatus: 'Off-Duty (Standby)'
  },
  {
    id: 'subadmin_logistics_05',
    name: 'Mizanur Rahman',
    email: 'mizanur.escrow@fluxmart.bd',
    phone: '+8801911000020',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    team: 'group_d_logistics',
    roleTitle: 'Escrow Release & Return Dispute Arbiter',
    onDuty: true,
    tasksCompleted: 189,
    currentStatus: 'Auditing 7-Day Return Escrow Holds'
  }
];

export const INITIAL_FLAGGED_CHATS: FlaggedChatMessage[] = [
  {
    id: 'flag_chat_01',
    sellerId: 'seller_chittagong_02',
    sellerName: 'ElectroHub Agrabad',
    customerId: 'cust_01',
    customerName: 'Rahim Chowdhury',
    customerPhone: '+8801799887766',
    messageText: 'Bhai amar phone number 01788223344. bKash e direct pathan, ami 10% extra discount dibo platform er baire.',
    timestamp: '18 minutes ago',
    flagReason: 'circumvention_deal',
    triggerKeywords: ['01788223344', 'bKash e direct', 'platform er baire', 'discount dibo'],
    severity: 'critical',
    status: 'flagged'
  },
  {
    id: 'flag_chat_02',
    sellerId: 'seller_sylhet_03',
    sellerName: 'Sylhet Craft Emporium',
    customerId: 'cust_03',
    customerName: 'Shakil Ahmed',
    customerPhone: '+8801822334455',
    messageText: 'Call me directly at 01922334455 for outside delivery. Fast courier without FLUX fee.',
    timestamp: '1 hour ago',
    flagReason: 'phone_number_detected',
    triggerKeywords: ['01922334455', 'directly', 'outside delivery', 'without FLUX'],
    severity: 'high',
    status: 'reviewed'
  }
];

export const INITIAL_MODERATION_ITEMS: ModerationAuditItem[] = [
  {
    id: 'mod_item_01',
    targetType: 'product',
    targetId: 'prod_audit_101',
    title: 'Gucci Imperial Silk Zari Saree (Made in Italy Replica)',
    creatorOrSellerName: 'Glamour Queen Fashion',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    category: 'fashion',
    flagReason: 'Counterfeit Trademark Infringement & Unverified Brand Authorization',
    submittedAt: 'Today at 08:45 AM',
    status: 'under_review'
  },
  {
    id: 'mod_item_02',
    targetType: 'product',
    targetId: 'prod_audit_102',
    title: 'Miracle Weight Loss Rapid Formula Drops',
    creatorOrSellerName: 'Bengal Bio Organics',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    category: 'medicine',
    flagReason: 'Missing DGDA Registration Number and Medical Claims Violation',
    submittedAt: 'Yesterday at 04:30 PM',
    status: 'under_review'
  },
  {
    id: 'mod_item_03',
    targetType: 'reel',
    targetId: 'reel_mod_201',
    title: 'Direct WhatsApp Contact for Luxury Watches at 80% Off',
    creatorOrSellerName: 'QuickWatch BD',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    category: 'electronics',
    flagReason: 'Off-Platform WhatsApp QR Code displayed in video reel',
    submittedAt: '2 hours ago',
    status: 'delisted'
  }
];

export const INITIAL_ORDER_DISPUTES: OrderDispute[] = [
  {
    id: 'disp_9041',
    orderId: 'FLX-2026-9041',
    customerId: 'cust_01',
    customerName: 'Rahim Chowdhury',
    sellerId: 'seller_current',
    sellerName: 'Aura Lifestyle & Tech BD',
    reason: 'defective',
    description: 'The luxury silk Panjabi had a torn cuff stitch upon unboxing. Customer uploaded unboxing video and photo proof.',
    evidencePhoto: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    requestedResolution: 'refund',
    status: 'pending_review',
    escrowAmount: 3755,
    createdAt: 'Yesterday, 06:15 PM'
  }
];

export const INITIAL_SMS_LOGS: SmsGatewayLog[] = [
  {
    id: 'sms_log_01',
    recipientPhone: '+8801799887766',
    message: 'FLUX MART: Your OTP is 778800 for Master Super-Admin console clearance. Do NOT share with anyone. Valid for 5 mins.',
    type: 'otp',
    operator: 'Grameenphone',
    status: 'delivered',
    timestamp: 'Today, 10:14 AM',
    gatewayRef: 'GP-BULK-948102'
  },
  {
    id: 'sms_log_02',
    recipientPhone: '+8801799887766',
    message: 'FLUX MART: Advance delivery fee of ৳60 received via bKash. Order #FLX-2026-9041 is confirmed and sent to Pathao Express.',
    type: 'advance_fee',
    operator: 'Grameenphone',
    status: 'delivered',
    timestamp: 'Yesterday, 02:24 PM',
    gatewayRef: 'GP-BULK-947812'
  },
  {
    id: 'sms_log_03',
    recipientPhone: '+8801712345678',
    message: 'FLUX MART: Daily Payout of ৳46,800 has been credited to your bKash Merchant Wallet after 10% platform commission deduction.',
    type: 'payout_alert',
    operator: 'Banglalink',
    status: 'delivered',
    timestamp: 'Yesterday, 11:59 PM',
    gatewayRef: 'BL-MFS-881290'
  },
  {
    id: 'sms_log_04',
    recipientPhone: '+8801799887766',
    message: 'FLUX MART: Pathao Express rider Asadul Islam (+8801844-902188) is out for delivery with parcel #FLX-2026-9041.',
    type: 'order_update',
    operator: 'Grameenphone',
    status: 'delivered',
    timestamp: 'Today, 08:31 AM',
    gatewayRef: 'GP-TRACK-194012'
  }
];

export const INITIAL_DAILY_PAYOUTS: DailyPayoutSummary[] = [
  {
    id: 'payout_batch_01',
    batchNumber: 'FLUX-PAY-2026-1029',
    date: '2026-10-29',
    totalOrdersProcessed: 38,
    grossDeliveredAmount: 184500,
    totalCommissionDeducted: 18450,
    netPayoutDistributed: 166050,
    sellersPaidCount: 14,
    status: 'completed',
    timestamp: '2026-10-29 23:59:00'
  }
];

