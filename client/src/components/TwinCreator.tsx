import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Model3DViewer from "./Model3DViewer";
import { 
  Upload, 
  Plus, 
  Zap, 
  Building, 
  Factory, 
  Sprout,
  Cpu,
  Settings,
  CheckCircle,
  Wand2,
  Sparkles,
  Bot,
  Layers,
  Database,
  Workflow,
  Activity
} from "lucide-react";

interface TwinModel3D {
  id: string;
  name: string;
  description: string;
  vertices: number[][];
  faces: number[][];
  materials: {
    color: string;
    metalness: number;
    roughness: number;
  };
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  createdAt: string;
}

interface DigitalTwin {
  id: number;
  name: string;
  type: string;
  description: string;
  userId: number;
  model3D: TwinModel3D | null;
  iotDevices: any[];
  workflows: any[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const TwinCreator = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [twinName, setTwinName] = useState("");
  const [twinType, setTwinType] = useState("");
  const [description, setDescription] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [generatedModel, setGeneratedModel] = useState<TwinModel3D | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const twinTypes = [
    { value: "building", label: "Building/Architecture", icon: Building, color: "text-blue-500" },
    { value: "manufacturing", label: "Manufacturing", icon: Factory, color: "text-orange-500" },
    { value: "agriculture", label: "Agriculture", icon: Sprout, color: "text-green-500" },
    { value: "smart-city", label: "Smart City", icon: Cpu, color: "text-purple-500" },
  ];

  // Fetch existing digital twins
  const { data: digitalTwins, isLoading: isLoadingTwins } = useQuery({
    queryKey: ["/api/digital-twins"],
    queryFn: () => apiRequest("/api/digital-twins?userId=1"),
  });

  // Generate AI model mutation
  const generateModelMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("/api/generate-twin", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      return response.model;
    },
    onSuccess: (model) => {
      setGeneratedModel(model);
      toast({
        title: "AI Model Generated!",
        description: "3D model has been generated from your prompt",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI model",
        variant: "destructive",
      });
    },
  });

  // Create digital twin mutation
  const createTwinMutation = useMutation({
    mutationFn: async (twinData: any) => {
      const response = await apiRequest("/api/digital-twins", {
        method: "POST",
        body: JSON.stringify(twinData),
      });
      return response.twin;
    },
    onSuccess: (twin) => {
      queryClient.invalidateQueries({ queryKey: ["/api/digital-twins"] });
      toast({
        title: "Digital Twin Created!",
        description: `${twin.name} has been successfully created`,
      });
      // Reset form
      setTwinName("");
      setTwinType("");
      setDescription("");
      setAiPrompt("");
      setGeneratedModel(null);
      setActiveTab("manage");
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create digital twin",
        variant: "destructive",
      });
    },
  });

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for AI generation",
        variant: "destructive",
      });
      return;
    }

    generateModelMutation.mutate(aiPrompt);
  };

  const handleCreateTwin = async () => {
    if (!twinName || !twinType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setCreationProgress(0);

    // Simulate twin creation process
    const steps = [
      "Initializing digital twin framework...",
      "Processing parameters and constraints...",
      "Generating 3D model structure...",
      "Integrating IoT sensors...",
      "Setting up data streams...",
      "Finalizing twin configuration...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCreationProgress(((i + 1) / steps.length) * 100);
      
      toast({
        title: steps[i],
        description: `Step ${i + 1} of ${steps.length}`,
      });
    }

    // Create the twin
    const twinData = {
      name: twinName,
      type: twinType,
      description,
      userId: 1, // Mock user ID
      model3D: generatedModel,
      iotDevices: [],
      workflows: [],
    };

    createTwinMutation.mutate(twinData);
    setIsCreating(false);
  };

  const handleQuickGenerate = (templateType: string) => {
    const prompts = {
      building: "Create a smart office building with sustainable energy systems, automated lighting, and HVAC control",
      manufacturing: "Design a smart factory with robotic assembly lines, quality control sensors, and predictive maintenance systems",
      agriculture: "Build a precision agriculture system with soil sensors, irrigation controls, and crop monitoring",
      "smart-city": "Create a smart city district with traffic management, environmental monitoring, and energy grid optimization"
    };
    
    const names = {
      building: "Smart Office Complex",
      manufacturing: "Automated Factory",
      agriculture: "Precision Farm",
      "smart-city": "Smart District"
    };

    setTwinType(templateType);
    setTwinName(names[templateType as keyof typeof names]);
    setAiPrompt(prompts[templateType as keyof typeof prompts]);
    setDescription(`AI-generated ${templateType} digital twin with integrated IoT systems and real-time monitoring.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Twin</TabsTrigger>
          <TabsTrigger value="ai-generate">AI Generate</TabsTrigger>
          <TabsTrigger value="manage">Manage Twins</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Digital Twin
              </CardTitle>
              <CardDescription>
                Define your digital twin parameters and let AI generate the complete simulation environment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="twin-name">Twin Name *</Label>
                    <Input
                      id="twin-name"
                      placeholder="Enter twin name..."
                      value={twinName}
                      onChange={(e) => setTwinName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="twin-type">Twin Type *</Label>
                    <Select value={twinType} onValueChange={setTwinType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select twin type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {twinTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your digital twin requirements..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Upload CAD files, blueprints, or reference images
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Files
                    </Button>
                  </div>

                  <Card className="p-4">
                    <h4 className="font-medium mb-3">AI Enhancement Options</h4>
                    <div className="space-y-2">
                      {[
                        "Auto-generate IoT sensor placements",
                        "Create predictive maintenance schedules",
                        "Optimize resource utilization",
                        "Generate performance analytics",
                      ].map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {isCreating && (
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-medium">Creating Digital Twin...</span>
                    <Badge variant="outline">{Math.round(creationProgress)}%</Badge>
                  </div>
                  <Progress value={creationProgress} className="w-full" />
                </Card>
              )}

              <Button 
                onClick={handleCreateTwin} 
                disabled={isCreating || createTwinMutation.isPending}
                className="w-full"
                size="lg"
              >
                {isCreating || createTwinMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Creating Twin...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Digital Twin
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                AI-Powered Twin Generation
              </CardTitle>
              <CardDescription>
                Use AI to generate complete digital twins from natural language descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Templates */}
              <div>
                <h3 className="font-medium mb-3">Quick Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {twinTypes.map((type) => (
                    <Card key={type.value} className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleQuickGenerate(type.value)}>
                      <div className="flex flex-col items-center gap-3">
                        <type.icon className={`w-8 h-8 ${type.color}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* AI Prompt */}
              <div>
                <Label htmlFor="ai-prompt">AI Generation Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Describe what you want to create in detail. For example: 'Create a smart factory with robotic assembly lines, quality control sensors, and predictive maintenance systems...'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleGenerateAI} 
                disabled={generateModelMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateModelMutation.isPending ? (
                  <>
                    <Bot className="w-4 h-4 mr-2 animate-spin" />
                    Generating AI Model...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>

              {/* Generated Model Preview */}
              {generatedModel && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated 3D Model</CardTitle>
                    <CardDescription>{generatedModel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-64 bg-gradient-to-br from-background to-accent/10 rounded-lg border">
                        <Model3DViewer model={generatedModel} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Vertices: {generatedModel.vertices.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Faces: {generatedModel.faces.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Material: {generatedModel.materials.color}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Manage Digital Twins
              </CardTitle>
              <CardDescription>
                View and manage your existing digital twins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTwins ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : digitalTwins?.twins?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {digitalTwins.twins.map((twin: DigitalTwin) => (
                    <Card key={twin.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const twinType = twinTypes.find(t => t.value === twin.type);
                            if (twinType) {
                              const IconComponent = twinType.icon;
                              return <IconComponent className="w-5 h-5" />;
                            }
                            return <Settings className="w-5 h-5" />;
                          })()}
                          <span className="font-medium">{twin.name}</span>
                        </div>
                        <Badge variant={twin.status === 'active' ? 'default' : 'secondary'}>
                          {twin.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{twin.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {twin.type}
                        </span>
                        <Button variant="outline" size="sm">
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No digital twins created yet.</p>
                  <Button variant="outline" onClick={() => setActiveTab("create")} className="mt-4">
                    Create Your First Twin
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

export default TwinCreator;