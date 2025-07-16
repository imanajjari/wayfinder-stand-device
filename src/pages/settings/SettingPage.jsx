import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSetting } from '../../services/settingService';
import { saveFloors, saveMyStand, saveStandData } from '../../services/floorService';

export default function SettingPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
  
    try {
      const response = await postSetting({ id, email, password });
      if (response.message === 'Stand is valid') {
        if (response.floors && response.floors.length > 0) {
          saveFloors(response.floors);
        }
  
        saveStandData(response);
  
        // ذخیره استند متعلق به کاربر
        const myStand = response.stands.find(stand => stand.isMe);
        if (myStand) {
          saveMyStand(myStand);
        }
  
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
    }
  };
  

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold mb-4">تنظیمات استند</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block">ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ارسال
        </button>
      </form>

      {message && <div className="text-green-600">{message}</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
