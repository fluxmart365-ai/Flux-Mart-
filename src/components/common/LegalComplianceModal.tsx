import React from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_LOGO } from '../../data/mockData';
import {
  Shield,
  FileText,
  Lock,
  Building,
  CheckCircle2,
  X,
  Scale,
  Pill,
  Award,
  ExternalLink,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export const LegalComplianceModal: React.FC = () => {
  const {
    isLegalModalOpen,
    setIsLegalModalOpen,
    legalModalTab,
    openLegalModal
  } = useApp();

  if (!isLegalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-3xl bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsLegalModalOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-neutral-800">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/40 shadow-md shadow-amber-500/20 shrink-0">
            <img src={OFFICIAL_LOGO} alt="FLUX MART" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                FLUX MART Legal & Regulatory Compliance
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                Government Verified
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              People's Republic of Bangladesh · Ministry of Commerce & DGDA Certified
            </p>
          </div>
        </div>

        {/* Statutory Registration Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Commerce DBID</span>
            <span className="text-xs font-mono font-bold text-amber-400">DBID-892401</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Trade License</span>
            <span className="text-xs font-mono font-bold text-sky-400">TRAD/DNCC/029412</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">VAT BIN</span>
            <span className="text-xs font-mono font-bold text-emerald-400">0048219-01-DNCC</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">DGDA Pharmacy</span>
            <span className="text-xs font-mono font-bold text-amber-300">DGDA-ECOM-7741</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B0D13] border border-neutral-800 rounded-xl mb-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => openLegalModal('dbid')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              legalModalTab === 'dbid'
                ? 'bg-gold-gradient text-slate-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>DBID & Guidelines</span>
          </button>

          <button
            onClick={() => openLegalModal('terms')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              legalModalTab === 'terms'
                ? 'bg-gold-gradient text-slate-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => openLegalModal('privacy')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              legalModalTab === 'privacy'
                ? 'bg-gold-gradient text-slate-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Biometrics</span>
          </button>

          <button
            onClick={() => openLegalModal('dgda')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              legalModalTab === 'dgda'
                ? 'bg-gold-gradient text-slate-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>DGDA Healthcare</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-neutral-300 leading-relaxed">
          {legalModalTab === 'dbid' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <h4 className="font-bold text-amber-300 text-sm mb-1">
                  National Digital Commerce Operational Guidelines 2021
                </h4>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  FLUX MART is fully gazetted under the Ministry of Commerce Digital Business Identification Number (DBID) registration framework. All multi-vendor transactions are audited under Government Central Regulatory Escrow.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandatory Delivery & Price Transparency</span>
                </h5>
                <p className="text-neutral-400 pl-5">
                  All catalog prices are inclusive of applicable VAT and government duties. Advance delivery charges are capped strictly at official courier costs (৳60 inside Dhaka, ৳120 outside Dhaka) and processed solely via registered MFS / Bank channels.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>7-Day Return & Escrow Protection</span>
                </h5>
                <p className="text-neutral-400 pl-5">
                  Customers are protected by our statutory 7-Day Return Guarantee. When a customer flags a defective, counterfeit, or mismatched parcel, merchant payouts are immediately held in platform escrow until our Team D Logistics Arbiter validates the return proof.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Doorstep Inspection on Cash-on-Delivery</span>
                </h5>
                <p className="text-neutral-400 pl-5">
                  In collaboration with Pathao, RedX, and Steadfast, customers are entitled to open-box OTP verification at the doorstep prior to handing over the due COD amount.
                </p>
              </div>
            </div>
          )}

          {legalModalTab === 'terms' && (
            <div className="space-y-3.5">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">1. Marketplace Intermediary Status</h4>
                <p className="text-neutral-400">
                  FLUX MART acts as a curated technology marketplace connecting verified Bangladeshi artisans, authorized brand distributors, and buyers across all 64 districts.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">2. Merchant Obligations & 3-Strike Framework</h4>
                <p className="text-neutral-400">
                  Every merchant must operate under our Disciplinary Framework:
                </p>
                <ul className="list-disc pl-5 text-neutral-400 space-y-1">
                  <li><strong className="text-amber-300">Strike 1:</strong> Formal Warning for slight delays or customer complaints.</li>
                  <li><strong className="text-amber-300">Strike 2:</strong> Immediate Catalog Freeze for circumvention, off-platform phone soliciting, or counterfeit flags.</li>
                  <li><strong className="text-rose-400">Strike 3:</strong> Permanent Account Suspension & Escrow Liquidation for fraud, fake NID, or hazardous goods.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">3. Platform Commissions & Automatic Daily Payout</h4>
                <p className="text-neutral-400">
                  Platform fees range from 5% (Medicine) to 12% (Fashion). Net revenues are disbursed via automated daily wallet payouts following successful courier delivery confirmation.
                </p>
              </div>
            </div>
          )}

          {legalModalTab === 'privacy' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
                  <Lock className="w-4 h-4" />
                  <span>Biometric KYC & NID Encryption</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Under Bangladesh Cyber Security Act 2023, all merchant national identity cards (NID), passports, and 3D facial liveness biometric records are stored using AES-256 encryption. Biometrics are never sold, rented, or transferred to third-party ad networks.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Customer Data & Address Confidentiality</h4>
                <p className="text-neutral-400">
                  Customer phone numbers and 6-layer detailed addresses are visible exclusively to designated courier API dispatchers (Pathao, RedX, Steadfast) for delivery completion. Sellers do not receive private customer contact details.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Automated Chat Audit & Off-Platform Protection</h4>
                <p className="text-neutral-400">
                  To prevent fraud and scam transactions, internal chat channels are audited by automated sentinels (Sub-Admin Team B) to detect unsolicited phone leaks or circumvention bypasses.
                </p>
              </div>
            </div>
          )}

          {legalModalTab === 'dgda' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <Pill className="w-4 h-4" />
                  <span>Directorate General of Drug Administration (DGDA) Compliance</span>
                </div>
                <p className="text-neutral-300 text-[11px]">
                  All health, botanical, and OTC therapeutic listings must possess valid DGDA registration and Good Manufacturing Practice (GMP) batch records.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Strict Ban on Unlicensed Substances</h4>
                <p className="text-neutral-400">
                  Narcotic compounds, unapproved rapid slimming drops, and unlabeled homeopathic concentrates are strictly barred. Violations result in immediate catalog delisting and statutory referral to law enforcement.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Registered Corporate Headquarters Footer */}
        <div className="mt-4 pt-3.5 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Registered HQ: Level 14, Police Plaza Concord, Tower-1, Gulshan-1, Dhaka 1212
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-300 font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+880 9612-334455</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>compliance@fluxmart.bd</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
