import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "../states/user";
import Login from "../views/auth/login";
import Dashboard from "../views/dashboard";
import CategoriesIndex from "../views/categories.jsx";
import ProductsIndex from "../views/products/index.jsx";
import CustomersIndex from "../views/customers/index.jsx";
import UsersIndex from "../views/users/index.jsx";
import TransactionsIndex from "../views/transactions/index.jsx";

export default function AppRoutes() {
  const { token } = useStore();

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/categories"
        element={token ? <CategoriesIndex /> : <Navigate to="/" replace />}
      />
      <Route
        path="/products"
        element={token ? <ProductsIndex /> : <Navigate to="/" replace />}
      />
      <Route
        path="/customers"
        element={token ? <CustomersIndex /> : <Navigate to="/" replace />}
      />
      <Route
        path="/users"
        element={token ? <UsersIndex /> : <Navigate to="/" replace />}
      />
      <Route
        path="/transactions"
        element={token ? <TransactionsIndex /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
