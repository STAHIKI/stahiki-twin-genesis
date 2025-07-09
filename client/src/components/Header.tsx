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
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left Section - Current View */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">{getActiveViewTitle()}</h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search twins, workflows, or ask AI..." 
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="glow" 
          size="sm" 
          className="gap-2"
          onClick={() => setActiveView("twin-creator")}
        >
          <Plus className="w-4 h-4" />
          Create Twin
        </Button>
        
        <div className="flex items-center gap-2">
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