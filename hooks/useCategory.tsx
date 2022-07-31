import { useCallback, useState } from "react";
import { Category as CategoryType } from "@prisma/client";
import { appFetch } from "../utils/api";

const endpoint = "category/";

export interface CategoryI extends CategoryType {
  parentCategory: {
    id: string;
    name: string;
  };
}
export interface Category {
  name?: string;
  parent?: string;
  image?: File;
}

interface UseCategory {
  categories: CategoryI[];
  parentCategories: CategoryI[];
  deleteCategory: (categoryId: string) => Promise<any>;
  addCategory: (data: Category) => Promise<any>;
  getCategories: (isParent: boolean) => Promise<any>;
  updateCategory: (data: any) => Promise<any>;
}

function useCategory(): UseCategory {
  const [categories, setCategories] = useState<CategoryI[]>([]);
  const [parentCategories, setParentCategories] = useState<CategoryI[]>([]);

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
      body: data,
      isFormData: true,
    });

    if (response.data) {
      alert("Category added");
    }

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

    if (response.data) {
      if (isParent) {
        setParentCategories(response.data);
      } else {
        setCategories(response.data);
      }
    }

    return response;
  }, []);

  return { categories, parentCategories, deleteCategory, addCategory, getCategories, updateCategory };
}

export default useCategory;
