import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigation } from "@/lib/contexts/NavigationContext";
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Settings,
  User,
  Plus,
  Activity
} from "lucide-react";

const Header = () => {
  const { activeView, setActiveView } = useNavigation();
  
  const getActiveViewTitle = () => {
    switch(activeView) {
      case "dashboard": return "Dashboard";
      case "ai-input": return "AI Input Panel";
      case "twin-creator": return "Twin Creator";
      case "workflow": return "Workflow Builder";
      case "simulation": return "Live Simulation";
      case "iot": return "IoT Integration";
      case "api": return "API Connections";
      case "analytics": return "Analytics";
      case "settings": return "Settings";
      default: return "Dashboard";
    }
  };
  return (
    <header className="h-14 sm:h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40">
      {/* Left Section - Current View */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h1 className="text-base sm:text-lg font-semibold text-foreground">{getActiveViewTitle()}</h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search twins, workflows, or ask AI..." 
            className="pl-10 bg-background/50 border-border/50 text-sm"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="glow" 
          size="sm" 
          className="gap-2 hidden sm:flex"
          onClick={() => setActiveView("twin-creator")}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">Create Twin</span>
        </Button>
        
        {/* Mobile Create Button */}
        <Button 
          variant="glow" 
          size="sm" 
          className="sm:hidden p-2"
          onClick={() => setActiveView("twin-creator")}
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-primary"></Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setActiveView("settings")}
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;