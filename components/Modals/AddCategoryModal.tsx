import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker, { PreviewImage } from "../Form/ImagePicker";
import { Option, SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";
import useCategory, { Category, CategoryI } from "../../hooks/useCategory";
import { MessageT } from "../Form/Input";
import { StateUpdateType } from "../../utils/types";

interface AddCategoryModalI extends SideModalI {
  selectedCategory: CategoryI | null;
  updateCategoryState: (type: StateUpdateType, data: CategoryI) => void;
}

const AddCategoryModal = ({ visible, onClose, selectedCategory, updateCategoryState }: AddCategoryModalI) => {
  const { getCategories, addCategory, updateCategory, deleteCategory, loading } = useCategory();
  const [parentCategories, setParentCategories] = useState<Option[]>([]);
  const [previouseUploadUrls, setPreviousUploadUrls] = useState<Record<string, PreviewImage>>({});
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Category>();

  useEffect(() => {
    if (parentCategories?.length === 0 && visible) {
      (async () => {
        const categories = await getCategories(true);
        setParentCategories(categories.map((category) => ({ label: category.name, value: category.id })));
      })();
    }
  }, [visible, parentCategories, getCategories]);

  useEffect(() => {
    if (selectedCategory && visible) {
      setValue("name", selectedCategory.name);
      setValue("parent", selectedCategory?.parentId || "");

      if (selectedCategory?.image) {
        setPreviousUploadUrls({
          [selectedCategory.image]: {
            id: null,
            url: selectedCategory.image,
          },
        });
      }
    }

    if (!visible) {
      reset();
      setPreviousUploadUrls({});
    }
  }, [selectedCategory, visible, setValue, reset]);

  const onCategoryRemove = useCallback(async () => {
    if (selectedCategory?.id) {
      const response = await deleteCategory(selectedCategory?.id);
      if (response.status == 200) {
        onClose();
        reset();
        setPreviousUploadUrls({});
        updateCategoryState("delete", selectedCategory);
      }
    }
  }, [deleteCategory, onClose, reset, selectedCategory, updateCategoryState]);

  const onSubmit = async (data: Category) => {
    const info = { ...data };
    if (!info.image) delete info.image;
    if (info.parent?.trim() === "" || info.parent === selectedCategory?.parentId) delete info.parent;

    if (selectedCategory) {
      const response = await updateCategory(selectedCategory.id, info);
      if (response.status == 200) {
        onClose();
        reset();
        setPreviousUploadUrls({});
        updateCategoryState("update", response.data);
      }
    } else {
      const response = await addCategory(info);
      if (response.status == 200) {
        onClose();
        reset();
        updateCategoryState("add", response.data);
      }
    }
  };

  return (
    <SideModal visible={visible} onClose={onClose}>
      <div className="h-full">
        <h2 className="ff-lato font-black text-2xl">{selectedCategory !== null ? "Edit" : "Add"} Category</h2>
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
                  items={parentCategories}
                  label="Parent Category"
                  placeholder={selectedCategory?.parentCategory?.name || "Select parent category"}
                  onChange={onChange}
                  isSingle={true}
                >
                  {parentCategories.map((option, index) => {
                    const isSelected = option.value === value;
                    return (
                      <SelectOption key={option.value} isSelectedItem={isSelected} item={option} index={index}>
                        {option.label}
                      </SelectOption>
                    );
                  })}
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
                  previousUploadUrls={previouseUploadUrls}
                  selectedFiles={value || []}
                  maxUpload={1}
                  onChange={onChange}
                />
              )}
            />
          </div>
          <div className="mb-10">
            <Button
              variant="primary"
              type="submit"
              isLoading={(loading.type === "addCateogry" || loading.type === "updateCategory") && loading.isLoading}
              className="my-1"
            >
              {selectedCategory !== null ? "Update" : "Add"} Category
            </Button>
            {selectedCategory !== null ? (
              <Button
                variant="danger"
                type="button"
                className="my-1"
                isLoading={loading.type === "delete" && loading.isLoading}
                onClick={onCategoryRemove}
              >
                Remove Category
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </SideModal>
  );
};

export default AddCategoryModal;
