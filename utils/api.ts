import { FetchConfig } from "./types";

export const DEV_URL = "http://localhost:3000/api/";

async function handleAPIError(response: any, endpoint: string) {
  response = await response.json();
  return response;
}

export const appFetch = async (url: string, options: FetchConfig) => {
  try {
    const endpoint = options.disableUrlAppend ? url : `${DEV_URL}${url}`;

    if (options.isFormData) {
      const data = { ...options.body };
      const formData = new FormData();

      for (const key in data) {
        if (key === "image" && data?.image?.length) {
          data.image.map((image: any) => formData.append("image", image));
        } else {
          formData.append(key, data[key]);
        }
      }

      options.body = formData;
    }

    if ("isFormData" in options) {
      delete options.isFormData;
    }

    const response = await fetch(endpoint, { ...options });

    if (response.status === 200) {
      return response.json();
    }
    return handleAPIError(response, endpoint);
  } catch (err) {
    console.log({ err });
  }
};
