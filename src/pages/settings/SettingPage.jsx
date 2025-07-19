import React, { useState } from 'react';
import { IoSettings, IoMail, IoLockClosed, IoCheckmarkCircle, IoWarning, IoClose } from 'react-icons/io5';
import { FaHashtag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Mock functions - replace with your actual imports
const postSetting = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'Stand is valid', floors: [], stands: [{ isMe: true }], user: {} };
};

const saveFloors = (floors) => console.log('Saving floors:', floors);
const saveMyStand = (stand) => console.log('Saving my stand:', stand);
const saveStandData = (data) => console.log('Saving stand data:', data);
const saveDestinations = (destinations) => console.log('Saving destinations:', destinations);
const getAllDestinations = async () => [];
const saveCompanyWithLogo = async (user) => console.log('Saving company with logo:', user);

export default function SettingPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // تابع ذخیره مقاصد
  const fetchAndSaveDestinations = async () => {
    try {
      const response = await getAllDestinations();
      saveDestinations(response);
      console.log('مقاصد با موفقیت ذخیره شد.');
    } catch (error) {
      console.error('خطا در دریافت یا ذخیره مقاصد:', error);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await postSetting({ id, email, password });
      if (response.message === 'Stand is valid') {
        if (response.floors && response.floors.length > 0) {
          saveFloors(response.floors);
        }

        saveStandData(response);

        // ذخیره کمپانی
        if (response.user) {
          await saveCompanyWithLogo(response.user);
        }

        const myStand = response.stands.find(stand => stand.isMe);
        if (myStand) {
          saveMyStand(myStand);
        }

        // دریافت و ذخیره مقاصد
        await fetchAndSaveDestinations();

        setMessage('✅ داده‌ها با موفقیت تنظیم شدند، درحال بازگشت...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('⚠️ اطلاعات معتبر نیستند');
      }
    } catch (err) {
      console.error(err);
      setError('❌ خطا در ارسال تنظیمات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl md:rounded-3xl shadow-lg mb-4 md:mb-6">
            <IoSettings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            تنظیمات استند
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            اطلاعات خود را وارد کنید
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* ID Input */}
            <div className="group">
              <label className="block text-gray-700 text-sm sm:text-base md:text-lg font-medium mb-2 md:mb-3">
                شناسه (ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaHashtag className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full pr-10 sm:pr-12 md:pr-14 pl-3 sm:pl-4 md:pl-5 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white placeholder-gray-400"
                  placeholder="شناسه خود را وارد کنید"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label className="block text-gray-700 text-sm sm:text-base md:text-lg font-medium mb-2 md:mb-3">
                ایمیل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IoMail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 sm:pr-12 md:pr-14 pl-3 sm:pl-4 md:pl-5 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white placeholder-gray-400"
                  placeholder="example@domain.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-gray-700 text-sm sm:text-base md:text-lg font-medium mb-2 md:mb-3">
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IoLockClosed className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 sm:pr-12 md:pr-14 pl-3 sm:pl-4 md:pl-5 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white placeholder-gray-400"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 md:py-5 px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2 space-x-reverse"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>در حال پردازش...</span>
                </>
              ) : (
                <span>تایید و ذخیره</span>
              )}
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className="mt-4 md:mt-6 p-4 md:p-5 bg-green-50 border-2 border-green-200 rounded-xl md:rounded-2xl flex items-center space-x-3 space-x-reverse animate-pulse">
              <IoCheckmarkCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-500 flex-shrink-0" />
              <span className="text-green-700 font-medium text-sm sm:text-base md:text-lg">{message}</span>
            </div>
          )}

          {error && (
            <div className="mt-4 md:mt-6 p-4 md:p-5 bg-red-50 border-2 border-red-200 rounded-xl md:rounded-2xl flex items-center space-x-3 space-x-reverse">
              <IoWarning className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-red-500 flex-shrink-0" />
              <span className="text-red-700 font-medium text-sm sm:text-base md:text-lg flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <IoClose className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-500 text-xs sm:text-sm md:text-base">
            اطلاعات شما به صورت امن ذخیره می‌شود
          </p>
        </div>
      </div>
    </div>
  );
}