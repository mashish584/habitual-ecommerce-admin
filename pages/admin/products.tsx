import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SectionHeading from "../../components/SectionHeading";

const Product = () => {
  return (
    <DashboardLayout>
      <SectionHeading title="Products(100)" isAction={true} buttonText="Add Product" onAction={() => {}} />
    </DashboardLayout>
  );
};

export default Product;
