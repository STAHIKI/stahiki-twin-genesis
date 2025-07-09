import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Link, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Database,
  Cloud,
  Zap,
  Key,
  TestTube,
  Save
} from "lucide-react";

interface APIConnection {
  id: string;
  name: string;
  url: string;
  method: string;
  status: "connected" | "error" | "testing";
  type: string;
  lastTest: string;
}

const APIConnections = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<APIConnection[]>([
    {
      id: "weather_api",
      name: "Weather Data API",
      url: "https://api.openweathermap.org/data/2.5/weather",
      method: "GET",
      status: "connected",
      type: "External Data",
      lastTest: "2 minutes ago"
    },
    {
      id: "erp_system",
      name: "ERP Integration",
      url: "https://erp.company.com/api/v1/production",
      method: "POST",
      status: "connected",
      type: "Enterprise System",
      lastTest: "5 minutes ago"
    },
    {
      id: "sensor_data",
      name: "Sensor Data Collector",
      url: "https://sensors.facility.com/api/data",
      method: "GET",
      status: "error",
      type: "IoT Platform",
      lastTest: "1 hour ago"
    }
  ]);

  const [newConnection, setNewConnection] = useState({
    name: "",
    url: "",
    method: "GET",
    headers: "",
    body: "",
    apiKey: ""
  });

  const handleTestConnection = async (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId ? { ...conn, status: "testing" as const } : conn
    ));

    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.3; // 70% success rate
    
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { 
            ...conn, 
            status: success ? "connected" as const : "error" as const,
            lastTest: "just now"
          } 
        : conn
    ));

    toast({
      title: success ? "Connection Successful" : "Connection Failed",
      description: success 
        ? "API endpoint is responding correctly" 
        : "Unable to connect to API endpoint",
      variant: success ? "default" : "destructive",
    });
  };

  const handleAddConnection = () => {
    if (!newConnection.name || !newConnection.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    const connection: APIConnection = {
      id: `api_${Date.now()}`,
      name: newConnection.name,
      url: newConnection.url,
      method: newConnection.method,
      status: "testing",
      type: "Custom API",
      lastTest: "never"
    };

    setConnections(prev => [...prev, connection]);
    setNewConnection({
      name: "",
      url: "",
      method: "GET",
      headers: "",
      body: "",
      apiKey: ""
    });

    toast({
      title: "API Connection Added",
      description: "New API connection has been configured",
    });

    // Auto-test the new connection
    setTimeout(() => handleTestConnection(connection.id), 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "testing":
        return <TestTube className="w-4 h-4 text-warning animate-pulse" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "External Data":
        return <Globe className="w-4 h-4" />;
      case "Enterprise System":
        return <Database className="w-4 h-4" />;
      case "IoT Platform":
        return <Zap className="w-4 h-4" />;
      default:
        return <Cloud className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections">API Connections</TabsTrigger>
          <TabsTrigger value="add">Add New API</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-6">
          {/* Connection Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Active API Connections
                </div>
                <Badge variant="outline">
                  {connections.filter(c => c.status === "connected").length} / {connections.length} Active
                </Badge>
              </CardTitle>
              <CardDescription>
                Manage and monitor your external API integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-accent/50">
                        {getTypeIcon(connection.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{connection.name}</h4>
                          {getStatusIcon(connection.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>{connection.method}</span>
                            <span className="truncate max-w-xs">{connection.url}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span>Type: {connection.type}</span>
                            <span>Last test: {connection.lastTest}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={connection.status === "connected" ? "default" : 
                                connection.status === "error" ? "destructive" : "secondary"}
                      >
                        {connection.status}
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestConnection(connection.id)}
                        disabled={connection.status === "testing"}
                      >
                        {connection.status === "testing" ? (
                          <>
                            <TestTube className="w-4 h-4 mr-2 animate-pulse" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <TestTube className="w-4 h-4 mr-2" />
                            Test
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Connect Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Connect Templates</CardTitle>
              <CardDescription>
                Pre-configured connections for popular services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "AWS IoT Core", icon: Cloud, type: "Cloud Platform" },
                  { name: "Azure Digital Twins", icon: Database, type: "Cloud Platform" },
                  { name: "Salesforce API", icon: Globe, type: "CRM System" },
                  { name: "SAP Integration", icon: Database, type: "ERP System" },
                  { name: "ThingSpeak", icon: Zap, type: "IoT Platform" },
                  { name: "Custom REST API", icon: Link, type: "Generic" },
                ].map((template) => (
                  <Button 
                    key={template.name} 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <template.icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.type}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          {/* Add New API Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New API Connection
              </CardTitle>
              <CardDescription>
                Configure a new API endpoint for your digital twin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-name">Connection Name *</Label>
                    <Input
                      id="api-name"
                      placeholder="My API Connection"
                      value={newConnection.name}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="api-url">Endpoint URL *</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com/data"
                      value={newConnection.url}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="api-method">HTTP Method</Label>
                    <Select 
                      value={newConnection.method} 
                      onValueChange={(value) => setNewConnection(prev => ({ ...prev, method: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter API key..."
                        value={newConnection.apiKey}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                      <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-headers">Headers (JSON format)</Label>
                    <Textarea
                      id="api-headers"
                      placeholder='{"Content-Type": "application/json"}'
                      value={newConnection.headers}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, headers: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="api-body">Request Body (for POST/PUT)</Label>
                    <Textarea
                      id="api-body"
                      placeholder='{"key": "value"}'
                      value={newConnection.body}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, body: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddConnection} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Connection
                </Button>
                <Button variant="outline" className="flex-1">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test & Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIConnections;