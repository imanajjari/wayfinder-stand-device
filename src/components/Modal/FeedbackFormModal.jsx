// src/components/Modal/FeedbackFormModal.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { submitFeedback } from "../../services/feedbackService";
import { useModalManager } from "../../contexts/ModalManagerContext";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";

const FeedbackFormModal = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    kind: null, // ابتدا هیچکدام انتخاب نشده
  });
  const [loading, setLoading] = useState(false);
  const { hideModal } = useModalManager();

  const validate = () => {
    if (form.kind === null) {
      toast.error("لطفاً نوع بازخورد را انتخاب کنید");
      return false;
    }
    if (form.title.trim().length < 3) {
      toast.error("عنوان باید حداقل ۳ کاراکتر باشد");
      return false;
    }
    if (form.content.trim().length < 10) {
      toast.error("متن بازخورد باید حداقل ۱۰ کاراکتر باشد");
      return false;
    }
    return true;
  };

  const submitHandler = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await submitFeedback(form.title, form.content, form.kind);
      toast.success("بازخورد شما با موفقیت ثبت شد 🙏");
      hideModal();
    } catch (err) {
      toast.error("خطا در ثبت بازخورد، لطفاً دوباره تلاش کنید");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-black/80 backdrop-blur-xl border border-white/20
        rounded-2xl
        px-6 py-8
        flex flex-col
        text-white
        w-[400px]
      "
      dir="rtl"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        انتقادات و پیشنهادات
      </h2>

      {/* نوع بازخورد - دکمه‌های رنگی */}
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-2 text-right">
          نوع بازخورد
        </label>
        <div className="flex gap-3 justify-center">
          {/* دکمه پیشنهاد */}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, kind: 1 }))}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl border-2 font-medium transition-all duration-200
              ${form.kind === 1 
                ? "bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
                : "bg-transparent border-green-500 text-green-500 hover:bg-green-500/10"
              }
            `}
          >
            <FaRegThumbsUp className="text-lg" />
            <span>پیشنهاد</span>
          </button>

          {/* دکمه انتقاد */}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, kind: 2 }))}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl border-2 font-medium transition-all duration-200
              ${form.kind === 2 
                ? "bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(200,20,10,0.5)]" 
                : "bg-transparent border-red-500 text-red-500 hover:bg-red-500/10"
              }
            `}
          >
            <FaRegThumbsDown className="text-lg" />
            <span>انتقاد</span>
          </button>
        </div>
      </div>

      {/* عنوان */}
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-2 text-right">
          عنوان
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="خلاصه موضوع"
          className="
            w-full
            bg-[#1d2330]
            rounded-xl
            px-5 py-2.5
            text-md
            text-right
            placeholder:text-[#FAF5F1]/50
            outline-none
            focus:ring-2 focus:ring-white/20
          "
        />
      </div>

      {/* متن اصلی */}
      <div className="mb-8">
        <label className="block text-[12px] font-bold mb-2 text-right">
          متن
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="متن خود را بنویسید..."
          rows={4}
          className="
            w-full
            bg-[#1d2330]
            rounded-xl
            px-5 py-2.5
            text-md
            text-right
            placeholder:text-[#FAF5F1]/50
            outline-none
            resize-none
            focus:ring-2 focus:ring-white/20
          "
        />
      </div>

      {/* دکمه ثبت */}
      <button
        onClick={submitHandler}
        disabled={loading}
        className="
          w-[300px] h-[34px]
          mx-auto
          bg-[#00FFA3]
          rounded-[10px]
          text-black
          text-[15px]
          font-semibold
          shadow-[0_5px_80px_rgba(0,255,163,0.5)]
          flex items-center justify-center
          transition-transform
          active:scale-95
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      >
        {loading ? "در حال ثبت..." : "ثبت بازخورد"}
      </button>
    </div>
  );
};

export default FeedbackFormModal;