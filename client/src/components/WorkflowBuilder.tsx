import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Workflow, 
  Code, 
  Play, 
  Pause, 
  Settings,
  Plus,
  GitBranch,
  Zap,
  Database,
  Clock,
  Activity
} from "lucide-react";

const WorkflowBuilder = () => {
  const [activeTab, setActiveTab] = useState("builder");

  const workflowNodes = [
    { id: 1, type: "trigger", label: "Temperature Sensor", status: "active" },
    { id: 2, type: "condition", label: "If > 25°C", status: "active" },
    { id: 3, type: "action", label: "Turn On AC", status: "pending" },
    { id: 4, type: "notification", label: "Send Alert", status: "inactive" }
  ];

  const nodeTypes = [
    { type: "Sensors", icon: Activity, color: "text-info" },
    { type: "Conditions", icon: GitBranch, color: "text-warning" },
    { type: "Actions", icon: Zap, color: "text-success" },
    { type: "Data", icon: Database, color: "text-primary" },
    { type: "Time", icon: Clock, color: "text-muted-foreground" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Automation</h2>
          <p className="text-muted-foreground">
            Automate your digital twin creation process with prebuilt nodes and custom node editor.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pause className="w-4 h-4 mr-2" />
            Pause All
          </Button>
          <Button variant="glow" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
          <TabsTrigger value="editor">Custom Node Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Workflow Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                Drag and Drop Workflow Builder
              </CardTitle>
              <CardDescription>
                Use prebuilt nodes to automate your digital twin creation process. Drag and drop nodes to create your workflow.
                Enhanced with industry-specific nodes: Architectural nodes for building code compliance and energy efficiency analysis;
                Industrial nodes for supply chain optimization and predictive maintenance; Agricultural nodes for irrigation scheduling and
                yield prediction. The node library is expanded to include smart city planning elements like traffic flow analysis and smart
                grid management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Node Palette */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Node Types</h3>
                  {nodeTypes.map((nodeType, index) => (
                    <div key={index} className="p-3 rounded-lg bg-accent/20 border border-border/50 hover:bg-accent/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <nodeType.icon className={`w-4 h-4 ${nodeType.color}`} />
                        <span className="text-sm font-medium text-foreground">{nodeType.type}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Plus className="w-3 h-3" />
                    Custom Node
                  </Button>
                </div>

                {/* Workflow Canvas */}
                <div className="lg:col-span-3">
                  <div className="h-96 bg-gradient-to-br from-background to-accent/10 rounded-lg border-2 border-dashed border-border/50 p-6">
                    <div className="flex flex-col space-y-4">
                      {workflowNodes.map((node, index) => (
                        <div key={node.id} className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${
                            node.status === 'active' ? 'bg-success/20 border-success/50' :
                            node.status === 'pending' ? 'bg-warning/20 border-warning/50' :
                            'bg-muted/20 border-border/50'
                          } border`}>
                            <span className="text-sm font-medium text-foreground">{node.label}</span>
                            <Badge 
                              variant={node.status === 'active' ? 'default' : 'secondary'} 
                              className="ml-2 text-xs"
                            >
                              {node.status}
                            </Badge>
                          </div>
                          {index < workflowNodes.length - 1 && (
                            <div className="w-8 h-0.5 bg-border"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 text-center">
                      <p className="text-sm text-muted-foreground">Drag nodes here to build your workflow</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {/* Custom Node Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Custom Node Editor
              </CardTitle>
              <CardDescription>
                Define custom automation flows for industry-specific use cases. Create, edit, and manage your custom nodes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-background to-accent/10 rounded-lg border border-border/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  {/* Code Editor Area */}
                  <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-foreground">Node Logic</h4>
                      <Badge variant="outline">JavaScript</Badge>
                    </div>
                    <div className="bg-background/80 rounded p-3 font-mono text-sm text-foreground">
                      <div className="text-primary">function</div>
                      <div className="ml-2 text-foreground">processTemperature(sensor) {`{`}</div>
                      <div className="ml-4 text-muted-foreground">// Custom logic here</div>
                      <div className="ml-4 text-warning">if</div>
                      <div className="ml-4 text-foreground">(sensor.value {`>`} 25) {`{`}</div>
                      <div className="ml-6 text-success">return</div>
                      <div className="ml-6 text-foreground">'COOLING_REQUIRED';</div>
                      <div className="ml-4 text-foreground">{`}`}</div>
                      <div className="ml-2 text-foreground">{`}`}</div>
                    </div>
                  </div>

                  {/* Node Properties */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Node Properties</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <span className="text-sm text-foreground">Temperature Controller</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="text-sm text-foreground">Condition</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span className="text-sm text-foreground">HVAC Control</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Test Node
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        Save Node
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowBuilder;