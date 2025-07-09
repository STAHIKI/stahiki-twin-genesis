import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Diamond, 
  Layers3, 
  Workflow, 
  Wifi, 
  BarChart3, 
  Settings,
  User,
  HelpCircle,
  Bell
} from "lucide-react";

const Navigation = () => {
  const navItems = [
    { icon: Diamond, label: "Twin Creation", active: true },
    { icon: Wifi, label: "IoT Integration" },
    { icon: Workflow, label: "Workflow Builder" },
    { icon: Layers3, label: "API Connections" },
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
            variant={item.active ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <BarChart3 className="w-5 h-5" />
          Analytics
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3">
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