import { ShoppingBasketOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from "@mui/icons-material";
import React from "react";
import DashboardCard from "../../components/DashboardCard";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import Navigation from "../../components/Navigation";
import SectionHeading from "../../components/SectionHeading";

const Index = () => {
  return (
    <div className="flex flex-row h-full">
      <Navigation />
      <div className="w-full h-full ml-64 px-16 pt-36">
        <div className="flex flex-row container mb-16">
          <DashboardCard Icon={SupervisorAccountOutlined} title="Users" count="2220" />
          <DashboardCard Icon={ShoppingBasketOutlined} title="Products" count="50" />
          <DashboardCard Icon={ShoppingCartOutlined} title="Orders" count="4" />
        </div>
        <div>
          <SectionHeading title="Recent Orders" path="/orders" />
          <ListContainer>
            <ListRow className="justify-between">
              <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
              <ListItem type="text" text="Jane Doe" className="w-fit" />
              <ListItem type="text" text="doe@mailinator.com" className="w-fit" />
              <ListItem type="text" text="12th June 2022" className="w-36" />
              <ListItem type="text" text="3 items" className="w-16" />
              <ListItem type="text" text="$50" className="w-16" />
              <ListItem type="text" text="Delivered" className="w-20" childClasses="text-success" />
              <ListItem type="action" text="View All" className="w-40" childClasses="radius-80" />
            </ListRow>
          </ListContainer>
        </div>
      </div>
    </div>
  );
};

export default Index;
