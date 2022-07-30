import { useCallback, useState } from "react";
import { appFetch } from "../utils/api";

const endpoint = "category/";

export interface Category {
  name?: string;
  parent?: string;
  image?: any;
}

function useCategory() {
  const [categories] = useState([]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    const response = await appFetch(`${endpoint}${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }, []);

  const addCategory = useCallback(async (data: Category) => {
    const response = await appFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: data,
    });
    return response;
  }, []);

  const updateCategory = useCallback(async (data: any) => {
    const response = await appFetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }, []);

  const getCategories = useCallback(async (isParent: boolean) => {
    const query = isParent ? "?parent=true" : "";

    const response = await appFetch(`${endpoint}${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }, []);

  return { categories, deleteCategory, addCategory, getCategories, updateCategory };
}

export default useCategory;
