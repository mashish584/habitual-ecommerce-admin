import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import SectionHeading from "../../components/SectionHeading";
import { useUIContext } from "../../context/UIContext";

const Product = () => {
  const { toggleSideModal } = useUIContext();

  return (
    <DashboardLayout>
      <div className="container">
        <SectionHeading title="Products(100)" isAction={true} buttonText="Add Product" onAction={() => {}} />
        <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
          {new Array(15).fill(1).map((_, index) => {
            return (
              <ListRow key={index} className="justify-between">
                <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
                <ListItem type="text" text="Macbook Pro 2020 14 inch Slate Gray" className="w-fit" />
                <ListItem type="text" text="Electronics" className="w-fit" />
                <ListItem type="text" text="200 available" className="w-24" />
                <ListItem type="text" text="50 sold" className="w-16" />
                <ListItem type="text" text="$999" className="w-16" />
                <ListItem type="text" text="Active" className="w-20" childClasses="text-success" />
                <ListItem type="action" text="View" className="w-40" childClasses="radius-80" onAction={() => toggleSideModal?.(true)} />
              </ListRow>
            );
          })}
        </ListContainer>
      </div>
    </DashboardLayout>
  );
};

export default Product;
