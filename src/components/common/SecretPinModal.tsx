import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle } from 'lucide-react';

export const SecretPinModal: React.FC = () => {
  const { secretPinModalOpen, setSecretPinModalOpen, verifyAdminPin, language } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!secretPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPin(pin);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2500);
    } else {
      setPin('');
      setError(false);
    }
  };

  const handleQuickPin = (code: string) => {
    setPin(code);
    verifyAdminPin(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-2xl p-6 shadow-2xl shadow-amber-950/50 text-white">
        {/* Close Button */}
        <button
          onClick={() => setSecretPinModalOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Lock Icon */}
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#D4AF37] mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <div className="mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
            Confidential Authorization Gate
          </span>
          <h2 className="text-xl font-bold text-white">Secret Admin Console</h2>
        </div>

        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          {language === 'bn'
            ? 'এই প্যানেলটি জনসাধারণের জন্য গোপন। মাস্টার অ্যাডমিন পিন দিয়ে প্রবেশ করুন।'
            : 'Access restricted to marketplace operations managers. Enter the master 4-digit security PIN.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Master Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="• • • •"
                autoFocus
                className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-lg font-mono text-white outline-none transition-colors"
              />
              <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Invalid master PIN. Try default: 7788</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm tracking-wide shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
          >
            Authorize Admin Access
          </button>
        </form>

        {/* Demo Fast Unlock Hint */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Master PIN Demo:</span>
          </span>
          <button
            type="button"
            onClick={() => handleQuickPin('7788')}
            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-amber-300 font-mono text-xs transition-colors cursor-pointer"
          >
            Auto-fill: 7788
          </button>
        </div>
      </div>
    </div>
  );
};
