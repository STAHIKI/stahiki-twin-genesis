import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Plus, 
  Zap, 
  Building, 
  Factory, 
  Sprout,
  Cpu,
  Settings,
  CheckCircle
} from "lucide-react";

const TwinCreator = () => {
  const [twinName, setTwinName] = useState("");
  const [twinType, setTwinType] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const { toast } = useToast();

  const twinTypes = [
    { value: "building", label: "Building/Architecture", icon: Building },
    { value: "manufacturing", label: "Manufacturing", icon: Factory },
    { value: "agriculture", label: "Agriculture", icon: Sprout },
    { value: "smart-city", label: "Smart City", icon: Cpu },
  ];

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCreationProgress(((i + 1) / steps.length) * 100);
      
      toast({
        title: steps[i],
        description: `Step ${i + 1} of ${steps.length}`,
      });
    }

    setIsCreating(false);
    toast({
      title: "Digital Twin Created Successfully!",
      description: `${twinName} is now ready for simulation and monitoring.`,
    });
  };

  return (
    <div className="space-y-6">
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
            disabled={isCreating}
            className="w-full"
            size="lg"
          >
            {isCreating ? (
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
    </div>
  );
};

export default TwinCreator;