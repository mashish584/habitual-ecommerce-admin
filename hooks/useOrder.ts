import { useCallback, useState } from "react";
import { appFetch } from "../utils/api";
import { generateKeyValuePair } from "../utils/feUtils";
import { LoadingI, Order } from "../utils/types";

type OrderLoadingType = "orders" | "order" | null;

type OrderState = {
  data: Record<string, Order>;
  nextPage: string | null;
  count: number;
};

interface UseOrder {
  loading: LoadingI<OrderLoadingType>;
  orders: OrderState;
  getOrders: (query?: string) => Promise<any>;
}

function useOrder(): UseOrder {
  const [orders, setOrders] = useState<OrderState>({ data: {}, nextPage: null, count: 0 });
  const [loading, setLoading] = useState<LoadingI<OrderLoadingType>>({ isLoading: false, type: null });

  const startLoading = (type: OrderLoadingType) => setLoading({ type, isLoading: true });
  const stopLoading = () => setLoading({ type: null, isLoading: false });

  const getOrders = useCallback(
    async (query = "") => {
      startLoading("orders");
      const url = orders.nextPage || `orders/${query}`;
      const response = await appFetch(url, {
        method: "GET",
        disableUrlAppend: orders.nextPage !== null,
      });
      stopLoading();

      if (response.data) {
        const orders = generateKeyValuePair<Orders>(response.data);
        setOrders((prev) => ({
          data: { ...prev.data, ...orders },
          nextPage: response.next,
          count: response.count,
        }));
      }
    },
    [orders.nextPage],
  );

  return {
    orders,
    loading,
    getOrders,
  };
}

export default useOrder;
