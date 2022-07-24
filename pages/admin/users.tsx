import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import SectionHeading from "../../components/SectionHeading";

const Users = () => (
  <DashboardLayout>
    <div className="container">
      <SectionHeading title="Users(2)" isAction={true} buttonText="Add User" onAction={() => {}} />
      <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
        {new Array(15).fill(1).map((_, index) => (
          <ListRow key={index} className="justify-between">
            <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
            <ListItem type="text" text="Jane Doe" className="w-fit" />
            <ListItem type="text" text="doe@mailinator.com" className="w-fit" />
            <ListItem type="text" text="3 orders" className="w-fit" />
            <ListItem type="action" text="View Details" className="w-40" childClasses="radius-80" />
          </ListRow>
        ))}
      </ListContainer>
    </div>
  </DashboardLayout>
);

export default Users;
