import { showToast } from "./feUtils";
import { FetchConfig } from "./types";

export const DEV_URL = "/api/";

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
    // eslint-disable-next-line no-use-before-define
    return handleAPIError(response, endpoint);
  } catch (err) {
    showToast("Something went wrong.", "error");
  }
};

async function handleAPIError(response: any, endpoint: string) {
  response = (await response.json()) || {};

  if (response.status === "403" && response.redirect) {
    await appFetch("signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    showToast("Session expired.", "error");
    window.location.href = "/admin";
  } else if (response.message && !response.errors?.length) {
    showToast(response.message, "error");
  }

  return response;
}
