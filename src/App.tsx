// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import PrivateRoute from "@/routes/PrivateRoute";
import DashboardPage from "./pages/Dashboard";
import ProductPage from "./pages/Products";
import UsersPage from "@/pages/User";
import AdminsPage from "@/pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admins"
        element={
          <PrivateRoute>
            <AdminsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
