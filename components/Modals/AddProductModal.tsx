import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "../Button";
import { Input, Select, ImagePicker, Message, MessageI, SelectOption } from "../Form";
import SideModal, { SideModalI } from "./SideModal";

import { useProduct, useCategory, ProductFormInterface } from "../../hooks";
import { Option, PreviewImage, ProductI, StateUpdateType } from "../../utils/types";
import { fillEmptySlotsWithDefault, showToast } from "../../utils/feUtils";

const defaultSlideColor = { backgroundColor: "#FFFFFF", color: "#222222" };

interface AddproductModal extends SideModalI {
  selectedProduct?: ProductI | null;
  updateProductState: (type: StateUpdateType, data: ProductI) => void;
  onProductImageDelete: (imageId: string) => void;
}

const AddProductModal: React.FC<AddproductModal> = ({ visible, onClose, selectedProduct, updateProductState, onProductImageDelete }) => {
  const { getCategories } = useCategory();
  const { addProduct, loading, filterProductForm, updateProduct } = useProduct();
  const [uploadedImages, setUploadedImages] = useState<Record<string, PreviewImage>>({});
  const [categories, setCategories] = useState<Option[]>([]);

  const selectedImageColors = React.useRef<Record<string, string>[]>([]);

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
        selectedImageColors.current = [];
        updateProductState(selectedProduct ? "update" : "add", response.data);
        const message = selectedProduct ? "Product details updated." : "Product added successfully.";
        showToast(message, "success");
      } else {
        response?.errors?.map((error: { key: keyof ProductFormInterface; message: string }) =>
          setError(error.key, { message: error.message }),
        );
      }
    }

    if (selectedProduct) {
      const formValues = filterProductForm(data, selectedProduct);

      if (selectedImageColors.current?.length) {
        const updatedSlideColors = fillEmptySlotsWithDefault(
          selectedImageColors.current,
          selectedProduct.slideColors?.length ? null : defaultSlideColor,
        );

        formValues.slideColors = new Array((formValues.image?.length || 0) + selectedProduct.images.length)
          .fill(defaultSlideColor)
          .map((slideColor, index) => {
            const previousSavedColors = selectedProduct.slideColors?.[index];
            const isColorPreSelected = previousSavedColors?.backgroundColor && previousSavedColors?.color;

            if (updatedSlideColors[index]) {
              return updatedSlideColors[index];
            }

            if (isColorPreSelected) {
              return selectedProduct.slideColors[index];
            }

            return slideColor;
          });
      }

      if (Object.keys(formValues).length) {
        const response = await updateProduct(formValues, selectedProduct.id);
        handleResponse(response);
      } else {
        onClose();
      }
    } else {
      data.slideColors = fillEmptySlotsWithDefault(selectedImageColors.current, {
        backgroundColor: "#FFFFFF",
        color: "#222222",
      });
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

  const updateImageColor = ({ target: { name, dataset, value } }: React.ChangeEvent<HTMLInputElement>) => {
    const index = dataset.index ? parseInt(dataset.index) : 0;
    const colors = selectedImageColors.current;
    if (colors[index]) {
      colors[index][name] = value;
    } else {
      colors[index] = {
        backgroundColor: "#FFFFFF",
        color: "#222222",
      };
      colors[index][name] = value;
    }
  };

  // ⚠️  categories.length is a check to call api only once during the component lifecycle it will stop
  // running the code block if categories already fetched if we remove the check it will
  // be infinite call and may need to pick different approach
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
        (previous, image, index) => ({
          ...previous,
          [image.fileId]: {
            id: image.fileId,
            url: image.url,
            ...selectedProduct.slideColors[index],
          },
        }),
        {} as Record<string, PreviewImage>,
      );

      setUploadedImages(images);
    }
  }, [selectedProduct, setValue, visible]);

  useEffect(() => {
    if (!visible) {
      reset();
      setUploadedImages({});
    }
  }, [reset, visible]);

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
                const additionalInputProps = {} as MessageI;

                if (errors.title?.message) {
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
                rules={{
                  pattern: {
                    value: /^\d*(\.\d{0,2})?$/,
                    message: "Please enter valid price. More than 2 decimal places are not allowed.",
                  },
                  required: "Please enter price.",
                }}
                render={({ field }) => {
                  const additionalInputProps = {} as MessageI;

                  if (errors.price?.message) {
                    additionalInputProps.messageType = "error";
                    additionalInputProps.message = errors.price.message;
                  }
                  return <Input type="number" label="Price" icon="price" className="basis-30" {...field} {...additionalInputProps} />;
                }}
              />

              <Controller
                name="discount"
                control={control}
                defaultValue={""}
                rules={{
                  validate: (value) => parseInt(value) <= 100 || !value || "Please enter valid discount.",
                }}
                render={({ field }) => {
                  const additionalInputProps = {} as MessageI;

                  if (errors.discount?.message) {
                    additionalInputProps.messageType = "error";
                    additionalInputProps.message = errors.discount.message;
                  }
                  return <Input type="number" icon="discount" label="Discount" className="basis-30" {...field} {...additionalInputProps} />;
                }}
              />

              <Controller
                name="quantity"
                control={control}
                defaultValue={""}
                rules={{
                  required: "Please enter quantity.",
                  validate: (value) => parseFloat(value) % 1 === 0 || "Please enter valid integer.",
                }}
                render={({ field }) => {
                  const additionalInputProps = {} as MessageI;

                  if (errors.quantity?.message) {
                    additionalInputProps.messageType = "error";
                    additionalInputProps.message = errors.quantity.message;
                  }
                  return <Input type="number" label="Quantity" className="basis-30" {...field} {...additionalInputProps} />;
                }}
              />
            </div>

            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Please enter product description." }}
              render={({ field }) => {
                const additionalInputProps = {} as MessageI;

                if (errors.description?.message) {
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
                        <SelectOption key={category.value} isSelectedItem={isSelected} item={category} index={index}>
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
                    resetComponentState={!visible}
                    maxUpload={3}
                    className={"mb-2 mt-3.5"}
                    onImageRemove={removeProductImage}
                    onColorChange={updateImageColor}
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
