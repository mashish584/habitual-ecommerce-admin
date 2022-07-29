import React, { useState } from "react";
import { EditOutlined } from "@mui/icons-material";

import SectionHeading from "../../components/SectionHeading";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import { AddCategoryModal } from "../../components/Modals";

const Category = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title="Category(10)" isAction={true} buttonText="Add Category" onAction={() => setShowAddCategoryModal(true)} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {new Array(15).fill(1).map((_, index) => (
              <ListRow key={index} className="justify-between">
                <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
                <ListItem type="text" text="Laptop" className="w-fit" />
                <ListItem type="text" text="Electronics" className="w-fit" />
                <ListItem type="text" text="25 products associated" className="w-fit" />
                <ListItem type="text" text="10 sub-categories" className="w-fit" />
                <ListItem type="action" text="Edit" className="w-40" childClasses="radius-80 w-24 mx-auto" actionIcon={EditOutlined} />
              </ListRow>
            ))}
          </ListContainer>
        </div>
      </div>
      <AddCategoryModal visible={showAddCategoryModal} onClose={() => setShowAddCategoryModal(false)} />
    </DashboardLayout>
  );
};

export default Category;
