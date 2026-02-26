import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Center, Text } from "@chakra-ui/react";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/Dashboard";
import AdminPage from "@/pages/Admin";
import UsersPage from "@/pages/User";
import ProductsPage from "@/pages/Products";

import { PrivateRoute } from "@/routes/PrivateRoute";
import { AdminRoute } from "@/routes/AdminRoute";
import { useAuth } from "@/context/useAuth";
import { useAuthStore } from "@/store/authStore";
import TodolistPage from "@/pages/TodolistPage";
import { RouteLoadingScreen } from "@/components/ui/RouteLoadingScreen";

const HomePage: FC = () => {
  const { loading, isAuthed } = useAuth();
  const status = useAuthStore((state) => state.status);

  if (loading || (isAuthed && (status === "idle" || status === "loading"))) {
    return <RouteLoadingScreen message="Loading..." />;
  }

  const readyForApp = isAuthed && status === "authenticated";
  return <Navigate to={readyForApp ? "/dashboard" : "/login"} replace />;
};

const NoPermissionPage: FC = () => (
  <Center minH="100dvh" bg="bg.dashboard">
    <Text color="text.primary" fontWeight="600">
      You do not have permission to access this page.
    </Text>
  </Center>
);

const NotFoundPage: FC = () => (
  <Center minH="100dvh" bg="bg.dashboard">
    <Text color="text.primary" fontWeight="600">
      Not Found
    </Text>
  </Center>
);

export const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/no-permission" element={<NoPermissionPage />} />

      {/* private */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/todolist" element={<TodolistPage />} />

        {/* admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admins" element={<AdminPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
