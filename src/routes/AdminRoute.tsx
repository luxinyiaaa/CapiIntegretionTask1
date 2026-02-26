import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

export const AdminRoute: FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/no-permission" replace />;
  }

  return <Outlet />;
};
