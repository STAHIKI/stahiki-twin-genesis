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
    const { vertices, faces } = model;
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
                stroke={model.materials.color}
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
    <div className={`relative ${isFullscreenMode ? 'h-full' : 'h-96'} bg-gradient-to-br from-background to-accent/20 rounded-lg border border-border/50 overflow-hidden`}>
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
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
        <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
          <h4 className="font-semibold text-foreground mb-2">{model.name}</h4>
          <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vertices:</span>
              <Badge variant="outline" className="text-xs">{model.vertices.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Faces:</span>
              <Badge variant="outline" className="text-xs">{model.faces.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material:</span>
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: model.materials.color }}></div>
            </div>
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