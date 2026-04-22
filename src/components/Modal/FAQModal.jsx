// src/components/Modal/FAQModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFaqs, getFaqById } from '../../services/faqService';
import { useModalManager } from '../../contexts/ModalManagerContext';
import { FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';

const FAQModal = () => {
  const [faqs, setFaqs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(null);
  const [answersCache, setAnswersCache] = useState({}); // ذخیره جواب‌های قبلاً گرفته شده
  const { hideModal } = useModalManager();
  const perPage = 10;

  // بارگذاری لیست سوالات (با صفحه‌بندی)
  const loadFaqs = async (page) => {
    try {
      setLoading(true);
      const res = await getFaqs(page, perPage);
      const { faqs: newFaqs, pages } = res.data.data;
      setFaqs(newFaqs);
      setTotalPages(pages);
    } catch (err) {
      toast.error('خطا در دریافت سوالات متداول');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setExpandedId(null); // بستن همه آیتم‌ها هنگام تغییر صفحه
    }
  };

  const toggleAnswer = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    // اگر قبلاً جواب این سوال را داریم، فقط نمایش بده
    if (answersCache[id]) {
      setExpandedId(id);
      return;
    }

    // در غیر این صورت از سرور بگیر
    try {
      setAnswerLoading(id);
      const res = await getFaqById(id);
      const { question, answer, file } = res.data.data;
      setAnswersCache(prev => ({
        ...prev,
        [id]: { question, answer, file }
      }));
      setExpandedId(id);
    } catch (err) {
      toast.error('خطا در دریافت پاسخ سوال');
      console.error(err);
    } finally {
      setAnswerLoading(null);
    }
  };

  return (
    <div
      className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-8 flex flex-col text-white w-[500px] max-w-[90vw] max-h-[80vh]"
      dir="rtl"
    >
      <h2 className="text-xl font-bold text-center mb-4">سوالات متداول</h2>

      {/* لیست سوالات */}
      <div className="overflow-y-auto flex-1 space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        )}

        {!loading &&
          faqs.map((item) => {
            const isExpanded = expandedId === item.id;
            const isLoadingAnswer = answerLoading === item.id;
            const cached = answersCache[item.id];

            return (
              <div
                key={item.id}
                className="bg-[#0E172B] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleAnswer(item.id)}
                  className="w-full px-4 py-3 text-right flex justify-between items-center hover:bg-[#1A2540] transition"
                >
                  <span className="font-medium">{item.question}</span>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isExpanded && (
                  <div className="px-4 py-3 border-t border-gray-600 text-gray-200 text-sm">
                    {isLoadingAnswer ? (
                      <div className="flex justify-center py-2">
                        <FaSpinner className="animate-spin" />
                      </div>
                    ) : cached ? (
                      <>
                        <p>{cached.answer}</p>
                        {cached.file && (
                          <div className="mt-2 text-blue-300">
                            📎 <a href="#" className="underline">مشاهده فایل ضمیمه</a>
                          </div>
                        )}
                      </>
                    ) : (
                      <p>خطا در بارگذاری پاسخ</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-[#0E172B] disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-3 py-1">
            {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-[#0E172B] disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      )}

      {/* دکمه بستن */}
      <button
        onClick={hideModal}
        className="mt-6 w-full py-2 rounded-lg bg-gray-500 hover:bg-gray-600 transition text-white"
      >
        بستن
      </button>
    </div>
  );
};

export default FAQModal;