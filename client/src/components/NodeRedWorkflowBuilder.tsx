import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  Activity,
  Thermometer,
  Gauge,
  Radio,
  Lightbulb,
  AlertTriangle,
  Mail,
  MessageSquare,
  Save,
  Trash2,
  Copy,
  Edit,
  Download,
  Upload
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  config: any;
  status: 'idle' | 'running' | 'success' | 'error';
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
}

interface WorkflowData {
  id?: number;
  name: string;
  twinId: number;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  isActive: boolean;
}

const NodeRedWorkflowBuilder = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedTwinId, setSelectedTwinId] = useState<number | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Node types with Node-RED style categories
  const nodeTypes = [
    {
      category: "Input",
      nodes: [
        { type: "mqtt-in", label: "MQTT In", icon: Radio, color: "text-blue-500", description: "Receive MQTT messages" },
        { type: "http-in", label: "HTTP In", icon: Database, color: "text-green-500", description: "HTTP endpoint" },
        { type: "sensor", label: "Sensor", icon: Thermometer, color: "text-orange-500", description: "IoT sensor input" },
        { type: "timer", label: "Timer", icon: Clock, color: "text-purple-500", description: "Time-based trigger" },
      ]
    },
    {
      category: "Function",
      nodes: [
        { type: "function", label: "Function", icon: Code, color: "text-yellow-500", description: "Custom JavaScript function" },
        { type: "switch", label: "Switch", icon: GitBranch, color: "text-indigo-500", description: "Route messages based on conditions" },
        { type: "change", label: "Change", icon: Edit, color: "text-pink-500", description: "Modify message properties" },
        { type: "template", label: "Template", icon: Copy, color: "text-teal-500", description: "Generate text from template" },
      ]
    },
    {
      category: "Output",
      nodes: [
        { type: "mqtt-out", label: "MQTT Out", icon: Radio, color: "text-blue-500", description: "Send MQTT messages" },
        { type: "http-out", label: "HTTP Out", icon: Database, color: "text-green-500", description: "HTTP response" },
        { type: "actuator", label: "Actuator", icon: Zap, color: "text-red-500", description: "Control IoT devices" },
        { type: "notification", label: "Notification", icon: Mail, color: "text-amber-500", description: "Send alerts" },
      ]
    },
    {
      category: "AI/ML",
      nodes: [
        { type: "ai-predict", label: "AI Predict", icon: Activity, color: "text-violet-500", description: "ML prediction model" },
        { type: "anomaly-detect", label: "Anomaly Detect", icon: AlertTriangle, color: "text-red-600", description: "Detect anomalies" },
        { type: "optimizer", label: "Optimizer", icon: Gauge, color: "text-emerald-500", description: "Optimize parameters" },
        { type: "ai-chat", label: "AI Chat", icon: MessageSquare, color: "text-blue-600", description: "AI conversation" },
      ]
    }
  ];

  // Fetch digital twins for workflow assignment
  const { data: digitalTwins } = useQuery({
    queryKey: ["/api/digital-twins"],
    queryFn: () => apiRequest("/api/digital-twins?userId=1"),
  });

  // Fetch workflows for selected twin
  const { data: workflows, isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ["/api/workflows", selectedTwinId],
    queryFn: () => selectedTwinId ? apiRequest(`/api/workflows?twinId=${selectedTwinId}`) : null,
    enabled: !!selectedTwinId,
  });

  // Save workflow mutation
  const saveWorkflowMutation = useMutation({
    mutationFn: async (workflowData: WorkflowData) => {
      const response = await apiRequest("/api/workflows", {
        method: "POST",
        body: JSON.stringify(workflowData),
      });
      return response.workflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows", selectedTwinId] });
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save workflow",
        variant: "destructive",
      });
    },
  });

  const handleDragStart = (nodeType: string) => {
    setDraggedNodeType(nodeType);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedNodeType) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const nodeTypeInfo = nodeTypes
      .flatMap(category => category.nodes)
      .find(node => node.type === draggedNodeType);

    if (nodeTypeInfo) {
      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: draggedNodeType,
        label: nodeTypeInfo.label,
        x,
        y,
        config: {},
        status: 'idle'
      };

      setNodes(prev => [...prev, newNode]);
    }
    setDraggedNodeType(null);
  };

  const handleSaveWorkflow = () => {
    if (!workflowName || !selectedTwinId) {
      toast({
        title: "Missing Information",
        description: "Please select a twin and enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    const workflowData: WorkflowData = {
      name: workflowName,
      twinId: selectedTwinId,
      nodes,
      connections,
      isActive: true,
    };

    saveWorkflowMutation.mutate(workflowData);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
    setSelectedNode(null);
  };

  const handleDeployWorkflow = () => {
    toast({
      title: "Workflow Deployed",
      description: "Your workflow is now running in the digital twin environment",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Node-RED Workflow Builder</h2>
          <p className="text-muted-foreground">
            Build sophisticated automation workflows with drag-and-drop nodes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setNodes([])}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveWorkflow} disabled={saveWorkflowMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="default" size="sm" onClick={handleDeployWorkflow}>
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
          <TabsTrigger value="library">Workflow Library</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Configuration</CardTitle>
              <CardDescription>Configure your workflow settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Digital Twin</Label>
                  <Select value={selectedTwinId?.toString()} onValueChange={(value) => setSelectedTwinId(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a digital twin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {digitalTwins?.twins?.map((twin: any) => (
                        <SelectItem key={twin.id} value={twin.id.toString()}>
                          {twin.name} ({twin.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Workflow Name</Label>
                  <Input
                    placeholder="Enter workflow name..."
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Node Palette */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Node Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nodeTypes.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                    <div className="space-y-2">
                      {category.nodes.map((node) => (
                        <div
                          key={node.type}
                          draggable
                          onDragStart={() => handleDragStart(node.type)}
                          className="p-3 rounded-lg bg-accent/20 border border-border/50 hover:bg-accent/30 transition-colors cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-center gap-2">
                            <node.icon className={`w-4 h-4 ${node.color}`} />
                            <div>
                              <span className="text-sm font-medium">{node.label}</span>
                              <p className="text-xs text-muted-foreground">{node.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Workflow Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="h-96 bg-gradient-to-br from-background to-accent/10 rounded-lg border-2 border-dashed border-border/50 p-4 relative overflow-hidden"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Workflow className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Drag nodes from the palette to start building</p>
                      </div>
                    </div>
                  ) : (
                    nodes.map((node) => {
                      const nodeType = nodeTypes
                        .flatMap(category => category.nodes)
                        .find(n => n.type === node.type);
                      
                      return (
                        <div
                          key={node.id}
                          className={`absolute p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedNode?.id === node.id ? 'border-primary bg-primary/10' : 'border-border bg-card'}
                            ${node.status === 'running' ? 'animate-pulse' : ''}
                            ${node.status === 'success' ? 'border-green-500' : ''}
                            ${node.status === 'error' ? 'border-red-500' : ''}
                          `}
                          style={{ left: node.x, top: node.y }}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div className="flex items-center gap-2">
                            {nodeType && <nodeType.icon className={`w-4 h-4 ${nodeType.color}`} />}
                            <span className="text-sm font-medium">{node.label}</span>
                            <Badge variant={node.status === 'running' ? 'default' : 'secondary'} className="text-xs">
                              {node.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Properties Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Node Type</Label>
                      <Input value={selectedNode.type} disabled />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={selectedNode.label}
                        onChange={(e) => {
                          setSelectedNode(prev => prev ? { ...prev, label: e.target.value } : null);
                          setNodes(prev => prev.map(node => 
                            node.id === selectedNode.id ? { ...node, label: e.target.value } : node
                          ));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge variant={selectedNode.status === 'running' ? 'default' : 'secondary'}>
                        {selectedNode.status}
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteNode(selectedNode.id)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Node
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a node to view properties</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>Edit workflow logic in JSON format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-auto">
                <pre>{JSON.stringify({ nodes, connections }, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Library</CardTitle>
              <CardDescription>Browse and manage saved workflows</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingWorkflows ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : workflows?.workflows?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflows.workflows.map((workflow: any) => (
                    <Card key={workflow.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{workflow.name}</span>
                        <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {workflow.nodes?.length || 0} nodes, {workflow.connections?.length || 0} connections
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-3 h-3 mr-1" />
                          Clone
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No workflows found for this twin.</p>
                  <Button variant="outline" onClick={() => setActiveTab("builder")} className="mt-4">
                    Create First Workflow
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeRedWorkflowBuilder;