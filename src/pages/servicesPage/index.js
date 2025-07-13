import Services from "@/components/Services/Services";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";
import servicesType from "../../../Data/servicesType";
import Layout from "@/container/Layout";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ChequeInquiry } from "@/server/Services";
import { IoMdCloseCircle } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";
const ServicesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCodeSection, setShowQRCodeSection] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [decodedText, setDecodedText] = useState(null);
  const [sayadiId, setSayadiId] = useState();
  const [showQRInfo, setShowQRInfo] = useState(false);
  const [showChequeInfo, setChequeInfo] = useState(false);
  const [chequeMedia, setChequeMedia] = useState(false);
  const [serialNo, setSerialNo] = useState(false);
  const [seriesNo, setSeriesNo] = useState(false);
  const [amount, setAmount] = useState(null);
  const [chequeStatus, setChequeStatus] = useState(null);
  const [sayadId, setSayadId] = useState(null);
  const router = useRouter();
  const scope = Cookies.get("Scope");
  const userNationalCode = Cookies.get("nationalCode");
  const terminalId = Cookies.get("terminalId");
  const phoneNumber = Cookies.get("phoneNumber");
  const aesVector = Cookies.get("aesVector");
  const aeskey = Cookies.get("aeskey");
  const sayadiHandler = (e) => {
    setSayadiId(e.target.value);
    console.log(e.target.value);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const sendSayadiIdHandler = async (e) => {
    e.preventDefault();
    console.log(sayadiId);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
      const fullTime = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
      const combinedData = `${sayadiId}${fullTime}`;
      const aesKey = base64ToUint8Array(aeskey);
      const aesIv = base64ToUint8Array(aesVector);
      const encryptedBase64 = await encryptWithAES(aesKey, aesIv, combinedData);
      const res = await ChequeInquiry(terminalId, encryptedBase64);
      console.log(res);
      if (res.isSuccess) {
        setChequeInfo(true);
        setChequeMedia(res.data.records[0].respObject.chequeMedia);
        setSeriesNo(res.data.records[0].respObject.seriesNo);
        setSerialNo(res.data.records[0].respObject.serialNo);
        setChequeStatus(res.data.records[0].respObject.chequeStatus);
        setAmount(res.data.records[0].respObject.amount);
        setSayadId(res.data.records[0].respObject.sayadId);
      }
    } catch (err) {
      alert("Encryption failed. Check the console for details.");
    }
  };

  const startCameraAndScanner = async () => {
    try {
      const availableCameras = await Html5Qrcode.getCameras();

      if (!availableCameras || availableCameras.length === 0) {
        alert("No cameras found on this device!");
        return;
      }

      const prioritizedCameras = availableCameras
        .filter((camera) => camera.label.toLowerCase().includes("back"))
        .sort((a, b) => {
          if (a.label.toLowerCase().includes("2 0")) return -1;
          if (b.label.toLowerCase().includes("2 0")) return 1;
          return 0;
        });

      if (prioritizedCameras.length === 0) {
        alert("No back-facing cameras found!");
        return;
      }

      setCameras(prioritizedCameras);

      tryBackCameras(prioritizedCameras);
    } catch (error) {
      console.error("Error getting cameras: ", error);
      alert("Failed to access cameras. Please check permissions.");
    }
  };

  const tryBackCameras = async (cameraList) => {
    if (cameraList.length === 0) {
      alert("No back camera could successfully scan a QR code!");
      return;
    }

    const [currentCamera, ...remainingCameras] = cameraList;

    const html5QrCode = new Html5Qrcode("reader");

    try {
      await html5QrCode.start(
        currentCamera.id,
        {
          fps: 15,
          qrbox: { width: 800, height: 800 },
        },
        (decodedText) => {
          console.log(`Decoded text: ${decodedText}`);
          setDecodedText(decodedText); // Save the decoded text
          setShowQRCodeSection(false); // Hide scanner view
          setScanner(null); // Clear scanner instance
          setShowQRInfo(true);
        },
        (error) => {
          console.warn(
            `Scanning error on camera ${currentCamera.label}: ${error}`
          );
        }
      );

      setSelectedCameraId(currentCamera.id);
      setScanner(html5QrCode);
    } catch (error) {
      console.warn(
        `Failed to start scanner with camera ${currentCamera.label}: ${error}`
      );
      tryBackCameras(remainingCameras);
    }
  };

  const handleServiceClick = (serviceId) => {
    if (serviceId === 1) {
      setShowQRCodeSection(true);
      startCameraAndScanner();
    }
  };

  const closeDecodedText = () => {
    setShowQRCodeSection(false);
    setDecodedText(null); // Clear the decoded text
    setShowQRInfo(false); // Hide the QR info section
    router.reload();
  };

  const closeChequeInfoHandler = () => {
    setChequeInfo(false);
  };

  function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // AES-CBC Encryption Function
  async function encryptWithAES(key, iv, data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    // Import key for AES encryption
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      encodedData
    );

    // Convert encrypted data to Base64
    return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  }

  const sendQRHandler = async () => {
    try {
      // Get the current time
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
      const fullTime = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

      // Extract the 16-character string from the QR code
      const match = decodedText.match(/\b\d{16}\b/); // Match exactly 16 digits
      const sixteenLengthText = match ? match[0] : null;

      if (!sixteenLengthText) {
        alert("No 16-character string found in the QR Code data.");
        return;
      }
      // Combine sixteenLengthText and fullTime
      const combinedData = `${sixteenLengthText}${fullTime}`;
      // Decode AES key and IV from Base64
      const aesKey = base64ToUint8Array(aeskey);
      const aesIv = base64ToUint8Array(aesVector);
      // Ensure key and IV lengths are valid
      if (![16, 24, 32].includes(aesKey.length)) {
        throw new Error("Invalid AES key length. Must be 16, 24, or 32 bytes.");
      }
      if (aesIv.length !== 16) {
        throw new Error("Invalid AES IV length. Must be 16 bytes.");
      }
      // Encrypt the combined data
      const encryptedBase64 = await encryptWithAES(aesKey, aesIv, combinedData);
      setIsLoading(true);
      const res = await ChequeInquiry(terminalId, encryptedBase64);
      if (res.isSuccess) {
        setIsLoading(false);
        setChequeInfo(true);
        setChequeMedia(res.data.records[0].respObject.chequeMedia);
        setSeriesNo(res.data.records[0].respObject.seriesNo);
        setSerialNo(res.data.records[0].respObject.serialNo);
        setChequeStatus(res.data.records[0].respObject.chequeStatus);
        setAmount(res.data.records[0].respObject.amount);
        setSayadId(res.data.records[0].respObject.sayadId);
      }
    } catch (err) {
      alert("Encryption failed. Check the console for details.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col container mx-auto bg-neutralColor-5 max-w-[600px] overflow-y-auto h-screen">
        <div className="grid grid-cols-2 gap-y-[10px] gap-x-[10px] md:grid-cols-3 md:gap-x-[10px] w-full bg-neutralColor-5 p-6">
          {servicesType.map((service) => (
            <Services
              key={service.id}
              service={service}
              handleServiceClick={() => handleServiceClick(service.id)}
            />
          ))}
        </div>

        {showQRCodeSection && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="flex justify-center items-center gap-y-[10px] rounded-md absolute bottom-[20px] px-[3px] py-[8px] w-1/2 z-50">
              <button
                className="bg-white rounded-r-md py-[12.5px] text-white px-[10px]"
                onClick={sendSayadiIdHandler}
              >
                <FaArrowRight className="fill-neutralColor-3" />
              </button>
              <input
                type="text"
                placeholder="ورود دستی شناسه صیادی"
                onChange={sayadiHandler}
                className="rounded-l-md px-[10px] py-[10px] text-[14px] outline-none border-r-2 border-r-neutralColor-3"
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <div id="reader" className="w-[700px] h-[700px] mb-[20px]"></div>
            </div>
          </div>
        )}

        {decodedText && showQRInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-4">اطلاعات QRCode : </h3>
              <p className="mb-6">{decodedText}</p>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="bg-errorColor-2 text-white py-2 px-4 rounded"
                  onClick={sendQRHandler}
                >
                  <div className="flex  justify-center items-center">
                    <div className="w-[40px]">
                      {isLoading ? (
                        <ThreeDots
                          height="25"
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
                          ارسال
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="bg-neutralColor-2 text-white py-2 px-4 rounded"
                  onClick={closeDecodedText}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
        {showChequeInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center text-[14px] flex flex-col gap-y-[20px]">
              <div
                className="flex justify-between items-center"
                onClick={closeChequeInfoHandler}
              >
                <IoMdCloseCircle className="w-6 h-6 fill-errorColor-1" />
              </div>
              <h3 className="text-lg font-semibold mb-4">اطلاعات چک : </h3>
              <div className="flex justify-between">
                <span>نوع چک :</span>
                <span>{chequeMedia}</span>
              </div>
              <div className="flex justify-between">
                <span>سریال چک :</span>
                <span>{serialNo}</span>
              </div>
              <div className="flex justify-between">
                <span>سری چک :</span>
                <span>{seriesNo}</span>
              </div>
              <div className="flex justify-between">
                <span>وضعیت چک :</span>
                <span>{chequeStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>مبلغ چک (ریال) :</span>
                <span>{formatNumber(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>شناسه صیادی چک :</span>
                <span>{sayadId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServicesPage;
