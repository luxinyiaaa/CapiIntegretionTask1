import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/firebase";

import { apiClient } from "@/api/axios";
import type { User } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";

type UseCurrentUserQueryOptions = {
  enabled: boolean;
  /** Firebase 是否已完成初始化（用于区分「等待中」与「确认无用户」） */
  firebaseLoading: boolean;
};

export const useCurrentUserQuery = ({
  enabled,
  firebaseLoading,
}: UseCurrentUserQueryOptions) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);
  const firebaseUid = auth.currentUser?.uid ?? "guest";

  const query = useQuery<User, AxiosError>({
    queryKey: ["auth", "me", firebaseUid],
    queryFn: async () => {
      const response = await apiClient.get<User>("/whoami/");
      return response.data;
    },
    enabled,
    staleTime: 60_000,
    retry: (failureCount, error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
  const { refetch, status, data, error } = query;

  useEffect(() => {
    if (!enabled) {
      // Firebase 还在初始化：不修改状态，避免误判为登出
      if (firebaseLoading) return;
      // Firebase 已加载且无用户：确认未登录
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    if (status === "pending") {
      setStatus("loading");
      return;
    }

    if (status === "success") {
      setUser(data);
      setStatus("authenticated");
      return;
    }

    if (status === "error") {
      const responseStatus = error?.response?.status;

      if (responseStatus === 401 || responseStatus === 403) {
        setUser(null);
        setStatus("unauthenticated");
      } else {
        console.error("Failed to fetch current user:", error);
        setUser(null);
        setStatus("unauthenticated");
      }
    }
  }, [enabled, firebaseLoading, status, data, error, setUser, setStatus]);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, () => {
      if (enabled && auth.currentUser) {
        void refetch();
      }
    });
    return () => unsubscribe();
  }, [enabled, refetch]);

  return query;
};
