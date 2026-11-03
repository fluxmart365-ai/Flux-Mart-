import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubAdminTeam } from '../../types';
import {
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  X,
  FileCheck2,
  MessageSquareWarning,
  Film,
  Truck,
  Users,
  AlertCircle,
  Key
} from 'lucide-react';

interface SubAdminStaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubAdminStaffLoginModal: React.FC<SubAdminStaffLoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const { subAdmins, loginAsSubAdmin, language } = useApp();

  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [selectedStaffEmail, setSelectedStaffEmail] = useState('kyc.subadmin@fluxmart.bd');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [successTeam, setSuccessTeam] = useState<string | null>(null);

  if (!isOpen) return null;

  const staffOptions = [
    {
      team: 'group_a_kyc' as SubAdminTeam,
      name: 'Shakil Ahmed',
      email: 'kyc.subadmin@fluxmart.bd',
      phone: '+8801911000001',
      role: 'KYC & Biometrics Supervisor',
      icon: FileCheck2,
      color: 'text-amber-400',
      badge: 'Group A: KYC & Seller Operations'
    },
    {
      team: 'group_b_support_fraud' as SubAdminTeam,
      name: 'Farhana Yasmin',
      email: 'support.subadmin@fluxmart.bd',
      phone: '+8801911000002',
      role: 'Support Sentinel & Chat Fraud Lead',
      icon: MessageSquareWarning,
      color: 'text-rose-400',
      badge: 'Group B: Chat Sentinel & Fraud Audit'
    },
    {
      team: 'group_c_content' as SubAdminTeam,
      name: 'Mahfuzur Rahman',
      email: 'content.subadmin@fluxmart.bd',
      phone: '+8801911000003',
      role: 'Catalog QC & DGDA Compliance Sentinel',
      icon: Film,
      color: 'text-purple-400',
      badge: 'Group C: Content Moderation & DGDA'
    },
    {
      team: 'group_d_logistics' as SubAdminTeam,
      name: 'Kamrul Hasan',
      email: 'logistics.subadmin@fluxmart.bd',
      phone: '+8801911000004',
      role: 'Courier Reconciliation & Escrow Officer',
      icon: Truck,
      color: 'text-emerald-400',
      badge: 'Group D: Courier & 7-Day Escrow'
    }
  ];

  const currentSelectedStaff = staffOptions.find((s) => s.email === selectedStaffEmail) || staffOptions[0];

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffEmail || !selectedStaffEmail.includes('@')) {
      setError('Please select or enter an authorized FLUX MART staff email.');
      return;
    }
    const matched = subAdmins.find((s) => s.email.toLowerCase() === selectedStaffEmail.toLowerCase());
    if (!matched) {
      setError('Staff email not found in active Sub-Admin roster.');
      return;
    }
    setError('');
    setStep('otp');
    setOtpCode('554433'); // pre-fill test 2FA token
  };

  const handleVerifyStaffOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '554433' && otpCode !== '778800') {
      setError('Invalid 2FA Sentinel Code. Authorized squad code is 554433.');
      return;
    }

    const success = loginAsSubAdmin(selectedStaffEmail);
    if (success) {
      setSuccessTeam(currentSelectedStaff.badge);
      setTimeout(() => {
        onClose();
        setStep('input');
        setOtpCode('');
        setError('');
        setSuccessTeam(null);
      }, 800);
    } else {
      setError('Authentication failed. Check your staff permissions.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0F1420] border border-sky-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-neutral-800">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Sub-Admin Staff Routing Portal
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[9px] font-bold">
                SENTINEL
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Role-restricted gateway for pre-registered operations personnel (Teams A, B, C, D)
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successTeam && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Access granted. Initializing {successTeam}...</span>
          </div>
        )}

        {/* Step 1: Staff Selection & Verification */}
        {step === 'input' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Select Pre-Registered Staff Member:
              </label>

              <div className="space-y-2">
                {staffOptions.map((staff) => {
                  const Icon = staff.icon;
                  const isSelected = selectedStaffEmail === staff.email;
                  return (
                    <div
                      key={staff.email}
                      onClick={() => setSelectedStaffEmail(staff.email)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-400 text-white shadow-md ring-1 ring-sky-400/40'
                          : 'bg-[#0B0D13] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg bg-neutral-900 border border-neutral-800 ${staff.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white truncate">{staff.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400 truncate">({staff.role})</span>
                          </div>
                          <span className="text-[10px] text-sky-300/80 font-mono block truncate">
                            {staff.email}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isSelected ? 'bg-sky-500 text-slate-950' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {staff.team.split('_')[1].toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warning regarding Zero Super-Admin clearance */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <span className="font-bold text-amber-400 block">Restricted Team Authorization Notice:</span>
              <p>
                Logging into this portal grants access <strong>strictly and exclusively</strong> to your assigned squad. Sub-Admins have zero access to platform commissions, gross payout engines, or Super-Admin ledgers.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate Staff Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: 2FA Token Code */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyStaffOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs space-y-1">
              <span className="text-neutral-300 block">Authenticating Sentinel Account:</span>
              <span className="text-sky-300 font-bold block">{currentSelectedStaff.name} ({currentSelectedStaff.email})</span>
              <span className="text-[10px] text-neutral-400 block">Locked to: {currentSelectedStaff.badge}</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="text-neutral-300 font-medium">Enter 6-Digit 2FA Staff Token:</label>
                <button
                  type="button"
                  onClick={() => setOtpCode('554433')}
                  className="text-[11px] text-sky-400 hover:underline cursor-pointer"
                >
                  Autofill (554433)
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="554433"
                className="w-full bg-[#0B0D13] border border-sky-500/40 focus:border-sky-400 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-white outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-1/3 py-2.5 px-4 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Verify & Enter Console</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
