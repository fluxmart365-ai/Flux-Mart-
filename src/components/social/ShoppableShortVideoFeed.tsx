import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppableVideo, Product } from '../../types';
import { renderWithMentions, POPULAR_MENTIONS } from '../../utils/textFormatting';
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  ArrowRight,
  Sparkles,
  Music,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  Send,
  Store,
  ShieldCheck,
  Headphones,
  Maximize2,
  Minimize2,
  AtSign,
  Upload
} from 'lucide-react';

interface ShoppableShortVideoFeedProps {
  onInstantBuy: (product: Product, quantity: number) => void;
}

interface SellerInquiryMessage {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  time: string;
}

interface ReelComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export const ShoppableShortVideoFeed: React.FC<ShoppableShortVideoFeedProps> = ({ onInstantBuy }) => {
  const {
    shoppableVideos,
    toggleLikeVideo,
    openShareModal,
    addToCart,
    products,
    addLoyaltyPoints,
    socialProfile,
    language,
    openLiveSupport,
    createShoppableReel,
    createSocialPost
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Comments state with @ mentions
  const [reelComments, setReelComments] = useState<Record<string, ReelComment[]>>({
    vid_01: [
      {
        id: 'c1',
        author: 'Asadul Islam (@asadul_i)',
        text: 'Can confirm the silk quality is exceptional! @golden_heritage did an incredible job with the zardozi collar.',
        time: '2h ago'
      },
      {
        id: 'c2',
        author: 'Farzana Mehnaz (@farzana_m)',
        text: 'How fast does Pathao deliver outside Dhaka? @sultana_admin is advance fee protected?',
        time: '5h ago'
      }
    ]
  });
  const [commentInput, setCommentInput] = useState('');

  // In-Feed Seller Chat Drawer state
  const [isInFeedChatOpen, setIsInFeedChatOpen] = useState(false);
  const [sellerChatMessages, setSellerChatMessages] = useState<Record<string, SellerInquiryMessage[]>>({});
  const [chatInput, setChatInput] = useState('');
  const [sellerIsTyping, setSellerIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Swipe gesture handling for zero-lag vertical reel transitions
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isWheelLocked = useRef<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);

  // Video progress simulation
  const [videoProgress, setVideoProgress] = useState(0);

  // Web Audio Synth for authentic Reels lo-fi music experience
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Upload video modal state
  const [newTitle, setNewTitle] = useState('');
  const [newSoundTrack, setNewSoundTrack] = useState('Original Sound - FLUX Acoustic');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [customVideoPoster, setCustomVideoPoster] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState(false);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);

  // New Post modal state
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postTaggedProductId, setPostTaggedProductId] = useState(products[0]?.id || '');
  const [postSuccessNotice, setPostSuccessNotice] = useState(false);
  const fileInputRefPost = useRef<HTMLInputElement>(null);

  const currentVideo = shoppableVideos[currentIndex] || shoppableVideos[0];

  // Initialize or resume Web Audio synthesizer when sound is unmuted and video is playing
  const playRhythmBeat = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate ambient lo-fi mellow note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const notes = [220, 261.63, 329.63, 392, 440, 523.25];
      const note = notes[Math.floor(Math.random() * notes.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isPlaying && !isMuted) {
      playRhythmBeat();
      const interval = window.setInterval(() => {
        playRhythmBeat();
      }, 1400);
      synthTimerRef.current = interval;
      return () => clearInterval(interval);
    } else {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
      }
    }
  }, [isPlaying, isMuted, currentIndex]);

  // Video progress bar interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1.5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  // Scroll to bottom of in-feed chat
  useEffect(() => {
    if (isInFeedChatOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isInFeedChatOpen, sellerChatMessages, sellerIsTyping]);

  const handleNextVideo = () => {
    setSlideDirection('up');
    setVideoProgress(0);
    setTimeout(() => {
      if (currentIndex < shoppableVideos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
      setSlideDirection(null);
    }, 120);
  };

  const handlePrevVideo = () => {
    setSlideDirection('down');
    setVideoProgress(0);
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setCurrentIndex(shoppableVideos.length - 1);
      }
      setSlideDirection(null);
    }, 120);
  };

  // Touch Swipe Event Listeners for mobile TikTok feel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const deltaY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 45;

    if (deltaY > minSwipeDistance) {
      handleNextVideo();
    } else if (deltaY < -minSwipeDistance) {
      handlePrevVideo();
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  // Wheel Scroll Event Listener with throttle
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelLocked.current) return;
    if (Math.abs(e.deltaY) > 25) {
      isWheelLocked.current = true;
      if (e.deltaY > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
      setTimeout(() => {
        isWheelLocked.current = false;
      }, 450);
    }
  };

  const handleShareClick = () => {
    openShareModal({
      id: currentVideo.id,
      title: currentVideo.title,
      url: `/discover?video=${currentVideo.id}`,
      image: currentVideo.videoPoster,
      type: 'video'
    });
  };

  // In-Feed Seller chat
  const currentChatMessages = sellerChatMessages[currentVideo.id] || [
    {
      id: 'init-1',
      sender: 'seller',
      text: `Hello! Thanks for checking our reel for ${currentVideo.taggedProduct.title}. How can we assist you with this product today?`,
      time: 'Just now'
    }
  ];

  const handleSendSellerMessage = (msgText?: string) => {
    const text = (msgText || chatInput).trim();
    if (!text) return;

    const userMsg: SellerInquiryMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSellerChatMessages((prev) => ({
      ...prev,
      [currentVideo.id]: [...(prev[currentVideo.id] || currentChatMessages), userMsg]
    }));

    if (!msgText) setChatInput('');
    setSellerIsTyping(true);

    setTimeout(() => {
      setSellerIsTyping(false);
      let reply = '';
      const t = text.toLowerCase();

      if (t.includes('stock') || t.includes('স্টক') || t.includes('available')) {
        reply = `Yes, this item is 100% in stock in our Dhaka warehouse! If ordered right now, we dispatch it via Pathao Express today.`;
      } else if (t.includes('dhaka') || t.includes('delivery') || t.includes('ডেলিভারি') || t.includes('fast')) {
        reply = `For Dhaka metropolitan addresses, delivery takes 24 hours. Outside Dhaka takes 48 to 72 hours via RedX or Steadfast. Mandatory advance delivery fee applies via bKash/Nagad.`;
      } else if (t.includes('size') || t.includes('কালার') || t.includes('color') || t.includes('exchange')) {
        reply = `Standard sizes (M, L, XL, XXL) are ready. We offer free size replacement within 7 days if the fit is not ideal!`;
      } else if (t.includes('advance') || t.includes('fee') || t.includes('টাকা') || t.includes('bkash')) {
        reply = `The advance delivery fee is ৳70 within Dhaka and ৳130 outside Dhaka. The remaining product price is paid via Cash on Delivery (COD) at your doorstep.`;
      } else {
        reply = `Thank you for reaching out! We have noted your question regarding ${currentVideo.taggedProduct.title}. You can click 'Buy Now' to secure yours, or we can assist further!`;
      }

      setSellerChatMessages((prev) => ({
        ...prev,
        [currentVideo.id]: [
          ...(prev[currentVideo.id] || []),
          {
            id: 's-' + Date.now(),
            sender: 'seller',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }, 1100);
  };

  // Add Comment with @ Mention
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: ReelComment = {
      id: 'rc-' + Date.now(),
      author: `${socialProfile.name} (@${socialProfile.referralCode.toLowerCase()})`,
      text: commentInput.trim(),
      time: 'Just now'
    };

    setReelComments((prev) => ({
      ...prev,
      [currentVideo.id]: [...(prev[currentVideo.id] || []), newComment]
    }));

    setCommentInput('');
    addLoyaltyPoints(20, 'Posted comment on Reel');
  };

  const handleInsertMention = (mentionTag: string) => {
    setCommentInput((prev) => `${prev ? prev + ' ' : ''}${mentionTag} `);
  };

  // Device file upload for new reel
  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomVideoPoster(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPostImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find((p) => p.id === selectedProductId) || products[0];
    const poster =
      customVideoPoster ||
      targetProduct?.image ||
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';
    createShoppableReel(
      newTitle || `${targetProduct.title} Unboxing`,
      poster,
      targetProduct,
      newSoundTrack
    );
    setUploadNotice(true);
    setTimeout(() => {
      setUploadNotice(false);
      setIsUploadOpen(false);
      setNewTitle('');
      setCustomVideoPoster(null);
      setCurrentIndex(0);
    }, 1200);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    const targetProduct = products.find((p) => p.id === postTaggedProductId);
    createSocialPost(postContent.trim(), postImage || undefined, targetProduct);
    setPostSuccessNotice(true);
    setTimeout(() => {
      setPostSuccessNotice(false);
      setIsNewPostOpen(false);
      setPostContent('');
      setPostImage(null);
    }, 1200);
  };

  // Keyboard navigation for smooth TikTok browsing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (commentsOpen || isUploadOpen || isNewPostOpen || isInFeedChatOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'm') {
        e.preventDefault();
        setIsMuted((m) => !m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commentsOpen, isUploadOpen, isNewPostOpen, isInFeedChatOpen, currentIndex, shoppableVideos.length]);

  const activeComments = reelComments[currentVideo.id] || [
    {
      id: 'c1',
      author: 'Asadul Islam (@asadul_i)',
      text: 'Can confirm the silk quality is exceptional! @golden_heritage did an incredible job with the zardozi collar.',
      time: '2h ago'
    }
  ];

  return (
    <div className={`relative flex flex-col items-center select-none ${isFullScreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center p-0' : 'max-w-md mx-auto'}`}>
      
      {/* Top Floating Control Bar (Hidden in full-screen) */}
      {!isFullScreen && (
        <div className="w-full flex items-center justify-between pb-3 px-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>FLUX Reels Feed</span>
            <span className="text-[10px] text-amber-400/90 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
              TikTok Immersion
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs hidden sm:flex items-center gap-1 transition-colors cursor-pointer"
              title="Full-Screen TikTok Mode"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Screen</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Upload Reel</span>
            </button>

            <button
              onClick={() => setIsNewPostOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#131722] hover:bg-neutral-800 border border-amber-500/50 text-amber-300 font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+ New Post</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 9:16 Video Canvas Card with Touch & Wheel Swipe */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`relative overflow-hidden bg-[#07090D] shadow-2xl select-none group focus:outline-none transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full sm:max-w-md sm:h-[94vh] sm:rounded-3xl border-2 border-neutral-800'
            : 'w-full aspect-[9/16] rounded-3xl border-2 border-neutral-800'
        }`}
        tabIndex={0}
      >
        
        {/* Looping Video Progress Bar at Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-gold-gradient transition-all duration-150 ease-linear"
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        {/* Background Visual Video Canvas with smooth slide transitions */}
        <div
          className={`w-full h-full relative transition-transform duration-200 ease-out ${
            slideDirection === 'up'
              ? '-translate-y-8 opacity-60'
              : slideDirection === 'down'
              ? 'translate-y-8 opacity-60'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <img
            src={currentVideo.videoPoster}
            alt={currentVideo.title}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        {/* Video Scrim Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 pointer-events-none" />

        {/* Center Play/Pause indicator on click */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity cursor-pointer"
          aria-label={isPlaying ? 'Pause Reel' : 'Play Reel'}
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-amber-400 border border-amber-500/50 shadow-2xl animate-in zoom-in-75 duration-200">
              <Play className="w-8 h-8 ml-1" />
            </div>
          )}
        </button>

        {/* Top Video Header: Sound Track & Enhanced Audio Controls & Fullscreen Exit */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          {/* Sound Track Badge with Equalizer */}
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white shadow-lg">
            {isPlaying && !isMuted ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-0.5 h-3.5 bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-pulse [animation-delay:0.1s]" />
              </div>
            ) : (
              <Music className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="text-[11px] truncate max-w-[130px] font-medium text-neutral-200">
              {currentVideo.soundTrack}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
                if (isMuted) {
                  playRhythmBeat();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold shadow-lg transition-all cursor-pointer ${
                !isMuted
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-950/40'
                  : 'bg-black/70 text-neutral-400 border-white/10 hover:text-white'
              }`}
              title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
            >
              {!isMuted ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-mono">Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Muted</span>
                </>
              )}
            </button>

            {/* Fullscreen Mode Exit or Enter */}
            {isFullScreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullScreen(false);
                }}
                className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
                title="Exit Full Screen"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Up / Down Navigation Chevrons with Swipe Hint */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 z-20 flex flex-col gap-2">
          <button
            onClick={handlePrevVideo}
            className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-amber-400 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
            title="Previous Reel (Swipe Down)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextVideo}
            className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-amber-400 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
            title="Next Reel (Swipe Up)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Right Floating Interaction Rail (Avatar, Like, Comment, In-Feed Chat, Share) */}
        <div className="absolute bottom-28 right-2.5 z-20 flex flex-col items-center gap-3.5">
          {/* Creator Avatar */}
          <div className="relative mb-0.5">
            <img
              src={currentVideo.creatorAvatar}
              alt={currentVideo.creatorName}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            {currentVideo.isSeller && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={() => toggleLikeVideo(currentVideo.id)}
            className="flex flex-col items-center text-white group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                currentVideo.isLiked
                  ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 scale-110'
                  : 'bg-black/60 border border-white/10 text-white hover:text-rose-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentVideo.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </div>
            <span className="text-[10px] font-mono mt-0.5 font-bold">
              {currentVideo.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setCommentsOpen(true)}
            className="flex flex-col items-center text-white cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:text-amber-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono mt-0.5 font-bold">
              {activeComments.length}
            </span>
          </button>

          {/* IN-FEED CHAT / MESSENGER ICON */}
          <button
            onClick={() => setIsInFeedChatOpen(true)}
            className="flex flex-col items-center text-white group cursor-pointer"
            title="Instant Chat with Seller"
          >
            <div className="relative w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/60 text-amber-300 flex items-center justify-center hover:scale-110 hover:border-amber-400 transition-all shadow-lg shadow-amber-950/40">
              <MessageSquareText className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
            </div>
            <span className="text-[10px] text-amber-300 font-bold mt-0.5 font-mono">
              Chat
            </span>
          </button>

          {/* Social Share Button */}
          <button
            onClick={handleShareClick}
            className="flex flex-col items-center text-white cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-400 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-amber-950/40">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-amber-300 font-bold mt-0.5 font-mono">
              +50 pts
            </span>
          </button>
        </div>

        {/* Bottom Left Content Info with @ Mentions formatting */}
        <div className="absolute bottom-22 left-4 right-16 z-20 text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs tracking-tight">
              {currentVideo.creatorName}
            </span>
            <span className="text-amber-400 font-mono text-[11px]">
              {currentVideo.creatorHandle}
            </span>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2">
            {renderWithMentions(language === 'bn' ? currentVideo.titleBn : currentVideo.title)}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-amber-300/90 font-mono">
            {currentVideo.tags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </div>

        {/* INLINE SHOPPABLE PRODUCT OVERLAY CARD */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20">
          <div className="p-2.5 rounded-2xl bg-[#131722]/95 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentVideo.taggedProduct.image}
                alt={currentVideo.taggedProduct.title}
                className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[9px] text-amber-400 uppercase tracking-wider font-semibold block truncate">
                  {currentVideo.taggedProduct.brand}
                </span>
                <h4 className="text-xs font-semibold text-white truncate leading-tight">
                  {language === 'bn' ? currentVideo.taggedProduct.titleBn : currentVideo.taggedProduct.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                    ৳{currentVideo.taggedProduct.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">In Stock</span>
                </div>
              </div>
            </div>

            {/* Instant Buy CTA Button */}
            <button
              onClick={() => onInstantBuy(currentVideo.taggedProduct, 1)}
              className="px-3.5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

      </div>

      {/* COMMENTS BOTTOM SHEET WITH @ MENTIONS */}
      {commentsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#131722] border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-4 text-white max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>Reel Discussion & Mentions ({activeComments.length})</span>
              </h4>
              <button
                onClick={() => setCommentsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick @ Mention helper chips */}
            <div className="py-2 overflow-x-auto flex items-center gap-1.5 text-[10px] no-scrollbar border-b border-neutral-800/60">
              <span className="text-neutral-400 mr-1 flex items-center gap-0.5">
                <AtSign className="w-3 h-3 text-amber-400" />
                <span>Mention:</span>
              </span>
              {POPULAR_MENTIONS.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertMention(tag)}
                  className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs max-h-[45vh]">
              {activeComments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#0B0D13] border border-neutral-800 space-y-1">
                  <div className="flex justify-between font-semibold text-amber-300 text-xs">
                    <span>{c.author}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{c.time}</span>
                  </div>
                  <div className="text-neutral-300 text-xs leading-relaxed">
                    {renderWithMentions(c.text)}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input with @ mention */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-neutral-800 flex items-center gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment... type @ to mention friends or shops"
                className="flex-1 bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="w-9 h-9 rounded-xl bg-gold-gradient text-slate-950 font-bold flex items-center justify-center hover:brightness-105 disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* IN-FEED CHAT / MESSENGER DRAWER WITH SELLER & DISPUTE DESK */}
      {isInFeedChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-t-3xl sm:rounded-3xl p-4 text-white max-h-[82vh] flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={currentVideo.creatorAvatar}
                    alt={currentVideo.creatorName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {currentVideo.creatorName}
                    </h4>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1 py-0.2 rounded border border-amber-500/40 font-semibold">
                      Seller Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Replies instantly · Guaranteed authentic
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsInFeedChatOpen(false);
                    openLiveSupport({
                      sellerName: currentVideo.taggedProduct.brand,
                      initialMessage: `I was viewing the Reel for "${currentVideo.taggedProduct.title}" and would like assistance.`
                    });
                  }}
                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-semibold border border-neutral-700 flex items-center gap-1"
                  title="Connect with Super-Admin Support"
                >
                  <Headphones className="w-3 h-3 text-amber-400" />
                  <span>Admin Help</span>
                </button>

                <button
                  onClick={() => setIsInFeedChatOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tagged Product Summary Card pinned inside chat */}
            <div className="my-2 p-2.5 rounded-xl bg-[#0B0D13] border border-neutral-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={currentVideo.taggedProduct.image}
                  alt={currentVideo.taggedProduct.title}
                  className="w-9 h-9 rounded-lg object-cover border border-amber-500/30"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-white truncate block">
                    {currentVideo.taggedProduct.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    ৳{currentVideo.taggedProduct.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsInFeedChatOpen(false);
                  onInstantBuy(currentVideo.taggedProduct, 1);
                }}
                className="px-3 py-1.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-[11px] shrink-0"
              >
                Instant Buy
              </button>
            </div>

            {/* Quick Inquiry Chips */}
            <div className="py-1.5 overflow-x-auto flex gap-1.5 text-[10px] no-scrollbar">
              <button
                onClick={() => handleSendSellerMessage('Is this product available in stock?')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 transition-colors"
              >
                📦 In Stock?
              </button>
              <button
                onClick={() => handleSendSellerMessage('How fast can you deliver to Dhaka?')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 transition-colors"
              >
                🚚 Delivery Time?
              </button>
              <button
                onClick={() => handleSendSellerMessage('What is the mandatory advance delivery fee?')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 transition-colors"
              >
                💸 Advance Fee?
              </button>
              <button
                onClick={() => handleSendSellerMessage('Can I exchange the size if needed?')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-300 border border-neutral-700 text-neutral-300 transition-colors"
              >
                🔄 Size Exchange?
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto py-2.5 space-y-2 text-xs min-h-[160px] max-h-[260px]">
              {currentChatMessages.map((msg) => {
                const isSeller = msg.sender === 'seller';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSeller ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-2.5 text-xs leading-relaxed ${
                        isSeller
                          ? 'bg-[#181C28] text-neutral-100 border border-neutral-700/80 rounded-tl-sm'
                          : 'bg-gold-gradient text-slate-950 font-medium rounded-tr-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-neutral-500 mt-0.5 px-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {sellerIsTyping && (
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs bg-[#181C28] p-2 rounded-xl w-fit">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] text-neutral-300">{currentVideo.creatorName} is typing...</span>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendSellerMessage();
              }}
              className="pt-2 border-t border-neutral-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask seller about size, delivery, stock..."
                className="flex-1 bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-9 h-9 rounded-xl bg-gold-gradient text-slate-950 font-bold flex items-center justify-center hover:brightness-105 disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* CREATOR UPLOAD REEL MODAL WITH DEVICE FILE UPLOAD & PRODUCT TAGGING */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Create Shoppable Short Reel</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Upload unboxings, reviews, or styling guides. Earn +100 FLUX Coins upon publishing!
            </p>

            {uploadNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Reel uploaded successfully! +100 FLUX Coins added to your wallet.</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">Reel Title & @ Mentions</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My Eid Unboxing with @golden_heritage #Fashion"
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Sound Track Name</label>
                <input
                  type="text"
                  value={newSoundTrack}
                  onChange={(e) => setNewSoundTrack(e.target.value)}
                  placeholder="e.g. Bengali Folk Lofi Beats"
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Tag Marketplace Product (Enables 'Buy Now' Card)</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.title} (৳{p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Device Video / Poster File Upload */}
              <input
                type="file"
                ref={fileInputRefVideo}
                onChange={handleVideoFileSelect}
                accept="video/*,image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRefVideo.current?.click()}
                className="p-4 rounded-xl bg-[#0B0D13] border border-dashed border-neutral-700 hover:border-amber-400/60 text-center text-neutral-400 text-xs space-y-1.5 cursor-pointer transition-colors"
              >
                {customVideoPoster ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Media Loaded from Device Ready</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mx-auto text-amber-400" />
                    <p className="font-semibold text-white">Upload 9:16 Short Video or Poster</p>
                    <p className="text-[10px] text-neutral-500">Tap to select video/image file from device.</p>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-105 cursor-pointer"
              >
                Publish Reel & Earn 100 Points
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATOR NEW COMMUNITY POST MODAL */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-md bg-[#131722] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsNewPostOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Create Community Look Post</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Share your look with social tagging (@mentions). Earn +100 FLUX Coins!
            </p>

            {postSuccessNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Post published to Community Looks Feed! +100 Coins awarded.</span>
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  What are you wearing / styling? (@tag brands & friends)
                </label>
                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="e.g. Absolutely in love with this Rajshahi Silk panjabi from @golden_heritage! Super soft and elegant. @rahim_c check this out!"
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl p-3 text-white outline-none focus:border-amber-400 resize-none text-xs"
                />

                {/* Quick Mention Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[10px] mt-1">
                  <span className="text-neutral-400 shrink-0">Tap to tag:</span>
                  {POPULAR_MENTIONS.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPostContent((prev) => `${prev ? prev + ' ' : ''}${tag} `)}
                      className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors shrink-0 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Tag Product</label>
                <select
                  value={postTaggedProductId}
                  onChange={(e) => setPostTaggedProductId(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.title} (৳{p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload */}
              <input
                type="file"
                ref={fileInputRefPost}
                onChange={handlePostFileSelect}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRefPost.current?.click()}
                className="p-3.5 rounded-xl bg-[#0B0D13] border border-dashed border-neutral-700 hover:border-amber-400/60 text-center text-neutral-400 text-xs space-y-1 cursor-pointer transition-colors"
              >
                {postImage ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Photo Attached Ready</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mx-auto text-amber-400" />
                    <p className="font-semibold text-white">Attach Outfit Photo</p>
                    <p className="text-[10px] text-neutral-500">Tap to select photo from device.</p>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-105 cursor-pointer"
              >
                Publish Post & Earn 100 Coins
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
