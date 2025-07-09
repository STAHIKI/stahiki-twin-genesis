import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigation } from "@/lib/contexts/NavigationContext";
import { 
  Diamond, 
  Layers3, 
  Workflow, 
  Wifi, 
  BarChart3, 
  Settings,
  User,
  HelpCircle,
  Bell,
  Home,
  Zap,
  Play,
  Database
} from "lucide-react";

const Navigation = () => {
  const { activeView, setActiveView } = useNavigation();
  
  const navItems = [
    { icon: Home, label: "Dashboard", key: "dashboard" },
    { icon: Zap, label: "AI Input", key: "ai-input" },
    { icon: Diamond, label: "Twin Creator", key: "twin-creator" },
    { icon: Workflow, label: "Workflow Builder", key: "workflow" },
    { icon: Play, label: "Live Simulation", key: "simulation" },
    { icon: Wifi, label: "IoT Integration", key: "iot" },
    { icon: Layers3, label: "API Connections", key: "api" },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Diamond className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Stahiki</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant={activeView === item.key ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12"
            onClick={() => setActiveView(item.key)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        <Button 
          variant={activeView === "analytics" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveView("analytics")}
        >
          <BarChart3 className="w-5 h-5" />
          Analytics
        </Button>
        <Button 
          variant={activeView === "settings" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveView("settings")}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 mt-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;