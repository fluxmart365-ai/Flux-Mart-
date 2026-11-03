import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  CheckCircle2,
  X,
  Radio,
  Send,
  RefreshCw,
  Clock,
  Filter,
  ShieldCheck,
  Zap,
  PhoneCall
} from 'lucide-react';
import { SmsGatewayLog } from '../../types';

export const SmsGatewayViewerModal: React.FC = () => {
  const {
    isSmsViewerOpen,
    setIsSmsViewerOpen,
    smsLogs,
    sendSms
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'otp' | 'order_update' | 'payout_alert' | 'advance_fee'>('all');
  const [testPhone, setTestPhone] = useState('01799887766');
  const [testMessage, setTestMessage] = useState('FLUX MART: Your order has been dispatched via Pathao Express.');
  const [testType, setTestType] = useState<SmsGatewayLog['type']>('order_update');
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isSmsViewerOpen) return null;

  const filteredLogs = activeFilter === 'all'
    ? smsLogs
    : smsLogs.filter((l) => l.type === activeFilter);

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;
    const fullPhone = testPhone.startsWith('+880') ? testPhone : `+880${testPhone.replace(/^0+/, '')}`;
    sendSms(fullPhone, testMessage, testType);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 2500);
  };

  const getOperatorColor = (operator: string) => {
    switch (operator) {
      case 'Grameenphone':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'Banglalink':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Robi':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'Teletalk':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-4xl bg-[#131722] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsSmsViewerOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-neutral-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                FLUX Telecom Gateway & SMS Audit Log
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                Sender ID: FLUX-MART
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Live Bangladesh Carrier Dispatches (Grameenphone, Banglalink, Robi, Teletalk)
            </p>
          </div>
        </div>

        {/* Carrier Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-sky-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Grameenphone (017/013)</span>
              <span className="text-sm font-bold font-mono text-sky-400">99.8% Delivered</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          </div>
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Banglalink (019/014)</span>
              <span className="text-sm font-bold font-mono text-amber-400">99.6% Delivered</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-rose-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Robi Axiata (018)</span>
              <span className="text-sm font-bold font-mono text-rose-400">99.5% Delivered</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Teletalk (015)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">98.9% Delivered</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All Logs ({smsLogs.length})
          </button>
          <button
            onClick={() => setActiveFilter('otp')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'otp'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            OTP Clearance
          </button>
          <button
            onClick={() => setActiveFilter('order_update')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'order_update'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Parcel Tracking
          </button>
          <button
            onClick={() => setActiveFilter('payout_alert')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'payout_alert'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Merchant Payouts
          </button>
          <button
            onClick={() => setActiveFilter('advance_fee')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'advance_fee'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            bKash/Nagad Advance Fee
          </button>
        </div>

        {/* Scrollable Logs Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-4">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs">
              No gateway messages matching this filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#0B0D13] border border-neutral-800 hover:border-neutral-700 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getOperatorColor(log.operator)}`}>
                      {log.operator}
                    </span>
                    <span className="font-mono text-amber-300 font-semibold">{log.recipientPhone}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({log.gatewayRef})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DELIVERED</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-200 bg-neutral-900/60 p-2.5 rounded-xl font-mono leading-relaxed border border-neutral-800/60">
                  {log.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Test SMS Dispatcher Bar */}
        <form onSubmit={handleSendTestSms} className="p-3.5 rounded-2xl bg-[#0B0D13] border border-amber-500/30 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-neutral-400 shrink-0 font-medium">Test SMS:</span>
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-28 sm:w-32 bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none"
            />
          </div>

          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type custom SMS notification message..."
            className="flex-1 w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Carrier SMS</span>
          </button>

          {sendSuccess && (
            <span className="text-[11px] text-emerald-400 font-semibold animate-pulse shrink-0">
              Dispatched!
            </span>
          )}
        </form>

      </div>
    </div>
  );
};
