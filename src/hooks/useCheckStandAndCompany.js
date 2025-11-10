// src\hooks\useCheckStandAndCompany.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanyData } from "../storage/companyStorage";
import { getMyStand } from "../storage/floorStorage";

/**
 * بررسی اطلاعات کمپانی و استند.
 * اگر یکی از اینها نبود، به /setting منتقل می‌شود.
 */
const useCheckStandAndCompany = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const company = getCompanyData();
    const myStand = getMyStand();

    if (!company || !myStand) {
      console.warn("🔴 اطلاعات کمپانی یا استند موجود نیست. انتقال به /setting");
      navigate('/setting');
    }
  }, [navigate]);
};

export default useCheckStandAndCompany;
