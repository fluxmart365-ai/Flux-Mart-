import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubAdminTeam, OrderDispute, FlaggedChatMessage, ModerationAuditItem } from '../../types';
import {
  Shield,
  FileCheck2,
  MessageSquareWarning,
  Film,
  Truck,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  Flame,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Lock,
  Package,
  Layers,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const SubAdminPortal: React.FC = () => {
  const {
    setRole,
    activeSubAdminTeam,
    setActiveSubAdminTeam,
    subAdminUser,
    subAdmins,
    sellerProfile,
    adminApproveKyc,
    adminRejectKyc,
    issueSellerStrike,
    flaggedChats,
    resolveFlaggedChat,
    moderationItems,
    auditModerationItem,
    disputes,
    resolveDispute,
    orders,
    products,
    sendSms,
    setIsSmsViewerOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<SubAdminTeam>(subAdminUser?.team || activeSubAdminTeam);
  const [kycRejectReason, setKycRejectReason] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [disputeNotes, setDisputeNotes] = useState('');
  const [stockAlertSuccess, setStockAlertSuccess] = useState<string | null>(null);
  const [strikeSuccess, setStrikeSuccess] = useState<string | null>(null);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  const handleSelectSquad = (targetTeam: SubAdminTeam) => {
    if (subAdminUser?.team && subAdminUser.team !== targetTeam) {
      const teamNames: Record<SubAdminTeam, string> = {
        group_a_kyc: 'Group A (KYC & Seller Operations)',
        group_b_support_fraud: 'Group B (Fraud & Chat Sentinel)',
        group_c_content: 'Group C (Content & Media Audit)',
        group_d_logistics: 'Group D (Logistics & Escrow)'
      };
      setAccessDeniedMessage(
        `Clearance Restricted: Staff member "${subAdminUser.name}" has credentials bound strictly to ${teamNames[subAdminUser.team]}. Cross-squad administrative clearance is reserved for Master Super-Admin.`
      );
      setTimeout(() => setAccessDeniedMessage(null), 4000);
      return;
    }
    setActiveTab(targetTeam);
    setActiveSubAdminTeam(targetTeam);
  };

  // Filter squad members for current team
  const currentTeamMembers = subAdmins.filter((s) => s.team === activeTab);

  // Group A Handlers
  const handleTriggerStockAlert = (productTitle: string) => {
    sendSms(
      sellerProfile.phone,
      `FLUX MART INVENTORY SENTINEL: Low stock alert for "${productTitle}". Only 4 units remain. Please replenish warehouse stock to prevent auto-delisting.`,
      'order_update'
    );
    setStockAlertSuccess(`Restock notification dispatched for ${productTitle}`);
    setTimeout(() => setStockAlertSuccess(null), 3000);
  };

  const handleIssueWarningStrike = (sellerId: string, reason: string) => {
    issueSellerStrike(sellerId, 1, reason, 'warning', activeTab);
    setStrikeSuccess('Strike 1 formal notice dispatched to merchant.');
    setTimeout(() => setStrikeSuccess(null), 3000);
  };

  const handleIssueFreezeStrike = (sellerId: string, reason: string) => {
    issueSellerStrike(sellerId, 2, reason, 'freeze', activeTab);
    setStrikeSuccess('Strike 2 Listing Freeze enacted on merchant.');
    setTimeout(() => setStrikeSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Sub-Admin Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#111A2E] via-[#131722] to-[#0B0D13] border border-sky-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Sub-Admin Operations Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-[10px] font-bold">
                Logged in: {subAdminUser?.name || 'Staff Sentinel'} ({subAdminUser?.roleTitle || 'Operator'})
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Role-based specialized staff terminal · Access strictly constrained to assigned operational squad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSmsViewerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>SMS Telecom Feed</span>
          </button>

          <button
            onClick={() => setRole('customer')}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Console</span>
          </button>
        </div>
      </div>

      {/* 2. Feedback Notifications */}
      {accessDeniedMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{accessDeniedMessage}</span>
        </div>
      )}

      {stockAlertSuccess && (
        <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/40 text-sky-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>{stockAlertSuccess}</span>
        </div>
      )}

      {strikeSuccess && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{strikeSuccess}</span>
        </div>
      )}

      {/* 3. Specialized Squad Selector (4 Teams) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Group A */}
        <button
          onClick={() => handleSelectSquad('group_a_kyc')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeTab === 'group_a_kyc'
              ? 'bg-gradient-to-br from-[#1E170A] to-[#131722] border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:border-neutral-700'
          } ${subAdminUser?.team && subAdminUser.team !== 'group_a_kyc' ? 'opacity-70' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeTab === 'group_a_kyc' ? 'bg-amber-500 text-slate-950' : 'bg-neutral-800 text-neutral-300'}`}>
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              {subAdminUser?.team && subAdminUser.team !== 'group_a_kyc' && (
                <Lock className="w-3 h-3 text-neutral-500" />
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                Team A (5)
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span>Group A: KYC & Seller Ops</span>
              {subAdminUser?.team === 'group_a_kyc' && (
                <span className="text-[9px] text-amber-400 font-mono font-normal">Assigned</span>
              )}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              NID/Face biometrics, stock monitoring, restock alerts & strikes
            </p>
          </div>
        </button>

        {/* Group B */}
        <button
          onClick={() => handleSelectSquad('group_b_support_fraud')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeTab === 'group_b_support_fraud'
              ? 'bg-gradient-to-br from-[#1E0F12] to-[#131722] border-rose-400 text-white shadow-lg shadow-rose-500/10'
              : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:border-neutral-700'
          } ${subAdminUser?.team && subAdminUser.team !== 'group_b_support_fraud' ? 'opacity-70' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeTab === 'group_b_support_fraud' ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-300'}`}>
              <MessageSquareWarning className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              {subAdminUser?.team && subAdminUser.team !== 'group_b_support_fraud' && (
                <Lock className="w-3 h-3 text-neutral-500" />
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                Team B (5)
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span>Group B: Fraud & Chat Sentinel</span>
              {subAdminUser?.team === 'group_b_support_fraud' && (
                <span className="text-[9px] text-rose-400 font-mono font-normal">Assigned</span>
              )}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Phone leak audit, off-platform bypass sentinel & quick bans
            </p>
          </div>
        </button>

        {/* Group C */}
        <button
          onClick={() => handleSelectSquad('group_c_content')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeTab === 'group_c_content'
              ? 'bg-gradient-to-br from-[#181128] to-[#131722] border-purple-400 text-white shadow-lg shadow-purple-500/10'
              : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:border-neutral-700'
          } ${subAdminUser?.team && subAdminUser.team !== 'group_c_content' ? 'opacity-70' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeTab === 'group_c_content' ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-300'}`}>
              <Film className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              {subAdminUser?.team && subAdminUser.team !== 'group_c_content' && (
                <Lock className="w-3 h-3 text-neutral-500" />
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                Team C (5)
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span>Group C: Content & Media Audit</span>
              {subAdminUser?.team === 'group_c_content' && (
                <span className="text-[9px] text-purple-400 font-mono font-normal">Assigned</span>
              )}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Catalog review, reel moderation, counterfeit screening & DGDA
            </p>
          </div>
        </button>

        {/* Group D */}
        <button
          onClick={() => handleSelectSquad('group_d_logistics')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeTab === 'group_d_logistics'
              ? 'bg-gradient-to-br from-[#091F1A] to-[#131722] border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-[#131722] border-neutral-800 text-neutral-400 hover:border-neutral-700'
          } ${subAdminUser?.team && subAdminUser.team !== 'group_d_logistics' ? 'opacity-70' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeTab === 'group_d_logistics' ? 'bg-emerald-500 text-slate-950' : 'bg-neutral-800 text-neutral-300'}`}>
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              {subAdminUser?.team && subAdminUser.team !== 'group_d_logistics' && (
                <Lock className="w-3 h-3 text-neutral-500" />
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                Team D (5)
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span>Group D: Logistics & Escrow</span>
              {subAdminUser?.team === 'group_d_logistics' && (
                <span className="text-[9px] text-emerald-400 font-mono font-normal">Assigned</span>
              )}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Pathao/RedX tracking, COD handover & 7-day return arbiter
            </p>
          </div>
        </button>
      </div>

      {/* 4. Active Squad 5-Member Roster Strip */}
      <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Assigned Squad Members ({currentTeamMembers.length} Sentinels on Roster)
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {currentTeamMembers.filter((m) => m.onDuty).length} Active On-Duty · 24/7 Coverage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {currentTeamMembers.map((member) => (
            <div
              key={member.id}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                subAdminUser?.id === member.id
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : 'bg-[#0B0D13] border-neutral-800'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0B0D13] ${
                    member.onDuty ? 'bg-emerald-400' : 'bg-neutral-600'
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate block">
                    {member.name}
                  </span>
                  {subAdminUser?.id === member.id && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold shrink-0">
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 truncate block">
                  {member.roleTitle}
                </span>
                <span className="text-[9px] text-amber-400/90 font-mono block">
                  {member.tasksCompleted} tasks done
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TEAM GROUP A: KYC & SELLER OPERATIONS PANEL */}
      {activeTab === 'group_a_kyc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Merchant KYC & Warehouse Stock Audit</h2>
              <p className="text-xs text-neutral-400">
                Verify NID front/back and biometric face liveness scans. Issue disciplinary strikes or restock alerts.
              </p>
            </div>
          </div>

          {/* Active Merchant Verification Card */}
          <div className="p-5 rounded-2xl bg-[#131722] border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src={sellerProfile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={sellerProfile.shopName}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{sellerProfile.shopName}</h3>
                    <span className="text-xs text-amber-300 font-mono">({sellerProfile.merchantUniqueId})</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {sellerProfile.kycStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Owner: {sellerProfile.ownerName} · {sellerProfile.phone} · {sellerProfile.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => adminApproveKyc(sellerProfile.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve KYC</span>
                </button>

                <button
                  onClick={() => adminRejectKyc(sellerProfile.id, kycRejectReason || 'NID scan unclear.')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleIssueWarningStrike(sellerProfile.id, 'Late dispatch violation reported by buyer.')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Issue Strike 1</span>
                </button>

                <button
                  onClick={() => handleIssueFreezeStrike(sellerProfile.id, 'Repeat circumvention or inventory discrepancy.')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Strike 2 (Freeze)</span>
                </button>
              </div>
            </div>

            {/* KYC Document Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 space-y-2">
                <span className="text-[11px] text-neutral-400 font-semibold block">1. NID Card Front</span>
                <div className="h-32 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
                  <img
                    src={sellerProfile.kycDocument?.frontImage || '/assets/aistudio/1790658673053_abd6ce4e.jpg'}
                    alt="NID Front"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  No: {sellerProfile.kycDocument?.documentNumber || '1992269550001429'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 space-y-2">
                <span className="text-[11px] text-neutral-400 font-semibold block">2. NID Card Back</span>
                <div className="h-32 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
                  <img
                    src={sellerProfile.kycDocument?.backImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'}
                    alt="NID Back"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  DOB: {sellerProfile.kycDocument?.dateOfBirth || '1992-08-14'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 space-y-2">
                <span className="text-[11px] text-neutral-400 font-semibold block">3. Biometric 3D Face Scan</span>
                <div className="h-32 rounded-lg overflow-hidden border border-amber-500/30 bg-neutral-900 relative">
                  <img
                    src={sellerProfile.kycDocument?.faceScanImage || sellerProfile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt="Biometric Scan"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] font-mono">
                    99.4% Match
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Liveness Verified: Passed
                </div>
              </div>
            </div>

            {/* Warehouse Stock Monitor & Low Stock Alerts */}
            <div className="mt-4 pt-3 border-t border-neutral-800">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Warehouse Stock Level Sentinels (Auto-Restock Alert Engine)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {products.slice(0, 3).map((prod) => (
                  <div key={prod.id} className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white truncate block">{prod.title}</span>
                      <span className="text-[10px] text-neutral-400">Stock: <strong className="text-amber-300 font-mono">{prod.stock} units</strong></span>
                    </div>
                    <button
                      onClick={() => handleTriggerStockAlert(prod.title)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-[10px] font-semibold cursor-pointer shrink-0"
                    >
                      Alert Seller
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TEAM GROUP B: FRAUD PREVENTION & CHAT SENTINEL PANEL */}
      {activeTab === 'group_b_support_fraud' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white">In-App Chat Sentinel & Circumvention Fraud Auditor</h2>
              <p className="text-xs text-neutral-400">
                Automated regex engine detects off-platform transactions, leaked phone numbers, and direct bKash solicitations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {flaggedChats.map((fc) => (
              <div
                key={fc.id}
                className="p-4 rounded-2xl bg-[#131722] border border-rose-500/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-rose-500 text-white font-bold text-[10px]">
                      {fc.severity.toUpperCase()} VIOLATION
                    </span>
                    <span className="text-xs font-bold text-white">Merchant: {fc.sellerName}</span>
                    <span className="text-xs text-neutral-400">→ Customer: {fc.customerName}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({fc.timestamp})</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    fc.status === 'flagged' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    STATUS: {fc.status.toUpperCase()}
                  </span>
                </div>

                {/* Message Box with Trigger Highlighting */}
                <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 text-xs font-mono text-neutral-200">
                  <div className="text-[10px] text-neutral-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Intercepted Message Body:</span>
                  </div>
                  <p className="text-rose-200 leading-relaxed bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                    "{fc.messageText}"
                  </p>
                </div>

                {/* Detected Keywords */}
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="text-neutral-400 font-medium">Trigger Patterns:</span>
                  {fc.triggerKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30 text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>

                {/* 1-Click Enforcement Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => resolveFlaggedChat(fc.id, 'warning_sent')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Issue Formal Warning (Strike 1)</span>
                  </button>

                  <button
                    onClick={() => resolveFlaggedChat(fc.id, 'seller_frozen')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Freeze Seller Listings (Strike 2)</span>
                  </button>

                  <button
                    onClick={() => resolveFlaggedChat(fc.id, 'reviewed')}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as False Alarm</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TEAM GROUP C: CONTENT MODERATION & MEDIA AUDIT */}
      {activeTab === 'group_c_content' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Product Catalog & Shoppable Reels Gatekeeper</h2>
              <p className="text-xs text-neutral-400">
                Audits uploaded catalogs, screens short video reels, and enforces DGDA & trademark copyright policies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {moderationItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#131722] border border-purple-500/30 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="h-40 rounded-xl overflow-hidden border border-neutral-800 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/40 uppercase">
                      {item.targetType}
                    </span>
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'delisted' ? 'bg-rose-500 text-white' : item.status === 'approved' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{item.title}</h3>
                    <p className="text-[10px] text-neutral-400">Creator/Seller: {item.creatorOrSellerName}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200">
                    <span className="font-semibold block mb-0.5">Audit Flag:</span>
                    <span>{item.flagReason}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => auditModerationItem(item.id, 'approved')}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => auditModerationItem(item.id, 'delisted')}
                    className="flex-1 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Delist</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TEAM GROUP D: LOGISTICS & COURIER RECONCILIATION */}
      {activeTab === 'group_d_logistics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Courier Reconciliation & 7-Day Guarantee Escrow Disputes</h2>
              <p className="text-xs text-neutral-400">
                Track parcel movements across Pathao, RedX, Steadfast, verify COD doorstep handovers, and resolve escrow dispute claims.
              </p>
            </div>
          </div>

          {/* Active Escrow Disputes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Pending Customer Escrow Disputes ({disputes.length} Registered)
            </h3>

            {disputes.map((disp) => (
              <div
                key={disp.id}
                className="p-4 rounded-2xl bg-[#131722] border border-emerald-500/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                        Order #{disp.orderId}
                      </span>
                      <span className="text-xs font-bold text-white">Buyer: {disp.customerName}</span>
                      <span className="text-xs text-neutral-400">vs Merchant: {disp.sellerName}</span>
                    </div>
                    <p className="text-[11px] text-amber-300 mt-0.5 font-medium">
                      Escrow Held: ৳{disp.escrowAmount.toLocaleString()} · Reason: {disp.reason.toUpperCase()}
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    STATUS: {disp.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5 text-xs">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                      Customer Grievance & Unboxing Evidence:
                    </span>
                    <p className="text-neutral-300 bg-[#0B0D13] p-3 rounded-xl border border-neutral-800 leading-relaxed font-mono">
                      "{disp.description}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold mb-1">
                      Uploaded Photo Proof:
                    </span>
                    <div className="h-24 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900">
                      <img
                        src={disp.evidencePhoto || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80'}
                        alt="Evidence Proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Arbiter Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => resolveDispute(disp.id, 'escrow_refunded', 'Defect verified from photo proof. 100% Escrow refunded to customer.')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve 100% Refund from Escrow</span>
                  </button>

                  <button
                    onClick={() => resolveDispute(disp.id, 'rejected', 'Evidence inconsistent with official courier dispatch logs.')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Dispute Claim</span>
                  </button>

                  <button
                    onClick={() => resolveDispute(disp.id, 'replacement_shipped', 'Merchant agreed to expedite replacement via Pathao Express.')}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Authorize Replacement Dispatch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Courier Network Health */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>Pathao Express Network</span>
              </span>
              <p className="text-lg font-bold font-mono text-white">412 active parcels</p>
              <span className="text-[10px] text-neutral-400">99.1% on-time metro SLA</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>RedX Nationwide Logistics</span>
              </span>
              <p className="text-lg font-bold font-mono text-white">284 active parcels</p>
              <span className="text-[10px] text-neutral-400">64 districts transit hub</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-1">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>Steadfast Courier BD</span>
              </span>
              <p className="text-lg font-bold font-mono text-white">198 active parcels</p>
              <span className="text-[10px] text-neutral-400">Rural upazila fulfillment</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
