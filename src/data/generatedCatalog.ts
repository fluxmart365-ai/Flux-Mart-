import { Product, ProductCategory } from '../types';
import fashionImg from '../assets/images/fashion_panjabi_gold_1793376787056.jpg';
import electronicsImg from '../assets/images/electronics_earbuds_gold_1793376787374.jpg';
import healthImg from '../assets/images/health_wellness_serum_1793376788053.jpg';
import householdImg from '../assets/images/household_brass_kettle_1793376787692.jpg';

/**
 * Demo catalog generator.
 *
 * Produces a large, deterministic set of realistic-looking demo products so the
 * storefront can be browsed with thousands of items. The same seed always yields
 * the same products (stable IDs, prices, titles), so cart items, orders and
 * localStorage overrides keep pointing at the right product between reloads.
 */

export const GENERATED_PRODUCT_COUNT_PER_CATEGORY = 600;
export const GENERATED_PRODUCT_ID_PREFIX = 'gen_';

// Small seeded PRNG (mulberry32) for deterministic output
const createRng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=75`;

type Pair = [en: string, bn: string];

interface SubCategoryDef {
  name: string;
  items: Pair[];
  priceRange: [number, number];
  weightKg: [number, number];
}

interface CategoryDef {
  code: string;
  adjectives: Pair[];
  brands: string[];
  subCategories: SubCategoryDef[];
  images: string[];
  warranty: string[];
  descriptions: Pair[];
}

const SELLERS = [
  { id: 'seller_dhaka_01', name: 'Nawab Exclusive Dhaka', uid: 'FLUX-MART-542' },
  { id: 'seller_chittagong_02', name: 'ElectroHub Agrabad', uid: 'FLUX-MART-889' },
  { id: 'seller_sylhet_03', name: 'Sylhet Craft Emporium', uid: 'FLUX-MART-317' },
  { id: 'seller_rajshahi_04', name: 'Rajshahi Silk Bazaar', uid: 'FLUX-MART-604' },
  { id: 'seller_khulna_05', name: 'Khulna Home Living', uid: 'FLUX-MART-721' },
  { id: 'seller_barishal_06', name: 'Barishal Wellness Pharma', uid: 'FLUX-MART-158' },
  { id: 'seller_rangpur_07', name: 'Rangpur Gadget Point', uid: 'FLUX-MART-933' },
  { id: 'seller_mymensingh_08', name: 'Mymensingh Lifestyle Store', uid: 'FLUX-MART-276' },
  { id: 'seller_gulshan_09', name: 'Gulshan Premium Outlet', uid: 'FLUX-MART-410' },
  { id: 'seller_uttara_10', name: 'Uttara Daily Mart', uid: 'FLUX-MART-865' }
];

const COLORS = [
  { name: 'Obsidian Black', hex: '#111827' },
  { name: 'Royal Gold', hex: '#E5A93C' },
  { name: 'Imperial Maroon', hex: '#7F1D1D' },
  { name: 'Midnight Navy', hex: '#1E3A8A' },
  { name: 'Pearl White', hex: '#F8FAFC' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Ash Grey', hex: '#6B7280' },
  { name: 'Rose Pink', hex: '#DB2777' },
  { name: 'Sky Blue', hex: '#0EA5E9' }
];

const CATEGORIES: Record<ProductCategory, CategoryDef> = {
  fashion: {
    code: 'FSH',
    adjectives: [
      ['Heritage', 'হেরিটেজ'], ['Royal', 'রয়্যাল'], ['Classic', 'ক্লাসিক'], ['Premium', 'প্রিমিয়াম'],
      ['Eid Special', 'ঈদ স্পেশাল'], ['Handloom', 'হ্যান্ডলুম'], ['Designer', 'ডিজাইনার'], ['Casual', 'ক্যাজুয়াল'],
      ['Festive', 'উৎসবের'], ['Slim Fit', 'স্লিম ফিট'], ['Embroidered', 'এমব্রয়ডারি করা'], ['Organic', 'অর্গানিক']
    ],
    brands: ['Nawab Silk House', 'Aarong Style', 'Deshi Dash', 'Rang Bangladesh', 'Yellow Thread', 'Sailor Weave', 'Ecstasy Line', 'Kay Kraft', 'Jamdani Ghar', 'Dhaka Denim Co.'],
    subCategories: [
      { name: 'Royal Panjabi & Kurtas', items: [['Silk Panjabi', 'সিল্ক পাঞ্জাবি'], ['Cotton Panjabi', 'কটন পাঞ্জাবি'], ['Linen Kurta', 'লিনেন কুর্তা'], ['Short Kurti', 'শর্ট কুর্তি']], priceRange: [1200, 6500], weightKg: [0.4, 0.8] },
      { name: 'Sarees & Three-Piece', items: [['Jamdani Saree', 'জামদানি শাড়ি'], ['Katan Saree', 'কাতান শাড়ি'], ['Tant Saree', 'তাঁতের শাড়ি'], ['Three-Piece Set', 'থ্রি-পিস সেট']], priceRange: [1500, 12000], weightKg: [0.5, 1.2] },
      { name: 'Shirts & T-Shirts', items: [['Formal Shirt', 'ফরমাল শার্ট'], ['Polo T-Shirt', 'পোলো টি-শার্ট'], ['Graphic Tee', 'গ্রাফিক টি-শার্ট'], ['Denim Shirt', 'ডেনিম শার্ট']], priceRange: [450, 2800], weightKg: [0.2, 0.5] },
      { name: 'Footwear', items: [['Leather Loafer', 'লেদার লোফার'], ['Running Sneaker', 'রানিং স্নিকার'], ['Kolhapuri Sandal', 'কোলাপুরি স্যান্ডেল'], ['Formal Oxford', 'ফরমাল অক্সফোর্ড']], priceRange: [900, 7500], weightKg: [0.6, 1.4] },
      { name: 'Bags & Accessories', items: [['Leather Wallet', 'লেদার ওয়ালেট'], ['Tote Bag', 'টোট ব্যাগ'], ['Silk Hijab', 'সিল্ক হিজাব'], ['Leather Belt', 'লেদার বেল্ট']], priceRange: [350, 4800], weightKg: [0.1, 0.9] }
    ],
    images: [
      fashionImg,
      unsplash('photo-1583391733956-3750e0ff4e8b'),
      unsplash('photo-1598033129183-c4f50c736f10'),
      unsplash('photo-1617137984095-74e4e5e3613f'),
      unsplash('photo-1610030469983-98e550d6193c'),
      unsplash('photo-1521572163474-6864f9cf17ab'),
      unsplash('photo-1542291026-7eec264c27ff'),
      unsplash('photo-1549298916-b41d501d3772'),
      unsplash('photo-1551028719-00167b16eac5'),
      unsplash('photo-1584917865442-de89df76afd3'),
      unsplash('photo-1596755094514-f87e34085b2c'),
      unsplash('photo-1591047139829-d91aecb6caea')
    ],
    warranty: ['7 days easy exchange', 'Size exchange within 10 days', 'Authentic fabric guarantee'],
    descriptions: [
      ['Carefully tailored with breathable fabric and fine stitching, perfect for festivals, office and everyday wear.', 'আরামদায়ক কাপড় ও সূক্ষ্ম সেলাইয়ে তৈরি — উৎসব, অফিস ও দৈনন্দিন ব্যবহারের জন্য উপযুক্ত।'],
      ['Crafted by local artisans of Bangladesh with long-lasting colour and premium finishing.', 'বাংলাদেশের স্থানীয় কারিগরদের হাতে তৈরি, দীর্ঘস্থায়ী রং ও প্রিমিয়াম ফিনিশিং।']
    ]
  },
  electronics: {
    code: 'ELC',
    adjectives: [
      ['Pro', 'প্রো'], ['Ultra', 'আল্ট্রা'], ['Smart', 'স্মার্ট'], ['Wireless', 'ওয়্যারলেস'],
      ['Gold Edition', 'গোল্ড এডিশন'], ['Max', 'ম্যাক্স'], ['Lite', 'লাইট'], ['Fast-Charge', 'ফাস্ট চার্জ'],
      ['Gaming', 'গেমিং'], ['Compact', 'কমপ্যাক্ট'], ['Next-Gen', 'নেক্সট-জেন'], ['Studio', 'স্টুডিও']
    ],
    brands: ['Aura Sound BD', 'Walton', 'Xiaomi', 'Anker', 'Baseus', 'Realme', 'Samsung', 'Haylou', 'QCY', 'Joyroom', 'Ugreen', 'Havit'],
    subCategories: [
      { name: 'Audio & Wireless Acoustics', items: [['ANC Earbuds', 'এএনসি ইয়ারবাডস'], ['Bluetooth Speaker', 'ব্লুটুথ স্পিকার'], ['Over-Ear Headphone', 'ওভার-ইয়ার হেডফোন'], ['Neckband', 'নেকব্যান্ড']], priceRange: [690, 9500], weightKg: [0.1, 0.9] },
      { name: 'Smart Wearables', items: [['Smart Watch', 'স্মার্ট ওয়াচ'], ['Fitness Band', 'ফিটনেস ব্যান্ড'], ['Kids GPS Watch', 'কিডস জিপিএস ওয়াচ']], priceRange: [1200, 14500], weightKg: [0.08, 0.3] },
      { name: 'Mobile Accessories', items: [['Power Bank 20000mAh', 'পাওয়ার ব্যাংক ২০০০০mAh'], ['65W GaN Charger', '৬৫W GaN চার্জার'], ['MagSafe Case', 'ম্যাগসেফ কেস'], ['Type-C Cable', 'টাইপ-সি ক্যাবল']], priceRange: [250, 4800], weightKg: [0.05, 0.5] },
      { name: 'Computer & Gaming', items: [['Mechanical Keyboard', 'মেকানিক্যাল কিবোর্ড'], ['Wireless Mouse', 'ওয়্যারলেস মাউস'], ['Gaming Controller', 'গেমিং কন্ট্রোলার'], ['USB Hub', 'ইউএসবি হাব']], priceRange: [550, 8900], weightKg: [0.1, 1.2] },
      { name: 'Smart Home Gadgets', items: [['WiFi Smart Camera', 'ওয়াইফাই স্মার্ট ক্যামেরা'], ['Smart LED Bulb', 'স্মার্ট এলইডি বাল্ব'], ['WiFi Router', 'ওয়াইফাই রাউটার'], ['Mini Projector', 'মিনি প্রজেক্টর']], priceRange: [450, 18500], weightKg: [0.1, 1.6] }
    ],
    images: [
      electronicsImg,
      unsplash('photo-1590658268037-6bf12165a8df'),
      unsplash('photo-1606220588913-b3aacb4d2f46'),
      unsplash('photo-1572536147248-ac59a8abfa4b'),
      unsplash('photo-1505740420928-5e560c06d30e'),
      unsplash('photo-1523275335684-37898b6baf30'),
      unsplash('photo-1546868871-7041f2a55e12'),
      unsplash('photo-1511707171634-5f897ff02aa9'),
      unsplash('photo-1527864550417-7fd91fc51a46'),
      unsplash('photo-1587829741301-dc798b83add3'),
      unsplash('photo-1608043152269-423dbba4e7e1'),
      unsplash('photo-1583394838336-acd977736f90')
    ],
    warranty: ['1 Year Official Brand Warranty', '6 Months Service Warranty', '7 days replacement guarantee'],
    descriptions: [
      ['Reliable performance with the latest chipset, long battery life and fast Type-C charging.', 'সর্বশেষ চিপসেট, দীর্ঘস্থায়ী ব্যাটারি এবং টাইপ-সি ফাস্ট চার্জিং সহ নির্ভরযোগ্য পারফরম্যান্স।'],
      ['100% original product with official warranty, tested before dispatch.', 'অফিসিয়াল ওয়ারেন্টিসহ ১০০% অরিজিনাল পণ্য, ডেলিভারির আগে পরীক্ষিত।']
    ]
  },
  medicine: {
    code: 'MED',
    adjectives: [
      ['Herbal', 'হারবাল'], ['Organic', 'অর্গানিক'], ['Advanced', 'অ্যাডভান্সড'], ['Daily', 'ডেইলি'],
      ['Ayurvedic', 'আয়ুর্বেদিক'], ['Pure', 'খাঁটি'], ['Clinical', 'ক্লিনিক্যাল'], ['Natural', 'প্রাকৃতিক'],
      ['Family Pack', 'ফ্যামিলি প্যাক'], ['Extra Strength', 'এক্সট্রা স্ট্রেংথ']
    ],
    brands: ['Square Health', 'Beximco Care', 'Incepta Wellness', 'ACI Health', 'Renata Life', 'Hamdard BD', 'Himalaya', 'Healthy Roots', 'Radiant Pharma', 'Opsonin Care'],
    subCategories: [
      { name: 'Vitamins & Supplements', items: [['Vitamin D3 1000 IU', 'ভিটামিন ডি৩ ১০০০ আইইউ'], ['Multivitamin Tablet', 'মাল্টিভিটামিন ট্যাবলেট'], ['Omega-3 Fish Oil', 'ওমেগা-৩ ফিশ অয়েল'], ['Zinc + Vitamin C', 'জিংক + ভিটামিন সি']], priceRange: [180, 2400], weightKg: [0.05, 0.4] },
      { name: 'Skin Care & Serums', items: [['Vitamin C Serum', 'ভিটামিন সি সিরাম'], ['Sunscreen SPF 50', 'সানস্ক্রিন এসপিএফ ৫০'], ['Aloe Vera Gel', 'অ্যালোভেরা জেল'], ['Hyaluronic Moisturizer', 'হায়ালুরোনিক ময়েশ্চারাইজার']], priceRange: [250, 3200], weightKg: [0.05, 0.3] },
      { name: 'Medical Devices', items: [['Digital Thermometer', 'ডিজিটাল থার্মোমিটার'], ['BP Monitor', 'ব্লাড প্রেশার মনিটর'], ['Pulse Oximeter', 'পালস অক্সিমিটার'], ['Glucometer Kit', 'গ্লুকোমিটার কিট']], priceRange: [350, 5800], weightKg: [0.1, 0.8] },
      { name: 'Herbal & Ayurvedic', items: [['Black Seed Oil', 'কালোজিরা তেল'], ['Moringa Powder', 'মরিঙ্গা পাউডার'], ['Sundarban Honey', 'সুন্দরবনের মধু'], ['Tulsi Herbal Tea', 'তুলসী হারবাল চা']], priceRange: [150, 1800], weightKg: [0.1, 1.0] },
      { name: 'Personal & Baby Care', items: [['Hand Sanitizer', 'হ্যান্ড স্যানিটাইজার'], ['Baby Lotion', 'বেবি লোশন'], ['Antiseptic Liquid', 'অ্যান্টিসেপটিক লিকুইড'], ['First Aid Kit', 'ফার্স্ট এইড কিট']], priceRange: [120, 1600], weightKg: [0.1, 0.9] }
    ],
    images: [
      healthImg,
      unsplash('photo-1556228720-195a672e8a03'),
      unsplash('photo-1584308666744-24d5c474f2ae'),
      unsplash('photo-1587854692152-cbe660dbde88'),
      unsplash('photo-1608571423902-eed4a5ad8108'),
      unsplash('photo-1620916566398-39f1143ab7be'),
      unsplash('photo-1471864190281-a93a3070b6de'),
      unsplash('photo-1576091160550-2173dba999ef')
    ],
    warranty: ['DGDA approved · Sealed pack', 'Genuine product guarantee', 'Return if seal broken on arrival'],
    descriptions: [
      ['DGDA registered, sealed and stored in temperature-controlled conditions. Please consult a physician before use.', 'ডিজিডিএ নিবন্ধিত, সিল করা এবং নিয়ন্ত্রিত তাপমাত্রায় সংরক্ষিত। ব্যবহারের আগে চিকিৎসকের পরামর্শ নিন।'],
      ['Made with natural ingredients for everyday wellness of the whole family.', 'পরিবারের সবার দৈনন্দিন সুস্থতার জন্য প্রাকৃতিক উপাদানে তৈরি।']
    ]
  },
  household: {
    code: 'HSH',
    adjectives: [
      ['Brass', 'পিতলের'], ['Ceramic', 'সিরামিক'], ['Non-Stick', 'নন-স্টিক'], ['Handcrafted', 'হস্তনির্মিত'],
      ['Bamboo', 'বাঁশের'], ['Stainless Steel', 'স্টেইনলেস স্টিল'], ['Nakshi', 'নকশি'], ['Modern', 'আধুনিক'],
      ['Eco-Friendly', 'পরিবেশবান্ধব'], ['Premium', 'প্রিমিয়াম'], ['Jute', 'পাটের']
    ],
    brands: ['Sylhet Craft', 'RFL Living', 'Miyako', 'Kiam', 'Otobi Home', 'Hatil Decor', 'Jute Works BD', 'Partex Home', 'Vision', 'Brass Heritage'],
    subCategories: [
      { name: 'Kitchen & Cookware', items: [['Electric Kettle', 'ইলেকট্রিক কেটলি'], ['Fry Pan Set', 'ফ্রাই প্যান সেট'], ['Pressure Cooker', 'প্রেশার কুকার'], ['Rice Cooker', 'রাইস কুকার']], priceRange: [650, 7800], weightKg: [0.6, 3.5] },
      { name: 'Home Decor', items: [['Table Lamp', 'টেবিল ল্যাম্প'], ['Wall Clock', 'দেয়াল ঘড়ি'], ['Flower Vase', 'ফুলদানি'], ['Wall Art Frame', 'ওয়াল আর্ট ফ্রেম']], priceRange: [450, 6500], weightKg: [0.3, 2.5] },
      { name: 'Bedding & Textiles', items: [['Nakshi Kantha', 'নকশি কাঁথা'], ['Cotton Bedsheet Set', 'কটন বেডশিট সেট'], ['Cushion Cover', 'কুশন কভার'], ['Jute Floor Mat', 'পাটের ফ্লোর ম্যাট']], priceRange: [350, 5500], weightKg: [0.3, 2.0] },
      { name: 'Dining & Serveware', items: [['Dinner Set', 'ডিনার সেট'], ['Tea Cup Set', 'চায়ের কাপ সেট'], ['Glass Water Jug', 'কাঁচের পানির জগ'], ['Serving Bowl', 'সার্ভিং বাটি']], priceRange: [400, 8500], weightKg: [0.4, 4.0] },
      { name: 'Storage & Cleaning', items: [['Storage Box', 'স্টোরেজ বক্স'], ['Spin Mop', 'স্পিন মপ'], ['Laundry Basket', 'লন্ড্রি ঝুড়ি'], ['Shoe Rack', 'জুতার র‍্যাক']], priceRange: [280, 3800], weightKg: [0.4, 3.0] }
    ],
    images: [
      householdImg,
      unsplash('photo-1556909114-f6e7ad7d3136'),
      unsplash('photo-1586023492125-27b2c045efd7'),
      unsplash('photo-1555041469-a586c61ea9bc'),
      unsplash('photo-1513694203232-719a280e022f'),
      unsplash('photo-1507473885765-e6ed057f782c'),
      unsplash('photo-1524758631624-e2822e304c36'),
      unsplash('photo-1484101403633-562f891dc89a'),
      unsplash('photo-1610701596007-11502861dcfa')
    ],
    warranty: ['6 Months Manufacturer Warranty', '7 days easy return', 'Breakage-free delivery guarantee'],
    descriptions: [
      ['Durable, easy to clean and designed to make your home more beautiful and organised.', 'টেকসই, সহজে পরিষ্কারযোগ্য এবং আপনার ঘরকে আরও সুন্দর ও গোছানো রাখতে ডিজাইন করা।'],
      ['Traditional Bangladeshi craftsmanship blended with modern everyday convenience.', 'ঐতিহ্যবাহী বাংলাদেশি কারুশিল্প ও আধুনিক সুবিধার চমৎকার মেলবন্ধন।']
    ]
  }
};

const COURIERS: Product['courierSupported'][] = [
  ['pathao', 'redx', 'steadfast'],
  ['pathao', 'steadfast'],
  ['redx', 'steadfast'],
  ['pathao', 'redx']
];

const generateCatalog = (): Product[] => {
  const rand = createRng(20261103);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const between = (min: number, max: number) => min + rand() * (max - min);

  const result: Product[] = [];
  let serial = 1;

  (Object.keys(CATEGORIES) as ProductCategory[]).forEach((category) => {
    const def = CATEGORIES[category];

    for (let i = 0; i < GENERATED_PRODUCT_COUNT_PER_CATEGORY; i++) {
      const sub = def.subCategories[i % def.subCategories.length];
      const [itemEn, itemBn] = pick(sub.items);
      const [adjEn, adjBn] = pick(def.adjectives);
      const brand = pick(def.brands);
      const seller = pick(SELLERS);
      const [descEn, descBn] = pick(def.descriptions);
      const image = pick(def.images);
      const altImage = pick(def.images);

      // Round prices to a natural "৳x90" style
      const price = Math.max(90, Math.round(between(sub.priceRange[0], sub.priceRange[1]) / 10) * 10 - 10);
      const discount = between(0.05, 0.45);
      const originalPrice = Math.round(price / (1 - discount) / 10) * 10;
      const modelNo = 100 + Math.floor(rand() * 900);
      const num = String(serial).padStart(5, '0');

      const colorCount = 2 + Math.floor(rand() * 3);
      const colorStart = Math.floor(rand() * COLORS.length);
      const colors = Array.from({ length: colorCount }, (_, c) => {
        const col = COLORS[(colorStart + c) % COLORS.length];
        return { ...col, inStock: rand() > 0.15 };
      });

      const product: Product = {
        id: `${GENERATED_PRODUCT_ID_PREFIX}${category.slice(0, 4)}_${num}`,
        title: `${brand} ${adjEn} ${itemEn} ${modelNo}`,
        titleBn: `${brand} ${adjBn} ${itemBn} ${modelNo}`,
        category,
        subCategory: sub.name,
        price,
        originalPrice,
        stock: Math.floor(between(3, 250)),
        sku: `FLX-${def.code}-${num}`,
        brand,
        sellerId: seller.id,
        sellerName: seller.name,
        sellerUniqueId: seller.uid,
        sellerVerified: rand() > 0.2,
        rating: Math.round(between(3.6, 5) * 10) / 10,
        reviewCount: Math.floor(between(0, 1500)),
        image,
        gallery: image === altImage ? [image] : [image, altImage],
        specifications: [
          { label: 'Brand', value: brand },
          { label: 'Model', value: `${def.code}-${modelNo}` },
          { label: 'Category', value: sub.name },
          { label: 'Country of Origin', value: rand() > 0.5 ? 'Bangladesh' : 'Imported' }
        ],
        description: descEn,
        descriptionBn: descBn,
        weightKg: Math.round(between(sub.weightKg[0], sub.weightKg[1]) * 100) / 100,
        codSupported: rand() > 0.1,
        warranty: pick(def.warranty),
        courierSupported: pick(COURIERS),
        featured: rand() > 0.97
      };

      if (category === 'fashion') {
        product.colors = colors;
        product.sizes = ['S', 'M', 'L', 'XL', 'XXL'].map((name) => ({ name, inStock: rand() > 0.15 }));
      } else if (category === 'electronics') {
        product.colors = colors;
      } else if (category === 'medicine') {
        const year = 2027 + Math.floor(rand() * 3);
        const month = String(1 + Math.floor(rand() * 12)).padStart(2, '0');
        product.packSizes = [
          { label: 'Single Pack', inStock: true },
          { label: 'Family Pack (x3)', inStock: rand() > 0.3 }
        ];
        product.expiryDate = `${month}/${year}`;
        product.batchNumber = `FLX-${1000 + Math.floor(rand() * 9000)}`;
        product.dgdaRegNumber = `DGDA-${def.code}-${10000 + Math.floor(rand() * 90000)}`;
      } else if (category === 'household') {
        product.colors = colors;
      }

      result.push(product);
      serial++;
    }
  });

  // Interleave categories so the "All" feed looks varied instead of grouped
  const perCat = GENERATED_PRODUCT_COUNT_PER_CATEGORY;
  const cats = Object.keys(CATEGORIES).length;
  const interleaved: Product[] = [];
  for (let i = 0; i < perCat; i++) {
    for (let c = 0; c < cats; c++) {
      interleaved.push(result[c * perCat + i]);
    }
  }
  return interleaved;
};

export const GENERATED_PRODUCTS: Product[] = generateCatalog();

export const isGeneratedProductId = (id: string) => id.startsWith(GENERATED_PRODUCT_ID_PREFIX);
