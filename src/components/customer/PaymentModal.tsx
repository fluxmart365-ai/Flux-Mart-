import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Order, DetailedShippingAddress, CartItem } from '../../types';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  Smartphone,
  KeyRound,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Store,
  FileText,
  BadgePercent,
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shippingInfo: DetailedShippingAddress;
  courierProvider: 'pathao' | 'redx' | 'steadfast';
  shippingFee: number;
  initialPaymentPlan?: 'advance_delivery' | 'full_amount';
  onOrderCompleted: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  shippingInfo,
  courierProvider,
  shippingFee,
  initialPaymentPlan = 'advance_delivery',
  onOrderCompleted
}) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedVoucher,
    customerName,
    customerPhone,
    createOrder,
    couriers,
    language
  } = useApp();

  const [paymentPlan, setPaymentPlan] = useState<'advance_delivery' | 'full_amount'>(initialPaymentPlan);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');

  // Direct MFS Gateway Multi-step Flow (Step 1: Account, Step 2: OTP, Step 3: PIN)
  const [mfsStep, setMfsStep] = useState<1 | 2 | 3>(1);
  const [mfsMobile, setMfsMobile] = useState(customerPhone?.replace('+880', '0') || '01712345678');
  const [mfsOtp, setMfsOtp] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(true);

  // Success Confirmation State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    name: customerName || 'Rahim Chowdhury',
    expiry: '09/28',
    cvv: '892'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const grandTotal = cartTotal + shippingFee;
  const advanceAmountToPay = paymentPlan === 'advance_delivery' ? shippingFee : grandTotal;
  const dueAmountOnDelivery = paymentPlan === 'advance_delivery' ? cartTotal : 0;

  // Group items by Seller / Shop Name
  const sellerGroups = cart.reduce((acc, item) => {
    const sId = item.product.sellerId || 'official_store';
    const sName = item.product.sellerName || 'FLUX MART Official Store';
    if (!acc[sId]) {
      acc[sId] = { sellerName: sName, items: [] };
    }
    acc[sId].items.push(item);
    return acc;
  }, {} as { [sellerId: string]: { sellerName: string; items: CartItem[] } });

  // Total Original Value of all items in cart
  const totalOriginalPrice = cart.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const productDiscountSaved = Math.max(0, totalOriginalPrice - cartSubtotal);
  const totalSavings = productDiscountSaved + cartDiscount;

  // Step 1 -> Step 2 (Send OTP)
  const handleMfsAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mfsMobile.trim();
    if (!cleanMobile || cleanMobile.length < 11) {
      setErrorMessage('Please enter an 11-digit mobile number (e.g. 017XXXXXXXX).');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please accept the advance delivery payment terms.');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);
    setProcessingStatusText(`Connecting to ${selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} Direct Auto-Debit Gateway...`);

    setTimeout(() => {
      setIsProcessing(false);
      setMfsStep(2);
    }, 900);
  };

  // Step 2 -> Step 3 (Verify OTP)
  const handleMfsOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfsOtp || mfsOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification OTP (Auto-fill Demo: 482910).');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);
    setProcessingStatusText('Verifying OTP with Central MFS Switch...');

    setTimeout(() => {
      setIsProcessing(false);
      setMfsStep(3);
    }, 800);
  };

  // Step 3 -> Direct Auto-Debit & Order Completion
  const handleMfsPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredLength = selectedMethod === 'bkash' ? 5 : 4;
    if (!mfsPin || mfsPin.length < requiredLength) {
      setErrorMessage(`Please enter your ${requiredLength}-digit secret PIN.`);
      return;
    }
    setErrorMessage('');
    executeDirectDebit();
  };

  const handleCardSubmit = () => {
    setErrorMessage('');
    executeDirectDebit();
  };

  const executeDirectDebit = () => {
    setIsProcessing(true);
    setProcessingStatusText(
      paymentPlan === 'advance_delivery'
        ? `Auto-debiting Advance Delivery Fee ৳${advanceAmountToPay} via ${selectedMethod.toUpperCase()}...`
        : `Auto-debiting Full Order Amount ৳${advanceAmountToPay.toLocaleString()} via ${selectedMethod.toUpperCase()}...`
    );

    setTimeout(() => {
      setIsProcessing(false);

      const trackingPrefix = courierProvider === 'pathao' ? 'PTH' : courierProvider === 'redx' ? 'RDX' : 'STF';
      const trackingNum = `${trackingPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      const courierConfig = couriers.find((c) => c.id === courierProvider);

      // Platform commission calculation
      const avgCommission = 10;
      const platformFee = Math.round((cartTotal * avgCommission) / 100);
      const sellerPayout = grandTotal - platformFee;

      // Automated direct reference generated by gateway
      const directRef =
        selectedMethod === 'bkash'
          ? `BK-ADV-DELIVERY-${Math.floor(100000 + Math.random() * 900000)}`
          : selectedMethod === 'nagad'
          ? `NG-ADV-DELIVERY-${Math.floor(100000 + Math.random() * 900000)}`
          : `CRD-ADV-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder = createOrder({
        customerId: 'cust_01',
        customerName: customerName || 'Valued Client',
        customerPhone: customerPhone || '+8801799887766',
        shippingAddress: shippingInfo,
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: shippingFee,
        advanceDeliveryFeePaid: advanceAmountToPay,
        advancePaymentMethod: selectedMethod === 'card' ? 'bkash' : selectedMethod,
        dueAmountOnDelivery: dueAmountOnDelivery,
        total: grandTotal,
        paymentMethod: selectedMethod as PaymentMethod,
        paymentStatus: dueAmountOnDelivery === 0 ? 'paid' : 'advance_paid_cod_pending',
        transactionId: directRef,
        orderStatus: 'to_ship',
        voucherCode: appliedVoucher?.code,
        platformFee,
        sellerPayout,
        courier: {
          provider: courierProvider,
          trackingNumber: trackingNum,
          estimatedDelivery: shippingInfo.division.toLowerCase().includes('dhaka') ? 'Within 24 Hours' : 'Within 48-72 Hours',
          shippingCharge: shippingFee,
          currentStatus: 'Advance Delivery Fee Cleared · Courier Parcel Manifest Generated',
          checkpoints: [
            {
              time: 'Just now',
              status: 'Advance Delivery Fee Cleared via bKash/Nagad',
              location: `${shippingInfo.district || shippingInfo.division} Regional Hub`,
              description: `Mandatory Advance Delivery Fee (৳${advanceAmountToPay}) successfully auto-debited via ${selectedMethod.toUpperCase()}. Order confirmed and handed to ${courierConfig?.name || 'Courier'}.`
            }
          ]
        }
      });

      setConfirmedOrder(newOrder);
    }, 1800);
  };

  const autoFillDemoOtp = () => {
    setMfsOtp('482910');
    setErrorMessage('');
  };

  const autoFillDemoPin = () => {
    setMfsPin(selectedMethod === 'bkash' ? '12345' : '1234');
    setErrorMessage('');
  };

  const resetMfsFlow = (method: 'bkash' | 'nagad' | 'card') => {
    setSelectedMethod(method);
    setMfsStep(1);
    setMfsOtp('');
    setMfsPin('');
    setErrorMessage('');
  };

  // If order was confirmed, show the Invoice Receipt View
  if (confirmedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in">
        <div className="relative w-full max-w-xl bg-[#131722] border-2 border-amber-500 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-7 space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {language === 'bn' ? 'অর্ডার সফলভাবে নিশ্চিত হয়েছে!' : 'Order Confirmed Successfully!'}
            </h3>
            <p className="text-xs text-amber-200/90 font-medium">
              {language === 'bn'
                ? `অগ্রিম ডেলিভারি চার্জ (৳${confirmedOrder.advanceDeliveryFeePaid}) পরিশোধ সম্পন্ন হয়েছে।`
                : `Mandatory Advance Delivery Fee (৳${confirmedOrder.advanceDeliveryFeePaid}) paid and verified.`}
            </p>
          </div>

          {/* Official Invoice Card */}
          <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3.5 text-xs">
            {/* Order Ref & Courier */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono">ORDER INVOICE ID</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{confirmedOrder.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-mono">COURIER TRACKING</span>
                <span className="font-mono font-bold text-white text-xs uppercase">
                  {confirmedOrder.courier.provider} · {confirmedOrder.courier.trackingNumber}
                </span>
              </div>
            </div>

            {/* Seller Breakdown */}
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold mb-1.5">
                {language === 'bn' ? 'সেলার ও পণ্য তালিকা:' : 'Merchants & Items:'}
              </span>
              <div className="space-y-2">
                {Object.values(sellerGroups).map((group, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#161B26] border border-neutral-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                      <Store className="w-3.5 h-3.5 text-amber-400" />
                      <span>{group.sellerName}</span>
                    </div>
                    {group.items.map((i) => (
                      <div key={i.product.id} className="flex justify-between text-neutral-300 text-[11px] pl-5">
                        <span className="truncate max-w-[280px]">
                          {i.product.title} (x{i.quantity})
                        </span>
                        <span className="font-mono text-white">৳{(i.product.price * i.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address (Structured 6 fields) */}
            <div className="pt-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold mb-1">
                {language === 'bn' ? 'ডেলিভারি ঠিকানা (৬টি ফিল্ড):' : 'Structured Delivery Address:'}
              </span>
              <p className="text-[11px] text-neutral-200 font-mono leading-relaxed bg-[#161B26] p-2.5 rounded-xl border border-neutral-800">
                {confirmedOrder.shippingAddress.fullAddress}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="pt-2 border-t border-neutral-800 space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>{language === 'bn' ? 'মোট মূল দাম (M.R.P.)' : 'Original Price Total:'}</span>
                <span className="font-mono">৳{totalOriginalPrice.toLocaleString()}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>{language === 'bn' ? 'মোট প্রাপ্ত ডিসকাউন্ট' : 'Discount Received:'}</span>
                  <span className="font-mono">-৳{totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge:'}</span>
                <span className="font-mono text-white">৳{confirmedOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between text-neutral-300 font-bold">
                <span>{language === 'bn' ? 'সর্বমোট অর্ডার মূল্য' : 'Grand Total Amount:'}</span>
                <span className="font-mono text-amber-400">৳{confirmedOrder.total.toLocaleString()}</span>
              </div>

              {/* Advance Paid & Due Breakdown */}
              <div className="pt-2 mt-2 border-t border-neutral-800 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold block">
                    {language === 'bn' ? 'পরিশোধিত অগ্রিম ফি' : 'Advance Paid Now'}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-300">
                    ৳{confirmedOrder.advanceDeliveryFeePaid.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-neutral-400 block font-mono mt-0.5">
                    Trx: {confirmedOrder.transactionId}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
                  <span className="text-[10px] text-amber-400 uppercase font-semibold block">
                    {language === 'bn' ? 'ডেলিভারিতে প্রদেয় (COD)' : 'Due on Delivery (COD)'}
                  </span>
                  <span className="text-sm font-bold font-mono text-amber-300">
                    ৳{confirmedOrder.dueAmountOnDelivery.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-neutral-400 block mt-0.5">
                    {confirmedOrder.dueAmountOnDelivery === 0 ? 'Fully Paid' : 'Cash on Doorstep'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onOrderCompleted(confirmedOrder);
              }}
              className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              {language === 'bn' ? 'অর্ডার ট্র্যাক করুন (Dashboard)' : 'Track Order in Customer Portal'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl text-white my-auto max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {language === 'bn' ? 'অটো-ডেবিট গেটওয়ে ও ইনভয়েস' : 'Direct Auto-Debit Payment Gateway'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {language === 'bn'
                  ? 'ডেলিভারি চার্জ অগ্রিম পরিশোধ ব্যতীত অর্ডার সম্পন্ন সম্ভব নয়'
                  : 'Mandatory Advance Delivery Fee Clearance Gate'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* 1. Transparent Order Summary & Breakdown Header (Accordion Toggle) */}
          <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2">
            <div
              onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <FileText className="w-4 h-4" />
                <span>{language === 'bn' ? 'স্বচ্ছ ইনভয়েস সামারি (Invoice Breakdown)' : 'Transparent Invoice Breakdown'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <span>৳{grandTotal.toLocaleString()}</span>
                {showInvoiceDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {showInvoiceDetails && (
              <div className="pt-2 border-t border-neutral-800/80 space-y-2.5 text-xs">
                {/* Seller & Items list */}
                <div className="space-y-1.5">
                  {Object.values(sellerGroups).map((group, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#161B26] border border-neutral-800/60">
                      <span className="text-[10px] text-amber-400 font-bold block flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        <span>Seller: {group.sellerName}</span>
                      </span>
                      {group.items.map((i) => (
                        <div key={i.product.id} className="flex justify-between text-neutral-300 text-[11px] mt-0.5">
                          <span className="truncate max-w-[240px]">{i.product.title} (x{i.quantity})</span>
                          <span className="font-mono text-white">৳{(i.product.price * i.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Pricing Details */}
                <div className="space-y-1 text-neutral-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Original Price Total (M.R.P.):</span>
                    <span className="font-mono text-neutral-300">৳{totalOriginalPrice.toLocaleString()}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Total Discounts Received:</span>
                      <span className="font-mono">-৳{totalSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge ({courierProvider.toUpperCase()}):</span>
                    <span className="font-mono text-white">৳{shippingFee}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-neutral-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-amber-400">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Destination Preview */}
                <div className="text-[10px] text-neutral-400 bg-[#161B26] p-2 rounded-lg font-mono">
                  <span className="text-amber-400 block font-sans font-semibold mb-0.5">Delivery Address:</span>
                  {shippingInfo.fullAddress}
                </div>
              </div>
            )}
          </div>

          {/* 2. Mandatory Advance Payment Policy Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'অগ্রিম ডেলিভারি ফি গেটওয়ে' : 'Mandatory Advance Delivery Fee'}</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded font-bold">
                ৳{advanceAmountToPay} Due Now
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              {paymentPlan === 'advance_delivery'
                ? `Only the delivery charge (৳${shippingFee}) is debited now via bKash/Nagad. The product balance (৳${dueAmountOnDelivery.toLocaleString()}) will be paid in cash upon doorstep delivery.`
                : `Full amount (৳${grandTotal.toLocaleString()}) is being paid upfront with zero doorstep dues.`}
            </p>
          </div>

          {/* 3. Payment Method Tabs (bKash & Nagad Auto-Debit) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => resetMfsFlow('bkash')}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                selectedMethod === 'bkash'
                  ? 'border-pink-500 bg-pink-500/15 text-white shadow-lg shadow-pink-500/10'
                  : 'border-neutral-800 bg-[#0B0D13] text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                bK
              </div>
              <div className="text-left">
                <span className="font-bold text-xs block text-white">bKash Direct</span>
                <span className="text-[10px] text-pink-400 font-mono">Auto-Debit OTP</span>
              </div>
            </button>

            <button
              onClick={() => resetMfsFlow('nagad')}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                selectedMethod === 'nagad'
                  ? 'border-orange-500 bg-orange-500/15 text-white shadow-lg shadow-orange-500/10'
                  : 'border-neutral-800 bg-[#0B0D13] text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                NG
              </div>
              <div className="text-left">
                <span className="font-bold text-xs block text-white">Nagad Direct</span>
                <span className="text-[10px] text-orange-400 font-mono">Auto-Debit OTP</span>
              </div>
            </button>
          </div>

          {/* 4. Automated Step-by-Step Direct Gateway Body */}
          <div className="rounded-2xl bg-[#0B0D13] border border-neutral-800 p-4 sm:p-5 space-y-4">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-neutral-800 pb-3">
              <div className={`flex items-center gap-1.5 ${mfsStep >= 1 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
                <span>Account</span>
              </div>
              <span className="text-neutral-700">→</span>
              <div className={`flex items-center gap-1.5 ${mfsStep >= 2 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
                <span>OTP Verification</span>
              </div>
              <span className="text-neutral-700">→</span>
              <div className={`flex items-center gap-1.5 ${mfsStep === 3 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                <span>PIN Confirmation</span>
              </div>
            </div>

            {/* Step 1: Mobile Account Number */}
            {mfsStep === 1 && (
              <form onSubmit={handleMfsAccountSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs text-neutral-300 font-medium block mb-1.5">
                    Your {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} Personal Wallet Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={mfsMobile}
                      onChange={(e) => setMfsMobile(e.target.value)}
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono tracking-wider outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    A secure 6-digit one-time password (OTP) will be verified next.
                  </span>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 accent-amber-400 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-neutral-300 cursor-pointer">
                    I authorize FLUX MART to auto-debit <strong>৳{advanceAmountToPay}</strong> via {selectedMethod.toUpperCase()} to confirm this order.
                  </label>
                </div>

                {errorMessage && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{processingStatusText}</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Verify OTP (৳{advanceAmountToPay})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Automated OTP Input */}
            {mfsStep === 2 && (
              <form onSubmit={handleMfsOtpSubmit} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-neutral-300 font-medium">
                      Enter 6-Digit OTP sent to {mfsMobile}
                    </label>
                    <button
                      type="button"
                      onClick={autoFillDemoOtp}
                      className="text-[10px] text-amber-400 underline font-mono hover:text-amber-300 cursor-pointer"
                    >
                      Auto-fill Demo OTP (482910)
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={mfsOtp}
                      onChange={(e) => setMfsOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-center text-sm font-mono tracking-widest text-white outline-none"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setMfsStep(1)}
                    className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ← Change Number
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Secure Direct PIN Auto-Debit */}
            {mfsStep === 3 && (
              <form onSubmit={handleMfsPinSubmit} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-neutral-300 font-medium">
                      Enter {selectedMethod === 'bkash' ? '5-Digit bKash' : '4-Digit Nagad'} PIN to Confirm
                    </label>
                    <button
                      type="button"
                      onClick={autoFillDemoPin}
                      className="text-[10px] text-amber-400 underline font-mono hover:text-amber-300 cursor-pointer"
                    >
                      Auto-fill Demo PIN
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={mfsPin}
                      onChange={(e) => setMfsPin(e.target.value.replace(/\D/g, ''))}
                      placeholder={selectedMethod === 'bkash' ? '• • • • •' : '• • • •'}
                      maxLength={selectedMethod === 'bkash' ? 5 : 4}
                      className="w-full bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-center text-sm font-mono tracking-widest text-white outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Direct auto-debit of <strong>৳{advanceAmountToPay}</strong> will be executed securely.
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setMfsStep(2)}
                    className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ← Back to OTP
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{processingStatusText}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Confirm & Auto-Debit ৳{advanceAmountToPay}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-Bit SSL Encrypted · Direct Bangladesh Bank NPSB Gateway</span>
          </div>

        </div>

      </div>
    </div>
  );
};
