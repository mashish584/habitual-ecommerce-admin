import { useCallback, useState } from "react";
import { appFetch } from "../utils/api";
import { LoadingI } from "../utils/types";

const endpoint = "product/";

type ProductLoadingType = "products" | "addProduct" | "updateProduct" | null;

export interface Product {
  title: string;
  description: string;
  image: File[];
  price: number;
  discount: number;
  quantity: number;
  categories: String[] | String;
}

interface UseProduct {
  loading: LoadingI<ProductLoadingType>;
  addProduct: (data: Product) => Promise<any>;
}

function useProduct(): UseProduct {
  const [loading, setLoading] = useState<LoadingI<ProductLoadingType>>({ type: "products", isLoading: false });

  const startLoading = (type: ProductLoadingType) => setLoading({ type, isLoading: true });
  const stopLoading = () => setLoading({ type: null, isLoading: false });

  const addProduct = useCallback(async (data: Product) => {
    startLoading("addProduct");

    data.categories = JSON.stringify(data.categories);
    const response = await appFetch(endpoint, {
      method: "POST",
      body: data,
      isFormData: true,
    });

    stopLoading();

    return response;
  }, []);

  return { addProduct, loading };
}

export default useProduct;
