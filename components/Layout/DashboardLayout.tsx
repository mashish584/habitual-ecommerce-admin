import React from "react";
import { MenuOutlined } from "@mui/icons-material";
import { useMenuContext } from "../../context/MenuContext";

const DashboardLayout: React.FC = ({ children }) => {
  const { showMobileNavigation, onMobileNavigationToggle } = useMenuContext();

  return (
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
  );
};

export default DashboardLayout;
