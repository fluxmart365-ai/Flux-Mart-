import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerAdminMessage } from '../../types';
import {
  X,
  Send,
  ShieldCheck,
  Lock,
  Headphones,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  AlertTriangle,
  FileText,
  PhoneCall,
  UserCheck
} from 'lucide-react';

export const SellerAdminMessengerModal: React.FC = () => {
  const {
    isSellerAdminMessengerOpen,
    setIsSellerAdminMessengerOpen,
    sellerProfile,
    sellerAdminMessages,
    sendSellerAdminMessage,
    language
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SellerAdminMessage['category']>('general');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [sellerAdminMessages, isSellerAdminMessengerOpen]);

  if (!isSellerAdminMessengerOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendSellerAdminMessage(inputMessage.trim(), selectedCategory);
    setInputMessage('');
  };

  const handleQuickChip = (text: string, cat: SellerAdminMessage['category']) => {
    setSelectedCategory(cat);
    sendSellerAdminMessage(text, cat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#131722] border border-amber-500/40 rounded-3xl shadow-2xl text-white my-auto overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0B0D13] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0D13] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base leading-tight">
                  Super-Admin Support & Compliance Desk
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  <Lock className="w-2.5 h-2.5" />
                  <span>E2E ENCRYPTED</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Connecting <strong className="text-amber-400">{sellerProfile.shopName}</strong> with FLUX Executive Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+8801800358923"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold border border-neutral-700 transition-colors"
              title="Super-Admin Direct Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+880 1800-FLUX</span>
            </a>

            <button
              onClick={() => setIsSellerAdminMessengerOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Priority Quick Action Chips */}
        <div className="p-3 bg-[#0E111A] border-b border-neutral-800/80 overflow-x-auto flex items-center gap-2 text-xs scrollbar-thin">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold shrink-0">
            Quick Inquiries:
          </span>

          <button
            type="button"
            onClick={() =>
              handleQuickChip(
                'Requesting priority clearance for pending wallet balance of ৳12,450.',
                'payout'
              )
            }
            className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span>Urgent Payout Disbursement</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickChip(
                'Submitted updated Trade License & Smart NID. Please expedite verification.',
                'kyc'
              )
            }
            className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-[11px] font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3 h-3 text-amber-400" />
            <span>Accelerate KYC Review</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickChip(
                'Reporting courier discrepancy with Pathao Parcel Waybill #PT-89421.',
                'dispute'
              )
            }
            className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-[11px] font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Courier Delivery Dispute</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickChip(
                'Inquiring about catalog listing approval for new luxury silk collection.',
                'listing'
              )
            }
            className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-[11px] font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span>Listing Approval</span>
          </button>
        </div>

        {/* Chat Timeline */}
        <div ref={chatScrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Encryption Security Banner */}
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Direct session encrypted under <strong>FLUX-SEC-256 Banking Protocol</strong>. Messages are stored for compliance audit under DGDA and Bangladesh Bank e-commerce regulations.
            </span>
          </div>

          {sellerAdminMessages.map((msg) => {
            const isSeller = msg.sender === 'seller';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 px-1">
                  <span className="font-bold text-neutral-300">
                    {msg.senderName}
                  </span>
                  {msg.senderRole && (
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-amber-300 font-mono">
                      {msg.senderRole}
                    </span>
                  )}
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isSeller
                      ? 'bg-gold-gradient text-slate-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                      : 'bg-[#0B0D13] border border-neutral-800 text-neutral-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-[#0B0D13] border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type confidential message to FLUX Super-Admin desk..."
            className="flex-1 bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="py-3 px-5 rounded-2xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
