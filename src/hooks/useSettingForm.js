import { useState } from "react";
import { postSetting } from "../services/settingService";
import {
  saveFloors,
  saveMyStand,
  saveStandData,
  saveDestinations,
} from "../storage/floorStorage";
import { getAllDestinations } from "../services/destinationService";
import { saveCompanyWithLogo } from "../storage/companyStorage";
import { toast } from "react-toastify";

export function useSettingForm(navigate) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndSaveDestinations = async () => {
    try {
      const response = await getAllDestinations();
      saveDestinations(response);
    } catch (error) {
      console.error("خطا در دریافت یا ذخیره مقاصد:", error);
      toast.error("خطا در بارگیری مقاصد");
    }
  };

  const handleFormSubmit = async (data) => {
    const { id, email, password } = data;

    localStorage.setItem("userCredentials", JSON.stringify({ id, email, password }));
    setIsLoading(true);

    try {
      const response = await postSetting({ id, email, password });
      console.log('postSetting response:', response);
      console.log('postSetting saveFloors:', response.data.floors);
      console.log('postSetting saveCompanyWithLogo:', response.data.user);
      
      if (response.message === "Stand is valid") {
        if (response.data.floors?.length > 0) saveFloors(response.data.floors);
        saveStandData(response.data);
        if (response.data.user) await saveCompanyWithLogo(response.data.user);

        const myStand = response.data.stands?.find((stand) => stand.isMe);
        if (myStand) saveMyStand(myStand);

        await fetchAndSaveDestinations();
        toast.success("خوش آمدید");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.warn("اطلاعات معتبر نیستند");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارسال تنظیمات");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleFormSubmit };
}
