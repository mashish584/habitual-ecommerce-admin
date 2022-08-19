import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useCategory from "../../hooks/useCategory";
import useProduct, { Product, ProductFormInterface } from "../../hooks/useProduct";
import { StateUpdateType } from "../../utils/types";
import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker, { PreviewImage } from "../Form/ImagePicker";
import { MessageT } from "../Form/Input";
import Message from "../Form/Message";
import { Option, SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";

interface AddproductModal extends SideModalI {
  selectedProduct?: Product | null;
  updateProductState: (type: StateUpdateType, data: Product) => void;
  onProductImageDelete: (imageId: string) => void;
}

const AddProductModal: React.FC<AddproductModal> = ({ visible, onClose, selectedProduct, updateProductState, onProductImageDelete }) => {
  const { getCategories } = useCategory();
  const { addProduct, loading, filterProductForm, updateProduct } = useProduct();
  const [uploadedImages, setUploadedImages] = useState<Record<string, PreviewImage>>({});
  const [categories, setCategories] = useState<Option[]>([]);

  const {
    reset,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInterface>();

  const onSubmit = async (data: ProductFormInterface) => {
    function handleResponse(response: any) {
      if (response.status == 200) {
        onClose();
        if (!selectedProduct) reset();
        updateProductState(selectedProduct ? "update" : "add", response.data);
      } else {
        response?.errors?.map((error: { key: keyof ProductFormInterface; message: string }) =>
          setError(error.key, { message: error.message }),
        );
      }
    }

    if (selectedProduct) {
      const formValues = filterProductForm(data, selectedProduct);
      if (Object.keys(formValues).length) {
        const response = await updateProduct(formValues, selectedProduct.id);
        handleResponse(response);
      }
    } else {
      const response = await addProduct(data);
      handleResponse(response);
    }
  };

  const removeProductImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const imageId = e.currentTarget.dataset.image;
    if (imageId) {
      setUploadedImages((images) => ({
        ...images,
        [imageId]: { ...images[imageId], isLoading: true },
      }));
      await onProductImageDelete(imageId);
      setUploadedImages((images) => ({
        ...images,
        [imageId]: { ...images[imageId], isLoading: false },
      }));
    }
  };

  useEffect(() => {
    if (categories.length === 0 && visible) {
      (async () => {
        const categories = await getCategories(false);
        setCategories(
          categories.map((category) => ({
            label: category.name,
            value: category.id,
            isSelected: selectedProduct?.categoryIds ? selectedProduct.categoryIds.includes(category.id) : false,
          })),
        );
      })();
    }
  }, [visible, categories, getCategories, selectedProduct?.categoryIds]);

  useEffect(() => {
    if (selectedProduct && visible) {
      setValue("title", selectedProduct.title);
      setValue("price", `${selectedProduct.price}`);
      setValue("discount", `${selectedProduct.discount}`);
      setValue("quantity", `${selectedProduct.quantity}`);
      setValue("description", selectedProduct.description || "");
      setValue("categories", selectedProduct.categoryIds);

      const images = selectedProduct.images.reduce(
        (previous, image) => ({
          ...previous,
          [image.fileId]: {
            id: image.fileId,
            url: image.url,
          },
        }),
        {} as Record<string, PreviewImage>,
      );

      setUploadedImages(images);
    }

    if (!visible) {
      reset();
      setUploadedImages({});
    }
  }, [selectedProduct, visible]);

  return (
    <SideModal visible={visible} onClose={onClose}>
      <div>
        <h2 className="ff-lato font-black text-2xl">{selectedProduct !== null ? "Edit" : "Add"} Product</h2>
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
                return (
                  <Input type="textarea" label="Description" className="basis-30" maxLength={300} {...field} {...additionalInputProps} />
                );
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
              rules={{
                validate: {
                  required: (value) => {
                    if (!value && !selectedProduct) return "Please upload atleast one image.";
                    return true;
                  },
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <ImagePicker
                    label="Upload Image"
                    actionText="Upload Image"
                    previousUploadUrls={uploadedImages}
                    selectedFiles={value || []}
                    maxUpload={3}
                    className={"mb-2"}
                    onImageRemove={removeProductImage}
                    onChange={onChange}
                  />
                  {errors.image && errors.image.type === "required" && <Message messageType="error" message={errors.image.message || ""} />}
                </>
              )}
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            isLoading={(loading.type === "addProduct" || loading.type === "updateProduct") && loading.isLoading}
            className="my-10"
          >
            {selectedProduct !== null ? "Update" : "Add"} Product
          </Button>
        </form>
      </div>
    </SideModal>
  );
};

export default AddProductModal;
