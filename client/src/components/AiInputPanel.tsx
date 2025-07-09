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
  Zap
} from "lucide-react";

const AiInputPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const suggestions = [
    "Design a smart greenhouse with automated irrigation and climate control",
    "Create a digital twin of a manufacturing assembly line with predictive maintenance",
    "Build a smart city traffic optimization system with real-time sensors",
    "Simulate a wind farm with weather data integration and power output optimization"
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
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
                disabled={isGenerating}
              >
                {isGenerating ? (
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
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="text-lg">Model Preview</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="w-full h-full bg-gradient-to-br from-background to-accent/20 rounded-lg border border-border/50 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Generating 3D model...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">3D preview will appear here</p>
                  </div>
                )}
              </div>
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