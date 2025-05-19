import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Router from "./components/Router";
import MainLoader from "./components/ui/MainLoader";

const App = () => {
  const { checkAuth, authReady } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!authReady) return <MainLoader />;

  return <Router />;
};

export default App;
