import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "../states/user";
import Login from "../views/auth/login";
import Dashboard from "../views/dashboard";

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
    </Routes>
  );
}
