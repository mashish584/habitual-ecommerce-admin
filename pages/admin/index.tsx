import { ShoppingBasketOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from "@mui/icons-material";
import React from "react";
import DashboardCard from "../../components/DashboardCard";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import SectionHeading from "../../components/SectionHeading";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-row container mb-16">
        <DashboardCard Icon={SupervisorAccountOutlined} title="Users" count="2220" />
        <DashboardCard Icon={ShoppingBasketOutlined} title="Products" count="50" />
        <DashboardCard Icon={ShoppingCartOutlined} title="Orders" count="4" />
      </div>
      <div className="container">
        <SectionHeading title="Recent Orders" isPath={true} path="/orders" />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024">
            {new Array(4).fill(1).map((_, index) => {
              return (
                <ListRow key={index} className="justify-between">
                  <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
                  <ListItem type="text" text="Jane Doe" className="w-fit" />
                  <ListItem type="text" text="doe@mailinator.com" className="w-fit" />
                  <ListItem type="text" text="12th June 2022" className="w-36" />
                  <ListItem type="text" text="3 items" className="w-16" />
                  <ListItem type="text" text="$50" className="w-16" />
                  <ListItem type="text" text="Delivered" className="w-20" childClasses="text-success" />
                  <ListItem type="action" text="View" className="w-40" childClasses="radius-80" />
                </ListRow>
              );
            })}
          </ListContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
