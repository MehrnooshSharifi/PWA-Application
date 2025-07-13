import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { TerminalInfoByUserId } from "@/server/Services";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
const IoChevronBackSharp = dynamic(
  () => import("react-icons/io5").then((mod) => mod.IoChevronBackSharp),
  { ssr: false }
);
const AddTerminalPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = Cookies.get("nationalCode");
  const initialValues = {
    terminalId: "",
  };
  const validationSchema = Yup.object({
    terminalId: Yup.string().required("شماره ترمینال را وارد نمایید"),
  });
  const onSubmit = async (values, { resetForm }) => {
    console.log(values, userId);
    try {
      setIsLoading(true);
      const res = await TerminalInfoByUserId(userId, values);
      if (res.isSuccess) {
        toast.success("عملیات با موفقیت انجام شد");
        const { data } = res;
        Cookies.set("aesVector", data.aesVector);
        Cookies.set("aeskey", data.aeskey);
        Cookies.set("terminalId", data.terminalId);
        router.push("/servicesPage");
        console.log(data);
        setIsLoading(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      router.push("/user/panel");
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
  });
  return (
    <div className="flex flex-col container mx-auto max-w-[600px] overflow-y-auto h-screen bg-neutralColor-5 p-6">
      <form
        onSubmit={formik.handleSubmit}
        className="flex-col items-center  mt-[100px]"
        autoComplete="off"
      >
        <div className="flex flex-col gap-y-[30px] items-center justify-center">
          <div className="w-full max-w-[340px] flex gap-x-[5px] items-center text-[14px]">
            <Link href="/user/panel">
              <p>پروفایل</p>
            </Link>
            <IoChevronBackSharp />
            <p className="text-neutralColor-2">افزودن ترمینال</p>
          </div>
          <div className="flex flex-col w-full max-w-[340px]">
            <label className="text-neutralColor-2 flex items-center  text-[14px] lg:text-[14px] px-2  whitespace-nowrap leading-[27.64px]  bg-naturalColor-2 absolute -mt-[15px] mx-4  font-medium">
              شماره ترمینال
            </label>
            <input
              {...formik.getFieldProps("terminalId")}
              className="focus-within:border-2 w-full focus-within:border-primaryColor-1 pr-[6px]  h-[48px]  lg:text-[16px] border border-neutralColor-3 rounded-[5px] bg-naturalColor-2 px-7 outline-none focus:bg-naturalColor-2"
              name="terminalId"
              type="text"
            />
            <div className={`absolute top-[225px]  lg:text-[12px] text-[10px]`}>
              {formik.touched.terminalId && formik.errors.terminalId && (
                <div className="flex gap-x-2 items-center ">
                  <span className="text-red-400">
                    {formik.errors.terminalId}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full max-w-[340px] h-[48px]  bg-errorColor-2 rounded-md text-naturalColor-2 text-[14px]"
          >
            <div className="flex  justify-center items-center">
              <div className="w-[40px]">
                {isLoading ? (
                  <ThreeDots
                    height="10"
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
                    ایجاد ترمینال
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTerminalPage;
