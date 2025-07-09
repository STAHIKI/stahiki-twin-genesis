import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Settings, 
  Layers,
  Eye,
  EyeOff,
  Zap,
  Thermometer,
  Gauge,
  Activity
} from "lucide-react";

const LiveSimulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState([1]);
  const [viewMode, setViewMode] = useState("3d");
  const [layersVisible, setLayersVisible] = useState({
    structure: true,
    sensors: true,
    dataFlow: true,
    analytics: false,
  });

  const [realTimeData, setRealTimeData] = useState({
    temperature: 22.5,
    pressure: 1013.25,
    vibration: 0.02,
    efficiency: 87.3,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setRealTimeData(prev => ({
          temperature: prev.temperature + (Math.random() - 0.5) * 2,
          pressure: prev.pressure + (Math.random() - 0.5) * 10,
          vibration: prev.vibration + (Math.random() - 0.5) * 0.01,
          efficiency: Math.max(0, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 5)),
        }));
      }, 1000 / simulationSpeed[0]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, simulationSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setRealTimeData({
      temperature: 22.5,
      pressure: 1013.25,
      vibration: 0.02,
      efficiency: 87.3,
    });
  };

  const toggleLayer = (layer: keyof typeof layersVisible) => {
    setLayersVisible(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Simulation Environment
            </div>
            <Badge variant={isPlaying ? "default" : "secondary"}>
              {isPlaying ? "Running" : "Paused"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time digital twin simulation with Omniverse-level visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={handlePlayPause}
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4 mr-2" />Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" />Play</>
              )}
            </Button>
            
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="speed" className="text-sm">Speed:</Label>
              <div className="w-24">
                <Slider
                  id="speed"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={simulationSpeed}
                  onValueChange={setSimulationSpeed}
                />
              </div>
              <span className="text-sm text-muted-foreground">{simulationSpeed[0]}x</span>
            </div>

            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main 3D Viewport */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">3D Simulation Viewport</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Perspective</Button>
                  <Button variant="outline" size="sm">Orthographic</Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="w-full h-full bg-gradient-to-br from-background via-accent/20 to-primary/10 rounded-lg border border-border/50 relative overflow-hidden">
                {/* Simulated 3D Environment */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Main 3D Object Simulation */}
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-primary/60 rounded-lg border border-primary/50 animate-pulse shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                      <div className="absolute inset-2 bg-gradient-to-br from-card to-accent/30 rounded border border-border"></div>
                    </div>
                    
                    {/* Sensor Points */}
                    {layersVisible.sensors && (
                      <>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-success rounded-full animate-ping"></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-warning rounded-full animate-ping"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-info rounded-full animate-ping"></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-destructive rounded-full animate-ping"></div>
                      </>
                    )}
                    
                    {/* Data Flow Lines */}
                    {layersVisible.dataFlow && (
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full">
                          <path
                            d="M 16 16 Q 50 8 100 16"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="4 4"
                            className="animate-pulse"
                          />
                          <path
                            d="M 16 100 Q 50 108 100 100"
                            stroke="hsl(var(--success))"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="4 4"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Real-time Status Overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge className="bg-success/20 text-success border-success/50">
                    <Zap className="w-3 h-3 mr-1" />
                    Real-time Active
                  </Badge>
                  <Badge className="bg-info/20 text-info border-info/50">
                    FPS: 60 | Latency: 12ms
                  </Badge>
                </div>

                {/* Performance Metrics */}
                <div className="absolute bottom-4 left-4 text-sm text-muted-foreground">
                  Vertices: 2.4M | Triangles: 4.8M | Materials: 156
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Data Panel */}
        <div className="space-y-6">
          {/* Layer Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(layersVisible).map(([layer, visible]) => (
                <div key={layer} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <Label className="text-sm capitalize">{layer.replace(/([A-Z])/g, ' $1')}</Label>
                  </div>
                  <Switch
                    checked={visible}
                    onCheckedChange={() => toggleLayer(layer as keyof typeof layersVisible)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real-time Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-warning" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="text-sm font-mono">{realTimeData.temperature.toFixed(1)}°C</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-info" />
                    <span className="text-sm">Pressure</span>
                  </div>
                  <span className="text-sm font-mono">{realTimeData.pressure.toFixed(2)} hPa</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-success" />
                    <span className="text-sm">Vibration</span>
                  </div>
                  <span className="text-sm font-mono">{realTimeData.vibration.toFixed(3)} mm/s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm">Efficiency</span>
                  </div>
                  <span className="text-sm font-mono">{realTimeData.efficiency.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Simulation Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Physics Accuracy</Label>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Rendering Quality</Label>
                <Slider defaultValue={[75]} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Data Frequency</Label>
                <Slider defaultValue={[60]} max={120} step={1} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveSimulation;