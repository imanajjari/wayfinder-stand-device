import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoReload, IoWarning, IoCheckmarkCircle } from "react-icons/io5";
import { postSetting } from "../../services/settingService";
import { saveFloors, saveMyStand, saveStandData, saveDestinations } from "../../services/floorService";
import { getAllDestinations } from "../../services/destinationService";
import { saveCompanyWithLogo } from "../../services/companyService";
import SettingsLayout from "../../layouts/SettingsLayout";

export default function UpdateDataPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userCredentials");
    if (!stored) {
      navigate("/setting"); // اطلاعات ذخیره نشده → کاربر باید لاگین کنه
      return;
    }

    const { id, email, password } = JSON.parse(stored);

    const fetchData = async () => {
      try {
        const response = await postSetting({ id, email, password });
        if (response.message === "Stand is valid") {
          if (response.data.floors?.length > 0) saveFloors(response.data.floors);
          saveStandData(response.data);
          if (response.user) await saveCompanyWithLogo(response.data.user);

          const myStand = response.data.stands?.find((stand) => stand.isMe);
          if (myStand) saveMyStand(myStand);

          const dest = await getAllDestinations();
          saveDestinations(dest);

          setStatus("success");
          setMessage("✅ داده‌ها با موفقیت به‌روزرسانی شدند");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setStatus("error");
          setMessage("⚠️ اطلاعات معتبر نیستند. شاید لازم باشد دوباره لاگین کنید.");
          setTimeout(() => navigate("/setting/reload"), 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("❌ خطا در دریافت داده‌ها. لطفاً دوباره وارد شوید.");
        setTimeout(() => navigate("/setting/reload"), 2000);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <SettingsLayout>
      <div className="w-full max-w-sm sm:max-w-md bg-[#10172A70]/40 backdrop-blur-lg border border-[#414f7470] p-6 rounded-2xl shadow-xl text-center">
        {status === "loading" && (
          <>
            <IoReload className="animate-spin w-10 h-10 mx-auto text-white" />
            <p className="mt-4 text-gray-300">در حال به‌روزرسانی داده‌ها...</p>
          </>
        )}

        {status === "success" && (
          <>
            <IoCheckmarkCircle className="w-10 h-10 mx-auto text-green-500" />
            <p className="mt-4 text-green-700 font-semibold">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <IoWarning className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-4 text-red-700 font-semibold">{message}</p>
          </>
        )}
      </div>
      </SettingsLayout>
  );
}
