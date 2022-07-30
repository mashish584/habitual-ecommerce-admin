import { FetchConfig } from "./types";

export const DEV_URL = "http://localhost:3000/api/";

async function handleAPIError(response: any, endpoint: string) {
  response = await response.json();
  const message = response.message || `Unable to fetch ${endpoint}`;
  console.log({ message });
}

export const appFetch = async (url: string, options: FetchConfig) => {
  try {
    const endpoint = `${DEV_URL}${url}`;

    if (options.headers["Content-Type"] === "multipart/form-data") {
      const data = { ...options.body };
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      options.body = formData;
    }

    const response = await fetch(endpoint, { ...options });

    if (response.status === 200) {
      return response.json();
    }
    handleAPIError(response, endpoint);
  } catch (err) {
    console.log({ err });
  }
};
