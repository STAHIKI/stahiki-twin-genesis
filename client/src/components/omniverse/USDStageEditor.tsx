import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Environment, ContactShadows, useBounds } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  Camera, 
  Lightbulb, 
  Cube, 
  Sphere, 
  Settings, 
  Users, 
  Download,
  Upload,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import type { USDStage, USDPrim, USDMesh, USDMaterial, RenderSettings } from '@shared/usd-schema';

interface USDStageEditorProps {
  stage: USDStage;
  onStageUpdate: (stage: USDStage) => void;
  collaborationMode?: boolean;
}

// 3D Scene Component
function SceneContent({ stage, selectedPrimId, onPrimSelect, renderSettings }: {
  stage: USDStage;
  selectedPrimId: string | null;
  onPrimSelect: (primId: string | null) => void;
  renderSettings: RenderSettings;
}) {
  const { scene } = useThree();
  const bounds = useBounds();

  // Convert USD prims to Three.js objects
  const sceneObjects = useMemo(() => {
    const objects: JSX.Element[] = [];
    
    Object.entries(stage.prims).forEach(([primId, prim]) => {
      if (prim.type === 'Mesh') {
        const meshPrim = prim as USDMesh;
        objects.push(
          <USDMeshRenderer
            key={primId}
            primId={primId}
            mesh={meshPrim}
            selected={selectedPrimId === primId}
            onSelect={() => onPrimSelect(primId)}
          />
        );
      }
    });
    
    return objects;
  }, [stage.prims, selectedPrimId, onPrimSelect]);

  return (
    <>
      {/* Environment setup based on render settings */}
      {renderSettings.environmentMap && (
        <Environment files={renderSettings.environmentMap} />
      )}
      
      {/* Global lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow={renderSettings.shadows}
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Grid and reference */}
      <Grid 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#6e6e6e" 
        sectionSize={10} 
        sectionThickness={1} 
        sectionColor="#9ca3af" 
        fadeDistance={100} 
        fadeStrength={1} 
        infiniteGrid 
      />
      
      {/* Scene objects */}
      {sceneObjects}
      
      {/* Contact shadows for realism */}
      {renderSettings.shadows && (
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.25} 
          scale={50} 
          blur={2.5} 
          far={50} 
        />
      )}
    </>
  );
}

// USD Mesh Renderer Component
function USDMeshRenderer({ 
  primId, 
  mesh, 
  selected, 
  onSelect 
}: { 
  primId: string; 
  mesh: USDMesh; 
  selected: boolean; 
  onSelect: () => void; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Create geometry from USD mesh data
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    
    // Convert vertices to flat array
    const vertices = new Float32Array(mesh.geometry.vertices.flat());
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Convert faces to indices
    const indices = new Uint32Array(mesh.geometry.faces.flat());
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    
    // Calculate normals if not provided
    if (!mesh.geometry.normals) {
      geom.computeVertexNormals();
    } else {
      const normals = new Float32Array(mesh.geometry.normals.flat());
      geom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    }
    
    // Add UVs if available
    if (mesh.geometry.uvs) {
      const uvs = new Float32Array(mesh.geometry.uvs.flat());
      geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }
    
    return geom;
  }, [mesh.geometry]);

  // Apply transform
  const transform = mesh.transform;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={transform.translate as [number, number, number]}
      quaternion={transform.rotate as [number, number, number, number]}
      scale={transform.scale as [number, number, number]}
      onClick={onSelect}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={selected ? "#60a5fa" : hovered ? "#93c5fd" : "#e5e7eb"}
        wireframe={selected}
        transparent={selected || hovered}
        opacity={selected || hovered ? 0.8 : 1}
      />
    </mesh>
  );
}

// Hierarchy Panel Component
function HierarchyPanel({ 
  stage, 
  selectedPrimId, 
  onPrimSelect, 
  onPrimCreate, 
  onPrimDelete 
}: {
  stage: USDStage;
  selectedPrimId: string | null;
  onPrimSelect: (primId: string | null) => void;
  onPrimCreate: (type: string) => void;
  onPrimDelete: (primId: string) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Scene Hierarchy
        </CardTitle>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onPrimCreate('Cube')}>
            <Cube className="w-3 h-3 mr-1" /> Cube
          </Button>
          <Button size="sm" variant="outline" onClick={() => onPrimCreate('Sphere')}>
            <Sphere className="w-3 h-3 mr-1" /> Sphere
          </Button>
          <Button size="sm" variant="outline" onClick={() => onPrimCreate('Light')}>
            <Lightbulb className="w-3 h-3 mr-1" /> Light
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {Object.entries(stage.prims).map(([primId, prim]) => (
              <div
                key={primId}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedPrimId === primId 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => onPrimSelect(primId)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{prim.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {prim.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Properties Panel Component
function PropertiesPanel({ 
  selectedPrim, 
  onPrimUpdate 
}: { 
  selectedPrim: USDPrim | null; 
  onPrimUpdate: (updates: Partial<USDPrim>) => void; 
}) {
  const controls = useControls(
    'Transform',
    selectedPrim ? {
      translateX: { value: selectedPrim.transform.translate[0], step: 0.1 },
      translateY: { value: selectedPrim.transform.translate[1], step: 0.1 },
      translateZ: { value: selectedPrim.transform.translate[2], step: 0.1 },
      scaleX: { value: selectedPrim.transform.scale[0], min: 0.1, max: 10, step: 0.1 },
      scaleY: { value: selectedPrim.transform.scale[1], min: 0.1, max: 10, step: 0.1 },
      scaleZ: { value: selectedPrim.transform.scale[2], min: 0.1, max: 10, step: 0.1 },
    } : {}
  );

  // Update prim when controls change
  React.useEffect(() => {
    if (selectedPrim && Object.keys(controls).length > 0) {
      onPrimUpdate({
        transform: {
          ...selectedPrim.transform,
          translate: [controls.translateX, controls.translateY, controls.translateZ],
          scale: [controls.scaleX, controls.scaleY, controls.scaleZ],
        }
      });
    }
  }, [controls, selectedPrim, onPrimUpdate]);

  if (!selectedPrim) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Select an object to edit properties</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <p className="text-sm text-gray-600">{selectedPrim.name}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transform">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="transform" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Transform controls in Leva panel →</h4>
              <p className="text-sm text-gray-600">
                Use the controls panel to adjust position, rotation, and scale
              </p>
            </div>
          </TabsContent>
          <TabsContent value="material" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Material Properties</h4>
              <p className="text-sm text-gray-600">
                Material editing coming soon...
              </p>
            </div>
          </TabsContent>
          <TabsContent value="metadata" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Metadata</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Type:</label>
                  <p className="text-sm text-gray-600">{selectedPrim.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">ID:</label>
                  <p className="text-sm text-gray-600 font-mono">{selectedPrim.id}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Main USD Stage Editor Component
export default function USDStageEditor({ 
  stage, 
  onStageUpdate, 
  collaborationMode = false 
}: USDStageEditorProps) {
  const [selectedPrimId, setSelectedPrimId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const selectedPrim = selectedPrimId ? stage.prims[selectedPrimId] : null;

  // Render settings controls
  const renderSettings = useControls('Render Settings', {
    renderer: { value: 'Real-time', options: ['RTX', 'Path-Traced', 'Real-time'] },
    quality: { value: 'Medium', options: ['Low', 'Medium', 'High', 'Ultra'] },
    shadows: true,
    reflections: true,
    globalIllumination: false,
  });

  const handlePrimCreate = useCallback((type: string) => {
    const newPrimId = `prim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPrim: USDPrim = {
      id: newPrimId,
      name: `${type}_${Object.keys(stage.prims).length + 1}`,
      type: type as any,
      transform: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0, 1],
        scale: [1, 1, 1],
      },
      children: [],
    };

    if (type === 'Cube' || type === 'Sphere') {
      // Create basic geometry for primitives
      const meshPrim = {
        ...newPrim,
        type: 'Mesh' as const,
        geometry: {
          vertices: type === 'Cube' ? [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
          ] : generateSphereVertices(16, 8),
          faces: type === 'Cube' ? [
            [0, 1, 2], [0, 2, 3], [1, 5, 6], [1, 6, 2],
            [5, 4, 7], [5, 7, 6], [4, 0, 3], [4, 3, 7],
            [3, 2, 6], [3, 6, 7], [4, 5, 1], [4, 1, 0]
          ] : generateSphereFaces(16, 8),
        }
      };
      
      const updatedStage = {
        ...stage,
        prims: {
          ...stage.prims,
          [newPrimId]: meshPrim
        }
      };
      onStageUpdate(updatedStage);
    }
  }, [stage, onStageUpdate]);

  const handlePrimUpdate = useCallback((updates: Partial<USDPrim>) => {
    if (!selectedPrimId) return;
    
    const updatedStage = {
      ...stage,
      prims: {
        ...stage.prims,
        [selectedPrimId]: {
          ...stage.prims[selectedPrimId],
          ...updates
        }
      }
    };
    onStageUpdate(updatedStage);
  }, [selectedPrimId, stage, onStageUpdate]);

  const handlePrimDelete = useCallback((primId: string) => {
    const { [primId]: deleted, ...remainingPrims } = stage.prims;
    const updatedStage = {
      ...stage,
      prims: remainingPrims
    };
    onStageUpdate(updatedStage);
    if (selectedPrimId === primId) {
      setSelectedPrimId(null);
    }
  }, [stage, onStageUpdate, selectedPrimId]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{stage.name}</h1>
          <Badge variant="outline">USD Stage</Badge>
          {collaborationMode && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Collaborative
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export USD
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="w-80 p-4 space-y-4 bg-white dark:bg-gray-800 border-r">
          <HierarchyPanel
            stage={stage}
            selectedPrimId={selectedPrimId}
            onPrimSelect={setSelectedPrimId}
            onPrimCreate={handlePrimCreate}
            onPrimDelete={handlePrimDelete}
          />
        </div>

        {/* Center Viewport */}
        <div className="flex-1 relative">
          <Canvas
            shadows={renderSettings.shadows}
            camera={{ position: [10, 10, 10], fov: 50 }}
            className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
          >
            <SceneContent
              stage={stage}
              selectedPrimId={selectedPrimId}
              onPrimSelect={setSelectedPrimId}
              renderSettings={renderSettings as RenderSettings}
            />
            <OrbitControls makeDefault />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            </GizmoHelper>
          </Canvas>
          
          {/* Leva Controls */}
          <div className="absolute top-4 right-4">
            <Leva collapsed={false} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 p-4 bg-white dark:bg-gray-800 border-l">
          <PropertiesPanel
            selectedPrim={selectedPrim}
            onPrimUpdate={handlePrimUpdate}
          />
        </div>
      </div>
    </div>
  );
}

// Helper functions for generating basic geometry
function generateSphereVertices(widthSegments: number, heightSegments: number): number[][] {
  const vertices: number[][] = [];
  
  for (let i = 0; i <= heightSegments; i++) {
    const v = i / heightSegments;
    const phi = v * Math.PI;
    
    for (let j = 0; j <= widthSegments; j++) {
      const u = j / widthSegments;
      const theta = u * Math.PI * 2;
      
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      
      vertices.push([x, y, z]);
    }
  }
  
  return vertices;
}

function generateSphereFaces(widthSegments: number, heightSegments: number): number[][] {
  const faces: number[][] = [];
  
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * (widthSegments + 1) + j;
      const b = a + widthSegments + 1;
      const c = a + 1;
      const d = b + 1;
      
      if (i !== 0) faces.push([a, b, c]);
      if (i !== heightSegments - 1) faces.push([c, b, d]);
    }
  }
  
  return faces;
}