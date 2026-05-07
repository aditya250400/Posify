import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "../states/user";
import Login from "../views/auth/login";

export default function AppRoutes() {
  const { token } = useStore();

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
    </Routes>
  );
}
