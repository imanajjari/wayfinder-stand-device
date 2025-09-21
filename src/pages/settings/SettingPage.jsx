import React, { useState } from 'react';
import { IoSettings, IoMail, IoLockClosed, IoCheckmarkCircle, IoWarning, IoClose } from 'react-icons/io5';
import { FaHashtag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { postSetting } from '../../services/settingService';
import { saveFloors, saveMyStand, saveStandData, saveDestinations } from '../../services/floorService';
import { getAllDestinations } from '../../services/destinationService';
import { saveCompanyWithLogo } from '../../services/companyService';

export default function SettingPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndSaveDestinations = async () => {
    try {
      const response = await getAllDestinations();
      saveDestinations(response);
      console.log('مقاصد با موفقیت ذخیره شد.');
    } catch (error) {
      console.error('خطا در دریافت یا ذخیره مقاصد:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // به فرم جلوگیری از ریفرش بده


    // ذخیره اطلاعات کاربر در localStorage
    localStorage.setItem("userCredentials", JSON.stringify({ id, email, password }));




    setError(null);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await postSetting({ id, email, password });
      if (response.message === 'Stand is valid') {
        if (response.floors?.length > 0) {
          saveFloors(response.floors);
        }

        saveStandData(response);

        if (response.user) {
          await saveCompanyWithLogo(response.user);
        }

        const myStand = response.stands?.find(stand => stand.isMe);
        if (myStand) {
          saveMyStand(myStand);
        }

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
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <IoSettings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">تنظیمات استند</h1>
          <p className="text-gray-600">اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border p-6 space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">شناسه (ID)</label>
            <div className="relative">
              <FaHashtag className="absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full pr-10 pl-3 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="شناسه خود را وارد کنید"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">ایمیل</label>
            <div className="relative">
              <IoMail className="absolute right-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-3 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="example@domain.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">رمز عبور</label>
            <div className="relative">
              <IoLockClosed className="absolute right-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-3 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-transform transform hover:scale-105 active:scale-95"
          >
            {isLoading ? 'در حال پردازش...' : 'تایید و ذخیره'}
          </button>

          {message && (
            <div className="flex items-center mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              <IoCheckmarkCircle className="mr-2 text-green-500" /> {message}
            </div>
          )}

          {error && (
            <div className="flex items-center mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <IoWarning className="mr-2 text-red-500" /> {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <IoClose />
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          اطلاعات شما به صورت امن ذخیره می‌شود
        </p>
      </div>
    </div>
  );
}
