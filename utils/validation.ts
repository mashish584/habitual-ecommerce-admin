import { NextApiResponse } from "next";

import * as yup from "yup";
import { isInvalidObject, isValidJSONString } from "./index";

import { CategoryBody, FileType, ProductBody, ProductVariant, ResponseError, SignupBody } from "./types";

const { ValidationError } = yup;

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

export const validateUserCred = async (values: SignupBody) => {
  try {
    const schema: yup.SchemaOf<SignupBody> = yup.object().shape({
      email: yup.string().trim().required("Email address is required.").email("Email address is not valid.").label("email"),
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

export const validateProduct = async (values: ProductBody) => {
  try {
    const schema: yup.SchemaOf<ProductBody> = yup.object().shape({
      title: yup.string().trim().required("Please provide product title."),
      description: yup
        .string()
        .trim()
        .min(50, "Product description shoulbe between 50-300 characters.")
        .max(300, "Product description shoulbe between 50-300 characters.")
        .notRequired(),
      images: yup
        .array()
        .min(1, "Please upload atleast 1 product image.")
        .max(4, `Please remove ${4 - values.images.length} images.`)
        .test("isValidImages", "Product images is not valid.Please check image type.", () => {
          const images = values.images || [];
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
              return !invalidObject;
            }

            return true;
          });

          return isValidVariant;
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
