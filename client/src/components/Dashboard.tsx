import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Database, 
  Clock, 
  Target, 
  TrendingUp, 
  Zap,
  Building,
  Factory,
  Sprout,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const kpis = [
    {
      title: "Active Twins",
      value: "24",
      change: "+3 this week",
      trend: "up",
      icon: Activity,
      color: "text-success"
    },
    {
      title: "Data Points",
      value: "1.2M",
      change: "+15% today",
      trend: "up", 
      icon: Database,
      color: "text-info"
    },
    {
      title: "Processing Time",
      value: "234ms",
      change: "-12ms avg",
      trend: "down",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Accuracy",
      value: "98.7%",
      change: "+0.3% today",
      trend: "up",
      icon: Target,
      color: "text-success"
    }
  ];

  const recentProjects = [
    {
      name: "Smart Factory Twin",
      type: "Manufacturing",
      status: "Active",
      progress: 100,
      icon: Factory,
      lastUpdate: "2 hours ago"
    },
    {
      name: "Urban Planning Model",
      type: "Architecture", 
      status: "Building",
      progress: 75,
      icon: Building,
      lastUpdate: "30 minutes ago"
    },
    {
      name: "Crop Simulation",
      type: "Agriculture",
      status: "Testing",
      progress: 60,
      icon: Sprout,
      lastUpdate: "1 hour ago"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-card to-accent/20 rounded-xl p-8 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Digital Twin Cursor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              An intuitive, fluid, and powerful interface for digital twin creation that combines 
              workflow automation with 3D modeling capabilities.
            </p>
          </div>
          <Button variant="glow" size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Start Building
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry-Specific Modules */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Industry-Specific Modules</CardTitle>
            <CardDescription>Choose your domain to get started with specialized tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg bg-accent/30 border border-border/50 hover:bg-accent/50 transition-all cursor-pointer group">
                <Building className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">Building Design</h3>
                <p className="text-sm text-muted-foreground">
                  Tools for architectural design and project management.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-accent/30 border border-border/50 hover:bg-accent/50 transition-all cursor-pointer group">
                <Zap className="w-8 h-8 text-warning mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">Process Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Features for optimizing industrial processes and monitoring equipment.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-accent/30 border border-border/50 hover:bg-accent/50 transition-all cursor-pointer group">
                <Sprout className="w-8 h-8 text-success mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">Crop Simulation</h3>
                <p className="text-sm text-muted-foreground">
                  Options for simulating crop growth and managing resources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Projects</CardTitle>
            <CardDescription>Your latest digital twin developments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                <div className="p-2 rounded-lg bg-primary/20">
                  <project.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{project.type}</p>
                  <Progress value={project.progress} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">{project.lastUpdate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;