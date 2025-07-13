import dynamic from "next/dynamic";

// Dynamically import the PanelPage component with SSR disabled
const UserPanel = dynamic(
  () => import("../../../components/UserPanel/UserPanel.js"),
  {
    ssr: false, // Disable server-side rendering
  }
);

const Panel = () => {
  return <UserPanel />;
};

export default Panel;
