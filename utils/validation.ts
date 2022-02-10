import * as yup from "yup";
import { ValidationError } from "yup";
import { ResponseError, SignupBody } from "./types";

export const validateUserRegister = async (values: SignupBody) => {
  try {
    const schema: yup.SchemaOf<SignupBody> = yup.object().shape({
      email: yup.string().trim().required("Email address is required.").email("Email address is not valid.").label("email"),
      password: yup.string().trim().required("Password is required.").label("password"),
    });

    await schema.validate(values, {
      abortEarly: false,
    });
  } catch (errors) {
    if (errors instanceof ValidationError) {
      let errorMessage = {} as ResponseError;

      const err = errors.inner.map((error, index) => {
        const errorInfo = {
          key: error.path || "",
          message: error.message,
        };

        if (index === 0) {
          errorMessage = errorInfo;
        }
        return errorInfo;
      });

      return {
        errors: err,
        errorMessage,
      };
    }
  }
};
