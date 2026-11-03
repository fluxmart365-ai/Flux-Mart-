import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_LOGO } from '../../data/mockData';
import { Role } from '../../types';
import {
  Smartphone,
  Mail,
  CheckCircle2,
  X,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Lock,
  Sparkles,
  ShoppingBag,
  Store,
  User,
  ShieldCheck,
  Shield,
  Check
} from 'lucide-react';

export const CustomerLoginModal: React.FC = () => {
  const {
    otpModalOpen,
    setOtpModalOpen,
    loginWithPhoneOtp,
    language,
    setRole,
    loginAsSuperAdmin,
    loginAsSubAdmin,
    openLegalModal,
    subAdmins
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Role selection during registration: 'customer' | 'seller'
  const [chosenRole, setChosenRole] = useState<Role>('customer');

  // Form fields
  const [phoneNumber, setPhoneNumber] = useState('1799887766');
  const [email, setEmail] = useState('rahim.chowdhury@fluxmart.bd');
  const [password, setPassword] = useState('flux2026');
  const [fullName, setFullName] = useState('Rahim Chowdhury');
  const [shopName, setShopName] = useState('Royal Heritage BD');

  // Step for OTP: 'input' | 'otp'
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otpFlowType, setOtpFlowType] = useState<'customer_phone' | 'super_admin_email' | 'sub_admin_auth'>('customer_phone');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  if (!otpModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid 10-11 digit Bangladeshi mobile number.');
      return;
    }
    setError('');

    // Check if phone matches sub-admin phone
    const cleanPhone = `+880${phoneNumber}`;
    const matchedSub = subAdmins.find(
      (s) => s.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
    );
    if (matchedSub) {
      setOtpFlowType('sub_admin_auth');
    } else {
      setOtpFlowType('customer_phone');
    }
    setPhoneStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    // 1. Secret Master Super-Admin verification
    if (otpFlowType === 'super_admin_email') {
      if (otpCode === '778800' || otpCode === '482910') {
        loginAsSuperAdmin();
        resetModal();
        return;
      } else {
        setError('Invalid Super-Admin OTP. Use authorization code 778800.');
        return;
      }
    }

    // 2. Sub-Admin Squad verification
    if (otpFlowType === 'sub_admin_auth') {
      if (otpCode === '554433' || otpCode === '778800' || otpCode === '482910') {
        loginAsSubAdmin(email || `+880${phoneNumber}`);
        resetModal();
        return;
      } else {
        setError('Invalid Sub-Admin OTP. Use squad authorization code 554433.');
        return;
      }
    }

    // 3. Regular Customer / Seller verification
    const phone = `+880${phoneNumber}`;
    loginWithPhoneOtp(
      phone,
      fullName || (chosenRole === 'seller' ? shopName : 'Valued Customer'),
      chosenRole,
      chosenRole === 'seller' ? shopName : undefined,
      email || undefined
    );
    resetModal();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check for Secret Master Admin Email
    if (email.trim().toLowerCase() === 'fluxmart365@gmail.com') {
      setError('');
      setOtpFlowType('super_admin_email');
      setPhoneStep('otp');
      return;
    }

    // Check for Sub-Admin Emails
    const matchedSub = subAdmins.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
    if (matchedSub) {
      setError('');
      setOtpFlowType('sub_admin_auth');
      setPhoneStep('otp');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setError('');
    loginWithPhoneOtp(
      phoneNumber ? `+880${phoneNumber}` : '+8801700000000',
      fullName || (chosenRole === 'seller' ? shopName : email.split('@')[0]),
      chosenRole,
      chosenRole === 'seller' ? shopName : undefined,
      email
    );
    resetModal();
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      if (provider === 'google') {
        loginWithPhoneOtp(
          '+8801711223344',
          'Tanvir Ahmed (Google)',
          chosenRole,
          chosenRole === 'seller' ? 'Tanvir Official Shop' : undefined,
          'tanvir.google@gmail.com'
        );
      } else {
        loginWithPhoneOtp(
          '+8801822334455',
          'Nusrat Jahan (Facebook)',
          chosenRole,
          chosenRole === 'seller' ? 'Nusrat Boutique' : undefined,
          'nusrat.fb@yahoo.com'
        );
      }
      resetModal();
    }, 1000);
  };

  const handleDemoFastLogin = (demoRole: Role) => {
    if (demoRole === 'seller') {
      loginWithPhoneOtp(
        '+8801712345678',
        'Tanvir Hossain',
        'seller',
        'Aura Lifestyle & Tech BD',
        'tanvir@auralifestyle.bd'
      );
    } else {
      loginWithPhoneOtp(
        '+8801799887766',
        'Rahim Chowdhury',
        'customer',
        undefined,
        'rahim.chowdhury@fluxmart.bd'
      );
    }
    resetModal();
  };

  const resetModal = () => {
    setPhoneStep('input');
    setOtpFlowType('customer_phone');
    setOtpCode('');
    setError('');
    setOtpModalOpen(false);
  };

  const fillQuickCode = () => {
    if (otpFlowType === 'super_admin_email') {
      setOtpCode('778800');
    } else if (otpFlowType === 'sub_admin_auth') {
      setOtpCode('554433');
    } else {
      setOtpCode('482910');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Logo & Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/40 shadow-md shadow-amber-500/20 mb-3">
            <img src={OFFICIAL_LOGO} alt="FLUX MART" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            FLUX <span className="text-gold-gradient">MART</span>
          </h2>
          <p className="text-xs text-amber-200/80 mt-0.5">
            The Premium Global Marketplace · Bangladesh Gateway
          </p>
        </div>

        {/* Sign In vs Register Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0B0D13] border border-neutral-800 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setPhoneStep('input');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-gold-gradient text-slate-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setPhoneStep('input');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gold-gradient text-slate-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create New Account'}
          </button>
        </div>

        {/* Role Selection Onboarding Step (Explicit Customer Sign In vs Seller/Merchant Sign In) */}
        <div className="mb-4 space-y-2">
          <label className="text-xs font-semibold text-neutral-300 block flex items-center justify-between">
            <span>
              {activeTab === 'signin'
                ? language === 'bn'
                  ? 'সাইন ইন ভূমিকা নির্বাচন করুন:'
                  : 'Select Account Role to Sign In:'
                : language === 'bn'
                ? 'আপনার ভূমিকা নির্বাচন করুন (Role Onboarding):'
                : 'Select Your Account Role:'}
            </span>
            <span className="text-[10px] text-amber-400 font-mono">
              {chosenRole === 'seller' ? 'Merchant Mode' : 'Customer Mode'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Customer Role */}
            <button
              type="button"
              onClick={() => setChosenRole('customer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                chosenRole === 'customer'
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                  : 'bg-[#0B0D13] border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${chosenRole === 'customer' ? 'bg-amber-400 text-slate-950' : 'bg-neutral-800 text-neutral-300'}`}>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                {chosenRole === 'customer' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <span className="text-xs font-bold text-white block">
                {language === 'bn' ? 'ক্রেতা (Customer)' : 'Customer Sign In'}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2 leading-tight">
                {language === 'bn'
                  ? 'কেনাকাটা, ক্যাশ অন ডেলিভারি ও রিলস'
                  : 'Shop VIP deals, earn coins & order tracking'}
              </span>
            </button>

            {/* Seller / Merchant Role */}
            <button
              type="button"
              onClick={() => setChosenRole('seller')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                chosenRole === 'seller'
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                  : 'bg-[#0B0D13] border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${chosenRole === 'seller' ? 'bg-amber-400 text-slate-950' : 'bg-neutral-800 text-neutral-300'}`}>
                  <Store className="w-4 h-4" />
                </div>
                {chosenRole === 'seller' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <span className="text-xs font-bold text-white block">
                {language === 'bn' ? 'মার্চেন্ট / বিক্রেতা' : 'Merchant Sign In'}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2 leading-tight">
                {language === 'bn'
                  ? 'পণ্য বিক্রি, ডিজিটাল ওয়ালেট ও ক্যাটাগরি'
                  : 'Manage store catalog, wallet & payouts'}
              </span>
            </button>
          </div>
        </div>

        {/* Method Switcher: Bangladeshi Phone (+880 OTP) vs Email */}
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-2">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setError('');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-neutral-800 text-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'মোবাইল নম্বর (+৮৮০)' : 'Mobile Phone (+880)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError('');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              authMethod === 'email'
                ? 'bg-neutral-800 text-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</span>
          </button>
        </div>

        {/* If in OTP Verification Mode (Phone or Secret Super-Admin / Sub-Admin Email OTP) */}
        {phoneStep === 'otp' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Contextual Clearance Banner */}
            {otpFlowType === 'super_admin_email' ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/50 text-left">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Master Super-Admin Clearance Gate</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
                  High-security master address recognized (<span className="text-amber-300 font-mono">fluxmart365@gmail.com</span>). Absolute ecosystem authority granted upon verification.
                </p>
              </div>
            ) : otpFlowType === 'sub_admin_auth' ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-transparent border border-sky-500/40 text-left">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>Sub-Admin Squad Terminal Authorization</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
                  Specialized operations squad account detected (<span className="text-sky-300 font-mono">{email || phoneNumber}</span>). Role-based console routing will be activated.
                </p>
              </div>
            ) : null}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  {otpFlowType === 'super_admin_email'
                    ? 'Enter 6-Digit Master Security Code'
                    : otpFlowType === 'sub_admin_auth'
                    ? 'Enter 6-Digit Squad Authorization Code'
                    : 'Enter 6-Digit SMS OTP'}
                </label>
                <button
                  type="button"
                  onClick={fillQuickCode}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
                >
                  {otpFlowType === 'super_admin_email'
                    ? 'Auto-fill Master OTP (778800)'
                    : otpFlowType === 'sub_admin_auth'
                    ? 'Auto-fill Squad OTP (554433)'
                    : 'Auto-fill demo (482910)'}
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="• • • • • •"
                autoFocus
                className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-xl font-mono text-white outline-none"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block text-center">
                {otpFlowType === 'super_admin_email'
                  ? 'Verification key dispatched via encrypted mail to fluxmart365@gmail.com'
                  : otpFlowType === 'sub_admin_auth'
                  ? `Security clearance dispatched to ${email || phoneNumber}`
                  : `Verification code dispatched via SMS to +880 ${phoneNumber}`}
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-[11px]">
                <RefreshCw className="w-3 h-3" />
                Resend code in {countdown}s
              </span>
              <button
                type="button"
                onClick={() => setPhoneStep('input')}
                className="text-amber-400 hover:underline text-[11px] cursor-pointer"
              >
                Change Credential
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {otpFlowType === 'super_admin_email'
                  ? 'Verify & Enter Super-Admin Console'
                  : otpFlowType === 'sub_admin_auth'
                  ? 'Verify & Launch Sub-Admin Dashboard'
                  : 'Verify & Launch Account'}
              </span>
            </button>
          </form>
        ) : authMethod === 'phone' ? (
          /* OPTION 1: PHONE NUMBER (+880) OTP FLOW */
          <form onSubmit={handlePhoneSubmit} className="space-y-3.5">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  {chosenRole === 'seller' ? 'Merchant Contact Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  required
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            )}

            {activeTab === 'register' && chosenRole === 'seller' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Shop / Store Name (দোকানের নাম)
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Nawab Royal Crafts"
                  required
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Bangladeshi Mobile Phone (+880)
              </label>
              <div className="flex items-center rounded-xl bg-[#0B0D13] border border-neutral-700 focus-within:border-amber-400 overflow-hidden">
                <span className="px-3 py-2.5 text-xs font-semibold text-amber-400 border-r border-neutral-800 bg-white/5 font-mono">
                  +880
                </span>
                <input
                  type="tel"
                  maxLength={11}
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(val);
                    setError('');
                  }}
                  placeholder="17XXXXXXXX"
                  className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white font-mono outline-none"
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Instant SMS OTP will be sent to this mobile number
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {language === 'bn'
                  ? chosenRole === 'seller'
                    ? 'মার্চেন্ট ওটিপি পাঠান'
                    : 'ওটিপি কোড পাঠান'
                  : chosenRole === 'seller'
                  ? 'Continue with Merchant Phone OTP'
                  : 'Continue with Phone OTP'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* OPTION 2: EMAIL & PASSWORD FLOW */
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  {chosenRole === 'seller' ? 'Merchant Contact Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  required
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            )}

            {activeTab === 'register' && chosenRole === 'seller' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Shop / Store Name (দোকানের নাম)
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Nawab Royal Crafts"
                  required
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-300">
                  Email Address
                </label>
                <button
                  type="button"
                  onClick={() => setEmail('fluxmart365@gmail.com')}
                  className="text-[10px] text-amber-400/90 hover:underline"
                >
                  Master Email Autofill
                </button>
              </div>
              <div className="flex items-center rounded-xl bg-[#0B0D13] border border-neutral-700 focus-within:border-amber-400 overflow-hidden">
                <span className="px-3 py-2.5 text-xs text-neutral-400 border-r border-neutral-800">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com (or fluxmart365@gmail.com)"
                  required
                  className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white outline-none"
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Master admin email triggers secure verification OTP
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Password
              </label>
              <div className="flex items-center rounded-xl bg-[#0B0D13] border border-neutral-700 focus-within:border-amber-400 overflow-hidden">
                <span className="px-3 py-2.5 text-xs text-neutral-400 border-r border-neutral-800">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {activeTab === 'signin'
                  ? chosenRole === 'seller'
                    ? 'Sign In to Seller Central'
                    : 'Sign In as Customer'
                  : chosenRole === 'seller'
                  ? 'Register as Merchant'
                  : 'Register as Customer'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Fast Login Switches */}
        <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-0.5">
            <span>Fast Role Verification & Demo Access:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFastLogin('customer')}
              className="py-2 px-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFastLogin('seller')}
              className="py-2 px-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Store className="w-3 h-3 text-amber-400" />
              <span>Merchant Demo</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
            <span className="bg-[#131722] px-3">or continue with social ID</span>
          </div>
        </div>

        {/* Prominent Social Login Buttons (Google & Facebook) at the bottom */}
        <div className="space-y-2">
          {/* Google Button */}
          <button
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocialLogin('google')}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{socialLoading === 'google' ? 'Connecting Google Account...' : 'Continue with Google'}</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocialLogin('facebook')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{socialLoading === 'facebook' ? 'Connecting Facebook...' : 'Continue with Facebook'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 text-center text-[10px] text-neutral-500 leading-relaxed">
          <span>By continuing, you agree to FLUX MART's </span>
          <button
            type="button"
            onClick={() => openLegalModal('terms')}
            className="text-amber-400 hover:underline cursor-pointer font-medium"
          >
            Terms of Service
          </button>
          <span>, </span>
          <button
            type="button"
            onClick={() => openLegalModal('privacy')}
            className="text-amber-400 hover:underline cursor-pointer font-medium"
          >
            Privacy Policy
          </button>
          <span> & </span>
          <button
            type="button"
            onClick={() => openLegalModal('dbid')}
            className="text-amber-400 hover:underline cursor-pointer font-medium"
          >
            Ministry DBID Compliance
          </button>.
        </div>
      </div>
    </div>
  );
};

export const PhoneOtpModal = CustomerLoginModal;
