import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";
import { GetToken } from "@/server/Services";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
export default function OTPPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef(null); // Ref for the OTP input
  const router = useRouter();
  const scope = Cookies.get("Scope");
  const userNationalCode = Cookies.get("nationalCode");
  const terminalId = Cookies.get("terminalId");
  const phoneNumber = Cookies.get("phoneNumber");
  const aesVector = Cookies.get("aesVector");
  const aeskey = Cookies.get("aeskey");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ otp, scope, userNationalCode });
    try {
      const res = await GetToken({ otp, scope, userNationalCode });
      console.log(res);
      if (res.access_token) {
        Cookies.set("Token", res.access_token);
      } else {
        toast.error(res.message);
      }
      if (terminalId && aeskey && aesVector) {
        router.push("/servicesPage");
      } else {
        router.push("/user/panel/terminal/addTerminal");
      }
    } catch (error) {}
  };

  const handleOTPInput = async () => {
    if ("OTPCredential" in window) {
      try {
        const otpCredential = await navigator.credentials.get({
          otp: { transport: ["sms"] },
        });
        console.log("OTP Credential:", otpCredential); // Log for debugging
        if (otpCredential && otpCredential.code) {
          setOtp(otpCredential.code); // Autofill the OTP
          otpInputRef.current?.blur(); // Optionally blur the input
        }
      } catch (err) {
        console.error("Error fetching OTP:", err);
      }
    }
  };

  useEffect(() => {
    otpInputRef.current?.focus(); // Focus input on mount
    handleOTPInput(); // Start listening for OTP autofill
  }, []);

  return (
    <div className="flex flex-col container mx-auto bg-neutralColor-5 max-w-[600px] overflow-y-auto h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex-col items-center mt-[100px]"
        autoComplete="off"
      >
        <div className="flex flex-col items-center gap-y-[30px]">
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              priority
              alt="logo"
              src="/assets/Images/logo/newLogo.webp"
              width={80}
              height={80}
            />
          </div>
          <h2 className="text-[16px] font-bold">کد تایید را وارد کنید</h2>
          <p className="text-[14px] text-neutralColor-2">
            کد تایید برای شماره {phoneNumber} پیامک شد
          </p>
          <div className="flex flex-col w-full max-w-[340px]">
            <input
              ref={otpInputRef}
              className="focus-within:border-2 text-neutralColor-2 w-full focus-within:border-primaryColor-1 pr-[6px] h-[48px] lg:text-[16px] border border-neutralColor-3 rounded-[5px] bg-naturalColor-2 px-7 outline-none focus:bg-naturalColor-2"
              name="otp"
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              placeholder="Enter OTP"
              autoFocus // Ensures field is focused
            />
          </div>
          <button
            disabled={!otp}
            type="submit"
            className={`rounded-[5px] bg-errorColor-2 text-center px-[16px] text-naturalColor-2 text-[14px] font-medium w-full max-w-[340px] h-[48px] ${
              !otp
                ? "cursor-not-allowed opacity-30"
                : "cursor-pointer opacity-100"
            }`}
          >
            {isLoading ? (
              <ThreeDots
                height="40"
                width="40"
                radius="9"
                color="#FAFAFA"
                ariaLabel="three-dots-loading"
              />
            ) : (
              "تایید"
            )}
          </button>
          <Link
            href="/user/login"
            className="text-[12px] font-bold text-primaryColor-1"
          >
            برگشت به مرحله قبل
          </Link>
        </div>
      </form>
    </div>
  );
}
