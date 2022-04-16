import { Product } from "@prisma/client";
import { NextApiResponse } from "next";

import * as yup from "yup";
import { isInvalidObject, isValidJSONString } from "./index";
import prisma from "./prisma";

import { CategoryBody, FileType, ProductBody, ProductVariant, ResponseError, AuthBody, SlideColors } from "./types";

const { ValidationError } = yup;

// → Prisma based validation
const isCategoryExistInRecords = async (id: string) => {
  try {
    const count = await prisma.category.count({ where: { id } });
    return count > 0;
  } catch (error) {
    return false;
  }
};

const handleError = (errors: any) => {
  if (errors instanceof ValidationError) {
    let errorMessage = {} as ResponseError;

    const err = errors.inner.map((error, index) => {
      const errorInfo = { key: error.path || "", message: error.message };

      if (index === 0) {
        errorMessage = errorInfo;
      }
      return errorInfo;
    });

    return { errors: err, errorMessage };
  }
};

export const validateUserCred = async (values: AuthBody, validateEmailExistence = false) => {
  try {
    const schema: yup.SchemaOf<AuthBody> = yup.object().shape({
      email: yup
        .string()
        .trim()
        .required("Email address is required.")
        .email("Email address is not valid.")
        .label("email")
        .test("isValidEmail", "Product images is not valid.Please check image type.", async (value, { createError, path }) => {
          if (validateEmailExistence) {
            const isEmailExist = (await prisma.user.count({ where: { email: value } })) > 0;

            if (isEmailExist) {
              return createError({
                path,
                message: `Email address is already registered.`,
              });
            }
          }

          return true;
        }),
      password: yup.string().trim().required("Password is required.").label("password"),
    });

    await schema.validate(values, {
      abortEarly: false,
    });
  } catch (errors) {
    return handleError(errors);
  }
};

export const validateCategory = async (values: CategoryBody) => {
  try {
    const schema: yup.SchemaOf<CategoryBody> = yup.object().shape({
      name: yup.string().trim().required("Please provide category name.").notRequired(),
    });

    await schema.validate(values, {
      abortEarly: false,
    });
  } catch (errors) {
    return handleError(errors);
  }
};

export const validateProduct = async (values: ProductBody, productinfo?: Product) => {
  try {
    // → totalImages is sumof user selected images and images already in db if both exist
    // → else it will be upload images length which will be by default 0 if not passed
    const totalImages =
      values?.images?.length && productinfo?.id && productinfo?.images?.length
        ? productinfo.images.length + values.images.length
        : values?.images?.length;

    const schema = yup.object().shape({
      title: yup.string().trim().required("Please provide product title.").notRequired(),
      description: yup
        .string()
        .trim()
        .min(50, "Product description shoulbe between 50-300 characters.")
        .max(300, "Product description shoulbe between 50-300 characters.")
        .notRequired(),
      images: yup
        .array()
        .min(productinfo?.images?.length ? 0 : 1, "Please upload atleast 1 product image.")
        .max(4, `Please remove ${4 - values.images.length} images.`)
        .test("isValidImages", "Product images is not valid.Please check image type.", (_, { createError, path }) => {
          const images = values.images || [];

          // ⚠️ total image exceed the limit of 4
          if (productinfo?.id && productinfo?.images?.length && images?.length) {
            if (totalImages > 4) {
              return createError({
                path,
                message: `Please remove ${totalImages - 4} images.`,
              });
            }
          }

          // ⚠️ check for mime type
          const isInvalidImageFileExists = images?.some((image) => image && !image.mimetype.includes("image"));
          return !isInvalidImageFileExists;
        }),
      variants: yup.mixed().test("isValidVariants", "Please provide valid variants.", (value) => {
        const variants = (isValidJSONString(value) ? JSON.parse(value) : []) as ProductVariant[];

        if (variants.length) {
          const variantObjectKeys = ["color", "image"];
          const isValidVariant = variants.some((variant) => {
            if (typeof variant === "object") {
              const invalidObject = isInvalidObject(variantObjectKeys, variant);

              // → If valid object check for values for both color and image
              if (!invalidObject) {
                const isValidColorValue = variant.color?.trim()?.length > 0;
                const isValidImage = variant?.image?.mimetype?.includes("image");

                return true || (isValidColorValue && isValidImage);
              }
            }

            return false;
          });

          return isValidVariant;
        }

        return true;
      }),
      slideColors: yup.mixed().test("isValidSlideColors", "Please provide valid slide colors.", (value, { createError, path }) => {
        const slideColors = (isValidJSONString(value) ? JSON.parse(value) : []) as SlideColors[];

        if (slideColors.length) {
          const slideColorObjectKeys = ["color", "backgroundColor"];
          const isValidSlideColor = slideColors.some((slideColor) => {
            if (typeof slideColor === "object") {
              const invalidObject = isInvalidObject(slideColorObjectKeys, slideColor);

              if (!invalidObject) {
                const isValidColor = slideColor.color?.trim()?.length > 0;
                const isValidBackgroundCOlor = slideColor.backgroundColor?.trim()?.length > 0;
                return isValidColor && isValidBackgroundCOlor;
              }
              return false;
            }
            return false;
          });

          return isValidSlideColor;
        }
        return true;
      }),
      price: yup
        .string()
        .trim()
        .test("isValidPrice", "Please provide valid price value.", (value = "") => {
          // ✅ valid if it's edit mode & value is not provided by user
          if (productinfo?.id && value === "") return true;

          const price = parseFloat(value);

          if (isNaN(price) || price <= 0) return false;

          return true;
        }),
      discount: yup
        .string()
        .trim()
        .test("isValidPrice", "Please provide valid discount value.", (value = "") => {
          if (value === "") return true;

          const price = parseFloat(value);

          if (isNaN(price) || price < 0) return false;

          return true;
        }),
      quantity: yup
        .string()
        .trim()
        .test("isValidQuantity", "Please provide valid quantity value.", (value = "") => {
          if (value === "") return true;
          const quantity = parseInt(value);

          if (isNaN(quantity) || quantity < 0) return false;

          return true;
        }),
      categories: yup.mixed().test("isValidCategories", "Please provide valid categories", async (value) => {
        const categories = (isValidJSONString(value) ? JSON.parse(value) : []) as string[];

        // ✅ Valid if no new category added but have old categories already during update
        if (productinfo?.category?.length && !categories.length) return true;

        // ⚠️ No category added
        if (!categories.length && !productinfo?.category?.length) return false;

        for (const key in categories) {
          const category = categories[key];
          const isExist = await isCategoryExistInRecords(category);
          if (!isExist) {
            return false;
          }
        }

        return true;
      }),
    });

    await schema.validate(values, {
      abortEarly: false,
    });
  } catch (errors) {
    return handleError(errors);
  }
};

export const validateImageUpload = (file: FileType, res: NextApiResponse) => {
  if (file && !file.mimetype.includes("image")) {
    return res.status(422).json({ message: "Only image is allowed to upload." });
  }

  return true;
};
