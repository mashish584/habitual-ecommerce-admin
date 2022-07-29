import React, { useState } from "react";
import { MenuOutlined } from "@mui/icons-material";
import Navigation from "../Navigation";
import useWindowSize from "../../hooks/useWindowSize";

const DashboardLayout: React.FC = ({ children }) => {
  const [width] = useWindowSize();

  const [showMobileNavigation, setShowMobileNavigation] = useState(false);

  const onMobileNavigationToggle = () => setShowMobileNavigation((prev) => !prev);

  const isMobileNavigationActive = width < 1024;

  return (
    <div className="flex flex-row w-full h-full">
      <Navigation visible={isMobileNavigationActive && showMobileNavigation} />
      <div
        className={`content-container translate-x-64 h-full px-16 pt-28 lgMax:translate-x-0 lgMax:px-4 lgMax:pt-5 ${
          showMobileNavigation ? "lgMax:translate-x-64" : "lgMax:translate-x-0"
        }`}
      >
        <button onClick={onMobileNavigationToggle} className="mb-28 lg:hidden">
          <MenuOutlined />
        </button>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
