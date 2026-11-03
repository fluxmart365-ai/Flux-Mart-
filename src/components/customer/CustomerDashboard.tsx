import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, DetailedShippingAddress } from '../../types';
import { BANGLADESH_DIVISIONS, formatDetailedAddress } from '../../data/bangladeshGeo';
import {
  X,
  User,
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  ExternalLink,
  Phone,
  Store,
  Plus,
  Edit2,
  Trash2,
  BadgePercent,
  Check,
  Headphones,
  MessageCircle,
  MessageSquare,
  FileText
} from 'lucide-react';

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ isOpen, onClose }) => {
  const {
    orders,
    customerName,
    customerPhone,
    logoutCustomer,
    isLoggedIn,
    setOtpModalOpen,
    language,
    t,
    setActiveMainTab,
    openLiveSupport,
    openDigitalInvoice,
    openSellerPublicProfile,
    createDispute,
    disputes,
    openLegalModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'to_pay' | 'to_ship' | 'to_receive' | 'to_review' | 'returned'>('to_receive');
  const [activeSection, setActiveSection] = useState<'orders' | 'profile' | 'help'>('orders');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // 7-Day Guarantee Escrow Return Modal State
  const [returnTargetOrder, setReturnTargetOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<'damaged' | 'defective' | 'wrong_item' | 'fake_item' | 'never_arrived'>('defective');
  const [returnDescription, setReturnDescription] = useState('Item arrived with manufacturing defect. Requesting replacement or escrow refund.');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Address Book state with 6-field structured addresses
  const [savedAddresses, setSavedAddresses] = useState<DetailedShippingAddress[]>([
    {
      division: 'Dhaka',
      district: 'Dhaka (City Core)',
      thana: 'Banani',
      wardNo: '19',
      roadOrBlock: 'Road 11, Block D',
      houseOrVillage: 'House 42, Apt 5B',
      fullAddress: 'House 42, Apt 5B, Road 11, Block D, Ward #19, Banani, Dhaka (City Core), Dhaka',
      postalCode: '1213'
    },
    {
      division: 'Chittagong',
      district: 'Chittagong Metro',
      thana: 'Agrabad',
      wardNo: '24',
      roadOrBlock: 'Sheikh Mujib Road',
      houseOrVillage: 'Level 6, World Trade Center',
      fullAddress: 'Level 6, World Trade Center, Sheikh Mujib Road, Ward #24, Agrabad, Chittagong Metro, Chittagong',
      postalCode: '4100'
    }
  ]);

  // New Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newDivId, setNewDivId] = useState('dhaka');
  const [newDistId, setNewDistId] = useState('dhaka_city');
  const [newThana, setNewThana] = useState('Gulshan-2');
  const [newWard, setNewWard] = useState('04');
  const [newRoad, setNewRoad] = useState('Road 12, Block C');
  const [newHouse, setNewHouse] = useState('House 88, Flat 3B');

  const curDiv = BANGLADESH_DIVISIONS.find((d) => d.id === newDivId) || BANGLADESH_DIVISIONS[0];
  const curDist = curDiv.districts.find((d) => d.id === newDistId) || curDiv.districts[0];

  const handleDivChange = (dId: string) => {
    setNewDivId(dId);
    const div = BANGLADESH_DIVISIONS.find((d) => d.id === dId) || BANGLADESH_DIVISIONS[0];
    const firstDist = div.districts[0];
    setNewDistId(firstDist.id);
    setNewThana(firstDist.thanas[0] || 'Sadar');
  };

  const handleDistChange = (distId: string) => {
    setNewDistId(distId);
    const dist = curDiv.districts.find((d) => d.id === distId);
    if (dist && dist.thanas.length > 0) {
      setNewThana(dist.thanas[0]);
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWard || !newRoad || !newHouse) return;

    const formatted = formatDetailedAddress({
      houseOrVillage: newHouse,
      roadOrBlock: newRoad,
      wardNo: newWard,
      thana: newThana,
      district: curDist.nameEn,
      division: curDiv.nameEn
    });

    const newAddr: DetailedShippingAddress = {
      division: curDiv.nameEn,
      district: curDist.nameEn,
      thana: newThana,
      wardNo: newWard,
      roadOrBlock: newRoad,
      houseOrVillage: newHouse,
      fullAddress: formatted
    };

    setSavedAddresses([newAddr, ...savedAddresses]);
    setIsAddressModalOpen(false);
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'to_pay') return order.paymentStatus === 'pending';
    if (activeTab === 'to_ship') return order.orderStatus === 'to_ship';
    if (activeTab === 'to_receive') return order.orderStatus === 'to_receive';
    if (activeTab === 'to_review') return order.orderStatus === 'completed' || order.orderStatus === 'to_review';
    if (activeTab === 'returned') return order.orderStatus === 'returned';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'to_receive':
        return (
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Out for Delivery
          </span>
        );
      case 'to_ship':
        return (
          <span className="text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Advance Paid · Preparing
          </span>
        );
      case 'to_pay':
        return (
          <span className="text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            Advance Fee Pending
          </span>
        );
      case 'completed':
      case 'to_review':
        return (
          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'returned':
        return (
          <span className="text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Returned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#131722] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl text-white my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {customerName || 'Valued Client'}
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                {customerPhone || '+880 17XXXXXXXX'} · Verified Customer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openLiveSupport()}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs text-amber-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="24/7 Live Support & Dispute Desk"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">24/7 Support</span>
            </button>

            <button
              onClick={() => {
                logoutCustomer();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Orders, Profile & Address Book, Help) */}
        <div className="px-4 sm:px-6 pt-3 border-b border-neutral-800 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('orders')}
            className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'orders'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{language === 'bn' ? 'আমার অর্ডার সমূহ' : 'My Orders & Invoices'}</span>
          </button>

          <button
            onClick={() => setActiveSection('profile')}
            className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'profile'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'bn' ? 'ঠিকানা ও প্রোফাইল' : 'Address Book & Profile'}</span>
          </button>

          <button
            onClick={() => setActiveSection('help')}
            className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'help'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'সাহায্য ও পলিসি' : 'Customer Care & FAQ'}</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. ORDERS SECTION */}
          {activeSection === 'orders' && (
            <div className="space-y-4">
              {/* Order Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'to_pay', label: language === 'bn' ? 'পেমেন্ট বাকি' : 'To Pay' },
                  { id: 'to_ship', label: language === 'bn' ? 'প্রস্তুতি চলছে' : 'To Ship' },
                  { id: 'to_receive', label: language === 'bn' ? 'ডেলিভারির পথে' : 'To Receive' },
                  { id: 'to_review', label: language === 'bn' ? 'রিভিউ দিন' : 'To Review' },
                  { id: 'returned', label: language === 'bn' ? 'রিটার্ন' : 'Returns' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
                        : 'bg-[#0B0D13] border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Order Cards List with Complete Invoice Breakdown */}
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-neutral-600" />
                  <p className="text-sm">No orders currently in this status.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const originalPriceTotal = order.items.reduce(
                      (sum, it) => sum + (it.product.originalPrice || it.product.price) * it.quantity,
                      0
                    );
                    const discountTotal = order.discount + Math.max(0, originalPriceTotal - order.subtotal);

                    return (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3.5"
                      >
                        {/* Top Order Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                              <span className="text-[11px] text-neutral-500">· {order.orderDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span>Payment: <strong className="text-amber-400 uppercase">{order.paymentMethod}</strong></span>
                              {order.transactionId && (
                                <span className="font-mono text-[10px] text-neutral-500">({order.transactionId})</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.orderStatus)}
                            <button
                              onClick={() => setSelectedTrackingOrder(order)}
                              className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Parcel</span>
                            </button>
                          </div>
                        </div>

                        {/* Items with Seller Shop Name & Original Prices */}
                        <div className="space-y-2.5">
                          {order.items.map((item, idx) => {
                            const sellerName = item.product.sellerName || 'FLUX Official Store';
                            const itemDiscount = Math.max(0, (item.product.originalPrice - item.product.price) * item.quantity);

                            return (
                              <div key={idx} className="p-2.5 rounded-xl bg-[#161B26] border border-neutral-800/60 flex items-start gap-3">
                                <img
                                  src={item.product.image}
                                  alt={item.product.title}
                                  className="w-14 h-14 rounded-lg object-cover border border-neutral-800 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold mb-0.5">
                                    <Store className="w-3 h-3 text-amber-400" />
                                    <button
                                      type="button"
                                      onClick={() => openSellerPublicProfile(item.product.sellerUniqueId || sellerName)}
                                      className="hover:text-amber-300 hover:underline cursor-pointer transition-colors"
                                      title="View Merchant Profile"
                                    >
                                      {sellerName}
                                    </button>
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px]">
                                      {item.product.sellerUniqueId || order.sellerUniqueId || 'FLUX-MART-542'} ✓
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-medium text-white truncate">
                                    {language === 'bn' ? item.product.titleBn : item.product.title}
                                  </h5>
                                  <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
                                    <span className="font-mono font-bold text-white">
                                      ৳{item.product.price.toLocaleString()}
                                    </span>
                                    {item.product.originalPrice > item.product.price && (
                                      <span className="text-[10px] text-neutral-500 line-through font-mono">
                                        ৳{item.product.originalPrice.toLocaleString()}
                                      </span>
                                    )}
                                    {itemDiscount > 0 && (
                                      <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1 rounded font-mono">
                                        -৳{itemDiscount.toLocaleString()}
                                      </span>
                                    )}
                                    <span className="text-neutral-400 font-mono ml-auto">
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Structured 6-Field Delivery Destination Address */}
                        <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800/80 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Structured Bangladeshi Delivery Address:</span>
                            </span>
                            <span className="text-neutral-400 font-mono text-[10px]">
                              {order.shippingAddress.division} · {order.shippingAddress.district || order.shippingAddress.city}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 font-mono leading-relaxed">
                            {order.shippingAddress.fullAddress}
                          </p>
                        </div>

                        {/* Advance Delivery Fee & Due Payment Strip */}
                        <div className="p-3 rounded-xl bg-gradient-to-r from-[#181C26] to-[#0B0D13] border border-neutral-800 flex flex-wrap items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-mono text-[10px] uppercase font-bold">
                              {order.courier.provider}
                            </span>
                            <span className="font-mono text-neutral-300">
                              {order.courier.trackingNumber}
                            </span>
                            <span className="text-neutral-400 text-[11px]">
                              ETA: <strong className="text-white">{order.courier.estimatedDelivery}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] text-emerald-400 block font-mono">
                                Advance Paid: ৳{(order.advanceDeliveryFeePaid ?? order.shippingFee).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-amber-300 block font-mono">
                                {order.dueAmountOnDelivery && order.dueAmountOnDelivery > 0
                                  ? `Due on Delivery: ৳${order.dueAmountOnDelivery.toLocaleString()}`
                                  : 'Due on Delivery: ৳0 (Paid in Full)'}
                              </span>
                            </div>

                            <div className="border-l border-neutral-700 pl-3">
                              <span className="text-[10px] text-neutral-400 block">Grand Total</span>
                              <span className="font-mono font-extrabold text-amber-400 text-sm tabular-nums">
                                ৳{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Actions: Digital Invoice Memo, Live Courier Tracking & Priority Dispute / Support */}
                        <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => openDigitalInvoice(order)}
                              className="px-3 py-1.5 rounded-lg bg-gold-gradient text-slate-950 font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                              title="View & Download Dual-Party Commercial Memo"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-950" />
                              <span>Digital Memo</span>
                            </button>

                            <button
                              onClick={() => setSelectedTrackingOrder(order)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-amber-400" />
                              <span>Live {order.courier.provider.toUpperCase()}</span>
                            </button>

                            {order.payoutHeldInEscrow ? (
                              <span className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 font-mono">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                <span>100% Escrow Held (Dispute Active)</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setReturnTargetOrder(order);
                                  setReturnSubmitted(false);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
                                title="Request Return under 7-Day Guarantee"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                <span>7-Day Return / Dispute</span>
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              openLiveSupport({
                                orderId: order.id,
                                sellerName: order.items[0]?.product.sellerName || 'Marketplace Seller',
                                defaultTab: 'dispute',
                                initialMessage: `Inquiry on Order #${order.id} (Status: ${order.orderStatus}). Please verify shipping status or dispute with merchant ${order.items[0]?.product.sellerName || ''}.`
                              })
                            }
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Headphones className="w-3.5 h-3.5 text-rose-400" />
                            <span>Help Desk</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. PROFILE & 6-FIELD ADDRESS BOOK */}
          {activeSection === 'profile' && (
            <div className="space-y-5">
              {/* Profile Customizer Showcase Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#131722] to-[#0B0D13] border border-amber-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-slate-950 font-bold">
                    <User className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Facebook-Style Profile Space</h4>
                    <p className="text-[11px] text-neutral-300">
                      Customize Cover Photo, Profile Picture, Bio, and earn FLUX coins!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveMainTab('profile');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs hover:brightness-105 transition-all cursor-pointer shrink-0"
                >
                  Open Profile Space →
                </button>
              </div>

              {/* Personal Details */}
              <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Personal Account Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      defaultValue={customerName}
                      className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Registered Phone (+880)</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={customerPhone || '+8801799887766'}
                      className="w-full bg-[#131722]/50 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-400 font-mono outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Saved Delivery Addresses with 6 Structured Fields */}
              <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>Nationwide Address Book (64 Districts & Thanas)</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Structured with 6 specific fields: Division, District, Thana, Ward No, Road/Block, House/Village.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {savedAddresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#131722] border border-neutral-800 text-xs space-y-2 hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Address #{idx + 1}</span>
                        </span>
                        {idx === 0 && (
                          <span className="text-amber-400 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-neutral-200 font-mono leading-relaxed text-[11px]">
                        {addr.fullAddress}
                      </p>

                      <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-1 text-[10px] text-neutral-400 font-mono">
                        <span>1. Div: <strong className="text-white">{addr.division}</strong></span>
                        <span>2. Dist: <strong className="text-white">{addr.district}</strong></span>
                        <span>3. Thana: <strong className="text-white">{addr.thana}</strong></span>
                        <span>4. Ward: <strong className="text-white">#{addr.wardNo}</strong></span>
                        <span>5. Road: <strong className="text-white">{addr.roadOrBlock}</strong></span>
                        <span>6. House: <strong className="text-white">{addr.houseOrVillage}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. HELP CENTER & RETURN POLICY */}
          {activeSection === 'help' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Bangladeshi Consumer Protection & Return Policy</span>
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Under the Consumer Rights Protection Act of Bangladesh, FLUX MART guarantees a <strong>7-Day Hassle-Free Replacement</strong> for defective, damaged, or mismatched products.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                    <span className="font-semibold text-amber-400 block mb-1">bKash & Nagad Refunds</span>
                    <p className="text-neutral-400 text-[11px]">
                      Refunds are credited directly to the originating mobile wallet within 24 to 48 business hours after courier parcel return scan.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                    <span className="font-semibold text-amber-400 block mb-1">Courier Doorstep Pickup</span>
                    <p className="text-neutral-400 text-[11px]">
                      Pathao Express or RedX will collect return parcels from your doorstep at zero extra cost upon return ticket approval.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-neutral-400">Merchant Helpdesk Hotline:</span>
                  <a
                    href="tel:+88096123589"
                    className="font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+880 9612-FLUXBD (3589)</span>
                  </a>
                </div>
              </div>

              {/* Dedicated Live Agent & Super-Admin Connect Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#131722] to-[#0B0D13] border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Direct Agent & Admin Connectivity</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online 24/7
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Experiencing order delays, merchant non-compliance, or payment issues? Connect immediately with Super-Admin Sultana Ahmed or our 24/7 WhatsApp emergency helpline.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => openLiveSupport({ defaultTab: 'chat' })}
                    className="px-4 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-950" />
                    <span>Start Live In-App Chat</span>
                  </button>

                  <button
                    onClick={() => openLiveSupport({ defaultTab: 'whatsapp' })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Connect via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => openLiveSupport({ defaultTab: 'dispute' })}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span>File Formal Dispute</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add New 6-Field Structured Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Add 6-Field Delivery Address (৬টি নির্দিষ্ট ফিল্ড)</span>
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">1. Division (বিভাগ)</label>
                  <select
                    value={newDivId}
                    onChange={(e) => handleDivChange(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-2.5 py-2 text-white outline-none"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.id} value={d.id}>{d.nameEn} ({d.nameBn})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">2. District (জেলা)</label>
                  <select
                    value={newDistId}
                    onChange={(e) => handleDistChange(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-2.5 py-2 text-white outline-none"
                  >
                    {curDiv.districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.nameEn} ({d.nameBn})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">3. Upazila / Thana (থানা)</label>
                  <select
                    value={newThana}
                    onChange={(e) => setNewThana(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-2.5 py-2 text-white outline-none"
                  >
                    {curDist.thanas.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">4. Ward No (ওয়ার্ড নম্বর)</label>
                  <input
                    type="text"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    placeholder="e.g. 04 or 19"
                    className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-300 block mb-1">5. Road Number / Block (রোড নম্বর / ব্লক)</label>
                <input
                  type="text"
                  value={newRoad}
                  onChange={(e) => setNewRoad(e.target.value)}
                  placeholder="e.g. Road #11, Block D"
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-300 block mb-1">6. House / Flat No. or Village (হাউস / ফ্ল্যাট নম্বর / গ্রাম)</label>
                <input
                  type="text"
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  placeholder="e.g. House 42, Apt 5B or Gram: Charpara"
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Save Structured Delivery Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Courier Tracking Modal Checkpoint View */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setSelectedTrackingOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Live Courier Tracking</h3>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 mb-5 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Carrier:</span>
                <span className="font-bold text-amber-400 uppercase">
                  {selectedTrackingOrder.courier.provider}
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-neutral-400">Tracking Code:</span>
                <span className="text-white font-bold">{selectedTrackingOrder.courier.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery Status:</span>
                <span className="text-emerald-400">{selectedTrackingOrder.courier.currentStatus}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-neutral-900">
                <span className="text-neutral-400">Advance Paid:</span>
                <span className="text-emerald-400 font-mono">
                  ৳{(selectedTrackingOrder.advanceDeliveryFeePaid ?? selectedTrackingOrder.shippingFee).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Due to Rider on Delivery:</span>
                <span className="text-amber-400 font-mono font-bold">
                  ৳{(selectedTrackingOrder.dueAmountOnDelivery ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkpoints */}
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
              {selectedTrackingOrder.courier.checkpoints.map((cp, idx) => (
                <div key={idx} className="relative flex items-start gap-4 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#0B0D13] border-2 border-amber-500/80 flex items-center justify-center text-amber-400 shrink-0 z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{cp.status}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      {cp.time} · {cp.location}
                    </span>
                    <p className="text-neutral-400 text-[11px] mt-0.5">{cp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Guarantee Escrow Return Modal */}
      {returnTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-auto overflow-hidden">
            
            <button
              onClick={() => {
                setReturnTargetOrder(null);
                setReturnSubmitted(false);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">7-Day Guarantee Return Request</h3>
                <p className="text-[11px] text-amber-300 font-mono">
                  Order #{returnTargetOrder.id} · Seller Payout: ৳{returnTargetOrder.sellerPayout.toLocaleString()}
                </p>
              </div>
            </div>

            {returnSubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">Dispute Registered & 100% Escrow Held</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Merchant payout of ৳{returnTargetOrder.sellerPayout.toLocaleString()} has been locked in platform escrow. Our Team D Logistics Arbiter will inspect the evidence within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setReturnTargetOrder(null);
                    setReturnSubmitted(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs cursor-pointer shadow-md hover:brightness-105"
                >
                  Close & Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#0B0D13] border border-amber-500/30 text-xs text-neutral-300 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Statutory Escrow Protection</span>
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Submitting this return request immediately holds 100% of the merchant payout in escrow under Ministry of Commerce e-commerce consumer guidelines.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Select Reason for Return / Dispute:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value as any)}
                    className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="defective">Manufacturing Defect or Torn Stitching</option>
                    <option value="damaged">Damaged Parcel / Transit Crushing</option>
                    <option value="wrong_item">Wrong Item / Variant Delivered</option>
                    <option value="fake_item">Counterfeit or Fake Brand Suspicion</option>
                    <option value="never_arrived">Delivery Mismatch / Incomplete</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Details & Unboxing Evidence Description:
                  </label>
                  <textarea
                    rows={3}
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    placeholder="Describe the defect or reason for return..."
                    className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnTargetOrder(null)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      createDispute(returnTargetOrder.id, returnReason, returnDescription);
                      setReturnSubmitted(true);
                    }}
                    className="px-5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs cursor-pointer shadow-md hover:brightness-105"
                  >
                    Submit Escrow Return Request
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
