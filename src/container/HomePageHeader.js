import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
const HomePageHeader = () => {
  const token = Cookies.get("Token");
  const scope = Cookies.get("Scope");
  const router = useRouter();
  const exitHandler = () => {
    Cookies.remove("Token");
    Cookies.remove("Scope");
    Cookies.remove("nationalCode");
    Cookies.remove("phoneNumber");
    Cookies.remove("userTypeId");
    Cookies.remove("aesVector");
    Cookies.remove("aeskey");
    router.push("/user/login");
  };
  return (
    <div className="bg-neutralColor-5 max-w-[600px] top-0 sticky transition-all duration-700 container mx-auto p-6 ">
      <div className="flex justify-between items-center">
        <Image
          priority
          src="/assets/Images/logo/newLogo.webp"
          width={65}
          height={50}
          alt="LOGO"
        />
        <div className="w-[100px] h-[40px] bg-errorColor-2 text-naturalColor-2 text-[14px] flex items-center justify-center rounded-md whitespace-nowrap">
          {/* //TODO : if there is coockie text have to change to  */}
          {token || scope ? (
            <Link href="/user/login" onClick={exitHandler}>
              خروج
            </Link>
          ) : (
            <Link href="/user/login">ورود | ثبت نام</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageHeader;
