import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryCommission, CourierConfig, SubAdminTeam, MerchantTier } from '../../types';
import {
  Shield,
  Sliders,
  Truck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Layers,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  BadgeCheck,
  ScanFace,
  Zap,
  Award,
  Radio,
  Clock,
  Landmark,
  Scale,
  Ban,
  Check,
  AlertTriangle,
  FileCheck2,
  MessageSquareWarning,
  Film,
  Sparkles,
  Download,
  BarChart3
} from 'lucide-react';

export const SecretAdminPortal: React.FC = () => {
  const {
    setRole,
    sellerProfile,
    adminApproveKyc,
    adminRejectKyc,
    categoryCommissions,
    updateCommission,
    couriers,
    toggleCourier,
    updateCourierRate,
    codReconciledTotal,
    reconcileCodPayouts,
    orders,
    products,
    triggerOneClickDailyPayout,
    dailyPayouts,
    lastPayoutSummary,
    isPayoutModalOpen,
    setIsPayoutModalOpen,
    subAdmins,
    withdrawalRequests,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
    sellerStrikes,
    issueSellerStrike,
    revokeSellerStrike,
    setIsSmsViewerOpen,
    openLegalModal
  } = useApp();

  const [activeSection, setActiveSection] = useState<'payout' | 'subadmins' | 'tiering' | 'kyc' | 'commission' | 'couriers' | 'orders'>('payout');
  const [financialTimeframe, setFinancialTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [reconcileSuccess, setReconcileSuccess] = useState(false);
  const [payoutProcessing, setPayoutProcessing] = useState(false);
  const [strikeReasonInput, setStrikeReasonInput] = useState('');

  // Financial Ledger Data (Daily, Monthly, Yearly)
  const financialLedgerData = {
    daily: {
      label: 'Today (24h Daily Settlement)',
      gmv: 342800,
      ordersCount: 42,
      commissionRetained: 34280,
      netDisbursed: 308520,
      activeMerchants: 16,
      escrowReserve: 48500,
      advanceDeliveryCollected: 5880,
      categories: [
        { name: 'Luxury Fashion & Apparel', gmv: 143976, share: 42, color: 'bg-amber-400' },
        { name: 'Tech & Mobile Gadgets', gmv: 116552, share: 34, color: 'bg-sky-400' },
        { name: 'Everyday Household Essentials', gmv: 47992, share: 14, color: 'bg-emerald-400' },
        { name: 'Health & DGDA Medicine', gmv: 34280, share: 10, color: 'bg-purple-400' },
      ],
      batches: [
        { batchId: 'BATCH-2025-1024-D1', time: 'Today 18:30 BST', orders: 42, merchants: 16, gmv: 342800, commission: 34280, net: 308520, method: 'bKash Merchant / BEFTN', ref: 'TXN-9982410-OK' },
        { batchId: 'BATCH-2025-1023-D2', time: 'Yesterday 18:30 BST', orders: 38, merchants: 14, gmv: 298400, commission: 29840, net: 268560, method: 'Nagad Payout Engine', ref: 'TXN-9981944-OK' },
      ]
    },
    monthly: {
      label: 'Current Month (October 2025)',
      gmv: 8940000,
      ordersCount: 1280,
      commissionRetained: 894000,
      netDisbursed: 8046000,
      activeMerchants: 48,
      escrowReserve: 620000,
      advanceDeliveryCollected: 179200,
      categories: [
        { name: 'Luxury Fashion & Apparel', gmv: 3754800, share: 42, color: 'bg-amber-400' },
        { name: 'Tech & Mobile Gadgets', gmv: 3039600, share: 34, color: 'bg-sky-400' },
        { name: 'Everyday Household Essentials', gmv: 1251600, share: 14, color: 'bg-emerald-400' },
        { name: 'Health & DGDA Medicine', gmv: 894000, share: 10, color: 'bg-purple-400' },
      ],
      batches: [
        { batchId: 'BATCH-2025-W4-M10', time: 'Week 4 Settlement', orders: 340, merchants: 44, gmv: 2380000, commission: 238000, net: 2142000, method: 'BEFTN Clearing House', ref: 'TXN-M10-W4-902' },
        { batchId: 'BATCH-2025-W3-M10', time: 'Week 3 Settlement', orders: 310, merchants: 41, gmv: 2190000, commission: 219000, net: 1971000, method: 'BEFTN Clearing House', ref: 'TXN-M10-W3-884' },
        { batchId: 'BATCH-2025-W2-M10', time: 'Week 2 Settlement', orders: 320, merchants: 42, gmv: 2240000, commission: 224000, net: 2016000, method: 'BEFTN Clearing House', ref: 'TXN-M10-W2-712' },
        { batchId: 'BATCH-2025-W1-M10', time: 'Week 1 Settlement', orders: 310, merchants: 39, gmv: 2130000, commission: 213000, net: 1917000, method: 'BEFTN Clearing House', ref: 'TXN-M10-W1-550' },
      ]
    },
    yearly: {
      label: 'Financial Year (FY 2024-2025)',
      gmv: 68450000,
      ordersCount: 9840,
      commissionRetained: 6845000,
      netDisbursed: 61605000,
      activeMerchants: 48,
      escrowReserve: 1450000,
      advanceDeliveryCollected: 1377600,
      categories: [
        { name: 'Luxury Fashion & Apparel', gmv: 28749000, share: 42, color: 'bg-amber-400' },
        { name: 'Tech & Mobile Gadgets', gmv: 23273000, share: 34, color: 'bg-sky-400' },
        { name: 'Everyday Household Essentials', gmv: 9583000, share: 14, color: 'bg-emerald-400' },
        { name: 'Health & DGDA Medicine', gmv: 6845000, share: 10, color: 'bg-purple-400' },
      ],
      batches: [
        { batchId: 'BATCH-FY25-Q3', time: 'Q3 Consolidated Audit', orders: 2540, merchants: 48, gmv: 17800000, commission: 1780000, net: 16020000, method: 'Bangladesh Bank RTGS/BEFTN', ref: 'TXN-FY25-Q3-AUDIT' },
        { batchId: 'BATCH-FY25-Q2', time: 'Q2 Consolidated Audit', orders: 2420, merchants: 46, gmv: 16900000, commission: 1690000, net: 15210000, method: 'Bangladesh Bank RTGS/BEFTN', ref: 'TXN-FY25-Q2-AUDIT' },
        { batchId: 'BATCH-FY25-Q1', time: 'Q1 Consolidated Audit', orders: 2380, merchants: 45, gmv: 16200000, commission: 1620000, net: 14580000, method: 'Bangladesh Bank RTGS/BEFTN', ref: 'TXN-FY25-Q1-AUDIT' },
      ]
    }
  };

  const currentLedger = financialLedgerData[financialTimeframe];

  const exportLedgerCsv = () => {
    const headers = "Batch ID,Period / Date,Orders Processed,Merchants Paid,Gross GMV (BDT),FLUX Retained Commission (10%),Net Disbursed to Sellers (BDT),Disbursement Method,Status,Transaction Reference\n";
    const rows = currentLedger.batches.map(b => 
      `"${b.batchId}","${b.time}","${b.orders}","${b.merchants}","${b.gmv}","${b.commission}","${b.net}","${b.method}","SETTLED","${b.ref}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FLUX_MART_Financial_Ledger_${financialTimeframe.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Platform Metrics
  const totalPlatformGmv = orders.reduce((sum, o) => sum + o.total, 0) + 1850000;
  const platformRevenue = Math.round(totalPlatformGmv * 0.098);
  const totalVendors = 48;

  const handleRunDailyPayout = () => {
    setPayoutProcessing(true);
    setTimeout(() => {
      triggerOneClickDailyPayout();
      setPayoutProcessing(false);
    }, 1000);
  };

  const handleApprove = (sellerId: string) => {
    adminApproveKyc(sellerId);
  };

  const handleReject = (sellerId: string) => {
    if (!rejectReason) {
      adminRejectKyc(sellerId, 'Document scan illegible or NID mismatch.');
    } else {
      adminRejectKyc(sellerId, rejectReason);
    }
    setSelectedSellerId(null);
    setRejectReason('');
  };

  const handleReconcile = () => {
    reconcileCodPayouts();
    setReconcileSuccess(true);
    setTimeout(() => setReconcileSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Admin Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1609] via-[#161A24] to-[#0B0D13] border border-amber-500/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Secret Master Admin Console
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase font-bold">
                Super-Admin Clearance (fluxmart365@gmail.com)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Absolute marketplace command desk · One-Click Payouts, 4 Sub-Admin Squads, KYC & National Escrow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* ONE-CLICK DAILY PAYOUT BUTTON */}
          <button
            onClick={handleRunDailyPayout}
            disabled={payoutProcessing}
            className="px-4 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 text-slate-950 ${payoutProcessing ? 'animate-spin' : ''}`} />
            <span>{payoutProcessing ? 'Processing Batch...' : 'One-Click Daily Payout'}</span>
          </button>

          <button
            onClick={() => setIsSmsViewerOpen(true)}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
            title="Inspect Carrier SMS logs"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>SMS Feed</span>
          </button>

          <button
            onClick={() => openLegalModal('dbid')}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="View Ministry & DGDA Compliance"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Compliance</span>
          </button>

          <button
            onClick={() => setRole('customer')}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Store</span>
          </button>
        </div>
      </div>

      {/* 2. Platform KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
          <span className="text-[11px] text-neutral-400 font-medium">Marketplace GMV</span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
            ৳{totalPlatformGmv.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400">Bangladeshi Commerce</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
          <span className="text-[11px] text-neutral-400 font-medium">Net Commission Earned</span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ৳{platformRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500">Auto-deducted from sellers</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
          <span className="text-[11px] text-neutral-400 font-medium">Registered Merchants</span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
            {totalVendors}
          </div>
          <span className="text-[10px] text-sky-400">Dhaka & Chittagong</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
          <span className="text-[11px] text-neutral-400 font-medium">Total Orders Handled</span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
            {orders.length + 842}
          </div>
          <span className="text-[10px] text-neutral-400">98.4% fulfillment rate</span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-[#131722] border border-amber-500/20 space-y-1">
          <span className="text-[11px] text-neutral-400 font-medium">COD Reconciled</span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ৳{codReconciledTotal.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Pathao / RedX / Steadfast</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#131722] border border-neutral-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSection('payout')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'payout'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>One-Click Daily Payout Engine</span>
        </button>

        <button
          onClick={() => setActiveSection('subadmins')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'subadmins'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Sub-Admin Squads (4 Teams / 20 Staff)</span>
        </button>

        <button
          onClick={() => setActiveSection('tiering')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'tiering'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Merchant Tiering & Rating Engine</span>
        </button>

        <button
          onClick={() => setActiveSection('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'kyc'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Master KYC Desk</span>
        </button>

        <button
          onClick={() => setActiveSection('commission')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'commission'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Category Commission</span>
        </button>

        <button
          onClick={() => setActiveSection('couriers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'couriers'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Couriers & COD</span>
        </button>

        <button
          onClick={() => setActiveSection('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'orders'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Global Orders</span>
        </button>
      </div>

      {/* 4. MODULE CONTENT */}

      {/* MODULE 1: FINANCIAL TRANSPARENCY & AUTOMATED LEDGER COMMAND DESK */}
      {activeSection === 'payout' && (
        <div className="space-y-6">
          {/* Executive Financial Ledger Control Header */}
          <div className="p-6 rounded-3xl bg-[#131722] border border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Executive Financial Ledger
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    Automated Reconciliation Active
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-1.5">
                  <Landmark className="w-5 h-5 text-amber-400" />
                  <span>Platform Financial Transparency & GMV Ledger</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Full automated accounting of Gross Merchandise Value (GMV), 10% platform commission retention, 7-day escrow hold, and automated merchant settlements.
                </p>
              </div>

              {/* Timeframe Switcher & CSV Export Button */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <div className="flex items-center p-1 bg-[#0B0D13] border border-neutral-800 rounded-xl">
                  <button
                    onClick={() => setFinancialTimeframe('daily')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      financialTimeframe === 'daily'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Daily (24h)
                  </button>
                  <button
                    onClick={() => setFinancialTimeframe('monthly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      financialTimeframe === 'monthly'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Monthly (Oct)
                  </button>
                  <button
                    onClick={() => setFinancialTimeframe('yearly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      financialTimeframe === 'yearly'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Yearly (FY25)
                  </button>
                </div>

                <button
                  onClick={exportLedgerCsv}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export official settlement ledger to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Timeframe Label Banner */}
            <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-[#0B0D13] border border-neutral-800/80">
              <span className="text-neutral-400">
                Viewing Period: <strong className="text-white font-mono">{currentLedger.label}</strong>
              </span>
              <span className="text-amber-400 font-mono text-[11px]">
                Currency: BDT (৳) · Platform Commission: 10.0% Flat
              </span>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Metric 1: GMV */}
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-1 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Gross Merchandise (GMV)</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
                  ৳{currentLedger.gmv.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>{currentLedger.ordersCount.toLocaleString()} Orders Processed</span>
                </div>
              </div>

              {/* Metric 2: Platform Commission */}
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-amber-500/30 space-y-1 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Retained Commission (10%)</span>
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-amber-300 tabular-nums">
                  ৳{currentLedger.commissionRetained.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <span>Net Platform Revenue</span>
                </div>
              </div>

              {/* Metric 3: Net Disbursed to Merchants */}
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-sky-500/30 space-y-1 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Net Disbursed to Merchants</span>
                  <Landmark className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-sky-400 tabular-nums">
                  ৳{currentLedger.netDisbursed.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <span>Across {currentLedger.activeMerchants} Active Sellers</span>
                </div>
              </div>

              {/* Metric 4: 7-Day Escrow & Advance Fee Reserve */}
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-purple-500/30 space-y-1 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">7-Day Escrow & COD Reserve</span>
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-purple-300 tabular-nums">
                  ৳{currentLedger.escrowReserve.toLocaleString()}
                </div>
                <div className="text-[11px] text-purple-400/90 flex items-center gap-1">
                  <span>+৳{currentLedger.advanceDeliveryCollected.toLocaleString()} Delivery Buffer</span>
                </div>
              </div>
            </div>

            {/* Category GMV Contribution Bars */}
            <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Category GMV Contribution & Sales Distribution</span>
                </h4>
                <span className="text-[10px] text-neutral-400">Total: 100% Volume</span>
              </div>

              {/* Combined Progress Bar */}
              <div className="h-3 w-full rounded-full bg-neutral-900 overflow-hidden flex">
                {currentLedger.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.share}%` }}
                    title={`${cat.name}: ${cat.share}% (৳${cat.gmv.toLocaleString()})`}
                  />
                ))}
              </div>

              {/* Category Legend & Values */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                {currentLedger.categories.map((cat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${cat.color}`} />
                    <div>
                      <span className="text-neutral-400 text-[11px] block">{cat.name}</span>
                      <span className="font-mono font-bold text-white text-xs">
                        ৳{cat.gmv.toLocaleString()} <span className="text-neutral-500 text-[10px]">({cat.share}%)</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* One-Click Daily Payout Engine Action Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#17130A] via-[#131722] to-[#0B0D13] border border-amber-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                <h4 className="text-sm sm:text-base font-bold text-white">One-Click Daily Payout Engine</h4>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  24h Cycle
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                Reconciles all delivered courier orders across Pathao, RedX, and Steadfast. Deducts 10% platform commission and immediately credits merchant wallets with instant withdrawal clearance.
              </p>
            </div>

            <button
              onClick={handleRunDailyPayout}
              disabled={payoutProcessing}
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Zap className={`w-4 h-4 text-slate-950 ${payoutProcessing ? 'animate-spin' : ''}`} />
              <span>{payoutProcessing ? 'Executing Settlement Batch...' : 'Execute One-Click Daily Payout'}</span>
            </button>
          </div>

          {/* Pending Merchant Withdrawal Requests Queue */}
          <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>Pending Merchant Withdrawal Requests ({withdrawalRequests.filter(r => r.status === 'pending').length} Pending)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Direct bKash Merchant, Nagad Payout, and Commercial Bank (BEFTN) withdrawal requests initiated by sellers.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {withdrawalRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-amber-300">{req.id}</span>
                      <span className="text-white font-bold">{req.sellerName}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                        {req.payoutMethod.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : req.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-300 animate-pulse'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px]">
                      Account: <strong className="text-neutral-200">{req.accountDetails}</strong> · Requested at: {req.requestedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-white tabular-nums">
                        ৳{req.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">Net Payout</span>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveWithdrawalRequest(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Disburse</span>
                        </button>
                        <button
                          onClick={() => rejectWithdrawalRequest(req.id, 'Account details mismatch')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Settlement Ledger Batches */}
          <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Historical Settlement Ledger & Batch Records ({currentLedger.batches.length} Batches)</span>
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                Filtered: {currentLedger.label}
              </span>
            </div>

            <div className="space-y-2">
              {currentLedger.batches.map((batch) => (
                <div
                  key={batch.batchId}
                  className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs hover:border-neutral-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{batch.batchId}</span>
                      <span className="text-neutral-500">· {batch.time}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        SETTLED
                      </span>
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-1">
                      Processed <strong className="text-amber-300 font-mono">{batch.orders} orders</strong> across <strong className="text-white font-mono">{batch.merchants} merchants</strong> · Method: <span className="text-sky-300 font-mono">{batch.method}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      Ref: {batch.ref}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Gross Sales</span>
                      <span className="font-mono text-neutral-300 font-semibold">৳{batch.gmv.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block">Commission Retained</span>
                      <span className="font-mono text-amber-400 font-semibold">৳{batch.commission.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Net Distributed</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">৳{batch.net.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: SUB-ADMIN SQUADS OVERVIEW (4 SPECIALIZED TEAMS / 20 MEMBERS) */}
      {activeSection === 'subadmins' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span>Sub-Admin Squads Management (4 Specialized Operational Teams)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Oversee all 20 appointed sentinels across KYC, Fraud Prevention, Content Quality, and Logistics.
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold">
                20 Staff Appointed · 4 Functional Squads
              </span>
            </div>

            {/* 4 Specialized Squad Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <span>Team Group A</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">5 Members</span>
                </div>
                <h4 className="text-xs font-semibold text-white">KYC & Seller Operations</h4>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  NID & biometric face scan audits, inventory sentinels & merchant warning strikes.
                </p>
                <div className="text-[10px] text-amber-300 font-mono pt-1">518 total tasks done</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <MessageSquareWarning className="w-4 h-4 text-rose-400" />
                    <span>Team Group B</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold">5 Members</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Support & Fraud Sentinel</h4>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  In-app chat monitoring, off-platform phone leak detection & anti-circumvention bans.
                </p>
                <div className="text-[10px] text-rose-300 font-mono pt-1">780 total tasks done</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-purple-400" />
                    <span>Team Group C</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold">5 Members</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Content Quality & Media</h4>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Product catalog scrutiny, shoppable reels moderation, copyright & DGDA drug policies.
                </p>
                <div className="text-[10px] text-purple-300 font-mono pt-1">740 total tasks done</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Team Group D</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">5 Members</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Logistics & Escrow Arbiter</h4>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Pathao/RedX/Steadfast coordination, COD reconciliation & 7-day return dispute resolution.
                </p>
                <div className="text-[10px] text-emerald-300 font-mono pt-1">954 total tasks done</div>
              </div>
            </div>

            {/* Complete 20 Sentinels Roster Table */}
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Full 20-Staff Sentinel Directory
              </h4>

              <div className="divide-y divide-neutral-800 bg-[#0B0D13] border border-neutral-800 rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
                {subAdmins.map((staff) => (
                  <div key={staff.id} className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-neutral-900/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">{staff.name}</span>
                          <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${
                            staff.team === 'group_a_kyc'
                              ? 'bg-amber-500/20 text-amber-300'
                              : staff.team === 'group_b_support_fraud'
                              ? 'bg-rose-500/20 text-rose-300'
                              : staff.team === 'group_c_content'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {staff.team.toUpperCase().replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 truncate block">
                          {staff.roleTitle} · {staff.email} · {staff.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                        {staff.tasksCompleted} tasks completed
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                        staff.onDuty ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${staff.onDuty ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
                        <span>{staff.onDuty ? 'On Duty' : 'Standby'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disciplinary 3-Strike Framework Engine */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-400" />
                <span>Disciplinary 3-Strike Framework Engine</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#0B0D13] border border-amber-500/30">
                  <span className="font-bold text-amber-400 block text-xs">Strike 1: Formal Warning</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Official notice dispatched via SMS. 48-hour compliance window.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0D13] border border-rose-500/30">
                  <span className="font-bold text-rose-400 block text-xs">Strike 2: Listing Freeze</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Store catalog locked. Cannot publish new items or edit prices.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0D13] border border-red-600/40">
                  <span className="font-bold text-red-400 block text-xs">Strike 3: Account Suspension</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Permanent platform ban, products delisted & escrow funds frozen.
                  </span>
                </div>
              </div>

              {/* Active Strikes Log */}
              {sellerStrikes.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] text-neutral-400 font-medium">Currently Active Disciplinary Strikes:</span>
                  {sellerStrikes.map((str) => (
                    <div key={str.id} className="p-3 rounded-xl bg-[#0B0D13] border border-rose-500/30 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px]">
                            STRIKE #{str.strikeNumber} ({str.severity.toUpperCase()})
                          </span>
                          <span className="font-bold text-white">Seller: {str.sellerId}</span>
                          <span className="text-neutral-500 text-[10px]">Issued: {str.issuedAt}</span>
                        </div>
                        <p className="text-rose-200 text-[11px] mt-0.5">"{str.reason}"</p>
                      </div>

                      <button
                        onClick={() => revokeSellerStrike(str.id)}
                        className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-semibold cursor-pointer shrink-0"
                      >
                        Revoke Strike
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 text-center text-neutral-500 text-xs">
                  Zero active disciplinary strikes on file. Marketplace merchant compliance is at 100%.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: MERCHANT TIERING & AUTOMATED RATING ENGINE */}
      {activeSection === 'tiering' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-[#131722] border border-amber-500/40 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Automated Merchant Tiering & Rating Engine</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Dynamic algorithmic tier calculation evaluating seller rating, fast dispatch SLA, and return rate. Grants boosted visibility on the homepage.
              </p>
            </div>

            {/* 4 Tiers Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-700 space-y-2">
                <div className="flex items-center gap-1.5 text-neutral-300 font-bold text-xs">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Merchant</span>
                </div>
                <p className="text-[11px] text-neutral-400">Passed NID & 3D biometric KYC. Baseline selling privileges.</p>
                <div className="text-[10px] text-neutral-500 font-mono">1.0x Visibility</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-slate-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Silver Merchant</span>
                </div>
                <p className="text-[11px] text-neutral-400">Rating &ge; 4.2★, &gt;10 orders, dispatch within 24 hours.</p>
                <div className="text-[10px] text-slate-300 font-mono">1.3x Search Boost</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-amber-500/50 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Gold Merchant</span>
                </div>
                <p className="text-[11px] text-neutral-400">Rating &ge; 4.6★, &gt;50 orders, return rate &lt; 2.0%.</p>
                <div className="text-[10px] text-amber-400 font-mono">1.8x Search Boost</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E1609] to-[#0B0D13] border-2 border-amber-400 space-y-2 shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Platinum Top-Rated</span>
                </div>
                <p className="text-[11px] text-neutral-300">Rating &ge; 4.85★, &gt;150 orders, return rate &lt; 0.8%.</p>
                <div className="text-[10px] text-amber-300 font-mono font-bold">2.4x Priority Featured</div>
              </div>
            </div>

            {/* Active Merchant Live Evaluation */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{sellerProfile.shopName}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      {sellerProfile.merchantUniqueId}
                    </span>
                  </h4>
                  <span className="text-[11px] text-neutral-400">Owner: {sellerProfile.ownerName}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>PLATINUM TOP-RATED MERCHANT</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800 space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">Customer Store Rating</span>
                  <div className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1">
                    <span>{sellerProfile.rating}</span>
                    <span className="text-xs">★</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Threshold: &ge; 4.85★ (Passed)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800 space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">Fast Dispatch SLA (&lt;12h)</span>
                  <div className="text-lg font-bold font-mono text-sky-400">
                    {sellerProfile.fastDispatchScore || 98.4}%
                  </div>
                  <span className="text-[10px] text-emerald-400">Pathao Priority Rider Pickup</span>
                </div>

                <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800 space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">Customer Return Rate</span>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {sellerProfile.returnRate || 0.6}%
                  </div>
                  <span className="text-[10px] text-emerald-400">Super-low defect ratio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* A. MASTER KYC VERIFICATION DESK */}
      {activeSection === 'kyc' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>Pending Merchant KYC Verification Queue</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Inspect National ID (NID), Passport, and Trade Licenses submitted by Bangladeshi merchants.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 font-mono text-xs font-semibold">
                Status: {sellerProfile.kycStatus.toUpperCase()}
              </span>
            </div>

            {/* Seller KYC Card */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                    {sellerProfile.avatar ? (
                      <img src={sellerProfile.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      sellerProfile.shopName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{sellerProfile.shopName}</h4>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        ID: {sellerProfile.merchantUniqueId || 'FLUX-MART-542'}
                      </span>
                      {sellerProfile.kycStatus === 'verified' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3 text-emerald-400" />
                          <span>Verified Merchant</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Owner: {sellerProfile.ownerName} · {sellerProfile.phone} · {sellerProfile.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-500 block">Payout Destination</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {sellerProfile.payoutAccountDetails || sellerProfile.bankAccountNumber || 'bKash Merchant'}
                  </span>
                </div>
              </div>

              {sellerProfile.kycDocument ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Document Type</span>
                      <span className="font-semibold text-white uppercase">{sellerProfile.kycDocument.documentType}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">ID / NID Number</span>
                      <span className="font-mono font-bold text-amber-400">{sellerProfile.kycDocument.documentNumber}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Trade License No.</span>
                      <span className="font-mono text-white">{sellerProfile.kycDocument.tradeLicenseNumber || 'TRAD/DSCC/019482/2024'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Name (Bangla)</span>
                      <span className="font-medium text-white">{sellerProfile.kycDocument.fullNameBengali}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Name (English)</span>
                      <span className="font-medium text-white">{sellerProfile.kycDocument.fullNameEnglish}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800">
                      <span className="text-neutral-500 block text-[11px]">Date of Birth</span>
                      <span className="font-mono text-white">{sellerProfile.kycDocument.dateOfBirth}</span>
                    </div>
                  </div>

                  {/* 3 Verification Documents Grid: NID Front, NID Back, Biometric Face Scan */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ScanFace className="w-4 h-4 text-amber-400" />
                      <span>3-Step Visual Identity Verification Audit</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Document 1: NID Front */}
                      <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800 space-y-1.5">
                        <span className="text-[11px] font-semibold text-neutral-300 block">
                          1. Government ID Front
                        </span>
                        <div className="aspect-video rounded-lg bg-neutral-900 overflow-hidden border border-neutral-700">
                          <img
                            src={sellerProfile.kycDocument.frontImage}
                            alt="Front Document"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Document 2: NID Back */}
                      <div className="p-3 rounded-xl bg-[#131722] border border-neutral-800 space-y-1.5">
                        <span className="text-[11px] font-semibold text-neutral-300 block">
                          2. Government ID Back
                        </span>
                        <div className="aspect-video rounded-lg bg-neutral-900 overflow-hidden border border-neutral-700 flex items-center justify-center text-neutral-500 text-xs">
                          {sellerProfile.kycDocument.backImage ? (
                            <img
                              src={sellerProfile.kycDocument.backImage}
                              alt="Back Document"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>No Back Scan</span>
                          )}
                        </div>
                      </div>

                      {/* Document 3: Face Scan */}
                      <div className="p-3 rounded-xl bg-[#131722] border border-emerald-500/40 space-y-1.5 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-emerald-400 block">
                            3. Biometric Face Scan
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                            99.4% Match
                          </span>
                        </div>
                        <div className="aspect-video rounded-lg bg-neutral-900 overflow-hidden border border-emerald-500/40 flex items-center justify-center relative">
                          <img
                            src={
                              sellerProfile.kycDocument.faceScanImage ||
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                            }
                            alt="Biometric Face Match"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 border border-emerald-400/50 rounded-lg pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-400">No documents submitted yet by this merchant.</p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-800/80">
                <button
                  onClick={() => handleReject(sellerProfile.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject KYC</span>
                </button>

                <button
                  onClick={() => handleApprove(sellerProfile.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <BadgeCheck className="w-4 h-4 text-slate-950" />
                  <span>Approve (Verified Merchant: {sellerProfile.merchantUniqueId || 'FLUX-MART-542'})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. CATEGORY COMMISSION SLIDERS */}
      {activeSection === 'commission' && (
        <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Category-Wise Platform Commission Sliders</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Adjust percentages automatically deducted from seller payouts. Changes update in real-time across the marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fashion Slider */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Fashion & Silk</h4>
                  <span className="text-[11px] text-neutral-400">Rajshahi silk, Panjabi, designer sarees</span>
                </div>
                <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {categoryCommissions.fashion}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={categoryCommissions.fashion}
                onChange={(e) => updateCommission('fashion', parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-500 block">
                Seller keeps {100 - categoryCommissions.fashion}% on every completed fashion order.
              </span>
            </div>

            {/* Electronics Slider */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Smart Electronics</h4>
                  <span className="text-[11px] text-neutral-400">Earbuds, smartwatches, accessories</span>
                </div>
                <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {categoryCommissions.electronics}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                value={categoryCommissions.electronics}
                onChange={(e) => updateCommission('electronics', parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-500 block">
                Seller keeps {100 - categoryCommissions.electronics}% on electronics.
              </span>
            </div>

            {/* Medicine Slider */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Medicine & Health</h4>
                  <span className="text-[11px] text-neutral-400">Herbal extracts, vitamins, monitors</span>
                </div>
                <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {categoryCommissions.medicine}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={categoryCommissions.medicine}
                onChange={(e) => updateCommission('medicine', parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-500 block">
                Seller keeps {100 - categoryCommissions.medicine}% on healthcare items.
              </span>
            </div>

            {/* Household Slider */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Household & Living</h4>
                  <span className="text-[11px] text-neutral-400">Artisanal brass, kettle sets, cookware</span>
                </div>
                <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {categoryCommissions.household}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={categoryCommissions.household}
                onChange={(e) => updateCommission('household', parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-500 block">
                Seller keeps {100 - categoryCommissions.household}% on household goods.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* C. COURIER INTEGRATIONS & COD RECONCILIATION */}
      {activeSection === 'couriers' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>Logistics Engine & Courier Gateway Toggles</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage Pathao Express, RedX, and Steadfast parcel APIs and shipping rates.
                </p>
              </div>

              <button
                onClick={handleReconcile}
                className="px-4 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reconcile COD Ledger</span>
              </button>
            </div>

            {reconcileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Cash-on-Delivery funds reconciled successfully with Pathao and RedX hub accounts!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {couriers.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Avg ETA: {c.avgDeliveryHours}h
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCourier(c.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        c.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {c.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1">Inside Dhaka Base Rate (৳)</label>
                      <input
                        type="number"
                        value={c.insideDhakaRate}
                        onChange={(e) =>
                          updateCourierRate(c.id, 'insideDhakaRate', parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Outside Dhaka Nationwide Rate (৳)</label>
                      <input
                        type="number"
                        value={c.outsideDhakaRate}
                        onChange={(e) =>
                          updateCourierRate(c.id, 'outsideDhakaRate', parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* D. GLOBAL ORDER MONITOR */}
      {activeSection === 'orders' && (
        <div className="p-6 rounded-3xl bg-[#131722] border border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-white">Global Order & Logistics Monitor</h3>
          
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-[#0B0D13] border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{order.id}</span>
                    <span className="text-neutral-500">· {order.orderDate}</span>
                  </div>
                  <span className="text-neutral-400">
                    Buyer: {order.customerName} ({order.shippingAddress.division}) · Courier:{' '}
                    <strong className="text-amber-400 uppercase">{order.courier.provider}</strong> (
                    {order.courier.trackingNumber})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white tabular-nums">
                    ৳{order.total.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold uppercase text-[10px]">
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
