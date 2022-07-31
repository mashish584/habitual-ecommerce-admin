import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker, { PreviewImage } from "../Form/ImagePicker";
import { SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";
import useCategory, { Category, CategoryI } from "../../hooks/useCategory";
import { MessageT } from "../Form/Input";

interface AddCategoryModalI extends SideModalI {
  selectedCategory: CategoryI | null;
}

const AddCategoryModal = ({ visible, onClose, selectedCategory }: AddCategoryModalI) => {
  const { getCategories, parentCategories, addCategory, updateCategory } = useCategory();
  const {
    // register,
    handleSubmit,
    // watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<Category>();

  useEffect(() => {
    if (parentCategories?.length === 0 && visible) {
      getCategories(true);
    }
  }, [visible, parentCategories]);

  useEffect(() => {
    if (selectedCategory) {
      setValue("name", selectedCategory.name);
      setValue("parent", selectedCategory?.parentId || "");
    }
  }, [selectedCategory]);

  const categories = parentCategories.map((category) => ({ label: category.name, value: category.id }));
  const previousUploadUrls: PreviewImage[] = selectedCategory?.image
    ? [
      {
        id: null,
        url: selectedCategory.image,
      },
    ]
    : [];

  const onSubmit = (data: Category) => {
    if (!data.image) delete data.image;
    if (data.parent?.trim() === "" || data.parent === selectedCategory?.parentId) delete data.parent;

    if (selectedCategory) {
      updateCategory(selectedCategory.id, data);
    } else {
      addCategory(data);
    }
  };

  return (
    <SideModal visible={visible} onClose={onClose}>
      <div className="h-full">
        <h2 className="ff-lato font-black text-2xl">Add Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 h-full flex flex-col justify-between">
          <div>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Please enter category name." }}
              render={({ field }) => {
                const additionalInputProps = {} as MessageT;

                if (errors.name) {
                  additionalInputProps.messageType = "error";
                  additionalInputProps.message = errors.name.message;
                }

                return <Input type="text" label="Category Name" {...field} {...additionalInputProps} />;
              }}
            />
            <Controller
              name="parent"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  items={categories}
                  label="Parent Category"
                  placeholder={selectedCategory?.parentCategory?.name || "Select parent category"}
                  onChange={onChange}
                  isSingle={true}
                >
                  {categories.map((option, index) => (
                      <SelectOption key={option.value} isSelectedItem={option.value === value} item={option} index={index}>
                        {option.label}
                      </SelectOption>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImagePicker
                  label="Upload Image"
                  actionText="Upload Image"
                  showColorPicker={false}
                  previousUploadUrls={previousUploadUrls}
                  selectedFiles={value || []}
                  maxUpload={1}
                  onChange={onChange}
                />
              )}
            />
          </div>
          <Button variant="primary" type="submit" className="my-10">
            Add Category
          </Button>
        </form>
      </div>
    </SideModal>
  );
};

export default AddCategoryModal;
