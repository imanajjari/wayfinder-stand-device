import { useState } from "react";
import { postSetting } from "../services/settingService";
import {
  saveFloors,
  saveMyStand,
  saveStandData,
  saveDestinations,
} from "../services/floorService";
import { getAllDestinations } from "../services/destinationService";
import { saveCompanyWithLogo } from "../services/companyService";
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
      if (response.message === "Stand is valid") {
        if (response.floors?.length > 0) saveFloors(response.floors);
        saveStandData(response);
        if (response.user) await saveCompanyWithLogo(response.user);

        const myStand = response.stands?.find((stand) => stand.isMe);
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
