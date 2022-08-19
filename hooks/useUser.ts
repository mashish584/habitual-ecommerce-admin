import { useCallback, useState } from "react";
import { User as UserT } from "@prisma/client";

import { appFetch } from "../utils/api";
import { Address, LoadingI } from "../utils/types";
import { generateKeyValuePair } from "../utils/feUtils";

const endpoint = "users/";

export type User = Omit<UserT, "addresses"> & { ordersCount: Number; addresses: Address[]; interests: [{ name: string; id: string }] };
type UserLoadingType = "users" | null;
type UserState = {
  data: Record<string, User>;
  nextPage: string | null;
  count: number;
};

interface UseUser {
  loading: LoadingI<UserLoadingType>;
  users: UserState;
  getUsers: (nextPage?: string | null) => Promise<any>;
}

function useUser(): UseUser {
  const [users, setUsers] = useState<UserState>({ data: {}, nextPage: null, count: 0 });
  const [loading, setLoading] = useState<LoadingI<UserLoadingType>>({ type: "users", isLoading: false });

  const startLoading = (type: UserLoadingType) => setLoading({ type, isLoading: true });
  const stopLoading = () => setLoading({ type: null, isLoading: false });

  const getUsers = useCallback(async (nextPage?: string | null) => {
    startLoading("users");
    const url = nextPage || endpoint;
    const response = await appFetch(url, {
      method: "GET",
      disableUrlAppend: nextPage !== null,
    });
    stopLoading();

    if (response.data) {
      const users = generateKeyValuePair<User>(response.data);
      setUsers((prev) => ({
        data: { ...prev.data, ...users },
        nextPage: response.next,
        count: response.count,
      }));
    }
  }, []);

  return { getUsers, users, loading };
}

export default useUser;
