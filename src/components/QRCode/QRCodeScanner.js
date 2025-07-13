import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
const QRCodeScanner = ({
  startScanner,
  startCameraListing,
  cameras,
  setSelectedCameraId,
}) => {
  const [sayadiId, setSayadiId] = useState();
  const sayadiHandler = (e) => {
    console.log(e.target.value);
    setSayadiId(e.target.value);
  };
  const sendSayadiIdHandler = () => {
    console.log(sayadiId);
  };
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="flex justify-center items-center gap-y-[10px] rounded-md absolute  bottom-[20px] px-[3px] py-[8px] w-1/2">
        <button
          className=" bg-white rounded-r-md  py-[12.5px] text-white px-[10px]"
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
    </div>
  );
};

export default QRCodeScanner;
