import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Store,
  Shield,
  Plus,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AccountSwitcherModal: React.FC = () => {
  const {
    isAccountSwitcherOpen,
    setIsAccountSwitcherOpen,
    accounts,
    currentAccountId,
    switchAccount,
    logoutCustomer,
    isLoggedIn,
    setOtpModalOpen,
    language
  } = useApp();

  if (!isAccountSwitcherOpen) return null;

  const currentAcc = accounts.find((a) => a.id === currentAccountId) || accounts[0];

  const handleSwitch = (id: string) => {
    switchAccount(id);
  };

  const handleAddNew = () => {
    setIsAccountSwitcherOpen(false);
    setOtpModalOpen(true);
  };

  const handleLogout = () => {
    logoutCustomer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-auto overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={() => setIsAccountSwitcherOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {language === 'bn' ? 'অ্যাকাউন্ট পরিবর্তন ও প্রোফাইল' : 'Switch or Add Account'}
            </h3>
            <p className="text-xs text-neutral-400">
              {language === 'bn'
                ? 'আপনার ক্রেতা ও বিক্রেতা প্রোফাইল পরিচালনা করুন'
                : 'Manage Customer & Merchant profiles effortlessly'}
            </p>
          </div>
        </div>

        {/* Current Active Account Card */}
        {isLoggedIn && currentAcc && (
          <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-amber-500/40 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={currentAcc.avatar}
                  alt={currentAcc.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0D13]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate">{currentAcc.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {currentAcc.role === 'seller' ? 'Merchant' : 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 truncate">
                  {currentAcc.shopName || currentAcc.phone || currentAcc.email}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active</span>
            </span>
          </div>
        )}

        {/* Switch to Other Accounts */}
        <div className="space-y-2 mb-5">
          <label className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block px-1">
            {language === 'bn' ? 'সংরক্ষিত প্রোফাইলসমূহ' : 'Saved Accounts'}
          </label>

          {accounts
            .filter((acc) => !isLoggedIn || acc.id !== currentAccountId)
            .map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSwitch(acc.id)}
                className="w-full p-3 rounded-xl bg-[#0B0D13]/70 hover:bg-[#0B0D13] border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-700 group-hover:border-amber-400/50"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                        {acc.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-neutral-800 text-neutral-400">
                        {acc.role === 'seller' ? 'Merchant' : 'Customer'}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 block truncate">
                      {acc.shopName || acc.phone || acc.email}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0" />
              </button>
            ))}
        </div>

        {/* Actions: Add Account & Log Out */}
        <div className="space-y-2.5 pt-2 border-t border-neutral-800">
          <button
            onClick={handleAddNew}
            className="w-full py-2.5 px-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট যোগ করুন' : 'Add New Account (Customer or Merchant)'}</span>
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{language === 'bn' ? 'লগআউট করুন (অতিথি মোড)' : 'Log Out (Continue as Guest)'}</span>
            </button>
          ) : (
            <button
              onClick={handleAddNew}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'সাইন ইন করুন' : 'Sign In Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
