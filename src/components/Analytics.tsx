import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
  Database
} from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedMetric, setSelectedMetric] = useState("performance");

  const kpiData = [
    {
      title: "System Performance",
      value: "98.7%",
      change: "+2.3%",
      trend: "up",
      icon: Activity,
      description: "Overall system efficiency"
    },
    {
      title: "Data Processing Rate",
      value: "1.2M/hr",
      change: "+15.7%",
      trend: "up",
      icon: Database,
      description: "Data points processed per hour"
    },
    {
      title: "Response Time",
      value: "234ms",
      change: "-12ms",
      trend: "down",
      icon: Clock,
      description: "Average API response time"
    },
    {
      title: "Active Connections",
      value: "156",
      change: "+8",
      trend: "up",
      icon: Zap,
      description: "Live IoT device connections"
    }
  ];

  const alertsData = [
    {
      id: 1,
      type: "warning",
      title: "High CPU Usage",
      description: "Server CPU usage exceeded 85% threshold",
      timestamp: "2 minutes ago",
      severity: "medium"
    },
    {
      id: 2,
      type: "error",
      title: "Sensor Disconnected",
      description: "Temperature sensor TMP-001 lost connection",
      timestamp: "5 minutes ago",
      severity: "high"
    },
    {
      id: 3,
      type: "info",
      title: "Maintenance Scheduled",
      description: "Routine system maintenance in 4 hours",
      timestamp: "1 hour ago",
      severity: "low"
    }
  ];

  const performanceData = [
    { time: "00:00", value: 95.2 },
    { time: "04:00", value: 97.1 },
    { time: "08:00", value: 94.8 },
    { time: "12:00", value: 98.7 },
    { time: "16:00", value: 96.3 },
    { time: "20:00", value: 98.1 },
    { time: "24:00", value: 98.7 }
  ];

  const usageStats = [
    { category: "Digital Twins", active: 24, total: 30, percentage: 80 },
    { category: "IoT Devices", active: 156, total: 180, percentage: 87 },
    { category: "API Endpoints", active: 12, total: 15, percentage: 80 },
    { category: "Workflows", active: 8, total: 10, percentage: 80 }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <CheckCircle className="w-4 h-4 text-info" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: "destructive" as const,
      medium: "secondary" as const,
      low: "outline" as const
    };
    return variants[severity as keyof typeof variants] || "outline";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and insights for your digital twin ecosystem
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-2">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-success" />
                )}
                <span className="text-xs text-muted-foreground">{kpi.change}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage Stats</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                System Performance Over Time
              </CardTitle>
              <CardDescription>
                Real-time performance metrics for the last {timeRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-gradient-to-br from-background to-accent/10 rounded-lg border border-border/50 p-6">
                {/* Simulated Chart */}
                <div className="flex items-end justify-between h-full">
                  {performanceData.map((point, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="bg-primary/60 rounded-t w-8 transition-all hover:bg-primary"
                        style={{ height: `${(point.value / 100) * 180}px` }}
                      ></div>
                      <div className="text-xs text-muted-foreground">{point.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Ingestion</span>
                    <span className="font-mono text-sm">1,234.56 MB/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing Queue</span>
                    <span className="font-mono text-sm">45 items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Output Rate</span>
                    <span className="font-mono text-sm">987.65 operations/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm">73%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "73%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory</span>
                      <span className="text-sm">62%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-info h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Statistics</CardTitle>
              <CardDescription>
                Current utilization across all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {usageStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stat.category}</span>
                      <div className="text-sm text-muted-foreground">
                        {stat.active} / {stat.total} active
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-glow h-3 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {stat.percentage}% utilization
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Alerts & Notifications
                <Badge variant="outline">{alertsData.length} active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsData.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={getSeverityBadge(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Reports</CardTitle>
              <CardDescription>
                Generate and schedule comprehensive system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Daily Performance Summary", type: "Automated", frequency: "Daily at 9 AM" },
                  { name: "Weekly IoT Device Status", type: "Scheduled", frequency: "Mondays at 8 AM" },
                  { name: "Monthly Resource Utilization", type: "Scheduled", frequency: "1st of each month" },
                  { name: "Quarterly Business Intelligence", type: "Manual", frequency: "On demand" },
                ].map((report, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{report.frequency}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;