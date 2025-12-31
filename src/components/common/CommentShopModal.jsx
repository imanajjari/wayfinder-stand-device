// src/components/common/commentShopModal.jsx
import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

export default function CommentShopModal({ shopId }) {
  // داده‌های نمونه (در عمل از API می‌گیری)
  const [comments, setComments] = useState([
    {
      id: 1,
      userEmail: "ali@example.com",
      text: "فروشگاه خیلی تمیز و پر از کالاهای باکیفیت بود!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // ۲ ساعت پیش
    },
    {
      id: 2,
      userEmail: "sara.m@gmail.com",
      text: "قیمت‌ها مناسب بود و پرسنل هم خیلی مودب بودن.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // ۲ روز پیش
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !email.trim()) return;

    const comment = {
      id: Date.now(),
      userEmail: email,
      text: newComment,
      createdAt: new Date(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setEmail("");
    setLoading(true);
    setTimeout(() => setLoading(false), 1000); // شبیه‌سازی درخواست API
  };

  const getInitial = (email) => email.charAt(0).toUpperCase();

  const getGradient = () => "linear-gradient(90deg, #008AFF, #00FFAB)";

  return (
    <div className="mt-8">
      {/* عنوان بخش */}
      <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
        نظرات کاربران
      </h2>

      {/* فرم ثبت نظر */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="ایمیل شما (برای نمایش)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#2a3a4f] text-white border border-gray-600 focus:outline-none focus:border-[#00FFAB] placeholder-gray-400"
            required
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="نظر خود را بنویسید..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-[#2a3a4f] text-white border border-gray-600 focus:outline-none focus:border-[#00FFAB] placeholder-gray-400"
              required
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim() || !email.trim()}
              className="px-5 py-3 rounded-xl flex items-center justify-center text-white font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: getGradient() }}
            >
              <IoSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* لیست کامنت‌ها */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-6">هنوز نظری ثبت نشده است.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-xl bg-[#2a3a4f] border border-gray-700"
            >
              {/* آواتار */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{ background: getGradient() }}
              >
                {getInitial(comment.userEmail)}
              </div>

              {/* محتوا */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{comment.userEmail}</p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                </div>
                <p className="text-gray-200 mt-1">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

