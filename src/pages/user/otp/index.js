import dynamic from "next/dynamic";

// Dynamically import the PanelPage component with SSR disabled
const OTP = dynamic(() => import("../../../components/OTP/OTP.js"), {
  ssr: false, // Disable server-side rendering
});

const Panel = () => {
  return <OTP />;
};

export default Panel;
