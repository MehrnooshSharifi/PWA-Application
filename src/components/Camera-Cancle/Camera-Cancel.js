import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null); 
  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result); // Set image data to display chosen image
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to capture a photo at full screen resolution
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      const capturedImageData = canvasRef.current.toDataURL("image/png");
      setImageData(capturedImageData);

      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      setShowCamera(false);
    }
  };

  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      />
      <div className="flex items-center gap-x-[10px]  justify-center mb-[20px] p-4 text-[14px] ">
        <button
          onClick={() => fileInputRef.current.click()} // Trigger file input
          className=" p-2 rounded bg-errorColor-3 text-naturalColor-2 whitespace-nowrap"
        >
          انتخاب از گالری
        </button>
        <div
          onClick={capturePhoto}
          className=" p-2 rounded w-[100px] h-[40px] flex items-center justify-center"
        >
          <Image
            alt="camera"
            src="/assets/Images/othersPic/camera.png"
            width={40}
            height={40}
          />
        </div>
        <Link
          href="/" // Navigate to the home page
          onClick={(e) => {
            e.preventDefault(); // Prevent default behavior
            router.push("/"); // Navigate back to the home page
            window.location.reload(); // Refresh the page to show the home page
          }}
          className="border border-1 border-errorColor-3 bg-naturalColor-2  p-4 rounded w-[100px] h-[40px] flex justify-center items-center text-errorColor-3"
        >
          انصراف
        </Link>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {/* Hidden file input for gallery selection */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Camera;
