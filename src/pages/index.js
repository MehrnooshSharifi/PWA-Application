import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("Token");
    const scope = Cookies.get("Scope");
    const terminalId = Cookies.get("terminalId");
    const aesVector = Cookies.get("aesVector");
    const aeskey = Cookies.get("aeskey");
    const userTypeId = Cookies.get("userTypeId");
    if (!token || !scope) {
      router.push("/user/login");
    } else if (aeskey && aesVector) {
      router.push("/servicesPage");
    } else if (!terminalId) {
      router.push("/user/panel/terminal/addTerminal");
    }
  }, [router]);

  return null;
};

export default HomePage;
