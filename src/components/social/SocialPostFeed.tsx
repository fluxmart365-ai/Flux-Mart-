import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialPost, Product } from '../../types';
import { renderWithMentions, POPULAR_MENTIONS } from '../../utils/textFormatting';
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  Plus,
  Send,
  MapPin,
  Sparkles,
  Tag,
  CheckCircle2,
  X,
  Image as ImageIcon,
  AtSign,
  Upload,
  MessageSquareText
} from 'lucide-react';

interface SocialPostFeedProps {
  onInstantBuy: (product: Product, quantity: number) => void;
}

export const SocialPostFeed: React.FC<SocialPostFeedProps> = ({ onInstantBuy }) => {
  const {
    socialPosts,
    toggleLikePost,
    addPostComment,
    createSocialPost,
    openShareModal,
    products,
    socialProfile,
    language,
    openLiveSupport
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedTagProductId, setSelectedTagProductId] = useState<string>(products[0]?.id || '');
  const [customPostImage, setCustomPostImage] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const fileInputRefPost = useRef<HTMLInputElement>(null);

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addPostComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleInsertMentionInComment = (postId: string, mention: string) => {
    const cur = commentInputs[postId] || '';
    setCommentInputs({
      ...commentInputs,
      [postId]: `${cur ? cur + ' ' : ''}${mention} `
    });
  };

  const handleInsertMentionInPost = (mention: string) => {
    setPostContent((prev) => `${prev ? prev + ' ' : ''}${mention} `);
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPostImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    const taggedProd = products.find((p) => p.id === selectedTagProductId);
    createSocialPost(
      postContent,
      customPostImage || taggedProd?.image,
      taggedProd
    );
    setPostContent('');
    setCustomPostImage(null);
    setIsCreateOpen(false);
  };

  const handleShareClick = (post: SocialPost) => {
    openShareModal({
      id: post.id,
      title: `${post.authorName}'s Look on FLUX MART`,
      url: `/discover?post=${post.id}`,
      image: post.image,
      type: 'post'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Create Look Trigger Banner with Prominent + New Post Button */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#131722] border border-amber-500/40 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src={socialProfile.profilePhoto}
            alt={socialProfile.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Share Your FLUX Look & Experience</h4>
            <span className="text-[11px] text-amber-400 font-medium">Earn +100 FLUX Coins & tag products for friends!</span>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>New Post</span>
        </button>
      </div>

      {/* Post List Feed */}
      <div className="space-y-6">
        {socialPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl bg-[#131722] border border-neutral-800 shadow-xl overflow-hidden text-white"
          >
            {/* Post Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{post.authorName}</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{post.authorLocation}</span>
                    <span>·</span>
                    <span>{post.postedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.taggedProduct && (
                  <button
                    onClick={() =>
                      openLiveSupport({
                        sellerName: post.taggedProduct?.sellerName || post.taggedProduct?.brand,
                        initialMessage: `I saw ${post.authorName}'s post on "${post.taggedProduct?.title}" and want to inquire about availability.`
                      })
                    }
                    className="p-2 rounded-xl bg-[#0B0D13] hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-neutral-800 transition-colors cursor-pointer"
                    title="Direct In-Feed Chat regarding post"
                  >
                    <MessageSquareText className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleShareClick(post)}
                  className="p-2 rounded-xl bg-[#0B0D13] hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-neutral-800 transition-colors cursor-pointer"
                  title="Share to Facebook, Messenger or Copy Link (+50 pts)"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Post Text Content with @ Mentions Formatting */}
            <div className="px-4 sm:px-5 pb-3">
              <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {renderWithMentions(post.content)}
              </div>
            </div>

            {/* Post Media */}
            {post.image && (
              <div className="w-full bg-[#0B0D13] max-h-[480px] overflow-hidden">
                <img
                  src={post.image}
                  alt="Look preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* INLINE TAGGED PRODUCT CARD WITH INSTANT BUY */}
            {post.taggedProduct && (
              <div className="p-3 mx-4 sm:mx-5 my-3 rounded-2xl bg-[#0B0D13] border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.taggedProduct.image}
                    alt={post.taggedProduct.title}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                        {post.taggedProduct.brand}
                      </span>
                      <span className="text-[10px] text-neutral-500">· Tagged Product</span>
                    </div>
                    <h5 className="text-xs font-semibold text-white truncate">
                      {language === 'bn' ? post.taggedProduct.titleBn : post.taggedProduct.title}
                    </h5>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ৳{post.taggedProduct.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onInstantBuy(post.taggedProduct!, 1)}
                  className="px-3.5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy Now</span>
                </button>
              </div>
            )}

            {/* Engagement Counts Bar */}
            <div className="px-4 sm:px-5 py-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <button
                onClick={() => toggleLikePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  post.isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                <span>{post.likesCount} Likes</span>
              </button>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 text-neutral-400" />
                  <span>{post.commentsCount} Comments</span>
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4 text-neutral-400" />
                  <span>{post.sharesCount} Shares</span>
                </span>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="px-4 sm:px-5 pb-3 space-y-2 border-t border-neutral-800/60 pt-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-2.5 rounded-xl bg-[#0B0D13] text-xs space-y-0.5">
                    <div className="flex justify-between font-semibold text-amber-300">
                      <span>{comment.author}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{comment.time}</span>
                    </div>
                    <div className="text-neutral-300">
                      {renderWithMentions(comment.text)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick @ Mention helper chips */}
            <div className="px-4 sm:px-5 py-1.5 bg-[#0B0D13]/60 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              <span className="text-neutral-400 shrink-0 flex items-center gap-0.5">
                <AtSign className="w-3 h-3 text-amber-400" />
                <span>Tag:</span>
              </span>
              {POPULAR_MENTIONS.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertMentionInComment(post.id, tag)}
                  className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-700 whitespace-nowrap transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Comment Form */}
            <div className="p-3 sm:p-4 bg-[#0B0D13] border-t border-neutral-800">
              <form
                onSubmit={(e) => handleCommentSubmit(post.id, e)}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  placeholder="Write a comment or type @ to mention accounts..."
                  className="flex-1 bg-[#131722] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={!(commentInputs[post.id] || '').trim()}
                  className="p-2 rounded-xl bg-gold-gradient text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE NEW LOOK POST MODAL WITH PRODUCT TAGGING & DEVICE UPLOAD */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#131722] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Create Customer Look & Review</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Tag any product from FLUX MART so friends and shoppers can buy directly from your post!
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Your Review / Styling Story & @ Mentions
                </label>
                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share details about the fabric, fitting, or tech... type @ to mention shops or friends"
                  className="w-full bg-[#0B0D13] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-white outline-none"
                />

                {/* Quick Mention Insertion Chips */}
                <div className="flex items-center gap-1.5 pt-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] text-neutral-400">Add Mention:</span>
                  {POPULAR_MENTIONS.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertMentionInPost(tag)}
                      className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-700 text-[10px]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Tag Purchased Product</label>
                <select
                  value={selectedTagProductId}
                  onChange={(e) => setSelectedTagProductId(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.title} (৳{p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload from device */}
              <input
                type="file"
                ref={fileInputRefPost}
                onChange={handleImageFileSelect}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRefPost.current?.click()}
                className="p-3.5 rounded-xl bg-[#0B0D13] border border-dashed border-neutral-700 hover:border-amber-400/60 text-center text-neutral-400 text-xs space-y-1 cursor-pointer transition-colors"
              >
                {customPostImage ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Photo Selected from Device</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mx-auto text-amber-400" />
                    <p className="font-semibold text-white">Upload Look Photo from Device</p>
                    <p className="text-[10px] text-neutral-500">Tap to upload your photo or outfit snapshot.</p>
                  </>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Publishing will reward you with +100 FLUX loyalty coins in your wallet!</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-105 cursor-pointer"
              >
                Publish Look & Earn 100 Points
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
