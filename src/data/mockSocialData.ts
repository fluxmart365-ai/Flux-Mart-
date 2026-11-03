import { CustomerBadge, CustomerSocialProfile, ShoppableVideo, SocialPost, SmartNotification } from '../types';
import { INITIAL_PRODUCTS, OFFICIAL_LOGO } from './mockData';

export const INITIAL_CUSTOMER_BADGES: CustomerBadge[] = [
  {
    id: 'badge_vip',
    name: 'FLUX Gold VIP Club',
    nameBn: 'ফ্লাক্স গোল্ড ভিআইপি ক্লাব',
    icon: 'Crown',
    description: 'Premier tier shopper with ৳25,000+ completed marketplace purchases.',
    tier: 'elite'
  },
  {
    id: 'badge_reviewer',
    name: 'Top Reviewer Dhaka',
    nameBn: 'টপ রিভিউয়ার ঢাকা',
    icon: 'Star',
    description: 'Awarded for 5+ detailed photo reviews and community ratings.',
    tier: 'gold'
  },
  {
    id: 'badge_silk',
    name: 'Silk Connoisseur',
    nameBn: 'রেশম আভিজাত্য সংগ্রাহক',
    icon: 'Sparkles',
    description: 'Verified patron of authentic hand-loomed Rajshahi Silk fashion.',
    tier: 'platinum'
  },
  {
    id: 'badge_nid',
    name: 'Smart NID Verified Buyer',
    nameBn: 'স্মার্ট এনআইডি ভেরিফাইড ক্রেতা',
    icon: 'ShieldCheck',
    description: 'Identity authenticated via Bangladesh Election Commission format.',
    tier: 'gold'
  }
];

export const INITIAL_CUSTOMER_SOCIAL_PROFILE: CustomerSocialProfile = {
  name: 'Rahim Chowdhury',
  phone: '+8801799887766',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  bio: 'Architect & luxury enthusiast based in Dhaka. Passionate about heritage Bengali artisanal crafts, pure Rajshahi silk, and audiophile gear.',
  tagline: 'Living elegantly in Dhaka · Curating the finest Bangladeshi crafts',
  location: 'Gulshan-2 / Banani, Dhaka',
  totalReviews: 8,
  sharedPostsCount: 14,
  loyaltyPoints: 850,
  referralCode: 'FLUX-RAHIM-2026',
  badges: INITIAL_CUSTOMER_BADGES,
  preferredCategories: ['fashion', 'electronics']
};

export const INITIAL_SHOPPABLE_VIDEOS: ShoppableVideo[] = [
  {
    id: 'vid_01',
    title: 'Heritage Rajshahi Silk Panjabi Unboxing & Collar Zardozi Details',
    titleBn: 'হেরিটেজ রাজশাহী সিল্ক পাঞ্জাবি আনবক্সিং ও কলার কারুকাজ',
    creatorName: 'Tanvir Style Studio',
    creatorHandle: '@tanvir_looks',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isSeller: true,
    videoPoster: '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg',
    videoDuration: '0:34',
    likesCount: 1420,
    commentsCount: 89,
    sharesCount: 312,
    isLiked: false,
    taggedProduct: INITIAL_PRODUCTS[0],
    soundTrack: 'Original Sound - Traditional Sitara Fusion',
    tags: ['#RajshahiSilk', '#EidFashion2026', '#NawabCollection']
  },
  {
    id: 'vid_02',
    title: 'Testing Aura Pro ANC in Jamuna Future Park Crowds (Real Test)',
    titleBn: 'যমুনা ফিউচার পার্কে অরা প্রো ইয়ারবাডসের নয়েজ ক্যান্সেলেশন টেস্ট',
    creatorName: 'Tech Geeks Dhaka',
    creatorHandle: '@dhakatech',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isSeller: false,
    videoPoster: '/src/assets/images/electronics_earbuds_gold_1793376787374.jpg',
    videoDuration: '0:42',
    likesCount: 2890,
    commentsCount: 144,
    sharesCount: 520,
    isLiked: true,
    taggedProduct: INITIAL_PRODUCTS[1],
    soundTrack: 'Bass Boosted Studio Acoustic - Aura Sound',
    tags: ['#AuraPro', '#DhakaGadgets', '#ANCWireless']
  },
  {
    id: 'vid_03',
    title: 'Morning Wellness Routine: Pure Botanical Alchemy Drops',
    titleBn: 'সকালের ভেষজ রুটিন: খাঁটি বোটানিক্যাল অ্যালকেমি এসেন্স',
    creatorName: 'Dr. Samina Wellness',
    creatorHandle: '@samina_health',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isSeller: false,
    videoPoster: '/src/assets/images/health_wellness_serum_1793376788053.jpg',
    videoDuration: '0:28',
    likesCount: 940,
    commentsCount: 36,
    sharesCount: 185,
    isLiked: false,
    taggedProduct: INITIAL_PRODUCTS[2],
    soundTrack: 'Ambient Organic Flow - Morning Chimes',
    tags: ['#AyurvedaBD', '#HerbalVitality', '#OrganicLiving']
  },
  {
    id: 'vid_04',
    title: 'Dhamrai Hand-Hammered Royal Brass Tea Ceremony: Golden Glow',
    titleBn: 'ধামরাইয়ের খাঁটি পিতলের চায়ের আড্ডা: ঐতিহ্যবাহী আভিজাত্য',
    creatorName: 'Heritage Bengal Home',
    creatorHandle: '@bengalheritage',
    creatorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    isSeller: true,
    videoPoster: '/src/assets/images/household_brass_kettle_1793376787692.jpg',
    videoDuration: '0:38',
    likesCount: 3150,
    commentsCount: 204,
    sharesCount: 780,
    isLiked: true,
    taggedProduct: INITIAL_PRODUCTS[3],
    soundTrack: 'Sufi Flute Melody - Heritage Dhaka',
    tags: ['#DhamraiBrass', '#ArtisanCrafts', '#RoyalHome']
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post_01',
    authorName: 'Rahim Chowdhury',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Banani, Dhaka',
    postedAt: '2 hours ago',
    content: 'Received my Nawab Heritage Silk Panjabi in just 22 hours through Pathao Express! The gold zardozi work on the placket is immaculate. Ready for the upcoming family gala.',
    image: '/src/assets/images/fashion_panjabi_gold_1793376787056.jpg',
    taggedProduct: INITIAL_PRODUCTS[0],
    likesCount: 84,
    isLiked: false,
    commentsCount: 12,
    sharesCount: 19,
    comments: [
      {
        id: 'c1',
        author: 'Farhan Kabir',
        text: 'The collar fitting looks stunning! Did you take size 42?',
        time: '1h ago'
      },
      {
        id: 'c2',
        author: 'Rahim Chowdhury',
        text: 'Yes exactly 42, fits true to size. Fabric is genuine Rajshahi silk.',
        time: '45m ago'
      }
    ]
  },
  {
    id: 'post_02',
    authorName: 'Sadia Sultana',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Dhanmondi, Dhaka',
    postedAt: 'Yesterday at 6:30 PM',
    content: 'Just brewed organic smoked tea in this hand-beaten solid brass kettle from Dhamrai. The aesthetic elevation for our living room table is unparalleled. Truly a collector item!',
    image: '/src/assets/images/household_brass_kettle_1793376787692.jpg',
    taggedProduct: INITIAL_PRODUCTS[3],
    likesCount: 156,
    isLiked: true,
    commentsCount: 24,
    sharesCount: 38,
    comments: [
      {
        id: 'c3',
        author: 'Nabila Karim',
        text: 'Does the wooden handle prevent heat when pouring?',
        time: 'Yesterday'
      },
      {
        id: 'c4',
        author: 'Sadia Sultana',
        text: 'Yes! The carved rosewood grip stays completely cool.',
        time: 'Yesterday'
      }
    ]
  }
];

export const INITIAL_SMART_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif_01',
    type: 'price_drop',
    title: 'Flash Price Drop: Heritage Rajshahi Silk',
    titleBn: 'মূল্য ছাড়: হেরিটেজ রাজশাহী সিল্ক পাঞ্জাবি',
    message: 'Golden Heritage just announced a 15% flash markdown on pure silk items based on your Fashion interest!',
    messageBn: 'আপনার ফ্যাশন পছন্দের ওপর ভিত্তি করে গোল্ডেন হেরিটেজ ১৫% বিশেষ মূল্য ছাড় ঘোষণা করেছে!',
    category: 'fashion',
    timestamp: '10m ago',
    read: false,
    productId: 'prod_01',
    discountBadge: '15% OFF',
    imageUrl: '/src/assets/images/fashion_panjabi_1793376747201.jpg'
  },
  {
    id: 'notif_02',
    type: 'order_update',
    title: 'Order Dispatched · Pathao Courier',
    titleBn: 'অর্ডার পাঠানো হয়েছে · পাঠাও কুরিয়ার',
    message: 'Order #FLUX-89241 has been dispatched by Golden Heritage Fashion. Advance delivery fee verified. Tap to view Official Digital Memo & Invoice.',
    messageBn: 'অর্ডার #FLUX-89241 পাঠাও কুরিয়ারে হস্তান্তর করা হয়েছে। অ্যাডভান্স ডেলিভারি চার্জ যাচাই সম্পন্ন। অফিসিয়াল ডিজিটাল মেমো দেখতে ক্লিক করুন।',
    timestamp: '42m ago',
    read: false,
    orderId: 'FLUX-89241',
    imageUrl: OFFICIAL_LOGO
  },
  {
    id: 'notif_03',
    type: 'flash_sale',
    title: 'New Flash Sale Alert: 65W GaN Charger',
    titleBn: 'ফ্ল্যাশ সেল অ্যালার্ট: ৬৫W GaN ফাস্ট চার্জার',
    message: 'Star Tech Hub launched a limited flash sale on Anker Prime Chargers. Price dropped from ৳4,200 to ৳3,450 for your Electronics interest.',
    messageBn: 'আপনার ইলেকট্রনিক্স আগ্রহের ওপর ভিত্তি করে অ্যাংকার প্রাইম ৬৫W চার্জারে বিশেষ ফ্ল্যাশ সেল চালু হয়েছে। বর্তমান মূল্য মাত্র ৳৩,৪৫০।',
    category: 'electronics',
    timestamp: '2h ago',
    read: false,
    productId: 'prod_02',
    discountBadge: '18% OFF',
    imageUrl: '/src/assets/images/electronics_charger_1793376762391.jpg'
  },
  {
    id: 'notif_04',
    type: 'mention',
    title: '@tanvir_looks mentioned you',
    titleBn: '@tanvir_looks আপনাকে মেনশন করেছেন',
    message: '@tanvir_looks tagged @rahim_c in a comment on "Heritage Rajshahi Silk Panjabi Unboxing": "Check out this authentic zardozi embroidery!"',
    messageBn: '@tanvir_looks আপনাকে একটি মন্তব্যে মেনশন করেছেন: "@rahim_c অসাধারণ কলার কারুকাজ দেখুন!"',
    timestamp: '4h ago',
    read: true,
    mentionAuthor: '@tanvir_looks'
  },
  {
    id: 'notif_05',
    type: 'offer',
    title: 'Household Craft Restock Notice',
    titleBn: 'নতুন স্টক নোটিস: সলিড ব্রাস হস্তশিল্প',
    message: 'Dhamrai Heritage Artisans just restocked hand-engraved brass teapots with free doorstep delivery.',
    messageBn: 'ধামরাই হেরিটেজ কারিগরদের হস্তনির্মিত ব্রাস কেটলি নতুন স্টকে এসেছে।',
    category: 'household',
    timestamp: '1d ago',
    read: true,
    productId: 'prod_04',
    discountBadge: 'RESTOCKED',
    imageUrl: '/src/assets/images/household_brass_kettle_1793376787692.jpg'
  }
];

