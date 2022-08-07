import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useCategory from "../../hooks/useCategory";
import useProduct, { Product } from "../../hooks/useProduct";
import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker from "../Form/ImagePicker";
import { MessageT } from "../Form/Input";
import Message from "../Form/Message";
import { Option, SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";

interface AddproductModal extends SideModalI {}

const AddProductModal: React.FC<AddproductModal> = ({ visible, onClose }) => {
  const { getCategories } = useCategory();
  const { addProduct, loading } = useProduct();
  const [categories, setCategories] = useState<Option[]>([]);
  const {
    reset,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Product>();

  const onSubmit = async (data: Product) => {
    const response = await addProduct(data);
    if (response.status == 200) {
      reset();
      onClose();
      alert("✅ Product added succesfully.");
    } else {
      response?.errors?.map((error: { key: keyof Product; message: string }) => setError(error.key, { message: error.message }));
    }
  };

  useEffect(() => {
    if (categories.length === 0 && visible) {
      (async () => {
        const categories = await getCategories(true);
        setCategories(categories.map((category) => ({ label: category.name, value: category.id })));
      })();
    }
  }, [visible, categories]);

  return (
    <SideModal visible={visible} onClose={onClose}>
      <div>
        <h2 className="ff-lato font-black text-2xl">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          <div>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: "Please enter product title." }}
              render={({ field }) => {
                const additionalInputProps = {} as MessageT;

                if (errors.title) {
                  additionalInputProps.messageType = "error";
                  additionalInputProps.message = errors.title.message;
                }
                return <Input type="text" label="Title" {...field} {...additionalInputProps} />;
              }}
            />

            <div className="flex justify-between">
              <Controller
                name="price"
                control={control}
                defaultValue={""}
                rules={{ required: "Please enter price." }}
                render={({ field }) => {
                  const additionalInputProps = {} as MessageT;

                  if (errors.price) {
                    additionalInputProps.messageType = "error";
                    additionalInputProps.message = errors.price.message;
                  }
                  return <Input type="text" label="Price" className="basis-30" {...field} {...additionalInputProps} />;
                }}
              />

              <Controller
                name="discount"
                control={control}
                defaultValue={""}
                render={({ field }) => {
                  const additionalInputProps = {} as MessageT;

                  if (errors.discount) {
                    additionalInputProps.messageType = "error";
                    additionalInputProps.message = errors.discount.message;
                  }
                  return <Input type="text" label="Discount" className="basis-30" {...field} {...additionalInputProps} />;
                }}
              />

              <Controller
                name="quantity"
                control={control}
                defaultValue={""}
                rules={{ required: "Please enter quantity." }}
                render={({ field }) => {
                  const additionalInputProps = {} as MessageT;

                  if (errors.quantity) {
                    additionalInputProps.messageType = "error";
                    additionalInputProps.message = errors.quantity.message;
                  }
                  return <Input type="text" label="Quantity" className="basis-30" {...field} {...additionalInputProps} />;
                }}
              />
            </div>

            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Please enter product description." }}
              render={({ field }) => {
                const additionalInputProps = {} as MessageT;

                if (errors.description) {
                  additionalInputProps.messageType = "error";
                  additionalInputProps.message = errors.description.message;
                }
                return <Input type="textarea" label="Description" className="basis-30" {...field} {...additionalInputProps} />;
              }}
            />

            <Controller
              name="categories"
              control={control}
              rules={{ required: "Please select atleast one category." }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Select
                    items={categories}
                    label="Categories"
                    placeholder={value?.length ? `${value.length} item${value.length > 1 ? "s" : ""} selected.` : "Select Categories"}
                    onChange={onChange}
                    isSingle={false}
                    className={"mb-1"}
                  >
                    {categories.map((category, index) => {
                      const isSelected = value?.includes(category.value);
                      return (
                        <SelectOption
                          key={category.value}
                          isSelectedItem={isSelected}
                          item={category}
                          index={index}
                          onClick={() => alert(index)}
                        >
                          {category.label}
                        </SelectOption>
                      );
                    })}
                  </Select>
                  {errors.categories && errors.categories.type === "required" && (
                    <Message messageType="error" message={errors.categories.message || ""} />
                  )}
                </>
              )}
            />

            <Controller
              name="image"
              control={control}
              rules={{ required: "Please add atleast one image." }}
              render={({ field: { onChange, value } }) => (
                <>
                  <ImagePicker
                    label="Upload Image"
                    actionText="Upload Image"
                    previousUploadUrls={[]}
                    selectedFiles={value || []}
                    maxUpload={3}
                    className={"mb-2"}
                    onChange={onChange}
                  />
                  {errors.image && errors.image.type === "required" && <Message messageType="error" message={errors.image.message || ""} />}
                </>
              )}
            />
          </div>
          <Button variant="primary" type="submit" isLoading={loading.type === "addProduct" && loading.isLoading} className="my-10">
            Add Product
          </Button>
        </form>
      </div>
    </SideModal>
  );
};

export default AddProductModal;
