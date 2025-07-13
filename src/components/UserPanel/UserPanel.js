import HomePageFooter from "@/container/HomePageFooter";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
const FaChevronLeft = dynamic(
  () => import("react-icons/fa6").then((mod) => mod.FaChevronLeft),
  { ssr: false } // Disable SSR
);
const IoTerminal = dynamic(
  () => import("react-icons/io5").then((mod) => mod.IoTerminal),
  { ssr: false }
);
const MdOutlineSupportAgent = dynamic(
  () => import("react-icons/md").then((mod) => mod.MdOutlineSupportAgent),
  { ssr: false }
);
const IoIosExit = dynamic(
  () => import("react-icons/io").then((mod) => mod.IoIosExit),
  { ssr: false }
);
const UserPanel = () => {
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
  const phoneNumber = Cookies.get("phoneNumber");
  return (
    <>
      <div className="flex flex-col container mx-auto bg-neutralColor-5 max-w-[600px] overflow-y-auto h-screen">
        <span className="w-full h-[80px] flex items-center bg-white p-4">
          پنل کاربری
        </span>
        <div className=" h-screen flex flex-col items-start p-4 ">
          {/* welcome section */}
          <div className="flex flex-col w-full bg-errorColor-2 h-[100px] rounded-lg p-4 mb-[30px]">
            <div className="flex justify-between mb-[10px] ">
              <div className="flex  gap-x-[5px] text-neutralColor-5 font-bold text-[12px] md:text-[14px]">
                <span>{phoneNumber}</span>
                <span>خوش آمدید</span>
              </div>
              <div className="bg-errorColor-4 rounded-md w-[20px] h-[20px] flex items-center justify-center">
                <FaChevronLeft className="w-4 h-4 fill-neutralColor-5" />
              </div>
            </div>
            <hr className="mb-[10px]" />
            <div className="flex justify-between items-center text-neutralColor-5  text-[12px] md:text-[14px]">
              <span>امتیاز شما</span>
              <div className="flex gap-x-[3px]">
                <span className="font-bold">500</span>
                <span>ریال</span>
              </div>
            </div>
          </div>
          {/* main profile section */}
          <div className="bg-naturalColor-2 w-full flex flex-col rounded-md p-4 mb-[50px]">
            <div
              className="flex justify-between mb-[10px] w-full h-[50px] items-center p-2 rounded-md hover:bg-neutralColor-5 cursor-pointer"
              onClick={() => router.push("/user/panel/terminal/addTerminal")}
            >
              <div className="flex items-center  gap-x-[5px] text-neutralColor-2  text-[12px] md:text-[14px]">
                <IoTerminal className="fill-neutralColor-3 w-5 h-5" />
                <span>ترمینال</span>
              </div>
              <FaChevronLeft className="w-4 h-4 fill-neutralColor-3" />
            </div>
          </div>
          {/* support and ... section */}
          <div className="bg-naturalColor-2 w-full flex flex-col gap-y-[10px] rounded-lg p-4">
            <div className="flex justify-between mb-[10px] w-full h-[50px] items-center p-2 rounded-md hover:bg-neutralColor-5 cursor-pointer">
              <div className="flex items-center  gap-x-[5px] text-neutralColor-2  text-[12px] md:text-[14px]">
                <MdOutlineSupportAgent className="fill-neutralColor-3 w-6 h-6" />
                <span>پشتیبانی</span>
              </div>
              <FaChevronLeft className="w-4 h-4 fill-neutralColor-3" />
            </div>
            <div className="flex justify-between mb-[10px] w-full h-[50px] items-center p-2 rounded-md hover:bg-neutralColor-5 cursor-pointer">
              <div
                className="flex items-center  gap-x-[5px] text-neutralColor-2  text-[12px] md:text-[14px]"
                onClick={exitHandler}
              >
                <IoIosExit className="fill-errorColor-2 w-7 h-7" />
                <span>خروج</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomePageFooter />
    </>
  );
};

export default UserPanel;
