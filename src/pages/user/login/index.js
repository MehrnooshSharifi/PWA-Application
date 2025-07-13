import { GetUserInfo, Login } from "@/server/Services";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import * as Yup from "yup";
import Cookies from "js-cookie";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const initialValues = {
    id: "",
    phoneNumber: "",
    userTypeId: "0",
  };
  const validationSchema = Yup.object({
    userTypeId: Yup.string().required(" نام شرکت را وارد نمایید"),
    id: Yup.string()
      .required("کد ملی/شناسه ملی را وارد نمایید")
      .min(10, "شناسه ملی باید 11 رقم باشد/کد ملی باید  10 رقم باشد")
      .max(11, "کد ملی حداکثر 10 رقم / شناسه ملی حداکثر 11 رقم می باشد"),
    phoneNumber: Yup.string()
      .required("شماره موبایل را وارد کنید")
      .min(11, "شماره تلفن همراه باید 11 رقم باشد")
      .max(11, "شماره تلفن همراه باید 11 رقم باشد"),
  });
  const onSubmit = async (user, { resetForm }) => {
    console.log(user);
    setIsLoading(true);
    router.push("/user/otp");
    const res = await Login(user);
    if (res.isSuccess) {
      console.log(res);
      Cookies.set("Scope", res.Scope);
      Cookies.set("phoneNumber", user.phoneNumber);
      Cookies.set("nationalCode", user.id);
      Cookies.set("userTypeId", user.userTypeId);
      const userInfo = await GetUserInfo(user.id);
      console.log(userInfo);
    } else {
      console.log(res.message);
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
  });
  return (
    <div className="flex flex-col container mx-auto bg-neutralColor-5 max-w-[600px] overflow-y-auto h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="flex-col items-center  mt-[100px] "
        autoComplete="off"
      >
        <div className=" flex flex-col items-center gap-y-[30px] ">
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              priority
              alt="logo"
              src="/assets/Images/logo/newLogo.webp"
              width={80}
              height={80}
            />
          </div>
          <h2 className="text-[16px] font-bold">ورود | ثبت نام</h2>
          <div
            className="flex gap-x-[10px] items-center
        "
          >
            <input
              defaultChecked
              className=""
              type="radio"
              id="genuine"
              name="userTypeId"
              value="0"
              onChange={formik.handleChange}
            />
            <label for="genuine" className="text-[14px]">
              حقیقی
            </label>
            <br />
            <input
              type="radio"
              id="legal"
              name="userTypeId"
              value="1"
              onChange={formik.handleChange}
            />
            <label for="legal" className="text-[14px]">
              حقوقی
            </label>
            <br />
          </div>
          <div className="flex flex-col w-full max-w-[340px]">
            <label
              className={`${
                formik.values.userTypeId == "0"
                  ? "w-[56px]  h-[15px]"
                  : "w-[80px]  h-[15px]"
              }  text-neutralColor-2 flex items-center  text-[14px] lg:text-[14px] px-2  whitespace-nowrap leading-[27.64px]  bg-naturalColor-2 absolute -mt-[10px] mx-4  font-medium`}
            >
              {formik.values.userTypeId == "0" ? "کدملی" : "شناسه ملی"}
            </label>
            <input
              {...formik.getFieldProps("id")}
              className="focus-within:border-2 w-full focus-within:border-primaryColor-1 pr-[6px]  h-[48px]  lg:text-[16px] border border-neutralColor-3 rounded-[5px] bg-naturalColor-2 px-7 outline-none focus:bg-naturalColor-2"
              name="id"
              type="text"
            />
            <div className={`absolute top-[360px]  lg:text-[12px] text-[10px]`}>
              {formik.touched.id && formik.errors.id && (
                <div className="flex gap-x-2 items-center ">
                  <span className="text-red-400">{formik.errors.id}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[340px]">
            <label className="w-[120px]  h-[15px]  text-neutralColor-2 flex items-center  text-[14px] lg:text-[14px] px-2  whitespace-nowrap leading-[27.64px]  bg-naturalColor-2 absolute -mt-[10px] mx-4  font-medium">
              شماره تلفن همراه
            </label>
            <input
              {...formik.getFieldProps("phoneNumber")}
              className="focus-within:border-2 w-full focus-within:border-primaryColor-1 pr-[6px]  h-[48px]  lg:text-[16px] border border-neutralColor-3 rounded-[5px] bg-naturalColor-2 px-7 outline-none focus:bg-naturalColor-2"
              name="phoneNumber"
              type="text"
            />
            <div className={`absolute top-[440px] lg:text-[12px] text-[10px]`}>
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="flex gap-x-2 items-center ">
                  <span className="text-red-400">
                    {formik.errors.phoneNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            disabled={!formik.isValid}
            type="submit"
            className={` rounded-[5px]  bg-errorColor-2  text-center  px-[16px] text-naturalColor-2 text-[14px] font-medium  w-full max-w-[340px] h-[48px]  lg:text-[16px]  bottom-[30px] lg:mb-2  mt-[17.51px] ${
              !formik.isValid
                ? "cursor-not-allowed opacity-30"
                : "cursor-pointeropacity-100"
            }`}
          >
            <div className="flex  justify-center items-center">
              <div className="w-[40px] ">
                {isLoading ? (
                  <ThreeDots
                    height="40"
                    width="40"
                    radius="9"
                    color="#FAFAFA"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  <span className="whitespace-nowrap flex items-center justify-center">
                    ورود | ثبت نام
                  </span>
                )}
              </div>
            </div>
          </button>
          <div className="flex gap-x-[5px] text-[12px] w-full max-w-[340px]">
            <span>ورود شما به معنای پذیرش</span>
            <Link href="/" className="text-primaryColor-1">
              شرایط تبادل
            </Link>
            <span>و</span>
            <Link href="/" className="text-primaryColor-1">
              قوانین حریم خصوصی
            </Link>
            <span>است</span>
          </div>
        </div>
      </form>
    </div>
  );
}
