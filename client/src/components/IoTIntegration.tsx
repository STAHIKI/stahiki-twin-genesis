import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  WifiOff, 
  Plus, 
  Settings, 
  Activity, 
  Thermometer, 
  Zap, 
  Gauge,
  Bluetooth,
  Smartphone,
  Radio,
  CheckCircle,
  AlertCircle,
  Clock,
  Factory
} from "lucide-react";

interface IoTDevice {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  lastUpdate: string;
  value: string;
  icon: React.ElementType;
  protocol: string;
}

const IoTIntegration = () => {
  const { toast } = useToast();
  const [newDeviceUrl, setNewDeviceUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: "temp_01",
      name: "Temperature Sensor A1",
      type: "Temperature",
      status: "connected",
      lastUpdate: "2 seconds ago",
      value: "23.5°C",
      icon: Thermometer,
      protocol: "MQTT"
    },
    {
      id: "vibr_01",
      name: "Vibration Monitor B2",
      type: "Vibration",
      status: "connected",
      lastUpdate: "1 second ago",
      value: "0.02 mm/s",
      icon: Activity,
      protocol: "CoAP"
    },
    {
      id: "power_01",
      name: "Power Meter C3",
      type: "Power",
      status: "error",
      lastUpdate: "5 minutes ago",
      value: "234.7 kW",
      icon: Zap,
      protocol: "Modbus"
    },
    {
      id: "press_01",
      name: "Pressure Sensor D4",
      type: "Pressure",
      status: "disconnected",
      lastUpdate: "10 minutes ago",
      value: "1013.25 hPa",
      icon: Gauge,
      protocol: "LoRaWAN"
    }
  ]);

  const handleAddDevice = async () => {
    if (!newDeviceUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a device endpoint URL",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate device discovery
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDevice: IoTDevice = {
      id: `device_${Date.now()}`,
      name: "New IoT Device",
      type: "Generic",
      status: "connected",
      lastUpdate: "just now",
      value: "N/A",
      icon: Wifi,
      protocol: "HTTP"
    };
    
    setDevices(prev => [...prev, newDevice]);
    setNewDeviceUrl("");
    setIsScanning(false);
    
    toast({
      title: "Device Connected",
      description: "New IoT device has been successfully integrated",
    });
  };

  const handleDeviceToggle = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            status: device.status === "connected" ? "disconnected" : "connected",
            lastUpdate: device.status === "connected" ? "just disconnected" : "just connected"
          }
        : device
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <WifiOff className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case "Bluetooth":
        return <Bluetooth className="w-4 h-4" />;
      case "WiFi":
        return <Wifi className="w-4 h-4" />;
      case "LoRaWAN":
        return <Radio className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Add New Device */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add IoT Device
          </CardTitle>
          <CardDescription>
            Connect sensors, actuators, and other IoT devices to your digital twin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="device-url">Device Endpoint URL</Label>
              <Input
                id="device-url"
                placeholder="http://192.168.1.100:8080/api/sensor"
                value={newDeviceUrl}
                onChange={(e) => setNewDeviceUrl(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAddDevice} 
              disabled={isScanning}
              className="mt-6"
            >
              {isScanning ? (
                <>
                  <Radio className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <Button variant="outline" className="gap-2">
              <Radio className="w-4 h-4" />
              Auto-Discover
            </Button>
            <Button variant="outline" className="gap-2">
              <Smartphone className="w-4 h-4" />
              Import Config
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Templates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Connected Devices
            </div>
            <Badge variant="outline">
              {devices.filter(d => d.status === "connected").length} / {devices.length} Online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-accent/50">
                    <device.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{device.name}</h4>
                      {getStatusIcon(device.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Type: {device.type}</span>
                      <span className="flex items-center gap-1">
                        {getProtocolIcon(device.protocol)}
                        {device.protocol}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {device.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono text-sm">{device.value}</div>
                    <Badge 
                      variant={device.status === "connected" ? "default" : 
                               device.status === "error" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {device.status}
                    </Badge>
                  </div>
                  
                  <Switch
                    checked={device.status === "connected"}
                    onCheckedChange={() => handleDeviceToggle(device.id)}
                  />
                  
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported Protocols</CardTitle>
          <CardDescription>
            Native support for industry-standard IoT communication protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "MQTT", description: "Message Queuing", icon: Radio },
              { name: "CoAP", description: "Constrained Application", icon: Smartphone },
              { name: "LoRaWAN", description: "Long Range WAN", icon: Radio },
              { name: "Modbus", description: "Industrial Protocol", icon: Settings },
              { name: "OPC-UA", description: "Industrial Automation", icon: Factory },
              { name: "HTTP/REST", description: "Web APIs", icon: Wifi },
              { name: "WebSocket", description: "Real-time Data", icon: Activity },
              { name: "Bluetooth", description: "Short Range", icon: Bluetooth },
            ].map((protocol) => (
              <div key={protocol.name} className="p-3 border border-border rounded-lg text-center">
                <protocol.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <h4 className="font-medium text-sm">{protocol.name}</h4>
                <p className="text-xs text-muted-foreground">{protocol.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoTIntegration;