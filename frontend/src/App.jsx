import "./App.css";
import { Toaster } from "react-hot-toast";
import { useStore } from "./states/theme";
import { useEffect } from "react";

function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);
  return (
    <>
      <Toaster />
    </>
  );
}

export default App;
