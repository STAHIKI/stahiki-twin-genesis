import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Maximize2, 
  RotateCcw, 
  Download, 
  Info,
  ZoomIn,
  ZoomOut,
  Rotate3d,
  Move3d
} from "lucide-react";

interface TwinModel3D {
  id: string;
  name: string;
  description: string;
  type?: string;
  geometry?: {
    vertices: number[][];
    faces: number[][];
    normals?: number[][];
    uvs?: number[][];
  };
  materials?: {
    diffuse?: string;
    color?: string;
    metalness: number;
    roughness: number;
    opacity?: number;
    emissive?: string;
  };
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  metadata?: {
    complexity?: string;
    polygonCount?: number;
  };
  createdAt: string;
  // Legacy support
  vertices?: number[][];
  faces?: number[][];
}

interface Model3DProps {
  model: TwinModel3D;
  autoRotate?: boolean;
  className?: string;
}

function Simple3DModel({ model, autoRotate = false, className = "" }: Model3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 2
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Render a simple wireframe representation of the model
  const renderWireframe = () => {
    // Handle both new and legacy model formats
    const vertices = model.geometry?.vertices || model.vertices || [];
    const faces = model.geometry?.faces || model.faces || [];
    
    if (!vertices.length || !faces.length) {
      return <text x="150" y="150" textAnchor="middle" className="fill-gray-400">No geometry data</text>;
    }
    
    const scale = zoom * 50;
    const centerX = 150;
    const centerY = 150;
    
    return (
      <svg width="300" height="300" className="absolute inset-0 m-auto">
        <g transform={`translate(${centerX}, ${centerY})`}>
          {faces.map((face, faceIndex) => {
            const points = face.map(vertexIndex => {
              const vertex = vertices[vertexIndex];
              if (!vertex) return { x: 0, y: 0 };
              
              // Simple 3D to 2D projection with rotation
              const rad = (rotation.y * Math.PI) / 180;
              const x = vertex[0] * Math.cos(rad) - vertex[2] * Math.sin(rad);
              const y = vertex[1];
              
              return {
                x: x * scale,
                y: y * scale
              };
            });
            
            const pathData = points.map((p, i) => 
              `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
            ).join(' ') + ' Z';
            
            return (
              <path
                key={faceIndex}
                d={pathData}
                fill="none"
                stroke={model.materials?.diffuse || model.materials?.color || '#00ff00'}
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {renderWireframe()}
    </div>
  );
}

interface Model3DViewerProps {
  model: TwinModel3D | null;
  isGenerating?: boolean;
  className?: string;
}

export default function Model3DViewer({ model, isGenerating = false, className = "" }: Model3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const ViewerContent = ({ isFullscreenMode = false }: { isFullscreenMode?: boolean }) => (
    <div className={`relative ${isFullscreenMode ? 'h-full' : 'h-64 sm:h-80 lg:h-96'} bg-gradient-to-br from-background to-accent/20 rounded-lg border border-border/50 overflow-hidden`}>
      {/* Controls Overlay */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Info className="w-4 h-4" />
        </Button>
        {!isFullscreenMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
        {model && (
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Model Info Overlay */}
      {showInfo && model && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 max-w-xs sm:max-w-sm">
          <h4 className="font-semibold text-foreground mb-2">{model.name}</h4>
          <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vertices:</span>
              <Badge variant="outline" className="text-xs">
                {(model.geometry?.vertices || model.vertices || []).length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Faces:</span>
              <Badge variant="outline" className="text-xs">
                {(model.geometry?.faces || model.faces || []).length}
              </Badge>
            </div>
            {model.metadata?.polygonCount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Polygons:</span>
                <Badge variant="outline" className="text-xs">{model.metadata.polygonCount}</Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material:</span>
              <div 
                className="w-4 h-4 rounded border" 
                style={{ 
                  backgroundColor: model.materials?.diffuse || model.materials?.color || '#808080' 
                }}
              ></div>
            </div>
            {model.type && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary" className="text-xs">{model.type}</Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D Viewer */}
      <div className="w-full h-full relative flex items-center justify-center">
        {model ? (
          <Simple3DModel 
            model={model} 
            autoRotate={autoRotate} 
            className="w-full h-full"
          />
        ) : isGenerating ? (
          <div className="relative">
            <div className="w-32 h-32 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Rotate3d className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Move3d className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">3D preview will appear here</p>
          </div>
        )}
      </div>

      {/* Status Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        {isGenerating && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-foreground">Generating 3D model...</span>
          </div>
        )}
        {!model && !isGenerating && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
            <span className="text-sm text-muted-foreground">3D preview will appear here</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={className}>
        <ViewerContent />
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>3D Model Viewer - {model?.name || "Preview"}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Interactive 3D View
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <ViewerContent isFullscreenMode={true} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}