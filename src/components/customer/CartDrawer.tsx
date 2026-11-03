import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentModal } from './PaymentModal';
import { Order, CartItem, Product } from '../../types';
import { BANGLADESH_DIVISIONS, calculateShippingFee, formatDetailedAddress } from '../../data/bangladeshGeo';
import {
  X,
  Trash2,
  Tag,
  Truck,
  ArrowRight,
  ShoppingBag,
  Check,
  MapPin,
  AlertCircle,
  Building2,
  Store,
  ShieldCheck,
  Sparkles,
  Info,
  BadgePercent
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedVoucher,
    applyVoucherCode,
    removeVoucher,
    couriers,
    language
  } = useApp();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; error: boolean } | null>(null);

  // 1. Detailed Step-by-Step 6-Field Bangladeshi Address State
  // 1. Division (বিভাগ)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('dhaka');
  // 2. District (জেলা - all 64 districts)
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dhaka_city');
  // 3. Upazila / Thana (থানা / উপজেলা)
  const [selectedThana, setSelectedThana] = useState<string>('Gulshan-2');
  // 4. Ward Number (ওয়ার্ড নম্বর)
  const [wardNo, setWardNo] = useState<string>('19');
  // 5. Road Number / Block (রোড নম্বর / ব্লক)
  const [roadOrBlock, setRoadOrBlock] = useState<string>('Road 11, Block D');
  // 6. House / Flat No. or Village (হাউস / ফ্ল্যাট নম্বর অথবা গ্রাম)
  const [houseOrVillage, setHouseOrVillage] = useState<string>('House 42, Apt 5B');
  const [postalCode, setPostalCode] = useState('1212');

  // Logistics selection (Pathao, RedX, Steadfast)
  const [selectedCourier, setSelectedCourier] = useState<'pathao' | 'redx' | 'steadfast'>('pathao');

  // Payment Option: Advance Delivery Fee (Standard) vs Full Amount
  const [paymentPlan, setPaymentPlan] = useState<'advance_delivery' | 'full_amount'>('advance_delivery');

  // Payment Modal Trigger
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Address validation feedback
  const [addressError, setAddressError] = useState<string | null>(null);

  // Derived geographical items
  const currentDivision = useMemo(
    () => BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivisionId) || BANGLADESH_DIVISIONS[0],
    [selectedDivisionId]
  );

  const currentDistrict = useMemo(() => {
    const found = currentDivision.districts.find((dist) => dist.id === selectedDistrictId);
    return found || currentDivision.districts[0];
  }, [currentDivision, selectedDistrictId]);

  // Group items by Seller / Shop Name
  const sellerGroups = useMemo(() => {
    const groups: { [sellerId: string]: { sellerName: string; items: CartItem[] } } = {};
    cart.forEach((item) => {
      const sId = item.product.sellerId || 'official_store';
      const sName = item.product.sellerName || 'FLUX MART Official Store';
      if (!groups[sId]) {
        groups[sId] = { sellerName: sName, items: [] };
      }
      groups[sId].items.push(item);
    });
    return Object.values(groups);
  }, [cart]);

  // Handle division change
  const handleDivisionChange = (divId: string) => {
    setSelectedDivisionId(divId);
    const div = BANGLADESH_DIVISIONS.find((d) => d.id === divId) || BANGLADESH_DIVISIONS[0];
    const firstDistrict = div.districts[0];
    setSelectedDistrictId(firstDistrict.id);
    setSelectedThana(firstDistrict.thanas[0] || 'Sadar');
  };

  // Handle district change
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    const dist = currentDivision.districts.find((d) => d.id === distId);
    if (dist && dist.thanas.length > 0) {
      setSelectedThana(dist.thanas[0]);
    }
  };

  // Calculate nationwide shipping rate
  const shippingCalculation = calculateShippingFee(selectedDivisionId, selectedDistrictId);
  const baseShippingRate = shippingCalculation.fee;

  // If DHAKAFAST voucher applied and inside Dhaka, free delivery
  const isDhakaCore = selectedDistrictId === 'dhaka_city';
  const finalShippingFee = appliedVoucher?.code === 'DHAKAFAST' && isDhakaCore ? 0 : baseShippingRate;
  const grandTotal = cartTotal + finalShippingFee;

  // Amount due on delivery under advance delivery fee rule
  const dueOnDoorstepDelivery = paymentPlan === 'advance_delivery' ? cartTotal : 0;
  const advanceAmountToPayNow = paymentPlan === 'advance_delivery' ? finalShippingFee : grandTotal;

  // Total Original Value of all items in cart
  const totalOriginalPrice = cart.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  // Total Product Discount (Original Price minus selling price)
  const productDiscountSaved = Math.max(0, totalOriginalPrice - cartSubtotal);
  // Total overall savings
  const totalSavings = productDiscountSaved + cartDiscount;

  // Combined full address string
  const formattedFullAddress = formatDetailedAddress({
    houseOrVillage,
    roadOrBlock,
    wardNo,
    thana: selectedThana,
    district: currentDistrict.nameEn,
    division: currentDivision.nameEn
  });

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = applyVoucherCode(voucherInput);
    setVoucherMsg({ text: res.message, error: !res.success });
    if (res.success) {
      setVoucherInput('');
    }
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    if (!wardNo.trim()) {
      setAddressError('Please provide the Ward Number (ওয়ার্ড নম্বর).');
      return;
    }
    if (!roadOrBlock.trim()) {
      setAddressError('Please provide the Road Number or Block (রোড নম্বর / ব্লক).');
      return;
    }
    if (!houseOrVillage.trim()) {
      setAddressError('Please provide House / Flat No. or Village (হাউস / ফ্ল্যাট / গ্রাম).');
      return;
    }
    setAddressError(null);
    setIsPaymentOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-xl bg-[#131722] border-l border-neutral-800 text-white flex flex-col h-full shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {language === 'bn' ? 'শপিং ব্যাগ ও চেকআউট' : 'Shopping Bag & Checkout'}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                ({cart.reduce((s, i) => s + i.quantity, 0)} {language === 'bn' ? 'টি পণ্য' : 'items'})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-600" />
                <p className="text-sm font-medium">Your shopping bag is empty.</p>
                <p className="text-xs text-neutral-500">Explore our curated collections to add items.</p>
              </div>
            ) : (
              <>
                {/* 1. Transparent Seller & Product Item Breakdown (সেলার ও পণ্যের বিস্তারিত) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Store className="w-4 h-4" />
                      <span>{language === 'bn' ? 'অর্ডারভুক্ত পণ্য ও সেলার বিস্তারিত' : 'Order Items by Merchant / Shop'}</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {sellerGroups.length} {sellerGroups.length > 1 ? 'Sellers' : 'Seller'}
                    </span>
                  </div>

                  {sellerGroups.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-2xl bg-[#0B0D13] border border-neutral-800/80 overflow-hidden"
                    >
                      {/* Shop Name Header (সেলার বা দোকানের নাম) */}
                      <div className="px-3.5 py-2.5 bg-[#161B26] border-b border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold text-white tracking-wide">
                            {group.sellerName}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Merchant</span>
                        </span>
                      </div>

                      {/* Items under this seller */}
                      <div className="p-3 divide-y divide-neutral-800/60 space-y-3">
                        {group.items.map((item) => {
                          const itemDiscount = Math.max(0, (item.product.originalPrice - item.product.price) * item.quantity);
                          return (
                            <div
                              key={item.product.id}
                              className="pt-3 first:pt-0 flex items-start gap-3"
                            >
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded-xl border border-neutral-700/50 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block truncate">
                                  {item.product.brand} · SKU: {item.product.sku}
                                </span>
                                <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                                  {language === 'bn' ? item.product.titleBn : item.product.title}
                                </h4>

                                {/* Price breakdown: Original Price & Discount received */}
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-white font-mono font-bold">
                                    ৳{item.product.price.toLocaleString()}
                                  </span>
                                  {item.product.originalPrice > item.product.price && (
                                    <span className="text-[11px] text-neutral-500 line-through font-mono">
                                      ৳{item.product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                  {itemDiscount > 0 && (
                                    <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono font-medium">
                                      Save ৳{itemDiscount.toLocaleString()}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-900">
                                  <span className="text-[11px] text-neutral-400 font-mono">
                                    Qty: {item.quantity} × ৳{item.product.price.toLocaleString()} = <strong className="text-amber-300">৳{(item.product.price * item.quantity).toLocaleString()}</strong>
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-[#131722] border border-neutral-700 rounded-lg">
                                      <button
                                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                        className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="px-2 text-xs font-mono font-bold text-white">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                        className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => removeFromCart(item.product.id)}
                                      className="text-neutral-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                      title="Remove item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher Section */}
                <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ডিসকাউন্ট ভাউচার কোড' : 'Voucher / Coupon Code'}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">Available: FLUXGOLD · EID2026</span>
                  </div>

                  {appliedVoucher ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                      <div>
                        <span className="font-mono font-bold text-amber-300 mr-2">
                          {appliedVoucher.code}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          (-৳{cartDiscount.toLocaleString()} Discount Applied)
                        </span>
                      </div>
                      <button
                        onClick={removeVoucher}
                        className="text-neutral-400 hover:text-rose-400 text-xs underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="e.g. FLUXGOLD"
                        className="flex-1 bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {voucherMsg && (
                    <div
                      className={`text-[11px] flex items-center gap-1.5 ${
                        voucherMsg.error ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {voucherMsg.error ? (
                        <AlertCircle className="w-3 h-3 shrink-0" />
                      ) : (
                        <Check className="w-3 h-3 shrink-0" />
                      )}
                      <span>{voucherMsg.text}</span>
                    </div>
                  )}
                </div>

                {/* 2. Detailed Step-by-Step Bangladeshi Address Form (৬ ধাপে বিস্তারিত ঠিকানা) */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-amber-500/30 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{language === 'bn' ? '১. বিস্তারিত ডেলিভারি ঠিকানা (৬টি নির্দিষ্ট ফিল্ড)' : '1. Structured Local Delivery Address Form'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium">
                      All 64 Districts
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400">
                    {language === 'bn'
                      ? 'সঠিক ও দ্রুত হোম ডেলিভারির জন্য প্রতিটি ফিল্ড পূরণ করুন:'
                      : 'Please fill each individual field for precise courier doorstep routing:'}
                  </p>

                  <div className="space-y-3 text-xs">
                    {/* Row A: 1. Division & 2. District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 1. Division (বিভাগ) */}
                      <div>
                        <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                          1. Division (বিভাগ) <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={selectedDivisionId}
                          onChange={(e) => handleDivisionChange(e.target.value)}
                          className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-2.5 py-2 text-xs text-white outline-none cursor-pointer"
                        >
                          {BANGLADESH_DIVISIONS.map((div) => (
                            <option key={div.id} value={div.id}>
                              {div.nameEn} ({div.nameBn})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. District (জেলা - all 64 districts) */}
                      <div>
                        <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                          2. District (জেলা) <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={selectedDistrictId}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-2.5 py-2 text-xs text-white outline-none cursor-pointer"
                        >
                          {currentDivision.districts.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                              {dist.nameEn} ({dist.nameBn})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row B: 3. Upazila/Thana & 4. Ward Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 3. Upazila / Thana (থানা / উপজেলা) */}
                      <div>
                        <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                          3. Upazila / Thana (থানা / উপজেলা) <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={selectedThana}
                          onChange={(e) => setSelectedThana(e.target.value)}
                          className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-2.5 py-2 text-xs text-white outline-none cursor-pointer"
                        >
                          {currentDistrict.thanas.map((thana, idx) => (
                            <option key={idx} value={thana}>
                              {thana}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 4. Ward Number (ওয়ার্ড নম্বর) */}
                      <div>
                        <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                          4. Ward Number (ওয়ার্ড নম্বর) <span className="text-amber-400">*</span>
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={wardNo}
                            onChange={(e) => setWardNo(e.target.value)}
                            placeholder="e.g. Ward 04 or 19"
                            className="flex-1 bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>
                        {/* Quick Ward chips */}
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400">
                          <span className="text-[9px]">Quick:</span>
                          {['01', '04', '09', '12', '19'].map((w) => (
                            <button
                              type="button"
                              key={w}
                              onClick={() => setWardNo(w)}
                              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                                wardNo === w
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              W-{w}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Row C: 5. Road Number / Block (রোড নম্বর / ব্লক) */}
                    <div>
                      <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                        5. Road Number / Block (রোড নম্বর / ব্লক) <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={roadOrBlock}
                        onChange={(e) => setRoadOrBlock(e.target.value)}
                        placeholder="e.g. Road #11, Block D / হোল্ডিং নং ৪৫, মেইন রোড"
                        className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Row D: 6. House / Flat No. or Village (হাউস / ফ্ল্যাট নম্বর অথবা গ্রাম) */}
                    <div>
                      <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                        6. House / Flat No. or Village (হাউস / ফ্ল্যাট নম্বর অথবা গ্রাম) <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={houseOrVillage}
                        onChange={(e) => setHouseOrVillage(e.target.value)}
                        placeholder="e.g. House 42, Apt 5B / গ্রাম: শান্তি নগর, ডাকঘর: বাজার"
                        className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Formatted Full Address Live Preview */}
                    <div className="p-2.5 rounded-xl bg-[#161B26] border border-neutral-800 space-y-1">
                      <span className="text-[10px] text-amber-400/90 font-semibold uppercase tracking-wider block">
                        Live Address Preview:
                      </span>
                      <p className="text-[11px] text-neutral-200 font-mono leading-relaxed break-words">
                        {formattedFullAddress || 'Address will appear here...'}
                      </p>
                    </div>

                    {addressError && (
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{addressError}</span>
                      </div>
                    )}

                    {/* Logistics Partner Select */}
                    <div className="pt-1">
                      <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                        Courier Logistics Engine (কুরিয়ার সার্ভিস)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'pathao', name: 'Pathao Express', rate: baseShippingRate },
                          { id: 'redx', name: 'RedX Logistics', rate: baseShippingRate + 5 },
                          { id: 'steadfast', name: 'Steadfast Parcel', rate: baseShippingRate }
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCourier(c.id as any)}
                            className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                              selectedCourier === c.id
                                ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                                : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            <span className="text-[11px] font-bold block">{c.name}</span>
                            <span className="text-[10px] font-mono text-amber-300">
                              {finalShippingFee === 0 ? 'FREE' : `৳${c.rate}`}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Truck className="w-3.5 h-3.5" />
                          <span>ETA: {shippingCalculation.eta}</span>
                        </span>
                        <span className="text-neutral-300 font-mono">
                          Zone: {shippingCalculation.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Transparent Order Financial Breakdown (মূল্য তালিকা ও ছাড়) */}
                <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-white border-b border-neutral-800 pb-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <BadgePercent className="w-4 h-4" />
                      <span>{language === 'bn' ? 'অর্ডার ইনভয়েস সামারি' : 'Order Invoice Summary'}</span>
                    </span>
                    <span className="text-[11px] text-neutral-400 font-normal">
                      Detailed Breakdown
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span>{language === 'bn' ? 'পণ্যের মোট মূল দাম (Original M.R.P.)' : 'Total Original Price (M.R.P.)'}</span>
                    <span className="font-mono text-neutral-300 tabular-nums">৳{totalOriginalPrice.toLocaleString()}</span>
                  </div>

                  {productDiscountSaved > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>{language === 'bn' ? 'মার্কেট অফার ছাড় (Offer Discount)' : 'Marketplace Promo Savings'}</span>
                      <span className="font-mono tabular-nums">-৳{productDiscountSaved.toLocaleString()}</span>
                    </div>
                  )}

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-amber-400 font-medium">
                      <span>{language === 'bn' ? 'ভাউচার ডিসকাউন্ট (Voucher)' : 'Voucher Code Discount'}</span>
                      <span className="font-mono tabular-nums">-৳{cartDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-300 font-semibold pt-1 border-t border-neutral-900">
                    <span>{language === 'bn' ? 'পণ্যের নিট মূল্য (Subtotal)' : 'Products Net Subtotal'}</span>
                    <span className="font-mono text-white tabular-nums">৳{cartSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'bn' ? 'ডেলিভারি চার্জ (Delivery Charge)' : 'Nationwide Delivery Charge'}</span>
                    </span>
                    <span className="font-mono text-white tabular-nums">
                      {finalShippingFee === 0 ? 'FREE' : `৳${finalShippingFee}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-extrabold text-white">
                    <span>{language === 'bn' ? 'সর্বমোট মূল্য (Grand Total)' : 'Grand Total Amount'}</span>
                    <span className="font-mono text-base text-amber-400 tabular-nums">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'আপনি মোট সাশ্রয় করলেন:' : 'Total Discount Received:'}</span>
                      </span>
                      <span className="font-mono font-bold">৳{totalSavings.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* 4. Mandatory Advance Delivery Fee Rule & Gate (বাধ্যতামূলক অগ্রিম ডেলিভারি চার্জ নীতি) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#181C26] to-[#0B0D13] border-2 border-amber-500/50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{language === 'bn' ? 'বাধ্যতামূলক অগ্রিম ডেলিভারি চার্জ নীতি' : 'Mandatory Advance Delivery Fee Policy'}</span>
                      </h4>
                      <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                        {language === 'bn'
                          ? 'অর্ডার নিশ্চিত করতে ডেলিভারি চার্জ বিকাশ বা নগদে অগ্রিম পরিশোধ বাধ্যতামূলক। কুরিয়ার হ্যান্ডওভার নিশ্চিত করার পরই পার্সেল বুকিং হবে।'
                          : 'Orders strictly require the Delivery Charge to be paid in advance via bKash/Nagad to prevent unverified cancellations and book the courier parcel.'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Selection Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {/* Option A: Advance Delivery Fee Only (Standard Bangladesh Practice) */}
                    <div
                      onClick={() => setPaymentPlan('advance_delivery')}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentPlan === 'advance_delivery'
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20'
                          : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-amber-300">
                          {language === 'bn' ? '১. অগ্রিম ডেলিভারি ফি' : '1. Advance Delivery Fee'}
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <div className="text-sm font-bold font-mono text-white mb-0.5">
                        ৳{finalShippingFee} <span className="text-[10px] font-normal text-neutral-300">Pay Now</span>
                      </div>
                      <p className="text-[10px] text-neutral-300">
                        Remaining <strong>৳{cartTotal.toLocaleString()}</strong> payable on doorstep delivery (COD).
                      </p>
                    </div>

                    {/* Option B: Pay 100% Full Order Amount in Advance */}
                    <div
                      onClick={() => setPaymentPlan('full_amount')}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentPlan === 'full_amount'
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20'
                          : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">
                          {language === 'bn' ? '২. সম্পূর্ণ অগ্রিম পরিশোধ' : '2. Full Advance Payment'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Zero COD
                        </span>
                      </div>
                      <div className="text-sm font-bold font-mono text-white mb-0.5">
                        ৳{grandTotal.toLocaleString()} <span className="text-[10px] font-normal text-neutral-300">Pay Now</span>
                      </div>
                      <p className="text-[10px] text-neutral-300">
                        100% paid upfront. <strong>৳0</strong> due upon parcel delivery.
                      </p>
                    </div>
                  </div>

                  {/* Clarification Summary */}
                  <div className="p-2.5 rounded-xl bg-[#0B0D13]/70 border border-neutral-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">
                      {paymentPlan === 'advance_delivery' ? 'Due on Doorstep Delivery (COD):' : 'Due on Delivery:'}
                    </span>
                    <span className="text-amber-400 font-bold text-sm">
                      ৳{dueOnDoorstepDelivery.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#0B0D13] space-y-2">
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {paymentPlan === 'advance_delivery'
                    ? `Pay Advance Delivery Fee (৳${finalShippingFee}) & Confirm Order`
                    : `Pay Full Order Amount (৳${grandTotal.toLocaleString()}) via bKash/Nagad`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Automated bKash & Nagad Auto-Debit Gate · No Order Placed Without Advance Payment</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Localized Direct MFS & Card Payment Modal with Advance Fee Enforcement */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        shippingInfo={{
          division: currentDivision.nameEn,
          district: currentDistrict.nameEn,
          thana: selectedThana,
          wardNo,
          roadOrBlock,
          houseOrVillage,
          city: currentDistrict.nameEn,
          area: selectedThana,
          fullAddress: formattedFullAddress,
          postalCode
        }}
        courierProvider={selectedCourier}
        shippingFee={finalShippingFee}
        initialPaymentPlan={paymentPlan}
        onOrderCompleted={(order) => {
          setIsPaymentOpen(false);
          onClose();
          onOrderCompleted(order);
        }}
      />
    </>
  );
};
