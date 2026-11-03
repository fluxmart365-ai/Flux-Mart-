import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Store,
  ChevronRight,
  Sparkles,
  Bot
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  time: string;
  ticketId?: string;
}

export const LiveSupportModal: React.FC = () => {
  const {
    isLiveSupportOpen,
    closeLiveSupport,
    supportContext,
    customerName,
    customerPhone,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'whatsapp' | 'dispute'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation based on context
  useEffect(() => {
    if (isLiveSupportOpen) {
      if (supportContext?.defaultTab) {
        setActiveTab(supportContext.defaultTab);
      }
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initialMsgs: ChatMessage[] = [
        {
          id: 'welcome-1',
          sender: 'agent',
          text: `Assalamu Alaikum ${customerName}! Welcome to FLUX MART Priority Concierge & Dispute Desk. I am Sultana Ahmed, your dedicated Senior Support Lead.`,
          time: now
        }
      ];

      if (supportContext?.orderId) {
        initialMsgs.push({
          id: 'ctx-order',
          sender: 'system',
          text: `Inquiry initialized for Order #${supportContext.orderId}${
            supportContext.sellerName ? ` with merchant "${supportContext.sellerName}"` : ''
          }.`,
          time: now
        });
      } else if (supportContext?.sellerName) {
        initialMsgs.push({
          id: 'ctx-seller',
          sender: 'system',
          text: `Connecting you regarding merchant store: "${supportContext.sellerName}".`,
          time: now
        });
      }

      if (supportContext?.initialMessage) {
        initialMsgs.push({
          id: 'ctx-initial',
          sender: 'user',
          text: supportContext.initialMessage,
          time: now
        });
        
        // Auto-reply to initial inquiry
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: 'reply-' + Date.now(),
              sender: 'agent',
              text: `Thank you for sharing this. I have immediately logged Priority Ticket #TK-${Math.floor(100000 + Math.random() * 900000)}. Our admin arbitration team is actively supervising this merchant. How else may I assist you right now?`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              ticketId: `TK-${Math.floor(100000 + Math.random() * 900000)}`
            }
          ]);
        }, 1200);
      }

      setMessages(initialMsgs);
    }
  }, [isLiveSupportOpen, supportContext, customerName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isLiveSupportOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate Agent Sultana typing and responding intelligently
    setTimeout(() => {
      setIsTyping(false);
      let reply = '';
      const t = text.toLowerCase();

      if (t.includes('delay') || t.includes('ship') || t.includes('late') || t.includes('পাঠায়নি')) {
        reply = `We take delivery timelines very seriously! Under FLUX MART Seller Service Level Agreements (SLA), all merchants must hand over parcels to Pathao / RedX within 48 hours. I have dispatched an urgent compliance ping to the merchant. If unfulfilled within 24 hours, your advance payment is 100% refundable immediately.`;
      } else if (t.includes('advance') || t.includes('bkash') || t.includes('nagad') || t.includes('টাকা') || t.includes('delivery fee')) {
        reply = `Your advance delivery fee is held securely in the FLUX Escrow Vault. Sellers cannot access this fee until courier parcel scan is verified. If the order is cancelled before dispatch, your bKash/Nagad wallet is credited automatically.`;
      } else if (t.includes('return') || t.includes('damage') || t.includes('নষ্ট') || t.includes('খারাপ')) {
        reply = `FLUX 7-Day Hassle-Free Return guarantee applies! We will arrange a free doorstep pickup via Pathao Express from your address and process the replacement or full refund without question.`;
      } else {
        reply = `I have documented your request on Ticket #TK-${Math.floor(100000 + Math.random() * 900000)}. Both our Super-Admin dispatch team and the seller have been alerted with high priority. We will ensure this is resolved seamlessly!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketId: `TK-${Math.floor(100000 + Math.random() * 900000)}`
        }
      ]);
    }, 1200);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello FLUX MART Support Team, I am ${customerName} (${customerPhone || 'Customer'}). I need urgent assistance regarding ${
      supportContext?.orderId ? `Order #${supportContext.orderId}` : 'an order inquiry'
    }${supportContext?.sellerName ? ` with seller "${supportContext.sellerName}"` : ''}. Please connect me to a live executive.`
  );

  const whatsappUrl = `https://wa.me/8801799887766?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#131722] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B0D13] via-[#131722] to-[#181C28] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
                alt="Support Lead"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#131722] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Sultana Ahmed
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] font-bold">
                  ADMIN LEAD
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <span className="text-emerald-400 font-medium">● 24/7 Live Desk</span>
                <span>·</span>
                <span>Avg. reply &lt; 1 min</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+88096123589"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[11px] text-amber-300 font-semibold border border-neutral-700 transition-colors"
              title="Call Helpline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+880 9612-FLUX</span>
            </a>

            <button
              onClick={closeLiveSupport}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Support Tabs */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-[#0B0D13]/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>In-App Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Direct</span>
          </button>

          <button
            onClick={() => setActiveTab('dispute')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'dispute'
                ? 'text-rose-400 border-b-2 border-rose-400 bg-rose-500/5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Escalate Dispute</span>
          </button>
        </div>

        {/* Tab 1: Live In-App Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0B0D13]/40">
            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-neutral-800/80 bg-[#0B0D13]/80 overflow-x-auto flex gap-2 text-xs no-scrollbar">
              <button
                onClick={() => handleSendMessage('Seller has not shipped order after 48 hours')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
              >
                🚚 Parcel delayed &gt; 48h
              </button>
              <button
                onClick={() => handleSendMessage('Is my Advance Delivery Fee payment protected?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
              >
                💸 Advance Fee Escrow
              </button>
              <button
                onClick={() => handleSendMessage('I need to request a 7-day product return & refund')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
              >
                🔄 7-Day Return Request
              </button>
              <button
                onClick={() => handleSendMessage('How do I contact the seller directly?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
              >
                🏪 Contact Seller Directly
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="px-3 py-1 rounded-full bg-neutral-800/90 border border-neutral-700/80 text-amber-300/90 text-[11px] font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{msg.text}</span>
                      </div>
                    </div>
                  );
                }

                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                        isAgent
                          ? 'bg-[#181C28] text-neutral-100 border border-neutral-700/80 rounded-tl-sm'
                          : 'bg-gold-gradient text-slate-950 font-medium rounded-tr-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.ticketId && (
                        <div className="mt-2 pt-2 border-t border-neutral-700/60 flex items-center justify-between text-[10px] text-amber-400 font-mono">
                          <span>Official Ticket: {msg.ticketId}</span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Logged in Admin Hub
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 px-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-neutral-400 text-xs bg-[#181C28] p-3 rounded-2xl w-fit border border-neutral-800">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-300">Sultana is typing reply...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0B0D13] border-t border-neutral-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message, dispute, or question..."
                className="flex-1 bg-[#131722] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-gold-gradient text-slate-950 font-bold flex items-center justify-center hover:brightness-105 disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Direct WhatsApp Desk */}
        {activeTab === 'whatsapp' && (
          <div className="p-6 space-y-5 text-center flex-1 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <MessageCircle className="w-9 h-9 text-emerald-400" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">FLUX 24/7 Official WhatsApp Desk</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Connect directly with our Dhaka central headquarters senior managers via WhatsApp for instant photo/video dispute reviews.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 text-left space-y-2 max-w-md mx-auto">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                Pre-Formatted Context Message
              </span>
              <p className="text-xs text-neutral-300 font-mono leading-relaxed bg-[#131722] p-3 rounded-xl border border-neutral-800">
                "Hello FLUX MART Support Team, I am {customerName} ({customerPhone || 'Customer'}). I need urgent assistance regarding {
                  supportContext?.orderId ? `Order #${supportContext.orderId}` : 'an order inquiry'
                }{supportContext?.sellerName ? ` with seller "${supportContext.sellerName}"` : ''}."
              </p>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Helpline: <strong className="text-white font-mono">+880 1799-887766</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Instant Pickup
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full max-w-md py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Launch WhatsApp Conversation</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}

        {/* Tab 3: Formal Seller Dispute Escalation */}
        {activeTab === 'dispute' && (
          <div className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-xs">Super-Admin Merchant Arbitration Desk</h5>
                <p className="text-[11px] text-rose-200/90 mt-0.5 leading-relaxed">
                  If a merchant fails to dispatch products or ignores customer communications, FLUX Super-Admins will immediately freeze the seller's wallet balance and process a 100% bKash/Nagad refund to you.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-neutral-300 font-semibold block">Select Dispute Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Seller Failed to Ship (>48h)',
                  'Mismatched or Fake Product',
                  'Damaged Goods in Courier Transit',
                  'Advance Delivery Fee Verification Issue',
                  'Courier Delivery Delay (>5 days)'
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSendMessage(`Formal Dispute Filed: ${item}`);
                      setActiveTab('chat');
                    }}
                    className="p-3 rounded-xl bg-[#0B0D13] hover:bg-amber-500/10 hover:border-amber-400/50 border border-neutral-800 text-neutral-300 hover:text-white text-left font-medium transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0D13] border border-neutral-800 space-y-2 text-[11px] text-neutral-400">
              <span className="font-bold text-amber-400 block">FLUX Buyer Protection Shield</span>
              <p>• 100% Advance Payment Refund guarantee if cancellation occurs prior to dispatch.</p>
              <p>• Nationwide return pickup handled directly by Pathao Express at zero extra cost.</p>
              <p>• Seller payouts are delayed until 7 days post-delivery customer satisfaction.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
