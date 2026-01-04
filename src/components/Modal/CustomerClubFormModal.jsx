import { useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { addCustomer } from "../../services/customerService";



const CustomerClubFormModal = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (form.name.trim().length < 5) {
      toast.error("نام باید حداقل ۵ کاراکتر باشد");
      return false;
    }

    // خروجی react-phone-input-2 عددی و بدون +
    if (form.phone.length < 11 || form.phone.length > 15) {
      toast.error("شماره تلفن معتبر نیست");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("ایمیل معتبر نیست");
      return false;
    }

    return true;
  };

  const submitHandler = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await addCustomer({
        name: form.name,
        number: form.phone,
        email: form.email,
      });

      toast.success("عضویت با موفقیت انجام شد 🎉");
      // اگر خواستی بعدش مودال رو ببندی، اینجا صداش بزن
      // closeModal();
    } catch (err) {
      toast.error("خطا در ثبت اطلاعات، دوباره تلاش کنید");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-[#2E4256]
        rounded-2xl
        pxrounded-[50px]
        px-6 py-8
        flex flex-col
        text-white
        w-[351px]
      "
      dir="rtl"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-4">
        باشگاه مشتریان
      </h2>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-2 text-right">
          نام و نام خانوادگی
        </label>
        <input
          name="name"
          value={form.name}
          onChange={(e) =>
            setForm((p) => ({ ...p, name: e.target.value }))
          }
          placeholder="نام کامل"
          className="
            w-full
            bg-[#0E172B]
            rounded-xl
            px-5 py-2.5
            text-md
            text-right
            placeholder:text-[#FAF5F1]/50
            outline-none
          "
        />
      </div>

      {/* Phone (All countries + flags + search) */}
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-2 text-right">
          شماره تلفن
        </label>
<PhoneInput
  country="ir"
  value={form.phone}
  onChange={(phone) => setForm((p) => ({ ...p, phone }))}
  enableSearch
  inputProps={{ name: "phone", required: true }}
  containerClass="cc-phone"
  containerStyle={{ width: "100%" }}
  inputStyle={{
    width: "100%",
    height: "42px",
    background: "#0E172B",
    color: "white",
    borderRadius: "12px",
    border: "none",
    paddingRight: "58px",
    paddingLeft: "12px",
    fontSize: "14px",
    direction: "ltr",
    boxSizing: "border-box",
  }}
  buttonStyle={{
    background: "#0E172B",
    border: "none",
    height: "42px",
    width: "56px",
    borderRadius: "12px 0 0 12px",
  }}
  dropdownStyle={{
    background: "#0E172B",
    color: "white",
    borderRadius: "12px",
    marginTop: "4px",
  }}
  searchStyle={{
    background: "#1A2540",
    color: "white",
    border: "none",
  }}
/>
      </div>

      {/* Email */}
      <div className="mb-8">
        <label className="block text-[12px] font-bold mb-2 text-right">
          ایمیل
        </label>
        <input
          name="email"
          value={form.email}
          onChange={(e) =>
            setForm((p) => ({ ...p, email: e.target.value }))
          }
          placeholder="example@email.com"
          className="
            w-full
            bg-[#0E172B]
            rounded-xl
            px-5 py-2.5
            text-md
            text-right
            placeholder:text-[#FAF5F1]/50
            outline-none
          "
        />
      </div>

      {/* Submit */}
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
        {loading ? "در حال ثبت..." : "ثبت"}
      </button>
    </div>
  );
};

export default CustomerClubFormModal;
