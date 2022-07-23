import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import SectionHeading from "../../components/SectionHeading";

const Orders = () => {
  return (
    <DashboardLayout>
      <SectionHeading title="Orders(2)" isPath={true} path="" />
      <div>
        <ListContainer>
          <ListRow className="justify-between">
            <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
            <ListItem type="text" text="Jane Doe" className="w-fit" />
            <ListItem type="text" text="doe@mailinator.com" className="w-fit" />
            <ListItem type="text" text="12th June 2022" className="w-36" />
            <ListItem type="text" text="3 items" className="w-16" />
            <ListItem type="text" text="$50" className="w-16" />
            <ListItem type="text" text="Delivered" className="w-20" childClasses="text-success" />
            <ListItem type="action" text="View" className="w-40" childClasses="radius-80" />
          </ListRow>
          <ListRow className="justify-between">
            <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
            <ListItem type="text" text="Jane Doe" className="w-fit" />
            <ListItem type="text" text="doe@mailinator.com" className="w-fit" />
            <ListItem type="text" text="12th June 2022" className="w-36" />
            <ListItem type="text" text="3 items" className="w-16" />
            <ListItem type="text" text="$50" className="w-16" />
            <ListItem type="text" text="Delivered" className="w-20" childClasses="text-success" />
            <ListItem type="action" text="View" className="w-40" childClasses="radius-80" />
          </ListRow>
        </ListContainer>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
