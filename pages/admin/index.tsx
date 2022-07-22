import { ShoppingBasketOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from "@mui/icons-material";
import React from "react";
import DashboardCard from "../../components/DashboardCard";
import Navigation from "../../components/Navigation";

const Index = () => {
  return (
    <div className="flex flex-row h-full">
      <Navigation />
      <div className="w-full h-full ml-64 px-16 pt-36">
        <div className="flex flex-row container">
          <DashboardCard Icon={SupervisorAccountOutlined} title="Users" count="2220" />
          <DashboardCard Icon={ShoppingBasketOutlined} title="Products" count="50" />
          <DashboardCard Icon={ShoppingCartOutlined} title="Orders" count="4" />
        </div>
      </div>
    </div>
  );
};

export default Index;
