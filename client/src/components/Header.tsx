import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-foreground">
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Twins
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Automation
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Marketplace
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Docs
          </Button>
        </nav>
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
        <Button variant="glow" size="sm" className="gap-2">
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
          
          <Button variant="ghost" size="sm">
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