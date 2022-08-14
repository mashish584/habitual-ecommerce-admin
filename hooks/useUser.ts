import { useCallback, useState } from "react";
import { User as UserT } from "@prisma/client";

import { appFetch } from "../utils/api";
import { LoadingI } from "../utils/types";

const endpoint = "users/";

type User = Partial<UserT> & { ordersCount?: Number };
type UserLoadingType = "users" | null;
type UserState = {
  data: User[];
  nextPage: string | null;
  count: number;
};

interface UseUser {
  loading: LoadingI<UserLoadingType>;
  users: UserState;
  getUsers: () => Promise<any>;
}

function useProduct(): UseUser {
  const [users, setUsers] = useState<UserState>({ data: [], nextPage: null, count: 0 });
  const [loading, setLoading] = useState<LoadingI<UserLoadingType>>({ type: "users", isLoading: false });

  const startLoading = (type: UserLoadingType) => setLoading({ type, isLoading: true });
  const stopLoading = () => setLoading({ type: null, isLoading: false });

  const getUsers = useCallback(async () => {
    startLoading("users");
    const url = users.nextPage || endpoint;
    const response = await appFetch(url, {
      method: "GET",
      disableUrlAppend: users.nextPage !== null,
    });
    stopLoading();

    if (response.data) {
      setUsers((prev) => ({
        data: [...prev.data, ...response.data],
        nextPage: response.next,
        count: response.count,
      }));
    }
  }, [users.nextPage]);

  return { getUsers, users, loading };
}

export default useProduct;
