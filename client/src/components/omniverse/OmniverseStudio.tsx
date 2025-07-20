import React, { useState, useRef, useEffect, useCallback } from 'react';
import WebGLRenderer from './WebGLRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Settings, 
  Layers, 
  Camera, 
  Lightbulb, 
  Palette, 
  Box,
  Circle,
  Monitor,
  Users,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Grid3X3,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface OmniverseStudioProps {
  twinId?: string;
  collaborationMode?: boolean;
}

interface Model3D {
  id: string;
  name: string;
  description: string;
  type: string;
  geometry: any;
  materials: any;
  lighting: any;
  environment: any;
  metadata: any;
}

interface ViewportSettings {
  renderer: 'RTX' | 'Path-Traced' | 'Real-time';
  quality: 'Low' | 'Medium' | 'High' | 'Ultra';
  shadows: boolean;
  reflections: boolean;
  globalIllumination: boolean;
  antialiasing: boolean;
  wireframe: boolean;
  showGrid: boolean;
  showGizmos: boolean;
}

interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'light' | 'camera' | 'empty';
  visible: boolean;
  locked: boolean;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  parent?: string;
  children: string[];
}

const OmniverseStudio: React.FC<OmniverseStudioProps> = ({ 
  twinId, 
  collaborationMode = false 
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model3D | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  
  // Scene management
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  // Viewport settings
  const [viewportSettings, setViewportSettings] = useState<ViewportSettings>({
    renderer: 'Real-time',
    quality: 'Medium',
    shadows: true,
    reflections: true,
    globalIllumination: false,
    antialiasing: true,
    wireframe: false,
    showGrid: true,
    showGizmos: true,
  });

  // Material properties
  const [materialProps, setMaterialProps] = useState({
    diffuse: '#808080',
    metalness: 0.0,
    roughness: 0.5,
    opacity: 1.0,
    emissive: '#000000',
  });

  // Lighting setup
  const [lightingSettings, setLightingSettings] = useState({
    ambientIntensity: 0.3,
    directionalIntensity: 1.0,
    directionalAngle: [45, 135],
    shadows: true,
    environmentMap: 'studio',
  });

  // Initialize WebGL context and basic 3D setup
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      toast({
        title: "WebGL Not Supported",
        description: "Your browser doesn't support WebGL. Please use a modern browser.",
        variant: "destructive",
      });
      return;
    }

    // Basic WebGL setup
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Add default grid and basic scene
    renderBasicScene(gl);
  }, []);

  const renderBasicScene = (gl: WebGLRenderingContext | WebGL2RenderingContext) => {
    // Create a simple shader program for basic rendering
    const vertexShaderSource = `
      attribute vec3 position;
      uniform mat4 mvpMatrix;
      void main() {
        gl_Position = mvpMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    // This is a simplified WebGL setup - in production you'd use a full 3D engine
    // For now, just clear to show the canvas is working
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };

  const handleGenerateModel = async () => {
    if (!generationPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for the 3D model",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest<{ model: Model3D }>('/api/generate-twin', {
        method: 'POST',
        body: { prompt: generationPrompt }
      });

      setCurrentModel(response.model);
      
      // Add to scene objects
      const newObject: SceneObject = {
        id: response.model.id,
        name: response.model.name,
        type: 'mesh',
        visible: true,
        locked: false,
        transform: {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
        children: [],
      };
      
      setSceneObjects(prev => [...prev, newObject]);
      setSelectedObjectId(response.model.id);
      
      toast({
        title: "Model Generated Successfully",
        description: `Created ${response.model.name} with ${response.model.metadata?.polygonCount || 'unknown'} polygons`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate 3D model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddPrimitive = (type: 'cube' | 'sphere' | 'plane') => {
    const newObject: SceneObject = {
      id: `${type}_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}_${sceneObjects.length + 1}`,
      type: 'mesh',
      visible: true,
      locked: false,
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      children: [],
    };
    
    setSceneObjects(prev => [...prev, newObject]);
    setSelectedObjectId(newObject.id);
  };

  const selectedObject = sceneObjects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">Stahiki Omniverse Studio</h1>
          <Badge variant="outline" className="border-green-500 text-green-400">
            {viewportSettings.renderer}
          </Badge>
          {collaborationMode && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Live Collaboration
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import USD
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant={isPlaying ? "secondary" : "default"} 
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Scene Hierarchy & Content Browser */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <Tabs defaultValue="hierarchy" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hierarchy" className="flex-1 p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Layers className="w-4 h-4" />
                    Scene Outliner
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddPrimitive('cube')}
                      className="border-gray-500"
                    >
                      <Box className="w-3 h-3 mr-1" /> Cube
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddPrimitive('sphere')}
                      className="border-gray-500"
                    >
                      <Circle className="w-3 h-3 mr-1" /> Sphere
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-80">
                    <div className="space-y-1">
                      {sceneObjects.map((obj) => (
                        <div
                          key={obj.id}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                            selectedObjectId === obj.id 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-gray-600'
                          }`}
                          onClick={() => setSelectedObjectId(obj.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{obj.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {obj.type}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSceneObjects(prev => 
                                  prev.map(o => 
                                    o.id === obj.id ? {...o, visible: !o.visible} : o
                                  )
                                );
                              }}
                              className="w-6 h-6 p-0"
                            >
                              {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSceneObjects(prev => 
                                  prev.map(o => 
                                    o.id === obj.id ? {...o, locked: !o.locked} : o
                                  )
                                );
                              }}
                              className="w-6 h-6 p-0"
                            >
                              {obj.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="flex-1 p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">AI Model Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt" className="text-white">Model Description</Label>
                    <Input
                      id="prompt"
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      placeholder="Describe the 3D model you want to generate..."
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateModel}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Viewport */}
        <div className="flex-1 flex flex-col">
          {/* Viewport Header */}
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                Perspective View
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewportSettings.showGrid ? "secondary" : "outline"}
                  onClick={() => setViewportSettings(prev => ({...prev, showGrid: !prev.showGrid}))}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewportSettings.wireframe ? "secondary" : "outline"}
                  onClick={() => setViewportSettings(prev => ({...prev, wireframe: !prev.wireframe}))}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-300">Renderer:</Label>
              <select
                value={viewportSettings.renderer}
                onChange={(e) => setViewportSettings(prev => ({
                  ...prev, 
                  renderer: e.target.value as ViewportSettings['renderer']
                }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
              >
                <option value="Real-time">Real-time</option>
                <option value="RTX">RTX Ray Tracing</option>
                <option value="Path-Traced">Path Traced</option>
              </select>
            </div>
          </div>

          {/* 3D Viewport */}
          <div className="flex-1 relative bg-gray-900">
            <WebGLRenderer
              model={currentModel}
              viewportSettings={viewportSettings}
              materialProps={materialProps}
              lightingSettings={lightingSettings}
            />
            
            {/* Viewport Overlay Info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
              <div>Quality: {viewportSettings.quality}</div>
              <div>Polygons: {currentModel?.metadata?.polygonCount || 0}</div>
              <div>FPS: 60</div>
            </div>
            
            {/* Viewport Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary">
                <Camera className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Sun className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties & Materials */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="p-4 h-full">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Transform</CardTitle>
                  {selectedObject && (
                    <p className="text-sm text-gray-300">{selectedObject.name}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedObject ? (
                    <>
                      <div>
                        <Label className="text-white">Position</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="X"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Y"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Z"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white">Rotation</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <Input 
                            type="number" 
                            step="1" 
                            placeholder="X°"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                          <Input 
                            type="number" 
                            step="1" 
                            placeholder="Y°"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                          <Input 
                            type="number" 
                            step="1" 
                            placeholder="Z°"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white">Scale</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="X"
                            defaultValue="1"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Y"
                            defaultValue="1"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Z"
                            defaultValue="1"
                            className="bg-gray-600 border-gray-500 text-white" 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">Select an object to edit properties</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="materials" className="p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Palette className="w-4 h-4" />
                    Material Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Base Color</Label>
                    <Input
                      type="color"
                      value={materialProps.diffuse}
                      onChange={(e) => setMaterialProps(prev => ({...prev, diffuse: e.target.value}))}
                      className="w-full h-10 bg-gray-600 border-gray-500"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Metallic: {materialProps.metalness}</Label>
                    <Slider
                      value={[materialProps.metalness]}
                      onValueChange={([value]) => setMaterialProps(prev => ({...prev, metalness: value}))}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Roughness: {materialProps.roughness}</Label>
                    <Slider
                      value={[materialProps.roughness]}
                      onValueChange={([value]) => setMaterialProps(prev => ({...prev, roughness: value}))}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Opacity: {materialProps.opacity}</Label>
                    <Slider
                      value={[materialProps.opacity]}
                      onValueChange={([value]) => setMaterialProps(prev => ({...prev, opacity: value}))}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lighting" className="p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="w-4 h-4" />
                    Lighting Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Ambient Intensity: {lightingSettings.ambientIntensity}</Label>
                    <Slider
                      value={[lightingSettings.ambientIntensity]}
                      onValueChange={([value]) => setLightingSettings(prev => ({...prev, ambientIntensity: value}))}
                      max={2}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Directional Intensity: {lightingSettings.directionalIntensity}</Label>
                    <Slider
                      value={[lightingSettings.directionalIntensity]}
                      onValueChange={([value]) => setLightingSettings(prev => ({...prev, directionalIntensity: value}))}
                      max={5}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Environment</Label>
                    <select
                      value={lightingSettings.environmentMap}
                      onChange={(e) => setLightingSettings(prev => ({...prev, environmentMap: e.target.value}))}
                      className="w-full bg-gray-600 text-white border border-gray-500 rounded px-2 py-1 mt-1"
                    >
                      <option value="studio">Studio</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="industrial">Industrial</option>
                      <option value="sunset">Sunset</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OmniverseStudio;