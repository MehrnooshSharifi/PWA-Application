import HomePageFooter from "./HomePageFooter";
import HomePageHeader from "./HomePageHeader";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 w-full ">
      <HomePageHeader />
      {children}
      <HomePageFooter />
    </div>
  );
};

export default Layout;
