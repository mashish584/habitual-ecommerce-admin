import { FetchConfig } from "./types";

export const DEV_URL = "http://localhost:3000/api/";

async function handleAPIError(response: any, endpoint: string) {
  response = await response.json();
  const message = response.message || `Unable to fetch ${endpoint}`;
  console.log({ message });
  return response;
}

export const appFetch = async (url: string, options: FetchConfig) => {
  try {
    const endpoint = `${DEV_URL}${url}`;

    if (options.isFormData) {
      const data = { ...options.body };
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
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
