import React from "react";
import Navigation from "../Navigation";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <div className="flex flex-row w-full h-full">
      <Navigation />
      <div className="content-container h-full px-16 pt-36">{children}</div>
    </div>
  );
};

export default DashboardLayout;
