import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Button from "../Button";
import { Input, Select, ImagePicker, SelectOption, MessageI } from "../Form";
import SideModal, { SideModalI } from "./SideModal";

import { useCategory, CategoryFormInterface } from "../../hooks";
import { CategoryI, Option, PreviewImage, StateUpdateType } from "../../utils/types";
import { showToast } from "../../utils/feUtils";

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
  } = useForm<CategoryFormInterface>();

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
        showToast(`${selectedCategory.name} category removed successfully.`, "success");
        updateCategoryState("delete", selectedCategory);
      }
    }
  }, [deleteCategory, onClose, reset, selectedCategory, updateCategoryState]);

  const onSubmit = async (data: CategoryFormInterface) => {
    const info = { ...data };
    if (!info.image) delete info.image;
    if (info.parent?.trim() === "" || info.parent === selectedCategory?.parentId) delete info.parent;
    if (info.name === selectedCategory?.name) delete info.name;

    function handleResponse(response: any) {
      if (response?.status == 200) {
        onClose();
        reset();
        if (selectedCategory) setPreviousUploadUrls({});
        const message = selectedCategory ? `${selectedCategory.name} category updated.` : "Category added successfully.";
        updateCategoryState(selectedCategory ? "update" : "add", response.data);
        showToast(message, "success");
      }
    }

    if (selectedCategory) {
      if (Object.keys(info).length === 0) {
        onClose();
        return;
      }

      const response = await updateCategory(selectedCategory.id, info);
      handleResponse(response);
    } else {
      const response = await addCategory(info);
      handleResponse(response);
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
                const additionalInputProps = {} as MessageI;

                if (errors.name?.message) {
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
                  resetComponentState={!visible}
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
