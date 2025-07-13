import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
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
  Database,
  Thermometer,
  Cpu,
  Gauge,
  Wifi,
  Signal,
  HardDrive,
  Layers,
  Monitor,
  Target,
  Settings
} from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedMetric, setSelectedMetric] = useState("performance");
  const [selectedTwinId, setSelectedTwinId] = useState<number | null>(null);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  // Fetch digital twins
  const { data: digitalTwins } = useQuery({
    queryKey: ["/api/digital-twins"],
    queryFn: () => apiRequest("/api/digital-twins?userId=1"),
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        temperature: Math.random() * 40 + 20,
        pressure: Math.random() * 50 + 100,
        efficiency: Math.random() * 20 + 80,
        power: Math.random() * 500 + 1000,
      };
      setRealTimeData(prev => [...prev.slice(-19), newDataPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Sample telemetry data
  const telemetryData = [
    { time: "00:00", temperature: 23.5, pressure: 101.3, efficiency: 89.2, power: 1250 },
    { time: "04:00", temperature: 24.1, pressure: 102.1, efficiency: 91.5, power: 1320 },
    { time: "08:00", temperature: 26.3, pressure: 103.8, efficiency: 94.1, power: 1180 },
    { time: "12:00", temperature: 28.7, pressure: 105.2, efficiency: 96.3, power: 1420 },
    { time: "16:00", temperature: 27.4, pressure: 104.6, efficiency: 93.8, power: 1380 },
    { time: "20:00", temperature: 25.9, pressure: 103.1, efficiency: 91.2, power: 1290 },
  ];

  const performanceMetrics = [
    { name: "Manufacturing", value: 94.2, target: 95.0, status: "warning" },
    { name: "Energy", value: 89.7, target: 90.0, status: "error" },
    { name: "Quality", value: 98.1, target: 97.0, status: "success" },
    { name: "Safety", value: 99.9, target: 99.5, status: "success" },
  ];

  const distributionData = [
    { name: "Operational", value: 78, color: "#10b981" },
    { name: "Maintenance", value: 12, color: "#f59e0b" },
    { name: "Idle", value: 8, color: "#6b7280" },
    { name: "Error", value: 2, color: "#ef4444" },
  ];

  const anomalyData = [
    { time: "2024-01-01", count: 3, severity: "low" },
    { time: "2024-01-02", count: 1, severity: "medium" },
    { time: "2024-01-03", count: 7, severity: "high" },
    { time: "2024-01-04", count: 2, severity: "low" },
    { time: "2024-01-05", count: 5, severity: "medium" },
  ];

  const kpiData = [
    {
      title: "System Performance",
      value: "98.7%",
      change: "+2.3%",
      trend: "up",
      icon: Activity,
      description: "Overall system efficiency",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      title: "Data Processing Rate",
      value: "1.2M/hr",
      change: "+15.7%",
      trend: "up",
      icon: Database,
      description: "Data points processed per hour",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Response Time",
      value: "234ms",
      change: "-12ms",
      trend: "down",
      icon: Clock,
      description: "Average API response time",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Active Connections",
      value: "156",
      change: "+8",
      trend: "up",
      icon: Zap,
      description: "Live IoT device connections",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
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
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className={`relative overflow-hidden border-l-4 ${kpi.borderColor} ${kpi.bgColor}/20`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="flex items-center gap-2">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
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
                {/* Colorful Chart Bars */}
                <div className="flex items-end justify-between h-full">
                  {performanceData.map((point, index) => {
                    const colors = [
                      "bg-gradient-to-t from-blue-500 to-blue-400",
                      "bg-gradient-to-t from-emerald-500 to-emerald-400", 
                      "bg-gradient-to-t from-purple-500 to-purple-400",
                      "bg-gradient-to-t from-orange-500 to-orange-400",
                      "bg-gradient-to-t from-pink-500 to-pink-400",
                      "bg-gradient-to-t from-cyan-500 to-cyan-400",
                      "bg-gradient-to-t from-violet-500 to-violet-400"
                    ];
                    return (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div 
                          className={`${colors[index]} rounded-t w-8 transition-all hover:scale-110 hover:shadow-lg`}
                          style={{ height: `${(point.value / 100) * 180}px` }}
                        ></div>
                        <Badge variant="outline" className="text-xs">
                          {point.value}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">{point.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  Real-time Telemetry
                </CardTitle>
                <CardDescription>Live sensor data from digital twins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realTimeData.length > 0 ? realTimeData : telemetryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Target vs actual performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{metric.value}%</span>
                          <Badge variant={
                            metric.status === 'success' ? 'default' : 
                            metric.status === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Target: {metric.target}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                System Status Distribution
              </CardTitle>
              <CardDescription>Current operational status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {distributionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Resource Usage Statistics
              </CardTitle>
              <CardDescription>Current utilization of system resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {usageStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stat.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {stat.active} / {stat.total} active
                      </span>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {stat.percentage}% utilization
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-orange-500" />
                System Health Monitor
              </CardTitle>
              <CardDescription>Real-time system health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "CPU Usage", value: 67, icon: Cpu, color: "text-red-500" },
                  { name: "Memory", value: 43, icon: HardDrive, color: "text-blue-500" },
                  { name: "Network", value: 89, icon: Wifi, color: "text-green-500" },
                  { name: "Storage", value: 34, icon: Database, color: "text-purple-500" },
                ].map((metric, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-3 mb-3">
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">{metric.value}%</div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                System Alerts & Notifications
              </CardTitle>
              <CardDescription>Recent alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsData.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityBadge(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                Anomaly Detection
              </CardTitle>
              <CardDescription>AI-powered anomaly detection results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500" />
                Analytics Reports
              </CardTitle>
              <CardDescription>Generated reports and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Performance Report", description: "Weekly performance analysis", date: "2024-01-15" },
                  { title: "Energy Efficiency", description: "Energy consumption patterns", date: "2024-01-14" },
                  { title: "Predictive Maintenance", description: "Upcoming maintenance predictions", date: "2024-01-13" },
                  { title: "Cost Analysis", description: "Operational cost breakdown", date: "2024-01-12" },
                ].map((report, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">{report.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{report.date}</span>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Download
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