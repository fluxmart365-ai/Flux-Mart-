import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { KycDocument, KycStatus } from '../../types';
import {
  X,
  Store,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Building2,
  Smartphone,
  CreditCard,
  FileText,
  AlertTriangle,
  Sparkles,
  Check,
  Camera,
  ScanFace,
  UserCheck,
  RefreshCw
} from 'lucide-react';

interface SellerRegistrationKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 1 | 2 | 3;
}

export const SellerRegistrationKYCModal: React.FC<SellerRegistrationKYCModalProps> = ({
  isOpen,
  onClose,
  initialStep = 1
}) => {
  const {
    sellerProfile,
    updateSellerProfile,
    updateSellerKyc,
    simulateKycStatusChange,
    language
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(initialStep);

  // Step 1: Basic Shop & Banking Details
  const [shopName, setShopName] = useState(sellerProfile.shopName || 'Aura Lifestyle & Tech BD');
  const [ownerName, setOwnerName] = useState(sellerProfile.ownerName || 'Tanvir Hossain');
  const [phone, setPhone] = useState(sellerProfile.phone || '+8801712345678');
  const [email, setEmail] = useState(sellerProfile.email || 'tanvir@auralifestyle.bd');
  const [businessCategory, setBusinessCategory] = useState(sellerProfile.businessCategory || 'Consumer Electronics & Luxury Fashion');
  const [warehouseLocation, setWarehouseLocation] = useState(sellerProfile.warehouseLocation || 'Tejgaon Industrial Area, Dhaka');
  const [payoutMethod, setPayoutMethod] = useState<'bkash_merchant' | 'nagad_merchant' | 'bank_transfer'>(
    sellerProfile.payoutMethod || 'bkash_merchant'
  );
  const [payoutAccountDetails, setPayoutAccountDetails] = useState(
    sellerProfile.payoutAccountDetails || '01712-345678 (bKash Merchant Account)'
  );
  const [bankName, setBankName] = useState(sellerProfile.bankName || 'Dutch Bangla Bank Ltd (DBBL)');
  const [bankAccountNumber, setBankAccountNumber] = useState(sellerProfile.bankAccountNumber || '110.120.482910');
  const [bankRoutingNumber, setBankRoutingNumber] = useState(sellerProfile.bankRoutingNumber || '090273415');

  // Step 2: Mandatory Government Identity Document Gate
  const [documentType, setDocumentType] = useState<'nid' | 'passport' | 'driving_license'>('nid');
  const [documentNumber, setDocumentNumber] = useState(sellerProfile.kycDocument?.documentNumber || '1992269550001429');
  const [fullNameBengali, setFullNameBengali] = useState(sellerProfile.kycDocument?.fullNameBengali || 'তানভীর হোসেন');
  const [fullNameEnglish, setFullNameEnglish] = useState(sellerProfile.kycDocument?.fullNameEnglish || 'Tanvir Hossain');
  const [dateOfBirth, setDateOfBirth] = useState(sellerProfile.kycDocument?.dateOfBirth || '1992-08-14');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState(sellerProfile.kycDocument?.tradeLicenseNumber || 'TRAD/DSCC/019482/2024');
  const [frontImage, setFrontImage] = useState(sellerProfile.kycDocument?.frontImage || '/assets/aistudio/1790658673053_abd6ce4e.jpg');
  const [backImage, setBackImage] = useState(sellerProfile.kycDocument?.backImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80');

  // Step 3: Mandatory Face Scan / Biometric Selfie Matching
  const [faceScanImage, setFaceScanImage] = useState(
    sellerProfile.kycDocument?.faceScanImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [faceMatchSuccess, setFaceMatchSuccess] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fileInputRefFront = useRef<HTMLInputElement>(null);
  const fileInputRefBack = useRef<HTMLInputElement>(null);
  const fileInputRefFace = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFrontImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFaceScanImage(event.target.result as string);
          triggerFaceScanAnimation();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFaceScanAnimation = () => {
    setIsScanningFace(true);
    setTimeout(() => {
      setIsScanningFace(false);
      setFaceMatchSuccess(true);
    }, 1200);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile({
      shopName,
      ownerName,
      phone,
      email,
      businessCategory,
      warehouseLocation,
      payoutMethod,
      payoutAccountDetails,
      bankName,
      bankAccountNumber,
      bankRoutingNumber
    });
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleStep3FinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const doc: KycDocument = {
      documentType,
      documentNumber,
      fullNameBengali,
      fullNameEnglish,
      dateOfBirth,
      tradeLicenseNumber,
      frontImage,
      backImage,
      faceScanImage,
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      updateSellerKyc(doc);
      setIsSubmitting(false);
      setSuccessToast('All 3 verification steps submitted! Your identity is now under Admin review.');
      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 2200);
    }, 1200);
  };

  const handleSimulateStatus = (status: KycStatus) => {
    simulateKycStatusChange(status);
    setSuccessToast(`KYC status simulated to: ${status.toUpperCase()}`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            {step === 1 ? (
              <Store className="w-6 h-6" />
            ) : step === 2 ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ScanFace className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>
                {step === 1
                  ? 'Step 1: Shop & Payout Info'
                  : step === 2
                  ? 'Step 2: NID & Trade License'
                  : 'Step 3: Biometric Face Scan Gate'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                Step {step} of 3
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {step === 1
                ? 'Shop profile, business category, and MFS / Bank payout account'
                : step === 2
                ? 'Upload clear front & back copies of your government identity document'
                : 'Mandatory face matching to prevent identity fraud under Bangladesh DBID rules'}
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar (3 Steps) */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div
            onClick={() => setStep(1)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              step === 1
                ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                : 'bg-[#0B0D13] border-neutral-800 text-neutral-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-[11px] flex items-center justify-center">
              1
            </span>
            <span className="truncate">1. Shop & Payout</span>
          </div>

          <div
            onClick={() => setStep(2)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              step === 2
                ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                : 'bg-[#0B0D13] border-neutral-800 text-neutral-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-[11px] flex items-center justify-center">
              2
            </span>
            <span className="truncate">2. NID Document</span>
          </div>

          <div
            onClick={() => setStep(3)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              step === 3
                ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                : 'bg-[#0B0D13] border-neutral-800 text-neutral-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-[11px] flex items-center justify-center">
              3
            </span>
            <span className="truncate">3. Face Biometrics</span>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* ================= STEP 1: BASIC SHOP & PAYOUT INFO ================= */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Shop Name (দোকান / প্রতিষ্ঠানের নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Aura Lifestyle & Tech BD"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Owner Full Name (স্বত্বাধিকারীর নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Official Phone Number (+880) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Business Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@domain.bd"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Business Category
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                >
                  <option value="Consumer Electronics & Luxury Fashion">Consumer Electronics & Luxury Fashion</option>
                  <option value="Artisanal Handloom & Traditional Silk">Artisanal Handloom & Traditional Silk</option>
                  <option value="Organic Phytoceuticals & Healthcare">Organic Phytoceuticals & Healthcare</option>
                  <option value="Heritage Brass & Luxury Household">Heritage Brass & Luxury Household</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Warehouse Location (Dhaka / CTG)
                </label>
                <input
                  type="text"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  placeholder="e.g. Tejgaon Industrial Area, Dhaka"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none transition-colors"
                />
              </div>
            </div>

            {/* Payout & Disbursement Configuration */}
            <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                  <CreditCard className="w-4 h-4" />
                  <span>Revenue Payout & Disbursement Channel</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Weekly Automated Settlement
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPayoutMethod('bkash_merchant')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payoutMethod === 'bkash_merchant'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  bKash Merchant
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('nagad_merchant')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payoutMethod === 'nagad_merchant'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Nagad Merchant
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('bank_transfer')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payoutMethod === 'bank_transfer'
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Bank BEFTN
                </button>
              </div>

              {payoutMethod === 'bank_transfer' ? (
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="DBBL / City Bank / BRAC"
                      className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Account Number</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="110.120.XXXX"
                      className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Routing Number</label>
                    <input
                      type="text"
                      value={bankRoutingNumber}
                      onChange={(e) => setBankRoutingNumber(e.target.value)}
                      placeholder="9-digit routing"
                      className="w-full bg-[#131722] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    {payoutMethod === 'bkash_merchant' ? 'bKash Merchant Wallet Number' : 'Nagad Merchant Wallet Number'}
                  </label>
                  <input
                    type="text"
                    value={payoutAccountDetails}
                    onChange={(e) => setPayoutAccountDetails(e.target.value)}
                    className="w-full bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-500">
                Encrypted & compliant with Bangladesh Bank MFS guidelines.
              </span>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next: Document Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: MANDATORY NID & TRADE LICENSE GATE ================= */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span>Under Bangladesh E-Commerce Directives, your shop requires clear front/back scans of your </span>
                <strong className="text-white">National ID (NID)</strong>
                <span> or </span>
                <strong className="text-white">Trade License</strong>
                <span>. Next, you will complete the facial match scan.</span>
              </div>
            </div>

            {/* Document Type Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'nid', label: 'National ID (NID)' },
                { id: 'passport', label: 'Passport (ই-পাসপোর্ট)' },
                { id: 'driving_license', label: 'Trade License (ট্রেড লাইসেন্স)' }
              ].map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setDocumentType(doc.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    documentType === doc.id
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold'
                      : 'bg-[#0B0D13] border-neutral-800 text-neutral-400'
                  }`}
                >
                  {doc.label}
                </button>
              ))}
            </div>

            {/* Structured Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  National ID / Passport Number *
                </label>
                <input
                  type="text"
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="10-digit smart or 17-digit NID"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Trade License Number (ট্রেড লাইসেন্স)
                </label>
                <input
                  type="text"
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  placeholder="TRAD/DNCC/019482/2024"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Full Name in Bengali (জাতীয় পরিচয়পত্র অনুযায়ী) *
                </label>
                <input
                  type="text"
                  required
                  value={fullNameBengali}
                  onChange={(e) => setFullNameBengali(e.target.value)}
                  placeholder="যেমন: তানভীর হোসেন"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Full Name in English (as per NID) *
                </label>
                <input
                  type="text"
                  required
                  value={fullNameEnglish}
                  onChange={(e) => setFullNameEnglish(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            {/* Front & Back Document Upload Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Front Image */}
              <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">
                    Front Side Photo (সামনের অংশ) *
                  </span>
                  {frontImage && (
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <div className="relative aspect-[16/9] rounded-xl bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center">
                  {frontImage ? (
                    <img src={frontImage} alt="NID Front" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3 text-neutral-500 text-xs">
                      <FileText className="w-6 h-6 mx-auto mb-1 text-neutral-400" />
                      <span>Upload Front NID Photo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefFront}
                  onChange={handleFrontUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefFront.current?.click()}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Front Photo</span>
                </button>
              </div>

              {/* Back Image */}
              <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">
                    Back Side Photo (পেছনের অংশ)
                  </span>
                  {backImage && (
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <div className="relative aspect-[16/9] rounded-xl bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center">
                  {backImage ? (
                    <img src={backImage} alt="NID Back" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3 text-neutral-500 text-xs">
                      <FileText className="w-6 h-6 mx-auto mb-1 text-neutral-400" />
                      <span>Upload Back NID Photo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefBack}
                  onChange={handleBackUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefBack.current?.click()}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Back Photo</span>
                </button>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Shop Details</span>
              </button>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Proceed to Step 3: Face Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: MANDATORY FACE SCAN & BIOMETRICS ================= */}
        {step === 3 && (
          <form onSubmit={handleStep3FinalSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#131722] to-amber-500/10 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-neutral-200">
              <ScanFace className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Mandatory Biometric Face Match (DBID Directive)</span>
                <span>Upload or snap a clear forward-looking selfie photo. Our system compares this against your National ID document image to verify account ownership.</span>
              </div>
            </div>

            {/* Face Scan Viewport Simulation */}
            <div className="p-5 rounded-2xl bg-[#0B0D13] border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-amber-500/50 shadow-2xl bg-neutral-900 group">
                <img
                  src={faceScanImage}
                  alt="Biometric Face Scan Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Simulated Biometric Oval & Scanner Line */}
                <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-full pointer-events-none" />
                
                {isScanningFace && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 shadow-lg shadow-emerald-400" />
                )}

                <div className="absolute bottom-2 inset-x-0 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-emerald-400 font-mono font-bold">
                    {isScanningFace ? 'Analyzing Biometrics...' : 'Biometric Match: 99.4%'}
                  </span>
                </div>
              </div>

              {/* Guidelines */}
              <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-[10px] text-neutral-400">
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-white font-medium block">✓ Forward Look</span>
                  <span>Direct face camera</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-white font-medium block">✓ Good Lighting</span>
                  <span>No dark shadows</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-white font-medium block">✓ Clear Eyes</span>
                  <span>No sunglasses</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 w-full">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefFace}
                  onChange={handleFaceUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefFace.current?.click()}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload / Snap Selfie Photo</span>
                </button>

                <button
                  type="button"
                  onClick={triggerFaceScanAnimation}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Re-run Biometric Scan Animation"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isScanningFace ? 'animate-spin' : ''}`} />
                  <span>Scan Check</span>
                </button>
              </div>
            </div>

            {/* Quick Testing Simulator Bar */}
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px] font-mono">
                Admin Simulator Desk:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateStatus('verified')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 cursor-pointer"
                >
                  ⚡ Instant Admin Approval
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateStatus('pending')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] border border-amber-500/40 cursor-pointer"
                >
                  Set In-Review (Pending)
                </button>
              </div>
            </div>

            {/* Step 3 Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to NID Step</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Submitting for Admin Review...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Submit All 3 Steps for Admin Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
