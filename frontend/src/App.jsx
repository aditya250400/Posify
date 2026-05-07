import { Toaster } from "react-hot-toast";
import { useStore } from "./states/theme";
import { useEffect } from "react";
import AppRoutes from "./routes";

function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);
  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
}

export default App;
