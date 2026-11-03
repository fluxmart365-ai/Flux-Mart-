export type Role = 'customer' | 'seller' | 'admin' | 'subadmin';

export type Language = 'en' | 'bn';

export type ProductCategory = 'fashion' | 'electronics' | 'medicine' | 'household';

export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export type MerchantTier = 'verified' | 'silver' | 'gold' | 'platinum';

export type SubAdminTeam = 
  | 'group_a_kyc' 
  | 'group_b_support_fraud' 
  | 'group_c_content' 
  | 'group_d_logistics';

export interface SubAdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  team: SubAdminTeam;
  roleTitle: string;
  onDuty: boolean;
  tasksCompleted: number;
  currentStatus: string;
}

export interface SellerStrike {
  id: string;
  sellerId: string;
  strikeNumber: 1 | 2 | 3;
  reason: string;
  issuedBy: string;
  issuedByTeam: SubAdminTeam | 'super_admin';
  issuedAt: string;
  severity: 'warning' | 'freeze' | 'suspension';
  status: 'active' | 'appealed' | 'revoked';
}

export interface KycDocument {
  documentType: 'nid' | 'passport' | 'driving_license';
  documentNumber: string;
  fullNameBengali: string;
  fullNameEnglish: string;
  dateOfBirth: string;
  tradeLicenseNumber?: string;
  frontImage: string;
  backImage?: string;
  faceScanImage?: string;
  submittedAt: string;
  rejectionReason?: string;
}

export interface SellerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SellerProfile {
  id: string;
  merchantUniqueId: string; // e.g. 'FLUX-MART-542'
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  division: string;
  district: string;
  address: string;
  warehouseLocation: string;
  businessCategory?: string;
  payoutMethod?: 'bkash_merchant' | 'nagad_merchant' | 'bank_transfer';
  payoutAccountDetails?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  kycStatus: KycStatus;
  kycDocument?: KycDocument;
  verifiedBadge?: boolean;
  tier?: MerchantTier;
  fastDispatchScore?: number; // percentage e.g. 98
  returnRate?: number; // percentage e.g. 1.2
  strikes?: SellerStrike[];
  isSuspended?: boolean;
  isListingFrozen?: boolean;
  walletBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  rating: number;
  reviews?: SellerReview[];
  productViewsCount?: number;
  joinedDate: string;
}

export interface SellerAdminMessage {
  id: string;
  sender: 'seller' | 'admin';
  senderName: string;
  senderRole?: string;
  message: string;
  timestamp: string;
  category?: 'payout' | 'kyc' | 'dispute' | 'listing' | 'general';
}

export interface Product {
  id: string;
  title: string;
  titleBn: string;
  category: ProductCategory;
  subCategory?: string; // e.g. "Royal Panjabi & Kurtas", "Audio & Wearables"
  price: number; // in BDT (৳)
  originalPrice: number;
  stock: number;
  sku: string;
  brand: string;
  sellerId: string;
  sellerName: string;
  sellerUniqueId?: string; // e.g. 'FLUX-MART-542'
  sellerVerified?: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  colors?: { name: string; hex: string; inStock: boolean }[];
  sizes?: { name: string; inStock: boolean }[];
  fabricTypes?: { name: string; inStock: boolean }[]; // Apparel/Fashion
  deviceModels?: { brand: string; model: string; inStock: boolean }[]; // Tech & Mobile Accessories
  materials?: { name: string; inStock: boolean }[]; // Cases/Living materials
  packSizes?: { label: string; inStock: boolean }[]; // Medicine / Everyday Goods
  dosageOrUnits?: string[]; // e.g. "500mg USP", "1000 IU"
  expiryDate?: string; // e.g. "12/2027"
  batchNumber?: string; // e.g. "FLX-8821"
  dgdaRegNumber?: string; // e.g. "DGDA-AYUR-89241"
  specifications?: { label: string; value: string }[];
  description: string;
  descriptionBn: string;
  weightKg: number;
  codSupported: boolean;
  warranty: string;
  courierSupported: ('pathao' | 'redx' | 'steadfast')[];
  featured?: boolean;
}

export interface PromotionalBanner {
  id: string;
  tag: string;
  tagColor?: string;
  title: string;
  titleBn?: string;
  subtitle: string;
  subtitleBn?: string;
  discountPercentage: number;
  couponCode?: string;
  targetCategory?: ProductCategory | 'all';
  targetProductId?: string;
  bgGradient: string;
  imageUrl?: string;
  expiryHours?: number;
  ctaText?: string;
  ctaTextBn?: string;
}

export interface UserAccountProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: Role;
  avatar: string;
  shopName?: string;
  tagline?: string;
  loyaltyPoints?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus = 'to_pay' | 'to_ship' | 'to_receive' | 'to_review' | 'completed' | 'returned';

export type CourierProvider = 'pathao' | 'redx' | 'steadfast';

export interface CourierTrackingCheckpoint {
  time: string;
  status: string;
  location: string;
  description: string;
}

export interface CourierInfo {
  provider: CourierProvider;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingCharge: number;
  currentStatus: string;
  checkpoints: CourierTrackingCheckpoint[];
}

export type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'cod';

export interface DetailedShippingAddress {
  division: string; // 1. Division (বিভাগ)
  district: string; // 2. District (জেলা - all 64 districts)
  thana: string; // 3. Upazila / Thana (থানা / উপজেলা)
  wardNo: string; // 4. Ward Number (ওয়ার্ড নম্বর)
  roadOrBlock: string; // 5. Road Number / Block (রোড নম্বর / ব্লক)
  houseOrVillage: string; // 6. House / Flat No. or Village (হাউস / ফ্ল্যাট নম্বর অথবা গ্রাম)
  city?: string; // backwards compatibility
  area?: string; // backwards compatibility
  fullAddress: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: DetailedShippingAddress;
  items: CartItem[];
  sellerUniqueId?: string; // e.g. 'FLUX-MART-542'
  sellerShopName?: string;
  sellerVerified?: boolean;
  subtotal: number;
  discount: number;
  shippingFee: number;
  advanceDeliveryFeePaid: number; // Mandatory advance delivery fee paid via bKash/Nagad
  advancePaymentMethod?: 'bkash' | 'nagad';
  dueAmountOnDelivery: number; // Cash to be collected at doorstep delivery (COD)
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'cod_pending' | 'advance_paid_cod_pending';
  transactionId?: string;
  orderStatus: OrderStatus;
  courier: CourierInfo;
  orderDate: string;
  voucherCode?: string;
  sellerPayout: number;
  platformFee: number;
  dispute?: OrderDispute;
  payoutHeldInEscrow?: boolean;
  payoutStatus?: 'pending_daily_payout' | 'paid_to_wallet' | 'held_dispute';
}

export interface Voucher {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
}

export interface CategoryCommission {
  fashion: number; // percentage, e.g. 12%
  electronics: number; // e.g. 8%
  medicine: number; // e.g. 5%
  household: number; // e.g. 10%
}

export interface CourierConfig {
  id: CourierProvider;
  name: string;
  enabled: boolean;
  insideDhakaRate: number;
  outsideDhakaRate: number;
  expressRate: number;
  avgDeliveryHours: number;
  logoColor: string;
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  payoutMethod: 'bkash_merchant' | 'nagad_merchant' | 'bank_transfer';
  accountDetails: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CustomerBadge {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  description: string;
  tier: 'gold' | 'platinum' | 'elite';
}

export interface CustomerSocialProfile {
  name: string;
  phone: string;
  profilePhoto: string;
  coverImage: string;
  bio: string;
  tagline: string;
  location: string;
  totalReviews: number;
  sharedPostsCount: number;
  loyaltyPoints: number;
  referralCode: string;
  badges: CustomerBadge[];
  preferredCategories?: ProductCategory[];
}

export type NotificationType = 'offer' | 'price_drop' | 'order_update' | 'mention' | 'flash_sale' | 'product_alert';

export interface SmartNotification {
  id: string;
  type: NotificationType;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  category?: ProductCategory;
  timestamp: string;
  read: boolean;
  orderId?: string;
  productId?: string;
  discountBadge?: string;
  imageUrl?: string;
  mentionAuthor?: string;
}

export interface ShoppableVideo {
  id: string;
  title: string;
  titleBn: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isSeller?: boolean;
  videoPoster: string;
  videoDuration: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  taggedProduct: Product;
  soundTrack: string;
  tags: string[];
}

export interface SocialPostComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  postedAt: string;
  content: string;
  image?: string;
  taggedProduct?: Product;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  comments: SocialPostComment[];
}

export interface OrderDispute {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  sellerName: string;
  reason: 'damaged' | 'defective' | 'wrong_item' | 'fake_item' | 'never_arrived';
  description: string;
  evidencePhoto?: string;
  requestedResolution: 'refund' | 'replacement';
  status: 'pending_review' | 'evidence_requested' | 'escrow_refunded' | 'rejected' | 'replacement_shipped';
  escrowAmount: number;
  createdAt: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface FlaggedChatMessage {
  id: string;
  sellerId: string;
  sellerName: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  messageText: string;
  timestamp: string;
  flagReason: 'phone_number_detected' | 'direct_mfs_request' | 'circumvention_deal' | 'abusive_language';
  triggerKeywords: string[];
  severity: 'critical' | 'high' | 'medium';
  status: 'flagged' | 'reviewed' | 'warning_sent' | 'seller_frozen';
}

export interface ModerationAuditItem {
  id: string;
  targetType: 'product' | 'reel' | 'post';
  targetId: string;
  title: string;
  creatorOrSellerName: string;
  thumbnail: string;
  category?: string;
  flagReason: string;
  submittedAt: string;
  status: 'under_review' | 'delisted' | 'approved';
}

export interface SmsGatewayLog {
  id: string;
  recipientPhone: string;
  message: string;
  type: 'otp' | 'order_update' | 'advance_fee' | 'payout_alert' | 'strike_notice';
  operator: 'Grameenphone' | 'Banglalink' | 'Robi' | 'Teletalk';
  status: 'delivered' | 'sent' | 'queued';
  timestamp: string;
  gatewayRef: string;
}

export interface DailyPayoutSummary {
  id: string;
  batchNumber: string;
  date: string;
  totalOrdersProcessed: number;
  grossDeliveredAmount: number;
  totalCommissionDeducted: number;
  netPayoutDistributed: number;
  sellersPaidCount: number;
  status: 'completed' | 'processing';
  timestamp: string;
}
