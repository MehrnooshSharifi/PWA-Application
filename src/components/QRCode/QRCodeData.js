const QRCodeData = ({ qrData, setQrData }) => {
  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white p-6">
    //   <div className="text-center">
    //     <h2 className="text-2xl mb-4">جزییات اطلاعات QR Code :</h2>
    //     <p>{qrData}</p>
    //     <button
    //       onClick={() => setQrData(null)}
    //       className="mt-4 bg-green-500 p-2 rounded-lg"
    //     >
    //       ارسال
    //     </button>
    //   </div>
    // </div>
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-lg shadow-lg">
      <h3 className="font-bold">QR Code Data:</h3>
      <p>{qrData}</p>
      <button
        onClick={() => setQrData(null)} // Clear QR data
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default QRCodeData;
