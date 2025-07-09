import { createContext, useContext, useState, ReactNode } from "react";

type NavigationContextType = {
  activeView: string;
  setActiveView: (view: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <NavigationContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </NavigationContext.Provider>
  );
};