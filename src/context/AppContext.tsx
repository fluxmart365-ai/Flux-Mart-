import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Language,
  Product,
  CartItem,
  Order,
  Voucher,
  SellerProfile,
  CategoryCommission,
  CourierConfig,
  KycDocument,
  WithdrawalRequest,
  CustomerSocialProfile,
  ShoppableVideo,
  SocialPost,
  SmartNotification,
  ProductCategory,
  UserAccountProfile,
  SellerAdminMessage,
  KycStatus,
  SubAdminTeam,
  SubAdminMember,
  SellerStrike,
  MerchantTier,
  OrderDispute,
  FlaggedChatMessage,
  ModerationAuditItem,
  SmsGatewayLog,
  DailyPayoutSummary,
  PromotionalBanner
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_PROMOTIONAL_BANNERS,
  INITIAL_COURIERS,
  INITIAL_VOUCHERS,
  INITIAL_SELLER_PROFILE,
  INITIAL_ORDERS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_SELLER_ADMIN_MESSAGES,
  INITIAL_SUB_ADMINS,
  INITIAL_FLAGGED_CHATS,
  INITIAL_MODERATION_ITEMS,
  INITIAL_ORDER_DISPUTES,
  INITIAL_SMS_LOGS,
  INITIAL_DAILY_PAYOUTS
} from '../data/mockData';
import {
  INITIAL_CUSTOMER_SOCIAL_PROFILE,
  INITIAL_SHOPPABLE_VIDEOS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_SMART_NOTIFICATIONS
} from '../data/mockSocialData';
import { translations } from '../data/translations';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;

  // View mode
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;

  // Splash Screen
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;

  // Secret Admin PIN Trigger
  secretPinModalOpen: boolean;
  setSecretPinModalOpen: (open: boolean) => void;
  handleLogoClick: () => void;
  verifyAdminPin: (pin: string) => boolean;

  // Customer & Multi-Account Management
  customerPhone: string | null;
  customerName: string;
  customerEmail: string | null;
  isLoggedIn: boolean;
  loginWithPhoneOtp: (phone: string, name?: string, chosenRole?: Role, shopName?: string, email?: string) => void;
  logoutCustomer: () => void;
  otpModalOpen: boolean;
  setOtpModalOpen: (open: boolean) => void;
  accounts: UserAccountProfile[];
  currentAccountId: string;
  switchAccount: (accountId: string) => void;
  addNewAccount: (newAcc: Omit<UserAccountProfile, 'id'>) => string;
  isAccountSwitcherOpen: boolean;
  setIsAccountSwitcherOpen: (open: boolean) => void;

  // Products & Real-Time Sync
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Dynamic Promotional Hero Banners
  promotionalBanners: PromotionalBanner[];
  addPromotionalBanner: (banner: Omit<PromotionalBanner, 'id'>) => void;
  deletePromotionalBanner: (id: string) => void;

  // Active Main Customer Navigation Tab ('shop' | 'discover' | 'orders' | 'profile')
  activeMainTab: 'shop' | 'discover' | 'orders' | 'profile';
  setActiveMainTab: (tab: 'shop' | 'discover' | 'orders' | 'profile') => void;

  // Social Commerce & Short-Videos
  socialProfile: CustomerSocialProfile;
  updateSocialProfile: (updates: Partial<CustomerSocialProfile>) => void;
  shoppableVideos: ShoppableVideo[];
  toggleLikeVideo: (videoId: string) => void;
  socialPosts: SocialPost[];
  toggleLikePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  createSocialPost: (content: string, image?: string, taggedProduct?: Product) => void;
  createShoppableReel: (title: string, videoPoster: string, taggedProduct: Product, soundTrack?: string) => ShoppableVideo;
  addLoyaltyPoints: (points: number, reason: string) => void;
  redeemPointsForVoucher: (cost: number, voucherValue: number) => { success: boolean; code?: string; message: string };
  activeShareModalItem: { title: string; url: string; image?: string; type: 'video' | 'post' | 'product'; id: string } | null;
  openShareModal: (item: { title: string; url: string; image?: string; type: 'video' | 'post' | 'product'; id: string }) => void;
  closeShareModal: () => void;
  recentPointsAwarded: { amount: number; reason: string } | null;
  dismissPointsNotice: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedVoucher: Voucher | null;
  applyVoucherCode: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderDate'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Seller Ecosystem
  sellerProfile: SellerProfile;
  updateSellerProfile: (updates: Partial<SellerProfile>) => void;
  updateSellerKyc: (doc: KycDocument) => void;
  simulateKycStatusChange: (status: KycStatus) => void;
  requestSellerWithdrawal: (amount: number, method: WithdrawalRequest['payoutMethod'], details: string) => boolean;
  withdrawalRequests: WithdrawalRequest[];
  sellerAdminMessages: SellerAdminMessage[];
  sendSellerAdminMessage: (text: string, category?: SellerAdminMessage['category']) => void;
  isSellerAdminMessengerOpen: boolean;
  setIsSellerAdminMessengerOpen: (open: boolean) => void;

  // Admin Master Controls
  categoryCommissions: CategoryCommission;
  updateCommission: (category: keyof CategoryCommission, rate: number) => void;
  couriers: CourierConfig[];
  toggleCourier: (id: CourierConfig['id']) => void;
  updateCourierRate: (id: CourierConfig['id'], field: 'insideDhakaRate' | 'outsideDhakaRate', rate: number) => void;
  adminApproveKyc: (sellerId: string) => void;
  adminRejectKyc: (sellerId: string, reason: string) => void;
  codReconciledTotal: number;
  reconcileCodPayouts: () => void;

  // 24/7 Live Support & Dispute Desk (Admin + WhatsApp + Seller)
  isLiveSupportOpen: boolean;
  supportContext: { sellerName?: string; orderId?: string; defaultTab?: 'chat' | 'whatsapp' | 'dispute'; initialMessage?: string } | null;
  openLiveSupport: (context?: { sellerName?: string; orderId?: string; defaultTab?: 'chat' | 'whatsapp' | 'dispute'; initialMessage?: string }) => void;
  closeLiveSupport: () => void;

  // Smart Personalized Notification Center (Algorithm-Based)
  notifications: SmartNotification[];
  unreadNotificationCount: number;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  preferredCategories: ProductCategory[];
  togglePreferredCategory: (cat: ProductCategory) => void;

  // Professional Dual-Party Digital Memo / Invoice System
  isDigitalInvoiceOpen: boolean;
  selectedInvoiceOrder: Order | null;
  openDigitalInvoice: (order: Order) => void;
  closeDigitalInvoice: () => void;

  // Seller Public Store Profile Modal
  isSellerPublicProfileOpen: boolean;
  selectedSellerProfile: SellerProfile | null;
  openSellerPublicProfile: (sellerOrId?: SellerProfile | string) => void;
  closeSellerPublicProfile: () => void;

  // Sub-Admin Console & 4 Specialized Teams
  activeSubAdminTeam: SubAdminTeam;
  setActiveSubAdminTeam: (team: SubAdminTeam) => void;
  subAdminUser: SubAdminMember | null;
  subAdmins: SubAdminMember[];
  loginAsSubAdmin: (emailOrPhone: string) => boolean;
  loginAsSuperAdmin: () => void;

  // One-Click Daily Payout & Automated Wallet Engine
  dailyPayouts: DailyPayoutSummary[];
  triggerOneClickDailyPayout: () => DailyPayoutSummary;
  lastPayoutSummary: DailyPayoutSummary | null;
  isPayoutModalOpen: boolean;
  setIsPayoutModalOpen: (open: boolean) => void;
  approveWithdrawalRequest: (id: string) => void;
  rejectWithdrawalRequest: (id: string, reason?: string) => void;

  // Disciplinary & 3-Strike Framework
  sellerStrikes: SellerStrike[];
  issueSellerStrike: (
    sellerId: string,
    strikeNumber: 1 | 2 | 3,
    reason: string,
    severity: 'warning' | 'freeze' | 'suspension',
    team?: SubAdminTeam | 'super_admin'
  ) => void;
  revokeSellerStrike: (strikeId: string) => void;

  // Customer Support & Fraud Prevention (Chat Monitoring)
  flaggedChats: FlaggedChatMessage[];
  resolveFlaggedChat: (id: string, action: 'reviewed' | 'warning_sent' | 'seller_frozen') => void;

  // Content Moderation & Product Audit
  moderationItems: ModerationAuditItem[];
  auditModerationItem: (id: string, decision: 'approved' | 'delisted') => void;

  // 7-Day Guarantee Escrow Disputes & Returns
  disputes: OrderDispute[];
  createDispute: (
    orderId: string,
    reason: OrderDispute['reason'],
    description: string,
    evidencePhoto?: string
  ) => void;
  resolveDispute: (
    disputeId: string,
    resolution: 'escrow_refunded' | 'rejected' | 'replacement_shipped',
    notes?: string
  ) => void;

  // Localized SMS Gateway Engine
  smsLogs: SmsGatewayLog[];
  sendSms: (
    phone: string,
    message: string,
    type: SmsGatewayLog['type'],
    operator?: SmsGatewayLog['operator']
  ) => void;
  isSmsViewerOpen: boolean;
  setIsSmsViewerOpen: (open: boolean) => void;

  // Legal, Policy & Compliance Center
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  legalModalTab: 'privacy' | 'terms' | 'dgda' | 'dbid';
  openLegalModal: (tab?: 'privacy' | 'terms' | 'dgda' | 'dbid') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('customer');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Secret Admin trigger: 5 rapid taps within 2.5s
  const [logoTapCount, setLogoTapCount] = useState<number>(0);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [secretPinModalOpen, setSecretPinModalOpen] = useState<boolean>(false);

  // Active Navigation Tab ('shop' | 'discover' | 'orders' | 'profile')
  const [activeMainTab, setActiveMainTab] = useState<'shop' | 'discover' | 'orders' | 'profile'>('shop');

  // Social Profile & Customization
  const [socialProfile, setSocialProfile] = useState<CustomerSocialProfile>(() => {
    const saved = localStorage.getItem('flux_social_profile');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_SOCIAL_PROFILE;
  });

  // Shoppable Short Videos (TikTok Style)
  const [shoppableVideos, setShoppableVideos] = useState<ShoppableVideo[]>(() => {
    const saved = localStorage.getItem('flux_shoppable_videos');
    return saved ? JSON.parse(saved) : INITIAL_SHOPPABLE_VIDEOS;
  });

  // Social Purchase Posts
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('flux_social_posts');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_POSTS;
  });

  // Points & Rewards System
  const [recentPointsAwarded, setRecentPointsAwarded] = useState<{ amount: number; reason: string } | null>(null);

  // Active Share Modal Item
  const [activeShareModalItem, setActiveShareModalItem] = useState<{
    title: string;
    url: string;
    image?: string;
    type: 'video' | 'post' | 'product';
    id: string;
  } | null>(null);

  // 24/7 Live Support & Dispute Desk (Admin + WhatsApp + Seller)
  const [isLiveSupportOpen, setIsLiveSupportOpen] = useState<boolean>(false);
  const [supportContext, setSupportContext] = useState<{
    sellerName?: string;
    orderId?: string;
    defaultTab?: 'chat' | 'whatsapp' | 'dispute';
    initialMessage?: string;
  } | null>(null);

  const openLiveSupport = (ctx?: {
    sellerName?: string;
    orderId?: string;
    defaultTab?: 'chat' | 'whatsapp' | 'dispute';
    initialMessage?: string;
  }) => {
    setSupportContext(ctx || null);
    setIsLiveSupportOpen(true);
  };

  const closeLiveSupport = () => {
    setIsLiveSupportOpen(false);
    setSupportContext(null);
  };

  // Smart Personalized Notification Center (Algorithm-Based)
  const [notifications, setNotifications] = useState<SmartNotification[]>(() => {
    const saved = localStorage.getItem('flux_smart_notifications');
    return saved ? JSON.parse(saved) : INITIAL_SMART_NOTIFICATIONS;
  });

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Preferred category interests for personalized flash drops & price drop algorithm
  const [preferredCategories, setPreferredCategories] = useState<ProductCategory[]>(
    socialProfile.preferredCategories || ['fashion', 'electronics']
  );

  useEffect(() => {
    localStorage.setItem('flux_smart_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const togglePreferredCategory = (cat: ProductCategory) => {
    setPreferredCategories((prev) => {
      const next = prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat];
      setSocialProfile((sp) => ({ ...sp, preferredCategories: next }));
      return next;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Professional Dual-Party Digital Memo / Invoice State
  const [isDigitalInvoiceOpen, setIsDigitalInvoiceOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const openDigitalInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
    setIsDigitalInvoiceOpen(true);
  };

  const closeDigitalInvoice = () => {
    setIsDigitalInvoiceOpen(false);
    setSelectedInvoiceOrder(null);
  };

  // Seller Public Store Profile Modal State & Handlers
  const [isSellerPublicProfileOpen, setIsSellerPublicProfileOpen] = useState(false);
  const [selectedSellerProfile, setSelectedSellerProfile] = useState<SellerProfile | null>(null);

  const openSellerPublicProfile = (sellerOrId?: SellerProfile | string) => {
    if (typeof sellerOrId === 'object' && sellerOrId !== null) {
      setSelectedSellerProfile(sellerOrId);
    } else if (typeof sellerOrId === 'string') {
      if (
        sellerOrId === sellerProfile.id ||
        sellerOrId === sellerProfile.merchantUniqueId ||
        sellerOrId === sellerProfile.shopName
      ) {
        setSelectedSellerProfile(sellerProfile);
      } else {
        setSelectedSellerProfile({
          id: sellerOrId,
          merchantUniqueId: sellerOrId.startsWith('FLUX-') ? sellerOrId : 'FLUX-MART-889',
          shopName: sellerOrId === 'seller_chittagong_02' ? 'ElectroHub Agrabad' : sellerOrId,
          ownerName: 'M. Faruk Chowdhury',
          phone: '+8801812349988',
          email: 'faruk@electrohub.bd',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
          bio: 'Official authentic consumer electronics & luxury accessories merchant in Chittagong & Dhaka.',
          division: 'Chittagong',
          district: 'Chittagong Metro',
          address: 'World Trade Center, Agrabad C/A, Chittagong',
          warehouseLocation: 'Agrabad Commercial Area, Chittagong',
          kycStatus: 'verified',
          verifiedBadge: true,
          walletBalance: 32000,
          pendingBalance: 8500,
          totalEarnings: 154000,
          rating: 4.8,
          productViewsCount: 9200,
          joinedDate: 'Feb 2026'
        });
      }
    } else {
      setSelectedSellerProfile(sellerProfile);
    }
    setIsSellerPublicProfileOpen(true);
  };

  const closeSellerPublicProfile = () => {
    setIsSellerPublicProfileOpen(false);
    setSelectedSellerProfile(null);
  };

  // Sync social states to storage
  useEffect(() => {
    localStorage.setItem('flux_social_profile', JSON.stringify(socialProfile));
  }, [socialProfile]);

  useEffect(() => {
    localStorage.setItem('flux_shoppable_videos', JSON.stringify(shoppableVideos));
  }, [shoppableVideos]);

  useEffect(() => {
    localStorage.setItem('flux_social_posts', JSON.stringify(socialPosts));
  }, [socialPosts]);

  // Customer & Multi-Account Auth
  const [accounts, setAccounts] = useState<UserAccountProfile[]>(() => {
    const saved = localStorage.getItem('flux_user_accounts');
    return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS;
  });
  const [currentAccountId, setCurrentAccountId] = useState<string>(() => {
    return localStorage.getItem('flux_active_account_id') || 'acc_cust_01';
  });
  const [customerPhone, setCustomerPhone] = useState<string | null>('+8801799887766');
  const [customerName, setCustomerName] = useState<string>('Rahim Chowdhury');
  const [customerEmail, setCustomerEmail] = useState<string | null>('rahim.chowdhury@fluxmart.bd');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('flux_user_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('flux_active_account_id', currentAccountId);
  }, [currentAccountId]);

  // Store data with robust real-time synchronization
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('flux_products_v3');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        const merged = [...INITIAL_PRODUCTS];
        parsed.forEach((p) => {
          const idx = merged.findIndex((m) => m.id === p.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...p };
          } else {
            merged.unshift(p);
          }
        });
        return merged;
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('flux_products_v3', JSON.stringify(products));
  }, [products]);

  // Dynamic Promotional Hero Banners
  const [promotionalBanners, setPromotionalBanners] = useState<PromotionalBanner[]>(() => {
    const saved = localStorage.getItem('flux_promotional_banners_v1');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONAL_BANNERS;
  });

  useEffect(() => {
    localStorage.setItem('flux_promotional_banners_v1', JSON.stringify(promotionalBanners));
  }, [promotionalBanners]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('flux_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('flux_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(() => {
    const saved = localStorage.getItem('flux_seller');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_PROFILE;
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 'WDR-901',
      sellerId: 'seller_current',
      sellerName: 'Aura Lifestyle & Tech BD',
      amount: 25000,
      payoutMethod: 'bkash_merchant',
      accountDetails: '01712-345678 (bKash Merchant Wallet)',
      requestedAt: '2026-10-28 16:30',
      status: 'approved'
    }
  ]);

  const [sellerAdminMessages, setSellerAdminMessages] = useState<SellerAdminMessage[]>(() => {
    const saved = localStorage.getItem('flux_seller_admin_messages');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_ADMIN_MESSAGES;
  });
  const [isSellerAdminMessengerOpen, setIsSellerAdminMessengerOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('flux_seller_admin_messages', JSON.stringify(sellerAdminMessages));
  }, [sellerAdminMessages]);

  // Admin Config
  const [categoryCommissions, setCategoryCommissions] = useState<CategoryCommission>({
    fashion: 12,
    electronics: 8,
    medicine: 5,
    household: 10
  });

  const [couriers, setCouriers] = useState<CourierConfig[]>(INITIAL_COURIERS);
  const [codReconciledTotal, setCodReconciledTotal] = useState<number>(142800);

  // Sub-Admin State & 4 Specialized Teams
  const [subAdmins, setSubAdmins] = useState<SubAdminMember[]>(INITIAL_SUB_ADMINS);
  const [activeSubAdminTeam, setActiveSubAdminTeam] = useState<SubAdminTeam>('group_a_kyc');
  const [subAdminUser, setSubAdminUser] = useState<SubAdminMember | null>(INITIAL_SUB_ADMINS[0]);

  // One-Click Daily Payout & Automated Wallet Engine
  const [dailyPayouts, setDailyPayouts] = useState<DailyPayoutSummary[]>(() => {
    const saved = localStorage.getItem('flux_daily_payouts');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_PAYOUTS;
  });
  const [lastPayoutSummary, setLastPayoutSummary] = useState<DailyPayoutSummary | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);

  // Disciplinary & 3-Strike Framework
  const [sellerStrikes, setSellerStrikes] = useState<SellerStrike[]>(() => {
    const saved = localStorage.getItem('flux_seller_strikes');
    return saved ? JSON.parse(saved) : [];
  });

  // Chat Monitoring & Fraud Detection
  const [flaggedChats, setFlaggedChats] = useState<FlaggedChatMessage[]>(() => {
    const saved = localStorage.getItem('flux_flagged_chats');
    return saved ? JSON.parse(saved) : INITIAL_FLAGGED_CHATS;
  });

  // Content Moderation & Product Audit
  const [moderationItems, setModerationItems] = useState<ModerationAuditItem[]>(() => {
    const saved = localStorage.getItem('flux_moderation_items');
    return saved ? JSON.parse(saved) : INITIAL_MODERATION_ITEMS;
  });

  // 7-Day Guarantee Escrow Disputes & Returns
  const [disputes, setDisputes] = useState<OrderDispute[]>(() => {
    const saved = localStorage.getItem('flux_order_disputes');
    return saved ? JSON.parse(saved) : INITIAL_ORDER_DISPUTES;
  });

  // SMS Gateway Logs
  const [smsLogs, setSmsLogs] = useState<SmsGatewayLog[]>(() => {
    const saved = localStorage.getItem('flux_sms_logs');
    return saved ? JSON.parse(saved) : INITIAL_SMS_LOGS;
  });
  const [isSmsViewerOpen, setIsSmsViewerOpen] = useState<boolean>(false);

  // Legal & Compliance Modal
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'dgda' | 'dbid'>('dbid');

  useEffect(() => {
    localStorage.setItem('flux_daily_payouts', JSON.stringify(dailyPayouts));
  }, [dailyPayouts]);

  useEffect(() => {
    localStorage.setItem('flux_seller_strikes', JSON.stringify(sellerStrikes));
  }, [sellerStrikes]);

  useEffect(() => {
    localStorage.setItem('flux_flagged_chats', JSON.stringify(flaggedChats));
  }, [flaggedChats]);

  useEffect(() => {
    localStorage.setItem('flux_moderation_items', JSON.stringify(moderationItems));
  }, [moderationItems]);

  useEffect(() => {
    localStorage.setItem('flux_order_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('flux_sms_logs', JSON.stringify(smsLogs));
  }, [smsLogs]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('flux_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('flux_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('flux_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('flux_seller', JSON.stringify(sellerProfile));
  }, [sellerProfile]);

  // Translation helper
  const t = (key: keyof typeof translations['en']): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  // Secret Admin Tap Handler
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastTapTime < 2500) {
      const nextCount = logoTapCount + 1;
      setLogoTapCount(nextCount);
      if (nextCount >= 5) {
        setSecretPinModalOpen(true);
        setLogoTapCount(0);
      }
    } else {
      setLogoTapCount(1);
    }
    setLastTapTime(now);
  };

  const verifyAdminPin = (pin: string): boolean => {
    if (pin.trim() === '7788' || pin.trim() === '1337') {
      setRole('admin');
      setSecretPinModalOpen(false);
      return true;
    }
    return false;
  };

  // Auth & Multi-Account Handlers
  const switchAccount = (accountId: string) => {
    const target = accounts.find((a) => a.id === accountId);
    if (!target) return;
    setCurrentAccountId(target.id);
    setCustomerName(target.name);
    setCustomerPhone(target.phone || null);
    setCustomerEmail(target.email || null);
    setRole(target.role);
    setIsLoggedIn(true);
    setIsAccountSwitcherOpen(false);

    if (target.role === 'customer') {
      setSocialProfile((sp) => ({
        ...sp,
        name: target.name,
        phone: target.phone || sp.phone,
        profilePhoto: target.avatar || sp.profilePhoto,
        loyaltyPoints: target.loyaltyPoints ?? sp.loyaltyPoints
      }));
    } else if (target.role === 'seller' && target.shopName) {
      setSellerProfile((prev) => ({
        ...prev,
        shopName: target.shopName || prev.shopName,
        ownerName: target.name,
        phone: target.phone || prev.phone,
        email: target.email || prev.email
      }));
    }
  };

  const addNewAccount = (newAcc: Omit<UserAccountProfile, 'id'>): string => {
    const newId = `acc_${Date.now()}`;
    const fullAccount: UserAccountProfile = { ...newAcc, id: newId };
    setAccounts((prev) => [...prev, fullAccount]);
    switchAccount(newId);
    return newId;
  };

  const loginWithPhoneOtp = (
    phone: string,
    name?: string,
    chosenRole: Role = 'customer',
    shopName?: string,
    email?: string
  ) => {
    const cleanPhone = phone.trim();
    const effectiveName = name?.trim() || (chosenRole === 'seller' ? 'Merchant Partner' : 'Valued Customer');

    const existing = accounts.find(
      (a) => (cleanPhone && a.phone === cleanPhone) || (email && a.email?.toLowerCase() === email.toLowerCase())
    );

    if (existing) {
      switchAccount(existing.id);
    } else {
      const newAccId = `acc_${Date.now()}`;
      const newProfile: UserAccountProfile = {
        id: newAccId,
        name: effectiveName,
        phone: cleanPhone || undefined,
        email: email || undefined,
        role: chosenRole,
        avatar: chosenRole === 'seller'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        shopName: chosenRole === 'seller' ? (shopName || `${effectiveName}'s Store`) : undefined,
        tagline: chosenRole === 'seller' ? 'Verified Merchant' : 'VIP Member',
        loyaltyPoints: 200
      };
      setAccounts((prev) => [...prev, newProfile]);
      setCurrentAccountId(newAccId);
      setCustomerName(effectiveName);
      setCustomerPhone(cleanPhone || null);
      setCustomerEmail(email || null);
      setRole(chosenRole);
      setIsLoggedIn(true);

      if (chosenRole === 'seller') {
        setSellerProfile((prev) => ({
          ...prev,
          shopName: shopName || `${effectiveName}'s Store`,
          ownerName: effectiveName,
          phone: cleanPhone || prev.phone,
          email: email || prev.email
        }));
      } else {
        setSocialProfile((sp) => ({
          ...sp,
          name: effectiveName,
          phone: cleanPhone || sp.phone
        }));
      }
    }

    setOtpModalOpen(false);
  };

  const logoutCustomer = () => {
    // 1. Clear active authentication and customer credentials
    setIsLoggedIn(false);
    setCustomerPhone(null);
    setCustomerEmail(null);
    setCustomerName('Guest User');

    // 2. Wipe sensitive session data, orders, and cart
    setOrders([]);
    setCart([]);
    setAccounts([]);
    setCurrentAccountId('');
    setAppliedVoucher(null);
    setActiveTrackingOrder(null);

    // 3. Reset social profile to pristine guest state with zero traces of previous session
    setSocialProfile({
      name: 'Guest User',
      phone: '',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      bio: 'Welcome to FLUX MART. Sign in to customize your profile, collect reward coins, and track orders.',
      tagline: 'Guest Explorer · Browse Public Store',
      location: 'Dhaka, Bangladesh',
      totalReviews: 0,
      sharedPostsCount: 0,
      loyaltyPoints: 0,
      referralCode: 'FLUX-GUEST',
      badges: [],
      preferredCategories: ['fashion', 'electronics']
    });

    // 4. Strictly clear all session items and local credentials from browser storage
    try {
      localStorage.removeItem('flux_is_logged_in');
      localStorage.removeItem('flux_social_profile');
      localStorage.removeItem('flux_orders');
      localStorage.removeItem('flux_cart');
      localStorage.removeItem('flux_user_accounts');
      localStorage.removeItem('flux_active_account_id');
      localStorage.removeItem('flux_customer_phone');
      localStorage.removeItem('flux_customer_name');
      localStorage.removeItem('flux_customer_address');
    } catch {
      // Storage access protected
    }

    // 5. Reset roles and tabs to clean public store
    setRole('customer');
    setActiveMainTab('shop');
    setIsAccountSwitcherOpen(false);

    // 6. Direct user immediately to the clean Sign In / Register login page
    setOtpModalOpen(true);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartDiscount = appliedVoucher
    ? appliedVoucher.discountType === 'percentage'
      ? Math.round((cartSubtotal * appliedVoucher.discountValue) / 100)
      : Math.min(appliedVoucher.discountValue, cartSubtotal)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedVariant === variant);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  const applyVoucherCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = INITIAL_VOUCHERS.find((v) => v.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid voucher code.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Voucher requires minimum order value of ৳${found.minOrderValue.toLocaleString()}.`
      };
    }
    setAppliedVoucher(found);
    return { success: true, message: `Promo code ${found.code} successfully applied!` };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  // Order Management
  const createOrder = (orderData: Omit<Order, 'id' | 'orderDate'>): Order => {
    const newId = `FLX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const order: Order = {
      ...orderData,
      id: newId,
      orderDate: now
    };

    setOrders((prev) => [order, ...prev]);
    clearCart();

    // If customer bought current seller's item, update seller wallet
    const sellerSales = order.items.filter((item) => item.product.sellerId === sellerProfile.id);
    if (sellerSales.length > 0) {
      const sellerGross = sellerSales.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const commissionPct = categoryCommissions[sellerSales[0].product.category] || 10;
      const commissionDeducted = Math.round((sellerGross * commissionPct) / 100);
      const netToSeller = sellerGross - commissionDeducted;

      setSellerProfile((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + netToSeller,
        totalEarnings: prev.totalEarnings + netToSeller
      }));
    }

    // Auto-push order invoice notification
    const orderNotif: SmartNotification = {
      id: `notif_${Date.now()}`,
      type: 'order_update',
      title: `Order Confirmed: #${newId}`,
      titleBn: `অর্ডার নিশ্চিত হয়েছে: #${newId}`,
      message: `Your order #${newId} is confirmed. Advance delivery fee of ৳${(order.advanceDeliveryFeePaid ?? order.shippingFee).toLocaleString()} received via ${order.advancePaymentMethod?.toUpperCase() || 'MFS'}. Tap to view & download your Official Digital Memo.`,
      messageBn: `আপনার অর্ডার #${newId} নিশ্চিত হয়েছে। ডিজিটাল মেমো ডাউনলোড করতে ট্যাপ করুন।`,
      timestamp: 'Just now',
      read: false,
      orderId: newId,
      imageUrl: order.items[0]?.product.image
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
  };

  // Products & Real-Time Sync Engine
  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = `prod_${newProductData.category.substring(0, 4)}_${Date.now()}`;
    const product: Product = {
      ...newProductData,
      id: newId
    };
    setProducts((prev) => [product, ...prev]);

    // Send instant system notification for new product arrival
    const productNotif: SmartNotification = {
      id: `notif_prod_${Date.now()}`,
      title: 'New Merchant Item Live',
      titleBn: 'নতুন পণ্য লাইভ হয়েছে',
      message: `${product.title} from ${product.sellerName} is now in stock across the marketplace.`,
      messageBn: `${product.titleBn || product.title} এখন মার্কেটপ্লেসে পাওয়া যাচ্ছে।`,
      category: product.category,
      timestamp: 'Just now',
      read: false,
      type: 'product_alert',
      productId: product.id,
      imageUrl: product.image
    };
    setNotifications((prev) => [productNotif, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  const addPromotionalBanner = (bannerData: Omit<PromotionalBanner, 'id'>) => {
    const newBanner: PromotionalBanner = {
      ...bannerData,
      id: `banner_${Date.now()}`
    };
    setPromotionalBanners((prev) => [newBanner, ...prev]);
  };

  const deletePromotionalBanner = (id: string) => {
    setPromotionalBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Seller KYC & Wallet
  const updateSellerProfile = (updates: Partial<SellerProfile>) => {
    setSellerProfile((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const simulateKycStatusChange = (status: KycStatus) => {
    setSellerProfile((prev) => ({
      ...prev,
      kycStatus: status
    }));
  };

  const updateSellerKyc = (doc: KycDocument) => {
    setSellerProfile((prev) => ({
      ...prev,
      kycStatus: 'pending',
      kycDocument: doc
    }));
  };

  const sendSellerAdminMessage = (text: string, category: SellerAdminMessage['category'] = 'general') => {
    if (!text.trim()) return;
    const sellerMsg: SellerAdminMessage = {
      id: `sam_${Date.now()}`,
      sender: 'seller',
      senderName: sellerProfile.ownerName,
      senderRole: sellerProfile.shopName,
      message: text.trim(),
      timestamp: 'Just now',
      category
    };

    setSellerAdminMessages((prev) => [...prev, sellerMsg]);

    // Simulated instant reply from FLUX Super-Admin Desk
    setTimeout(() => {
      let replyText = `Thank you, ${sellerProfile.ownerName}. Your request has been acknowledged by FLUX Super-Admin Operations.`;
      if (category === 'payout') {
        replyText = `We have verified your payout clearance for ${sellerProfile.shopName}. Bank BEFTN and bKash Merchant disbursements are processed every business day at 11:30 AM & 4:30 PM.`;
      } else if (category === 'kyc') {
        replyText = `Our merchant compliance desk has received your NID & Trade License documents. AI document validation has matched your account details. Verification audit completed.`;
      } else if (category === 'dispute') {
        replyText = `Customer / Courier dispute ticket logged. We have flagged the order with Pathao & Steadfast logistics and held escrow clearance safely.`;
      } else if (category === 'listing') {
        replyText = `Your product catalog specifications have been validated and approved for instant live customer synchronization across Bangladesh.`;
      }

      const adminReply: SellerAdminMessage = {
        id: `sam_${Date.now() + 1}`,
        sender: 'admin',
        senderName: 'Farhan Kabir (FLUX Super-Admin Desk)',
        senderRole: 'Senior Merchant Operations',
        message: replyText,
        timestamp: 'Just now',
        category
      };
      setSellerAdminMessages((prev) => [...prev, adminReply]);
    }, 1200);
  };

  const requestSellerWithdrawal = (
    amount: number,
    method: WithdrawalRequest['payoutMethod'],
    details: string
  ): boolean => {
    if (amount <= 0 || amount > sellerProfile.walletBalance) {
      return false;
    }
    const newReq: WithdrawalRequest = {
      id: `WDR-${Math.floor(100 + Math.random() * 900)}`,
      sellerId: sellerProfile.id,
      sellerName: sellerProfile.shopName,
      amount,
      payoutMethod: method,
      accountDetails: details,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };

    setSellerProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      pendingBalance: prev.pendingBalance + amount
    }));
    setWithdrawalRequests((prev) => [newReq, ...prev]);
    return true;
  };

  // Admin Master Actions
  const updateCommission = (category: keyof CategoryCommission, rate: number) => {
    setCategoryCommissions((prev) => ({
      ...prev,
      [category]: rate
    }));
  };

  const toggleCourier = (id: CourierConfig['id']) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const updateCourierRate = (
    id: CourierConfig['id'],
    field: 'insideDhakaRate' | 'outsideDhakaRate',
    rate: number
  ) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: rate } : c))
    );
  };

  const adminApproveKyc = (sellerId: string) => {
    if (sellerId === sellerProfile.id || sellerId === sellerProfile.merchantUniqueId) {
      setSellerProfile((prev) => ({
        ...prev,
        kycStatus: 'verified',
        verifiedBadge: true
      }));
    }
  };

  const adminRejectKyc = (sellerId: string, reason: string) => {
    if (sellerId === sellerProfile.id) {
      setSellerProfile((prev) => ({
        ...prev,
        kycStatus: 'rejected',
        kycDocument: prev.kycDocument
          ? { ...prev.kycDocument, rejectionReason: reason }
          : undefined
      }));
    }
  };

  const reconcileCodPayouts = () => {
    setCodReconciledTotal((prev) => prev + 34500);
  };

  // Sub-Admin Auth & Team Switching
  const loginAsSubAdmin = (emailOrPhone: string): boolean => {
    const clean = emailOrPhone.trim().toLowerCase();
    const found = subAdmins.find(
      (s) =>
        s.email.toLowerCase() === clean ||
        s.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, '')) ||
        s.id.toLowerCase() === clean
    );
    const target = found || subAdmins[0];
    setSubAdminUser(target);
    setActiveSubAdminTeam(target.team);
    setRole('subadmin');
    setIsLoggedIn(true);
    setCustomerName(target.name);
    setCustomerEmail(target.email);
    setCustomerPhone(target.phone);
    return true;
  };

  const loginAsSuperAdmin = () => {
    setRole('admin');
    setCustomerEmail('fluxmart365@gmail.com');
    setCustomerName('Master Super-Admin');
    setCustomerPhone('+8801799887766');
    setIsLoggedIn(true);
  };

  // One-Click Daily Payout Engine
  const triggerOneClickDailyPayout = (): DailyPayoutSummary => {
    const grossAmount = 342800;
    const commissionDeducted = Math.round(grossAmount * 0.10); // 10% platform commission
    const netPayout = grossAmount - commissionDeducted;
    const batchNumber = `FLUX-PAY-${Date.now().toString().slice(-6)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const summary: DailyPayoutSummary = {
      id: `payout_${Date.now()}`,
      batchNumber,
      date: todayStr,
      totalOrdersProcessed: 42,
      grossDeliveredAmount: grossAmount,
      totalCommissionDeducted: commissionDeducted,
      netPayoutDistributed: netPayout,
      sellersPaidCount: 16,
      status: 'completed',
      timestamp: new Date().toLocaleString()
    };

    setDailyPayouts((prev) => [summary, ...prev]);
    setLastPayoutSummary(summary);
    setIsPayoutModalOpen(true);

    // Auto-credit active seller wallet
    const sellerPayoutCredit = 38500;
    setSellerProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + sellerPayoutCredit,
      pendingBalance: Math.max(0, prev.pendingBalance - sellerPayoutCredit),
      totalEarnings: prev.totalEarnings + sellerPayoutCredit
    }));

    // Record telecom SMS to merchant
    sendSms(
      sellerProfile.phone,
      `FLUX MART: Daily Payout of ৳${sellerPayoutCredit.toLocaleString()} credited to your ${sellerProfile.payoutMethod || 'bKash Merchant'} wallet. Commission deducted. Batch Ref: ${batchNumber}.`,
      'payout_alert',
      'Banglalink'
    );

    return summary;
  };

  const approveWithdrawalRequest = (id: string) => {
    setWithdrawalRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          sendSms(
            sellerProfile.phone,
            `FLUX MART: Withdrawal request #${r.id} for ৳${r.amount.toLocaleString()} has been approved and disbursed to ${r.accountDetails}.`,
            'payout_alert'
          );
          return { ...r, status: 'approved' };
        }
        return r;
      })
    );
  };

  const rejectWithdrawalRequest = (id: string, reason?: string) => {
    const target = withdrawalRequests.find((r) => r.id === id);
    if (target && target.status === 'pending') {
      // Refund balance to seller
      setSellerProfile((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + target.amount,
        pendingBalance: Math.max(0, prev.pendingBalance - target.amount)
      }));
      sendSms(
        sellerProfile.phone,
        `FLUX MART: Withdrawal request #${target.id} was rejected (${reason || 'Account details mismatch'}). Funds refunded to seller wallet.`,
        'payout_alert'
      );
    }
    setWithdrawalRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  // 3-Strike Disciplinary Framework
  const issueSellerStrike = (
    sellerId: string,
    strikeNumber: 1 | 2 | 3,
    reason: string,
    severity: 'warning' | 'freeze' | 'suspension',
    team: SubAdminTeam | 'super_admin' = 'group_a_kyc'
  ) => {
    const newStrike: SellerStrike = {
      id: `strike_${Date.now()}`,
      sellerId,
      strikeNumber,
      reason,
      issuedBy: subAdminUser?.name || 'Super-Admin Operations',
      issuedByTeam: team,
      issuedAt: new Date().toLocaleString(),
      severity,
      status: 'active'
    };

    setSellerStrikes((prev) => [newStrike, ...prev]);

    if (sellerId === sellerProfile.id || sellerId === sellerProfile.merchantUniqueId) {
      setSellerProfile((prev) => {
        const nextStrikes = [...(prev.strikes || []), newStrike];
        const isListingFrozen = nextStrikes.filter((s) => s.status === 'active').length >= 2;
        const isSuspended = nextStrikes.filter((s) => s.status === 'active').length >= 3;
        return {
          ...prev,
          strikes: nextStrikes,
          isListingFrozen,
          isSuspended
        };
      });
    }

    sendSms(
      sellerProfile.phone,
      `FLUX MART DISCIPLINARY NOTICE: Strike #${strikeNumber} (${severity.toUpperCase()}) issued. Reason: ${reason}. Please contact compliance@fluxmart.bd.`,
      'strike_notice',
      'Grameenphone'
    );
  };

  const revokeSellerStrike = (strikeId: string) => {
    setSellerStrikes((prev) =>
      prev.map((s) => (s.id === strikeId ? { ...s, status: 'revoked' } : s))
    );
    setSellerProfile((prev) => {
      const remainingActive = (prev.strikes || []).filter(
        (s) => s.id !== strikeId && s.status === 'active'
      );
      return {
        ...prev,
        strikes: (prev.strikes || []).map((s) =>
          s.id === strikeId ? { ...s, status: 'revoked' } : s
        ),
        isListingFrozen: remainingActive.length >= 2,
        isSuspended: remainingActive.length >= 3
      };
    });
  };

  // Chat Monitoring & Fraud Resolution
  const resolveFlaggedChat = (
    id: string,
    action: 'reviewed' | 'warning_sent' | 'seller_frozen'
  ) => {
    setFlaggedChats((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, status: action } : fc))
    );
    if (action === 'warning_sent') {
      issueSellerStrike(
        sellerProfile.id,
        1,
        'Circumvention violation: Soliciting off-platform payment/phone leak.',
        'warning',
        'group_b_support_fraud'
      );
    } else if (action === 'seller_frozen') {
      issueSellerStrike(
        sellerProfile.id,
        2,
        'Severe circumvention repeat: Off-platform transaction solicitation.',
        'freeze',
        'group_b_support_fraud'
      );
    }
  };

  // Content Moderation
  const auditModerationItem = (id: string, decision: 'approved' | 'delisted') => {
    setModerationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
  };

  // Disputes & Escrow Returns
  const createDispute = (
    orderId: string,
    reason: OrderDispute['reason'],
    description: string,
    evidencePhoto?: string
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const newDispute: OrderDispute = {
      id: `disp_${Date.now()}`,
      orderId,
      customerId: targetOrder?.customerId || 'cust_01',
      customerName: targetOrder?.customerName || customerName,
      sellerId: targetOrder?.sellerUniqueId || 'seller_current',
      sellerName: targetOrder?.sellerShopName || 'Aura Lifestyle & Tech BD',
      reason,
      description,
      evidencePhoto:
        evidencePhoto ||
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      requestedResolution: 'refund',
      status: 'pending_review',
      escrowAmount: targetOrder ? targetOrder.sellerPayout : 3755,
      createdAt: 'Just now'
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Hold Order Payout in Escrow
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, payoutHeldInEscrow: true, payoutStatus: 'held_dispute', dispute: newDispute }
          : o
      )
    );

    sendSms(
      targetOrder?.customerPhone || customerPhone || '+8801799887766',
      `FLUX MART: Return dispute registered for Order #${orderId}. Seller payout is held in 100% Escrow. Our Team D arbiter is auditing proof.`,
      'order_update'
    );
  };

  const resolveDispute = (
    disputeId: string,
    resolution: 'escrow_refunded' | 'rejected' | 'replacement_shipped',
    notes?: string
  ) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolution,
              resolvedBy: subAdminUser?.name || 'Team D Logistics Lead',
              resolutionNotes: notes || `Resolved as ${resolution}`
            }
          : d
      )
    );

    const dispute = disputes.find((d) => d.id === disputeId);
    if (dispute) {
      if (resolution === 'escrow_refunded') {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === dispute.orderId ? { ...o, orderStatus: 'returned', payoutHeldInEscrow: false } : o
          )
        );
        sendSms(
          customerPhone || '+8801799887766',
          `FLUX MART: Escrow refund of ৳${dispute.escrowAmount.toLocaleString()} approved for order #${dispute.orderId}. Credited back to original payment method.`,
          'advance_fee'
        );
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === dispute.orderId ? { ...o, payoutHeldInEscrow: false } : o))
        );
      }
    }
  };

  // Localized SMS Gateway Engine
  const sendSms = (
    phone: string,
    message: string,
    type: SmsGatewayLog['type'],
    customOperator?: SmsGatewayLog['operator']
  ) => {
    let operator: SmsGatewayLog['operator'] = customOperator || 'Grameenphone';
    if (!customOperator) {
      if (phone.includes('017') || phone.includes('013')) operator = 'Grameenphone';
      else if (phone.includes('019') || phone.includes('014')) operator = 'Banglalink';
      else if (phone.includes('018')) operator = 'Robi';
      else if (phone.includes('015')) operator = 'Teletalk';
    }

    const newLog: SmsGatewayLog = {
      id: `sms_${Date.now()}`,
      recipientPhone: phone,
      message,
      type,
      operator,
      status: 'delivered',
      timestamp: 'Just now',
      gatewayRef: `${operator.slice(0, 2).toUpperCase()}-GATEWAY-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setSmsLogs((prev) => [newLog, ...prev]);
  };

  // Legal Modal
  const openLegalModal = (tab: 'privacy' | 'terms' | 'dgda' | 'dbid' = 'dbid') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Social Profile Customizer
  const updateSocialProfile = (updates: Partial<CustomerSocialProfile>) => {
    setSocialProfile((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Video Actions
  const toggleLikeVideo = (videoId: string) => {
    setShoppableVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const nextLiked = !v.isLiked;
          return {
            ...v,
            isLiked: nextLiked,
            likesCount: nextLiked ? v.likesCount + 1 : v.likesCount - 1
          };
        }
        return v;
      })
    );
  };

  // Post Actions
  const toggleLikePost = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      author: socialProfile.name,
      text: text.trim(),
      time: 'Just now'
    };
    setSocialPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, newComment]
            }
          : p
      )
    );
  };

  const createSocialPost = (content: string, image?: string, taggedProduct?: Product) => {
    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      authorName: socialProfile.name,
      authorAvatar: socialProfile.profilePhoto,
      authorLocation: socialProfile.location,
      postedAt: 'Just now',
      content,
      image,
      taggedProduct,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      comments: []
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    addLoyaltyPoints(100, 'Created Verified Look Post');
  };

  const createShoppableReel = (
    title: string,
    videoPoster: string,
    taggedProduct: Product,
    soundTrack?: string
  ): ShoppableVideo => {
    const newVideo: ShoppableVideo = {
      id: `vid_${Date.now()}`,
      title,
      titleBn: title,
      creatorName: socialProfile.name || 'Verified Creator',
      creatorAvatar:
        socialProfile.profilePhoto ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      creatorHandle: `@${(socialProfile.name || 'creator').toLowerCase().replace(/\s+/g, '_')}`,
      soundTrack: soundTrack || 'Original Sound - FLUX Acoustic Beats',
      videoDuration: '0:28',
      tags: ['#FLUXReels', '#Unboxing', '#DhakaLiving'],
      likesCount: 1,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      videoPoster,
      taggedProduct
    };
    setShoppableVideos((prev) => [newVideo, ...prev]);
    addLoyaltyPoints(150, 'Uploaded New Shoppable Reel');
    return newVideo;
  };

  const addLoyaltyPoints = (points: number, reason: string) => {
    setSocialProfile((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + points,
      sharedPostsCount: reason.toLowerCase().includes('share') ? prev.sharedPostsCount + 1 : prev.sharedPostsCount
    }));
    setRecentPointsAwarded({ amount: points, reason });
  };

  const dismissPointsNotice = () => {
    setRecentPointsAwarded(null);
  };

  const redeemPointsForVoucher = (cost: number, voucherValue: number) => {
    if (socialProfile.loyaltyPoints < cost) {
      return { success: false, message: `Need ${cost} FLUX Coins. You have ${socialProfile.loyaltyPoints}.` };
    }
    const code = `REWARD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVoucher: Voucher = {
      code,
      discountType: 'fixed',
      discountValue: voucherValue,
      minOrderValue: voucherValue * 2,
      description: `৳${voucherValue} Loyalty Voucher (Redeemed with ${cost} points)`
    };

    setSocialProfile((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - cost
    }));

    setAppliedVoucher(newVoucher);
    return { success: true, code, message: `Successfully redeemed! Voucher ${code} applied to your bag.` };
  };

  const openShareModal = (item: { title: string; url: string; image?: string; type: 'video' | 'post' | 'product'; id: string }) => {
    setActiveShareModalItem(item);
  };

  const closeShareModal = () => {
    setActiveShareModalItem(null);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        viewMode,
        setViewMode,
        showSplash,
        setShowSplash,
        secretPinModalOpen,
        setSecretPinModalOpen,
        handleLogoClick,
        verifyAdminPin,
        customerPhone,
        customerName,
        customerEmail,
        isLoggedIn,
        loginWithPhoneOtp,
        logoutCustomer,
        otpModalOpen,
        setOtpModalOpen,
        accounts,
        currentAccountId,
        switchAccount,
        addNewAccount,
        isAccountSwitcherOpen,
        setIsAccountSwitcherOpen,
        products,
        addProduct,
        updateProduct,
        updateProductStock,
        promotionalBanners,
        addPromotionalBanner,
        deletePromotionalBanner,
        activeMainTab,
        setActiveMainTab,
        socialProfile,
        updateSocialProfile,
        shoppableVideos,
        toggleLikeVideo,
        socialPosts,
        toggleLikePost,
        addPostComment,
        createSocialPost,
        createShoppableReel,
        addLoyaltyPoints,
        redeemPointsForVoucher,
        activeShareModalItem,
        openShareModal,
        closeShareModal,
        recentPointsAwarded,
        dismissPointsNotice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedVoucher,
        applyVoucherCode,
        removeVoucher,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        orders,
        createOrder,
        updateOrderStatus,
        activeTrackingOrder,
        setActiveTrackingOrder,
        sellerProfile,
        updateSellerProfile,
        updateSellerKyc,
        simulateKycStatusChange,
        requestSellerWithdrawal,
        withdrawalRequests,
        sellerAdminMessages,
        sendSellerAdminMessage,
        isSellerAdminMessengerOpen,
        setIsSellerAdminMessengerOpen,
        categoryCommissions,
        updateCommission,
        couriers,
        toggleCourier,
        updateCourierRate,
        adminApproveKyc,
        adminRejectKyc,
        codReconciledTotal,
        reconcileCodPayouts,
        isLiveSupportOpen,
        supportContext,
        openLiveSupport,
        closeLiveSupport,
        notifications,
        unreadNotificationCount,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        preferredCategories,
        togglePreferredCategory,
        isDigitalInvoiceOpen,
        selectedInvoiceOrder,
        openDigitalInvoice,
        closeDigitalInvoice,
        isSellerPublicProfileOpen,
        selectedSellerProfile,
        openSellerPublicProfile,
        closeSellerPublicProfile,
        activeSubAdminTeam,
        setActiveSubAdminTeam,
        subAdminUser,
        subAdmins,
        loginAsSubAdmin,
        loginAsSuperAdmin,
        dailyPayouts,
        triggerOneClickDailyPayout,
        lastPayoutSummary,
        isPayoutModalOpen,
        setIsPayoutModalOpen,
        approveWithdrawalRequest,
        rejectWithdrawalRequest,
        sellerStrikes,
        issueSellerStrike,
        revokeSellerStrike,
        flaggedChats,
        resolveFlaggedChat,
        moderationItems,
        auditModerationItem,
        disputes,
        createDispute,
        resolveDispute,
        smsLogs,
        sendSms,
        isSmsViewerOpen,
        setIsSmsViewerOpen,
        isLegalModalOpen,
        setIsLegalModalOpen,
        legalModalTab,
        openLegalModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
