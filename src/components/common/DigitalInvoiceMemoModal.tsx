import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_LOGO } from '../../data/mockData';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building,
  User,
  MapPin,
  Calendar,
  Truck,
  CreditCard,
  QrCode,
  FileText,
  BadgeCheck,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const DigitalInvoiceMemoModal: React.FC = () => {
  const {
    isDigitalInvoiceOpen,
    closeDigitalInvoice,
    selectedInvoiceOrder,
    openSellerPublicProfile,
    language
  } = useApp();

  const [copiedLink, setCopiedLink] = React.useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isDigitalInvoiceOpen || !selectedInvoiceOrder) return null;

  const order = selectedInvoiceOrder;
  const sellerName = order.items[0]?.product.sellerName || 'Verified FLUX Merchant';
  const advanceFee = order.advanceDeliveryFeePaid ?? order.shippingFee;
  const dueCOD = order.dueAmountOnDelivery ?? Math.max(0, order.total - advanceFee);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://fluxmart.bd/invoice/${order.id}?auth=official_verified_memo`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F121A] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Non-printable) */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#0B0D13] via-[#131722] to-[#0B0D13] border-b border-neutral-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Official Dual-Party Digital Invoice</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.2 rounded border border-emerald-500/40">
                  VERIFIED
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Memo #{order.id} · Accessible to Buyer & Seller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy Memo Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={closeDigitalInvoice}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Memo Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 text-xs bg-[#0F121A] text-neutral-200 space-y-6 print:p-0 print:bg-white print:text-black">
          
          <div ref={printAreaRef} className="space-y-6">
            
            {/* Memo Header with Official Branding & Dual-Party Commercial Stamp */}
            <div className="pb-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/40 shadow-md">
                  <img
                    src={OFFICIAL_LOGO}
                    alt="FLUX MART Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white print:text-black">
                    FLUX <span className="text-amber-400 print:text-amber-700">MART</span>
                  </h1>
                  <p className="text-[11px] text-amber-300 font-medium tracking-wider">
                    The Premium Global Marketplace
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    Bangladesh Commercial Reg: DBID-892401 · VAT Reg: 0048219-01
                  </p>
                </div>
              </div>

              {/* Invoice Number & Date Badge */}
              <div className="text-left sm:text-right bg-[#131722] sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-neutral-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  COMMERCIAL MEMORANDUM & INVOICE
                </span>
                <span className="text-sm font-mono font-bold text-white print:text-black block">
                  #{order.id}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono flex items-center sm:justify-end gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>Issue Date: {order.orderDate}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                  Payment Status: {order.paymentStatus === 'paid' ? 'PAID IN FULL' : 'ADVANCE CLEARED · COD DUE'}
                </span>
              </div>
            </div>

            {/* Dual-Party Section: Merchant Details (Left) vs Customer Details (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Merchant / Seller Info with Unique ID */}
              <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                    <Building className="w-3.5 h-3.5" />
                    <span>PARTY A: AUTHORIZED SELLER</span>
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    <span>VERIFIED MERCHANT</span>
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openSellerPublicProfile(order.sellerUniqueId || sellerName)}
                      className="font-bold text-white print:text-black text-xs hover:text-amber-400 cursor-pointer text-left transition-colors flex items-center gap-1.5"
                      title="View Verified Seller Profile"
                    >
                      <span>{order.sellerShopName || sellerName}</span>
                      <ExternalLink className="w-3 h-3 text-amber-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openSellerPublicProfile(order.sellerUniqueId || sellerName)}
                      className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold cursor-pointer transition-colors"
                      title="Seller Unique ID"
                    >
                      ID: {order.sellerUniqueId || 'FLUX-MART-542'}
                    </button>
                  </div>
                  <p className="text-neutral-400">
                    Warehouse: Dhaka Central Fulfillment Center, Tejgaon I/A
                  </p>
                  <p className="text-neutral-400 font-mono">
                    Merchant Hotline: +880 9612-FLUXBD
                  </p>
                  <p className="text-neutral-400 font-mono">
                    Trade License: TRAD/DNCC/029412/2024
                  </p>
                </div>
              </div>

              {/* Customer / Consignee Info */}
              <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                    <User className="w-3.5 h-3.5" />
                    <span>PARTY B: CUSTOMER / RECIPIENT</span>
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                    BUYER
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p className="font-semibold text-white print:text-black text-xs">
                    {order.customerName}
                  </p>
                  <p className="font-mono text-emerald-400">
                    Phone: {order.customerPhone}
                  </p>
                  <p className="text-neutral-300 font-mono leading-relaxed">
                    <span className="text-neutral-400">Destination: </span>
                    {order.shippingAddress.fullAddress}
                  </p>
                  <div className="pt-1 text-[10px] text-neutral-400 font-mono grid grid-cols-2 gap-1 border-t border-neutral-800/60 mt-1">
                    <span>Div: {order.shippingAddress.division}</span>
                    <span>Dist: {order.shippingAddress.district || order.shippingAddress.city}</span>
                    <span>Thana: {order.shippingAddress.thana || 'N/A'}</span>
                    <span>Ward: #{order.shippingAddress.wardNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Courier Dispatch & Parcel Tracking Barcode Strip */}
            <div className="p-3.5 rounded-2xl bg-[#131722] border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Assigned Courier Partner
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase text-xs">
                      {order.courier.provider} EXPRESS
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="font-mono text-amber-300 text-xs">
                      Waybill: {order.courier.trackingNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <span className="text-neutral-400 block text-[10px]">Estimated Delivery</span>
                <span className="font-semibold text-white">{order.courier.estimatedDelivery}</span>
              </div>
            </div>

            {/* Itemized Order Table */}
            <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#131722]/60">
              <div className="p-3 bg-[#0B0D13] border-b border-neutral-800 grid grid-cols-12 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <div className="col-span-5">Product Name & Specifications</div>
                <div className="col-span-2 text-center">Original Price</div>
                <div className="col-span-2 text-center">Discounted Price</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-neutral-800 text-xs">
                {order.items.map((item, idx) => {
                  const origPrice = item.product.originalPrice || item.product.price;
                  const itemSubtotal = item.product.price * item.quantity;
                  return (
                    <div key={idx} className="p-3 grid grid-cols-12 items-center gap-2">
                      <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate text-xs">
                            {item.product.title}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono truncate">
                            SKU: {item.product.sku} · {item.product.brand}
                            {item.selectedVariant ? ` · ${item.selectedVariant}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 text-center font-mono text-neutral-400 text-xs">
                        ৳{origPrice.toLocaleString()}
                      </div>

                      <div className="col-span-2 text-center font-mono text-emerald-400 font-medium text-xs">
                        ৳{item.product.price.toLocaleString()}
                      </div>

                      <div className="col-span-1 text-center font-mono font-bold text-white">
                        ×{item.quantity}
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-amber-400">
                        ৳{itemSubtotal.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calculation & Advance Payment Breakdown Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* Mandatory Advance Delivery Fee Clearance Seal */}
              <div className="sm:col-span-7 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-[#131722] to-[#0B0D13] border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>MANDATORY ADVANCE DELIVERY CHARGE CLEARANCE</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  In accordance with FLUX MART eCommerce Policy, courier delivery charge of <strong>৳{advanceFee.toLocaleString()}</strong> was collected in advance via <strong>{order.advancePaymentMethod?.toUpperCase() || 'bKash / Nagad Direct Gateway'}</strong>.
                </p>
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>TrxID: {order.transactionId || 'MFS-ESCROW-' + order.id.slice(-6)}</span>
                  <span className="text-emerald-400 font-bold">100% ESCROW PROTECTED</span>
                </div>
              </div>

              {/* Financial Totals with Paid and Balance Amounts Breakdown */}
              <div className="sm:col-span-5 p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Product Catalog Value:</span>
                  <span className="font-mono text-white">৳{(order.subtotal + (order.discount || 0)).toLocaleString()}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Discount Amount Received:</span>
                    <span className="font-mono font-semibold">-৳{order.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Courier / Delivery Charge:</span>
                  <span className="font-mono text-white">৳{order.shippingFee.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline font-bold text-white">
                  <span>Grand Total Payable:</span>
                  <span className="font-mono text-base text-amber-400">
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Paid Amount (Advance Delivery):</span>
                    <span className="font-mono font-bold">৳{advanceFee.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>Balance Amount Due (COD Doorstep):</span>
                    <span className="font-mono text-amber-300 text-sm">৳{dueCOD.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Official Dual Signature & Consumer Protection Notes */}
            <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="text-center sm:text-left text-[10px] text-neutral-400 space-y-0.5">
                <p className="font-semibold text-neutral-300">Consumer Rights Protection Act 2009</p>
                <p>7-Day Replacement Guarantee & Free Doorstep Return Pickup via Pathao Express.</p>
              </div>

              <div className="text-center p-2 rounded-xl bg-[#0B0D13] border border-neutral-800 font-mono text-[9px] text-neutral-400">
                <QrCode className="w-8 h-8 mx-auto text-amber-400 mb-1" />
                <span>SCAN TO VERIFY AUTHENTICITY</span>
              </div>

              <div className="text-center sm:text-right text-[10px] space-y-1">
                <div className="border-b border-neutral-700/80 pb-1 w-32 ml-auto">
                  <span className="font-script text-amber-300 italic text-sm">Sultana Ahmed</span>
                </div>
                <p className="text-neutral-400 font-mono">
                  Authorized FLUX Commercial Officer
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
