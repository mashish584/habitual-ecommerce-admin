import React, { useCallback, useEffect, useState } from "react";
import { EditOutlined } from "@mui/icons-material";

import SectionHeading from "../../components/SectionHeading";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import { AddCategoryModal } from "../../components/Modals";
import useCategory, { CategoryI } from "../../hooks/useCategory";

const Category = () => {
  const { categories, getCategories } = useCategory();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryI | null>(null);

  const updateSelectedCategory = useCallback(
    (index: number) => {
      if (categories[index]) {
        setShowAddCategoryModal(true);
        setSelectedCategory(categories[index]);
      }
    },
    [categories],
  );

  useEffect(() => {
    getCategories(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title="Category(10)" isAction={true} buttonText="Add Category" onAction={() => setShowAddCategoryModal(true)} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {categories.map((category, index) => (
              <ListRow key={category.id} className="justify-between">
                <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-20" />
                <ListItem type="text" text={category.name} className="w-36" />
                <ListItem type="text" text={category?.parentCategory?.name} className="w-28" />
                <ListItem type="text" text="25 products associated" className="w-56" />
                <ListItem type="text" text="10 sub-categories" className="w-40" />
                <ListItem
                  type="action"
                  text="Edit"
                  className="w-40"
                  childClasses="radius-80 w-24 mx-auto"
                  index={index}
                  actionIcon={EditOutlined}
                  onAction={updateSelectedCategory}
                />
              </ListRow>
            ))}
          </ListContainer>
        </div>
      </div>
      <AddCategoryModal visible={showAddCategoryModal} selectedCategory={selectedCategory} onClose={() => setShowAddCategoryModal(false)} />
    </DashboardLayout>
  );
};

export default Category;
