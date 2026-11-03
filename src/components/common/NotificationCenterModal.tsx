import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartNotification, ProductCategory } from '../../types';
import {
  Bell,
  X,
  CheckCheck,
  Tag,
  Package,
  TrendingDown,
  Sparkles,
  AtSign,
  FileText,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    preferredCategories,
    togglePreferredCategory,
    orders,
    openDigitalInvoice,
    setActiveMainTab,
    language
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'offers' | 'orders' | 'mentions'>('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // Algorithm filtering based on user preferred categories and filter tab
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Tab filter
      if (filterType === 'offers' && notif.type !== 'offer' && notif.type !== 'price_drop' && notif.type !== 'flash_sale') {
        return false;
      }
      if (filterType === 'orders' && notif.type !== 'order_update') {
        return false;
      }
      if (filterType === 'mentions' && notif.type !== 'mention') {
        return false;
      }
      return true;
    });
  }, [notifications, filterType]);

  if (!isNotificationCenterOpen) return null;

  const handleNotificationClick = (notif: SmartNotification) => {
    markNotificationAsRead(notif.id);

    if (notif.orderId) {
      const matched = orders.find((o) => o.id === notif.orderId) || orders[0];
      if (matched) {
        setIsNotificationCenterOpen(false);
        openDigitalInvoice(matched);
      }
    } else if (notif.type === 'mention') {
      setIsNotificationCenterOpen(false);
      setActiveMainTab('discover');
    }
  };

  const CATEGORY_LABELS: Record<ProductCategory, { en: string; bn: string; icon: string }> = {
    fashion: { en: 'Fashion & Silk', bn: 'পোশাক ও সিল্ক', icon: '👘' },
    electronics: { en: 'Electronics & Tech', bn: 'ইলেকট্রনিক্স ও গেজেট', icon: '⚡' },
    medicine: { en: 'Organic Health', bn: 'স্বাস্থ্য ও আয়ুর্বেদ', icon: '🌿' },
    household: { en: 'Heritage Brass & Living', bn: 'হস্তশিল্প ও গৃহস্থালি', icon: '🏺' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B0D13] via-[#131722] to-[#181C28] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Smart Notifications
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/40">
                  ALGORITHM ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Personalized flash drops, order memos & community mentions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={markAllNotificationsAsRead}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Mark Read</span>
            </button>

            <button
              onClick={() => setIsNotificationCenterOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Personalized Algorithm Interest Strip */}
        <div className="p-3 bg-[#0B0D13] border-b border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white font-semibold cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalize Algorithm Interests ({preferredCategories.length})</span>
            </button>
            <span className="text-[10px] text-neutral-500 font-mono">
              Auto-learns from browsing
            </span>
          </div>

          {/* Collapsible Shopping Category Toggles */}
          {showPreferences && (
            <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
              {(['fashion', 'electronics', 'medicine', 'household'] as ProductCategory[]).map((cat) => {
                const isSelected = preferredCategories.includes(cat);
                const info = CATEGORY_LABELS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => togglePreferredCategory(cat)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-[#131722] text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{language === 'bn' ? info.bn : info.en}</span>
                    {isSelected && <span className="text-[9px] text-amber-400 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'offers', label: '🔥 Offers & Drops' },
              { id: 'orders', label: '📦 Orders & Invoices' },
              { id: 'mentions', label: '💬 Mentions (@)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-semibold transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-gold-gradient text-slate-950 font-bold'
                    : 'bg-[#131722] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <Bell className="w-9 h-9 mx-auto text-neutral-600" />
              <p className="text-xs font-semibold text-neutral-300">All caught up!</p>
              <p className="text-[11px] text-neutral-500">
                You will receive alerts here when merchants drop prices in your preferred categories.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isOrder = notif.type === 'order_update';
              const isPriceDrop = notif.type === 'price_drop' || notif.type === 'flash_sale';
              const isMention = notif.type === 'mention';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    notif.read
                      ? 'bg-[#0B0D13]/70 border-neutral-800/80 hover:border-neutral-700'
                      : 'bg-gradient-to-r from-[#181E2E] via-[#131722] to-[#121622] border-amber-500/40 shadow-lg shadow-black/40'
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!notif.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-400" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Notification Icon / Image */}
                    {notif.imageUrl ? (
                      <img
                        src={notif.imageUrl}
                        alt="Alert Preview"
                        className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        {isOrder ? (
                          <Package className="w-5 h-5 text-amber-400" />
                        ) : isPriceDrop ? (
                          <TrendingDown className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AtSign className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 pr-4 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-white text-xs">
                          {language === 'bn' ? notif.titleBn : notif.title}
                        </span>
                        {notif.discountBadge && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold border border-rose-500/30">
                            {notif.discountBadge}
                          </span>
                        )}
                        {notif.category && (
                          <span className="text-[9px] text-amber-400/90 font-mono uppercase bg-amber-500/10 px-1 py-0.2 rounded">
                            {notif.category}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        {language === 'bn' ? notif.messageBn : notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{notif.timestamp}</span>
                        </span>

                        {/* Order Memo CTA Trigger */}
                        {notif.orderId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notif);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gold-gradient text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-sm hover:brightness-105 cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-slate-950" />
                            <span>View Digital Memo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
