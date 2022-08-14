import { useCallback, useState } from "react";
import { Product as ProductT } from "@prisma/client";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

import { appFetch } from "../utils/api";
import { LoadingI } from "../utils/types";

const endpoint = "product/";

export type Product = Omit<ProductT, "images"> & { images: UploadResponse[]; category: Record<"name" | "id", string>[] };
type ProductLoadingType = "products" | "addProduct" | "updateProduct" | "product" | "removeProductImage" | null;
type ProductState = {
  data: Product[];
  nextPage: string | null;
  count: number;
};

export interface ProductFormInterface {
  title: string;
  description: string;
  image: File[];
  price: string;
  discount: string;
  quantity: string;
  categories: String[] | String;
}

interface UseProduct {
  loading: LoadingI<ProductLoadingType>;
  products: ProductState;
  productInfo: Product | null;
  addProduct: (data: ProductFormInterface) => Promise<any>;
  getProducts: (query?: string) => Promise<any>;
  getProductDetail: (productId: string) => Promise<any>;
  deleteProductImage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<any>;
  resetProductInfo: () => void;
}

function useProduct(): UseProduct {
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const [products, setProducts] = useState<ProductState>({ data: [], nextPage: null, count: 0 });
  const [loading, setLoading] = useState<LoadingI<ProductLoadingType>>({ type: "products", isLoading: false });

  const startLoading = (type: ProductLoadingType) => setLoading({ type, isLoading: true });
  const stopLoading = () => setLoading({ type: null, isLoading: false });

  const addProduct = useCallback(async (data: ProductFormInterface) => {
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

  const getProducts = useCallback(
    async (query = "") => {
      startLoading("products");
      const url = products.nextPage || `products/${query}`;
      const response = await appFetch(url, {
        method: "GET",
        disableUrlAppend: products.nextPage !== null,
      });
      stopLoading();

      if (response.data) {
        setProducts((prev) => ({
          data: [...prev.data, ...response.data],
          nextPage: response.next,
          count: response.count,
        }));
      }
    },
    [products.nextPage],
  );

  const getProductDetail = useCallback(async (productId: string) => {
    startLoading("product");
    const response = await appFetch(`${endpoint}${productId}/`, {
      method: "GET",
    });
    stopLoading();
    if (response.data) {
      setProductInfo(response.data);
    }
  }, []);

  const resetProductInfo = useCallback(() => {
    setProductInfo(null);
  }, []);

  const deleteProductImage = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const imageId = e.currentTarget.dataset.image;

      if (imageId && productInfo?.id) {
        startLoading("removeProductImage");
        const response = await appFetch(`${endpoint}image/${imageId}/`, {
          method: "DELETE",
          body: JSON.stringify({ productId: productInfo?.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        stopLoading();
        if (response.data) {
          setProductInfo(response.data);
        } else if (response.message) {
          alert(response.message);
        }
      }
    },
    [productInfo],
  );

  return { addProduct, getProducts, getProductDetail, resetProductInfo, deleteProductImage, productInfo, products, loading };
}

export default useProduct;
