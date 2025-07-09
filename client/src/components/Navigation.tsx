import { useState } from "react";
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
  Database,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Navigation = () => {
  const { activeView, setActiveView } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { icon: Home, label: "Dashboard", key: "dashboard", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { icon: Zap, label: "AI Input", key: "ai-input", color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { icon: Diamond, label: "Twin Creator", key: "twin-creator", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { icon: Workflow, label: "Workflow Builder", key: "workflow", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { icon: Play, label: "Live Simulation", key: "simulation", color: "text-pink-500", bgColor: "bg-pink-500/10" },
    { icon: Wifi, label: "IoT Integration", key: "iot", color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
    { icon: Layers3, label: "API Connections", key: "api", color: "text-violet-500", bgColor: "bg-violet-500/10" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-card border-r border-border flex flex-col sticky top-0 transition-all duration-300 ease-in-out shrink-0 relative`}>
      {/* Small Toggle Button - Strategically positioned */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-1 top-3 w-5 h-5 p-0 z-20 bg-background/90 hover:bg-accent border border-border/50 rounded transition-all duration-200 shadow-sm"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      {/* Logo and Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Diamond className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <span className="text-xl font-bold text-foreground">Stahiki</span>}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant={activeView === item.key ? "default" : "ghost"}
            className={`${isCollapsed ? 'w-10 h-10 p-0' : 'w-full justify-start gap-3'} h-12 relative group ${activeView === item.key ? '' : 'hover:' + item.bgColor}`}
            onClick={() => setActiveView(item.key)}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 ${activeView === item.key ? 'text-white' : item.color} transition-colors duration-200`} />
            {!isCollapsed && <span className={activeView === item.key ? 'text-white' : 'text-foreground'}>{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-12 bg-card border border-border rounded px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        <Button 
          variant={activeView === "analytics" ? "default" : "ghost"} 
          className={`${isCollapsed ? 'w-10 h-10 p-0' : 'w-full justify-start gap-3'} h-12 relative group ${activeView === "analytics" ? '' : 'hover:bg-indigo-500/10'}`}
          onClick={() => setActiveView("analytics")}
          title={isCollapsed ? "Analytics" : undefined}
        >
          <BarChart3 className={`w-5 h-5 ${activeView === "analytics" ? 'text-white' : 'text-indigo-500'} transition-colors duration-200`} />
          {!isCollapsed && <span className={activeView === "analytics" ? 'text-white' : 'text-foreground'}>Analytics</span>}
          {isCollapsed && (
            <div className="absolute left-12 bg-card border border-border rounded px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Analytics
            </div>
          )}
        </Button>
        <Button 
          variant={activeView === "settings" ? "default" : "ghost"} 
          className={`${isCollapsed ? 'w-10 h-10 p-0' : 'w-full justify-start gap-3'} h-12 relative group ${activeView === "settings" ? '' : 'hover:bg-gray-500/10'}`}
          onClick={() => setActiveView("settings")}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className={`w-5 h-5 ${activeView === "settings" ? 'text-white' : 'text-gray-500'} transition-colors duration-200`} />
          {!isCollapsed && <span className={activeView === "settings" ? 'text-white' : 'text-foreground'}>Settings</span>}
          {isCollapsed && (
            <div className="absolute left-12 bg-card border border-border rounded px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Settings
            </div>
          )}
        </Button>
        
        {/* User Profile */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 mt-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground">Enterprise Plan</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center mt-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative group">
              <User className="w-4 h-4 text-primary-foreground" />
              <div className="absolute left-12 bg-card border border-border rounded px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                John Doe - Enterprise Plan
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;