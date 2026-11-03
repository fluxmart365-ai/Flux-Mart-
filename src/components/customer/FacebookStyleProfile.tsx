import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import {
  Camera,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Award,
  Crown,
  Share2,
  Gift,
  Copy,
  Check,
  Edit3,
  ShieldCheck,
  Star,
  Package,
  Heart,
  Headphones,
  MessageCircle,
  Upload,
  Link,
  CheckCircle2,
  X,
  Phone,
  SlidersHorizontal,
  Flame,
  Settings,
  LogOut,
  UserPlus,
  Store,
  User,
  Users,
  ChevronRight
} from 'lucide-react';

const CURATED_COVERS = [
  {
    name: 'Silk Golden Weave',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Dhaka Metropolitan Skyline',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Bengali Artisanal Brass Studio',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Dark Obsidian Minimalist Gold',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80'
  }
];

const CURATED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
];

export const FacebookStyleProfile: React.FC = () => {
  const {
    socialProfile,
    updateSocialProfile,
    redeemPointsForVoucher,
    openShareModal,
    socialPosts,
    language,
    openLiveSupport,
    preferredCategories,
    togglePreferredCategory,
    logoutCustomer,
    accounts,
    currentAccountId,
    switchAccount,
    setOtpModalOpen,
    isAccountSwitcherOpen,
    setIsAccountSwitcherOpen,
    setRole,
    isLoggedIn
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(socialProfile.name);
  const [phone, setPhone] = useState(socialProfile.phone || '+8801799887766');
  const [bio, setBio] = useState(socialProfile.bio);
  const [tagline, setTagline] = useState(socialProfile.tagline);
  const [location, setLocation] = useState(socialProfile.location);

  // Photo customization modals
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const fileInputRefCover = useRef<HTMLInputElement>(null);
  const fileInputRefAvatar = useRef<HTMLInputElement>(null);

  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'rewards' | 'badges' | 'settings'>('posts');
  const [redeemNotice, setRedeemNotice] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialProfile({
      name,
      phone,
      bio,
      tagline,
      location
    });
    setIsEditing(false);
    setSaveSuccessNotice('Profile details saved successfully!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Device file upload for Cover
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSocialProfile({ coverImage: event.target.result as string });
          setIsCoverModalOpen(false);
          setSaveSuccessNotice('Custom cover photo uploaded successfully!');
          setTimeout(() => setSaveSuccessNotice(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Device file upload for Avatar
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSocialProfile({ profilePhoto: event.target.result as string });
          setIsAvatarModalOpen(false);
          setSaveSuccessNotice('Profile picture uploaded successfully!');
          setTimeout(() => setSaveSuccessNotice(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomCoverUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCoverUrl.trim()) {
      updateSocialProfile({ coverImage: customCoverUrl.trim() });
      setCustomCoverUrl('');
      setIsCoverModalOpen(false);
      setSaveSuccessNotice('Cover photo updated!');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    }
  };

  const handleSaveCustomAvatarUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      updateSocialProfile({ profilePhoto: customAvatarUrl.trim() });
      setCustomAvatarUrl('');
      setIsAvatarModalOpen(false);
      setSaveSuccessNotice('Profile picture updated!');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    }
  };

  const handleRedeem = (cost: number, value: number) => {
    const res = redeemPointsForVoucher(cost, value);
    setRedeemNotice(res.message);
    setTimeout(() => setRedeemNotice(null), 4000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(`https://fluxmart.bd/?ref=${socialProfile.referralCode}`);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const myPosts = socialPosts.filter((p) => p.authorName === socialProfile.name);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-2xl">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {language === 'bn' ? 'সাইন ইন প্রয়োজন' : 'Sign In Required'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আপনার অ্যাকাউন্ট ও পূর্ববর্তী সেশনের তথ্য নিরাপদে মুছে ফেলা হয়েছে। ব্যক্তিগত প্রোফাইল দেখতে দয়া করে সাইন ইন করুন।'
              : 'Previous session data has been securely cleared. Please sign in or register to access your personal profile, rewards, and orders with zero traces of previous session data.'}
          </p>
        </div>
        <button
          onClick={() => setOtpModalOpen(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gold-gradient text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4 text-slate-950" />
          <span>{language === 'bn' ? 'সাইন ইন / রেজিস্টার করুন' : 'Sign In / Register Now'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {saveSuccessNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* 1. Facebook-Style Header Card (Customizable Cover + Floating Avatar + Profile Stats) */}
      <div className="rounded-3xl bg-[#131722] border border-neutral-800 overflow-hidden shadow-2xl relative">
        
        {/* Cover Photo Area */}
        <div className="relative h-48 sm:h-64 w-full bg-[#0B0D13] overflow-hidden group">
          <img
            src={socialProfile.coverImage}
            alt="Profile Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-black/40 pointer-events-none" />

          {/* Prominent Help / Support button in top corner */}
          <button
            onClick={() => openLiveSupport()}
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-amber-400/50 text-amber-300 font-bold text-xs shadow-lg shadow-black/50 hover:scale-105 transition-all cursor-pointer z-10"
            title="Connect with Super-Admin Support & WhatsApp"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>24/7 Live Support & Help</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
          </button>

          {/* Clean User-Customizable Cover Photo Button */}
          <button
            onClick={() => setIsCoverModalOpen(true)}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 text-neutral-200 hover:text-white font-medium text-xs shadow-lg transition-all cursor-pointer z-10"
            title="Upload or Change Cover Photo"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Cover Photo</span>
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-8 pb-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            
            {/* Avatar & Floating Edit Button */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={socialProfile.profilePhoto}
                  alt={socialProfile.name}
                  className="w-28 sm:w-32 h-28 sm:h-32 rounded-full object-cover border-4 border-[#131722] shadow-2xl bg-[#0B0D13]"
                />
                
                {/* Avatar Camera Upload Trigger */}
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gold-gradient text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-[#131722]"
                  title="Upload or Change Profile Picture"
                >
                  <Camera className="w-4 h-4 text-slate-950" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {socialProfile.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                    VIP GOLD
                  </span>
                </div>

                <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                  {socialProfile.tagline}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{socialProfile.location}</span>
                  <span>·</span>
                  <span className="font-mono text-emerald-400 font-semibold">{socialProfile.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAccountSwitcherOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B0D13] hover:bg-neutral-800 border border-amber-500/30 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Switch between saved Customer & Merchant Profiles (Messenger Style)"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch Account ({accounts.length})</span>
              </button>

              <button
                onClick={() => openLiveSupport()}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Connect with Super-Admin Support & WhatsApp"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                <span>24/7 Support</span>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile Space'}</span>
              </button>

              <button
                onClick={() =>
                  openShareModal({
                    id: 'profile_share',
                    title: `${socialProfile.name}'s Profile on FLUX MART`,
                    url: `/?ref=${socialProfile.referralCode}`,
                    image: socialProfile.profilePhoto,
                    type: 'post'
                  })
                }
                className="px-4 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Profile (+50 pts)</span>
              </button>
            </div>
          </div>

          {/* User Bio */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl text-center sm:text-left mt-2">
            {socialProfile.bio}
          </p>

          {/* Activity Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800">
            <div className="p-3 rounded-2xl bg-[#0B0D13] border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Verified Reviews</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                {socialProfile.totalReviews}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0D13] border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Shared Looks</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                {socialProfile.sharedPostsCount}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0D13] border border-amber-500/30 text-center">
              <span className="text-[11px] text-amber-300 block font-medium">FLUX Loyalty Coins</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-amber-400 tabular-nums">
                {socialProfile.loyaltyPoints}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0D13] border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Honor Badges</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {socialProfile.badges.length}
              </span>
            </div>
          </div>

          {/* Smooth Inline Profile Editor */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#0B0D13] border border-amber-500/40 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Customize Personal Profile & Notification Interests</span>
                </h4>
                <span className="text-[10px] text-amber-400 font-mono">Modern Social Space</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Full Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Phone Number (+880 OTP verified)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Primary Location (Division / Area)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Personal Slogan / Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-[#131722] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Personal Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#131722] border border-neutral-700 rounded-xl p-3 text-white outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Shopping Interest Selection for Smart Notification Algorithm */}
              <div className="p-3.5 rounded-xl bg-[#131722] border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Shopping Interests (Algorithm Feeds)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">Pushes Flash Drops</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['fashion', 'electronics', 'medicine', 'household'] as ProductCategory[]).map((cat) => {
                    const isSelected = preferredCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => togglePreferredCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                            : 'bg-[#0B0D13] text-neutral-400 border border-neutral-800 hover:text-white'
                        }`}
                      >
                        <span className="capitalize">{cat}</span>
                        {isSelected && <span className="text-[10px] text-amber-400 font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-105 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* 2. Navigation Tabs (My Looks, Gamified Rewards, Badges) */}
      <div className="flex items-center gap-2 p-1 bg-[#131722] border border-neutral-800 rounded-2xl">
        <button
          onClick={() => setActiveProfileTab('posts')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'posts'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>My Shared Looks ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('rewards')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'rewards'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Rewards & Points ({socialProfile.loyaltyPoints})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('badges')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'badges'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Honor Badges ({socialProfile.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('settings')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'settings'
              ? 'bg-gold-gradient text-slate-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account & Switcher</span>
        </button>
      </div>

      {/* TAB 1: MY SHARED LOOKS */}
      {activeProfileTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#131722] border border-neutral-800 text-center space-y-3">
              <Camera className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No Shared Looks Yet</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Snap and share photos of products you received from FLUX MART. Earn +100 FLUX Coins for each post!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl bg-[#131722] border border-neutral-800 overflow-hidden shadow-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{post.authorLocation}</span>
                    <span>·</span>
                    <span>{post.postedAt}</span>
                  </div>
                  <p className="text-xs text-neutral-200">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post visual"
                      className="w-full h-44 object-cover rounded-xl border border-neutral-800"
                    />
                  )}
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                    <span className="text-amber-400 font-mono">♥ {post.likesCount} Likes</span>
                    <span>💬 {post.commentsCount} Comments</span>
                    <span>↗ {post.sharesCount} Shares</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REWARDS & POINTS REDEMPTION */}
      {activeProfileTab === 'rewards' && (
        <div className="space-y-4">
          {redeemNotice && (
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{redeemNotice}</span>
            </div>
          )}

          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#131722] to-[#0B0D13] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-slate-950 font-bold shadow-lg">
                <Gift className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold block">
                  Available FLUX Coins
                </span>
                <span className="text-2xl font-black font-mono text-white">
                  {socialProfile.loyaltyPoints} <span className="text-xs text-amber-400 font-normal">Coins</span>
                </span>
              </div>
            </div>

            {/* Referral Code Copy */}
            <div className="flex items-center gap-2 bg-[#0B0D13] p-2 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-mono">Referral Code:</span>
              <strong className="text-xs font-mono text-amber-400 font-bold">
                {socialProfile.referralCode}
              </strong>
              <button
                onClick={handleCopyReferral}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                title="Copy Referral Link"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">৳100 Discount Voucher</span>
                <span className="text-xs font-mono font-bold text-amber-400">200 Coins</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Redeem 200 loyalty coins for an instant ৳100 off your next checkout order.
              </p>
              <button
                onClick={() => handleRedeem(200, 100)}
                disabled={socialProfile.loyaltyPoints < 200}
                className="w-full py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
              >
                Redeem ৳100 Voucher
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#131722] border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">৳300 VIP Discount Voucher</span>
                <span className="text-xs font-mono font-bold text-amber-400">500 Coins</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Redeem 500 loyalty coins for an instant ৳300 off your next purchase.
              </p>
              <button
                onClick={() => handleRedeem(500, 300)}
                disabled={socialProfile.loyaltyPoints < 500}
                className="w-full py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
              >
                Redeem ৳300 Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HONOR BADGES */}
      {activeProfileTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialProfile.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-[#131722] border border-amber-500/30 flex items-start gap-3.5 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Crown className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">
                    {language === 'bn' ? badge.nameBn : badge.name}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] uppercase font-bold">
                    {badge.tier}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ACCOUNT MANAGEMENT, MULTI-PROFILE SWITCHER & LOG OUT */}
      {activeProfileTab === 'settings' && (
        <div className="space-y-5">
          {/* Active Account Overview Card */}
          <div className="p-5 rounded-2xl bg-[#131722] border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'bn' ? 'সক্রিয় অ্যাকাউন্ট বিবরণী' : 'Current Active Profile'}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                AUTHENTICATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                <span className="text-neutral-400 block text-[11px] mb-0.5">Account Holder</span>
                <span className="text-white font-bold">{socialProfile.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800">
                <span className="text-neutral-400 block text-[11px] mb-0.5">Primary Mobile (+880)</span>
                <span className="text-emerald-400 font-mono font-bold">{socialProfile.phone}</span>
              </div>
            </div>

            {/* Quick Merchant Mode Switch */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-400 text-slate-950">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Merchant Seller Portal</h4>
                  <p className="text-[11px] text-amber-200/80">Manage your shop, wallet payouts & product catalog</p>
                </div>
              </div>
              <button
                onClick={() => setRole('seller')}
                className="px-3.5 py-1.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs hover:brightness-105 transition-all cursor-pointer shadow-sm"
              >
                Enter Portal
              </button>
            </div>
          </div>

          {/* Multi-Account Switcher & Profiles List */}
          <div className="p-5 rounded-2xl bg-[#131722] border border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? 'সংরক্ষিত অ্যাকাউন্টসমূহ' : 'Saved Accounts & Profiles'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn'
                    ? 'সহজেই এক ক্লিকে ক্রেতা বা বিক্রেতা অ্যাকাউন্টে সুইচ করুন'
                    : 'Switch seamlessly between your customer, merchant, and alternate profiles'}
                </p>
              </div>

              {/* Add Account Button */}
              <button
                onClick={() => setOtpModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '+ অ্যাকাউন্ট যোগ করুন' : '+ Add Account'}</span>
              </button>
            </div>

            {/* Accounts List */}
            <div className="space-y-2">
              {accounts.map((acc) => {
                const isActive = acc.id === currentAccountId && isLoggedIn;
                return (
                  <div
                    key={acc.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#0B0D13] border-amber-500/50 ring-1 ring-amber-500/30'
                        : 'bg-[#0B0D13]/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{acc.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-neutral-800 text-amber-300 border border-neutral-700">
                            {acc.role === 'seller' ? 'Merchant' : 'Customer'}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 block truncate">
                          {acc.shopName || acc.phone || acc.email}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isActive ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => switchAccount(acc.id)}
                          className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear and Functional Log Out Button */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-neutral-500">
                Logging out resets your session to guest browsing mode.
              </span>
              <button
                onClick={() => {
                  logoutCustomer();
                  setSaveSuccessNotice('You have been logged out. You can now browse as a guest.');
                  setTimeout(() => setSaveSuccessNotice(null), 3000);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'bn' ? 'লগআউট করুন' : 'Log Out Account'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CUSTOM COVER PHOTO CUSTOMIZER */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">Custom Cover Photo</h3>
              </div>
              <button
                onClick={() => setIsCoverModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRefCover}
              onChange={handleCoverFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => fileInputRefCover.current?.click()}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-dashed border-amber-500/50 flex items-center justify-center gap-2.5 text-xs text-amber-300 font-bold transition-all cursor-pointer group"
            >
              <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Upload Custom Image from Device</span>
            </button>

            {/* Custom URL Form */}
            <form onSubmit={handleSaveCustomCoverUrl} className="space-y-2">
              <label className="text-[11px] text-neutral-400 font-medium block">
                Or Paste Image Web URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!customCoverUrl.trim()}
                  className="px-3.5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Curated Aesthetic Covers */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-medium block">
                Curated Luxury Presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CURATED_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      updateSocialProfile({ coverImage: preset.url });
                      setIsCoverModalOpen(false);
                    }}
                    className="p-1 rounded-xl bg-[#0B0D13] border border-neutral-800 hover:border-amber-400 transition-all text-left overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-14 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] text-neutral-300 truncate block mt-1 px-1 font-medium">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM PROFILE PICTURE CUSTOMIZER */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">Custom Profile Picture</h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRefAvatar}
              onChange={handleAvatarFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Device Upload */}
            <button
              onClick={() => fileInputRefAvatar.current?.click()}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-dashed border-amber-500/50 flex items-center justify-center gap-2.5 text-xs text-amber-300 font-bold transition-all cursor-pointer group"
            >
              <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Upload Picture from Device</span>
            </button>

            {/* Custom URL Form */}
            <form onSubmit={handleSaveCustomAvatarUrl} className="space-y-2">
              <label className="text-[11px] text-neutral-400 font-medium block">
                Or Paste Image Web URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!customAvatarUrl.trim()}
                  className="px-3.5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Curated Avatars */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-medium block">
                Choose Profile Style:
              </span>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                {CURATED_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      updateSocialProfile({ profilePhoto: url });
                      setIsAvatarModalOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      socialProfile.profilePhoto === url
                        ? 'border-amber-400 scale-110 ring-2 ring-amber-400/40'
                        : 'border-neutral-700 hover:border-amber-400/60'
                    }`}
                  >
                    <img src={url} alt={`Style ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
