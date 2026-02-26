import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/useAuth";
import { useAuthStore } from "@/store/authStore";
import { RouteLoadingScreen } from "@/components/ui/RouteLoadingScreen";

export const PrivateRoute: FC = () => {
  const { loading, isAuthed } = useAuth();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  if (loading) {
    return <RouteLoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (status === "idle" || status === "loading") {
    return <RouteLoadingScreen message="Loading user profile..." />;
  }

  if (status !== "authenticated" || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
