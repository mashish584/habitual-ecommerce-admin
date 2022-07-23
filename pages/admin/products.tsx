import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import SectionHeading from "../../components/SectionHeading";

const Product = () => {
  return (
    <DashboardLayout>
      <SectionHeading title="Products(100)" isAction={true} buttonText="Add Product" onAction={() => {}} />
      <div>
        <ListContainer>
          <ListRow className="justify-between">
            <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
            <ListItem type="text" text="Macbook Pro 2020 14 inch Slate Gray" className="w-fit" />
            <ListItem type="text" text="Electronics" className="w-fit" />
            <ListItem type="text" text="200 available" className="w-24" />
            <ListItem type="text" text="50 sold" className="w-16" />
            <ListItem type="text" text="$999" className="w-16" />
            <ListItem type="text" text="Active" className="w-20" childClasses="text-success" />
            <ListItem type="action" text="View" className="w-40" childClasses="radius-80" />
          </ListRow>
        </ListContainer>
      </div>
    </DashboardLayout>
  );
};

export default Product;
