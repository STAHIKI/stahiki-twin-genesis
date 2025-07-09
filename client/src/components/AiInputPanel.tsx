import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Upload, 
  Settings, 
  Play,
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Zap,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Model3DViewer from "./Model3DViewer";

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

const AiInputPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedModel, setGeneratedModel] = useState<TwinModel3D | null>(null);
  const { toast } = useToast();

  const suggestions = [
    "Design a smart greenhouse with automated irrigation and climate control",
    "Create a digital twin of a manufacturing assembly line with predictive maintenance",
    "Build a smart city traffic optimization system with real-time sensors",
    "Simulate a wind farm with weather data integration and power output optimization"
  ];

  const generateTwinMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const data = await apiRequest('/api/generate-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.success && data.model) {
        setGeneratedModel(data.model);
        toast({
          title: "3D Model Generated!",
          description: `Successfully created ${data.model.name}`,
        });
      } else {
        throw new Error(data.error || "Failed to generate model");
      }
    },
    onError: (error: any) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate 3D model. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your digital twin",
        variant: "destructive",
      });
      return;
    }
    generateTwinMutation.mutate(prompt.trim());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Smart AI Input Panel</h2>
          <p className="text-muted-foreground">
            An intuitive, fluid, and powerful interface for digital twin creation that combines 
            workflow automation with 3D modeling capabilities.
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Lightbulb className="w-3 h-3" />
          Model Preview
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Prompt Box */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Prompt Box
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text commands for AI to generate realistic twin models"
                className="min-h-32 bg-background/50 border-border/50 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                variant="glow" 
                className="w-full gap-2"
                onClick={handleGenerate}
                disabled={generateTwinMutation.isPending}
              >
                {generateTwinMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Scan-to-Twin Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-info" />
                Scan-to-Twin Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload LiDAR scans/images</p>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Convert
              </Button>
            </CardContent>
          </Card>

          {/* Auto-Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-warning" />
                Auto-Optimization Suggestions
              </CardTitle>
              <CardDescription>
                AI dynamically enhances models based on use cases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Optimize
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* 3D Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Model Preview</span>
                {generatedModel && (
                  <Badge variant="secondary" className="text-xs">
                    {generatedModel.vertices.length} vertices
                  </Badge>
                )}
              </CardTitle>
              {generatedModel && (
                <CardDescription>
                  {generatedModel.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Model3DViewer 
                model={generatedModel}
                isGenerating={generateTwinMutation.isPending}
                className="h-96"
              />
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Suggested Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className="w-full text-left p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiInputPanel;