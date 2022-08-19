import React, { useCallback, useEffect, useState } from "react";
import { EditOutlined } from "@mui/icons-material";

import SectionHeading from "../../components/SectionHeading";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import { AddCategoryModal } from "../../components/Modals";
import useCategory, { CategoryI } from "../../hooks/useCategory";
import { generateKeyValuePair } from "../../utils/feUtils";
import { StateUpdateType } from "../../utils/types";

const Category = () => {
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState<Record<string, CategoryI>>({});
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryI | null>(null);

  const updateSelectedCategory = useCallback(
    (id: string) => {
      setShowAddCategoryModal(true);
      setSelectedCategory(categories[id]);
    },
    [categories],
  );

  const updateCategoryState = useCallback(
    (type: StateUpdateType, data: CategoryI) => {
      if (type === "delete") {
        const storeCategories = { ...categories };
        delete storeCategories[data.id];
        setCategories(storeCategories);
      } else {
        setCategories((prev) => ({
          ...prev,
          [data.id]: data,
        }));
      }
    },
    [categories, setCategories],
  );

  const onFormClose = useCallback(() => {
    setShowAddCategoryModal(false);
    setSelectedCategory(null);
  }, []);

  useEffect(() => {
    (async () => {
      const categories = await getCategories(false);
      if (categories.length) {
        setCategories(generateKeyValuePair(categories));
      }
    })();
  }, [getCategories]);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading
          title={`Category (${Object.keys(categories).length})`}
          isAction={true}
          buttonText="Add Category"
          onAction={() => setShowAddCategoryModal(true)}
        />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {Object.values(categories).map((category) => (
              <ListRow key={category.id} className="justify-between">
                <ListItem isImage={true} imagePath={category.image || ""} className={"w-16 h-16 mr-2"} />
                <ListItem type="text" text={category.name} className="w-36" />
                <ListItem type="text" text={category?.parentCategory?.name} className="w-28" />
                <ListItem type="text" text="25 products associated" className="w-56" />
                <ListItem type="text" text="10 sub-categories" className="w-40" />
                <ListItem
                  type="action"
                  text="Edit"
                  className="w-40"
                  childClasses="radius-80 w-24 mx-auto"
                  index={category.id}
                  actionIcon={EditOutlined}
                  onAction={updateSelectedCategory}
                />
              </ListRow>
            ))}
          </ListContainer>
        </div>
      </div>
      <AddCategoryModal
        visible={showAddCategoryModal}
        selectedCategory={selectedCategory}
        onClose={onFormClose}
        updateCategoryState={updateCategoryState}
      />
    </DashboardLayout>
  );
};

export default Category;
