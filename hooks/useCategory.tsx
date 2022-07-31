import { useCallback, useState } from "react";
import { Category as CategoryType } from "@prisma/client";
import { appFetch } from "../utils/api";
import { ResponseI } from "../utils/types";

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

interface CategoryResponse extends ResponseI<CategoryI[]> {}

interface UseCategory {
  categories: CategoryResponse;
  parentCategories: CategoryResponse;
  deleteCategory: (categoryId: string) => Promise<any>;
  addCategory: (data: Category) => Promise<any>;
  getCategories: (isParent: boolean) => Promise<any>;
  updateCategory: (categoryId: string, data: any) => Promise<any>;
}

function useCategory(): UseCategory {
  const [categories, setCategories] = useState<CategoryResponse>({ data: [], isLoading: false });
  const [parentCategories, setParentCategories] = useState<CategoryResponse>({ data: [], isLoading: false });

  const startLoading = (isParent = false) => {
    const callback = (prev: CategoryResponse) => ({ ...prev, isLoading: true });
    if (isParent) {
      setParentCategories(callback);
    } else {
      setCategories(callback);
    }
  };

  const stopLoading = (isParent = false) => {
    const callback = (prev: CategoryResponse) => ({ ...prev, isLoading: false });
    if (isParent) {
      setParentCategories(callback);
    } else {
      setCategories(callback);
    }
  };

  const deleteCategory = useCallback(async (categoryId: string) => {
    startLoading();
    const response = await appFetch(`${endpoint}${categoryId}`, {
      method: "DELETE",
    });
    stopLoading();
    return response;
  }, []);

  const addCategory = useCallback(async (data: Category) => {
    startLoading();
    const response = await appFetch(endpoint, {
      method: "POST",
      body: data,
      isFormData: true,
    });

    if (response.data) {
      stopLoading();
      alert("Category added");
    }

    return response;
  }, []);

  const updateCategory = useCallback(async (path: string, data: Category) => {
    startLoading();
    const response = await appFetch(`${endpoint}${path}/`, {
      method: "PATCH",
      body: data,
      isFormData: true,
    });

    if (response.data) {
      stopLoading();
      alert("Category updated");
    }

    return response;
  }, []);

  const getCategories = useCallback(async (isParent: boolean) => {
    const query = isParent ? "?parent=true" : "";
    startLoading(isParent);
    const response = await appFetch(`${endpoint}${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data) {
      stopLoading(isParent);
      const updatedState = { isLoading: false, data: response.data };
      if (isParent) {
        setParentCategories(updatedState);
      } else {
        setCategories(updatedState);
      }
    }

    return response;
  }, []);

  return { categories, parentCategories, deleteCategory, addCategory, getCategories, updateCategory };
}

export default useCategory;
