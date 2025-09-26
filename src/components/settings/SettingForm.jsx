// src\components\settings\SettingForm.jsx
import React from "react";
import { useForm } from "react-hook-form";

import { IoMail, IoLockClosed } from "react-icons/io5";
import { FaHashtag } from "react-icons/fa";
import InputWithIcon from "./InputWithIcon";
import GradientButton from "./GradientButton";
import { useNavigate } from "react-router-dom";
import {useSettingForm} from '../../hooks/useSettingForm'
import FormHeader from "./FormHeader";

export default function SettingForm() {
  const navigate = useNavigate();
  const { isLoading, handleFormSubmit } = useSettingForm(navigate);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
    <FormHeader />
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="p-6 sm:px-6 sm:py-10 lg:px-10 lg:py-24 xl:py-10 
                 bg-[#10172A70]/40 backdrop-blur-lg 
                 rounded-3xl sm:rounded-[44px] 
                 border border-[#324154] shadow-xl space-y-5"
    >
      <InputWithIcon
        label="شناسه (ID)"
        placeholder="شناسه خود را وارد کنید"
        Icon={FaHashtag}
        error={errors.id?.message}
        {...register("id", { required: "شناسه الزامی است" })}
      />

      <InputWithIcon
        label="ایمیل"
        type="email"
        placeholder="example@domain.com"
        Icon={IoMail}
        error={errors.email?.message}
        {...register("email", {
          required: "ایمیل الزامی است",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "ایمیل معتبر نیست",
          },
        })}
      />

      <InputWithIcon
        label="رمز عبور"
        type="password"
        placeholder="رمز عبور خود را وارد کنید"
        Icon={IoLockClosed}
        error={errors.password?.message}
        {...register("password", { required: "رمز عبور الزامی است" })}
      />

      <GradientButton
        text="تایید و ذخیره"
        isLoading={isLoading}
        type="submit"
      />
    </form>
    <p className="hidden sm:block text-center text-gray-300 text-xs mt-6 lg:text-2xl">
            اطلاعات شما به صورت امن ذخیره می‌شود
          </p>
    </>
  );
}
