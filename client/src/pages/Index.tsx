import StahikiApp from "@/components/StahikiApp";
import { NavigationProvider } from "@/lib/contexts/NavigationContext";

const Index = () => {
  return (
    <NavigationProvider>
      <StahikiApp />
    </NavigationProvider>
  );
};

export default Index;
