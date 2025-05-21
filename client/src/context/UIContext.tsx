import { createContext, useContext } from "react";

interface UIContextType {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

export const UIContext = createContext<UIContextType | null>(null);

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context)
    throw new Error("useUIContext must be used within a UIProvider");
  return context;
};
