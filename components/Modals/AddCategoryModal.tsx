import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker from "../Form/ImagePicker";
import { SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";
import useCategory, { Category } from "../../hooks/useCategory";
import { MessageT } from "../Form/Input";

interface AddCategoryModalI extends SideModalI {}

const AddCategoryModal = ({ visible, onClose }: AddCategoryModalI) => {
  const { getCategories, parentCategories } = useCategory();
  const {
    // register,
    handleSubmit,
    // watch,
    control,
    formState: { errors },
  } = useForm<Category>();

  const onSubmit = (data: any) => console.log({ data });

  useEffect(() => {
    if (parentCategories?.length === 0 && visible) {
      console.log("CALLED");
      getCategories(true);
    }
  }, [visible, parentCategories]);

  const categories = parentCategories.map((category) => ({ label: category.name, value: category.id }));

  return (
    <SideModal visible={visible} onClose={onClose}>
      <div className="h-full">
        <h2 className="ff-lato font-black text-2xl">Add Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 h-full flex flex-col justify-between">
          <div>
            <Controller
              name="name"
              control={control}
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
              render={({ field: { onChange } }) => (
                <Select items={categories} label="Parent Category" placeholder="Select parent category" onChange={onChange} isSingle={true}>
                  {categories.map((option, index) => (
                    <SelectOption key={option.value} item={option} index={index}>
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
