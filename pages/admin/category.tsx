import { EditOutlined } from "@mui/icons-material";
import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import SectionHeading from "../../components/SectionHeading";

const Category = () => {
  return (
    <DashboardLayout>
      <SectionHeading title="Category(10)" isAction={true} buttonText="Add Category" onAction={() => {}} />
      <div>
        <ListContainer>
          <ListRow className="justify-between">
            <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
            <ListItem type="text" text="Laptop" className="w-fit" />
            <ListItem type="text" text="Electronics" className="w-fit" />
            <ListItem type="text" text="25 products associated" className="w-fit" />
            <ListItem type="text" text="10 sub-categories" className="w-fit" />
            <ListItem type="action" text="Edit" className="w-40" childClasses="radius-80 w-24 mx-auto" actionIcon={EditOutlined} />
          </ListRow>
        </ListContainer>
      </div>
    </DashboardLayout>
  );
};

export default Category;
