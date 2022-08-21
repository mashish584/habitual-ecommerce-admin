import { useCallback, useState } from "react";

import { appFetch } from "../utils/api";
import { CategoryI, LoadingI } from "../utils/types";

const endpoint = "category/";

type CategoryLoadingType = "categories" | "addCateogry" | "updateCategory" | "parentCategories" | "delete" | null;

export interface CategoryFormInterface {
  name?: string;
  parent?: string;
  image?: File;
}

interface UseCategory {
  loading: LoadingI<CategoryLoadingType>;
  deleteCategory: (categoryId: string) => Promise<any>;
  addCategory: (data: CategoryFormInterface) => Promise<any>;
  getCategories: (isParent: boolean) => Promise<CategoryI[]>;
  updateCategory: (categoryId: string, data: any) => Promise<any>;
  // updateCategoryState: (type: StateUpdateType, data: Category) => void;
}

function useCategory(): UseCategory {
  const [loading, setLoading] = useState<LoadingI<CategoryLoadingType>>({ type: "categories", isLoading: false });

  const startLoading = (type: CategoryLoadingType) => setLoading({ type, isLoading: true });
  const stopLoading = () => setLoading({ type: null, isLoading: false });

  const deleteCategory = useCallback(async (categoryId: string) => {
    startLoading("delete");
    const response = await appFetch(`${endpoint}${categoryId}`, {
      method: "DELETE",
    });
    stopLoading();
    return response;
  }, []);

  const addCategory = useCallback(async (data: CategoryFormInterface) => {
    startLoading("addCateogry");
    const response = await appFetch(endpoint, {
      method: "POST",
      body: data,
      isFormData: true,
    });

    stopLoading();

    return response;
  }, []);

  const updateCategory = useCallback(async (path: string, data: CategoryFormInterface) => {
    startLoading("updateCategory");
    const response = await appFetch(`${endpoint}${path}/`, {
      method: "PATCH",
      body: data,
      isFormData: true,
    });

    if (response.data) {
      stopLoading();
    }

    return response;
  }, []);

  // const updateCategoryState = useCallback((type:StateUpdateType,data:Category) => {

  //   if(type === 'add' || type === )

  // }, []);

  const getCategories = useCallback(async (isParent: boolean) => {
    const query = isParent ? "?parent=true" : "";
    startLoading(isParent ? "parentCategories" : "categories");
    const response = await appFetch(`${endpoint}${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    stopLoading();
    return response.data;
  }, []);

  return { loading, deleteCategory, addCategory, getCategories, updateCategory };
}

export default useCategory;
