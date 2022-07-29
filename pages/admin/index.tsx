import React, { useState } from "react";
import { ShoppingBasketOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from "@mui/icons-material";

import SectionHeading from "../../components/SectionHeading";
import DashboardCard from "../../components/DashboardCard";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import { OrderDetailModal } from "../../components/Modals";

const Index = () => {
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex flex-row lg:container mb-16 smMax:flex-col xlMax:justify-between">
        <DashboardCard Icon={SupervisorAccountOutlined} title="Users" count="2220" className="smMax:mb-4" />
        <DashboardCard Icon={ShoppingBasketOutlined} title="Products" count="50" className="smMax:mb-4" />
        <DashboardCard Icon={ShoppingCartOutlined} title="Orders" count="4" className="smMax:mb-4" />
      </div>
      <div className="lg:container">
        <SectionHeading title="Recent Orders" isPath={true} path="/orders" />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024">
            {new Array(4).fill(1).map((_, index) => (
              <ListRow key={index} className="justify-between">
                <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
                <ListItem type="text" text="Jane Doe" className="w-fit" />
                <ListItem type="text" text="doe@mailinator.com" className="w-fit" />
                <ListItem type="text" text="12th June 2022" className="w-36" />
                <ListItem type="text" text="3 items" className="w-16" />
                <ListItem type="text" text="$50" className="w-16" />
                <ListItem type="text" text="Delivered" className="w-20" childClasses="text-success" />
                <ListItem
                  type="action"
                  text="View"
                  className="w-40"
                  childClasses="radius-80"
                  onAction={() => setShowOrderDetailModal(true)}
                />
              </ListRow>
            ))}
          </ListContainer>
        </div>
      </div>
      <OrderDetailModal visible={showOrderDetailModal} onClose={() => setShowOrderDetailModal(false)} />
    </DashboardLayout>
  );
};

export default Index;
