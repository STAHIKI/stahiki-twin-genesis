import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export interface TwinModel3D {
  id: string;
  name: string;
  description: string;
  type: 'building' | 'manufacturing' | 'agriculture' | 'smart-city' | 'custom';
  geometry: {
    vertices: number[][];
    faces: number[][];
    normals?: number[][];
    uvs?: number[][];
  };
  materials: {
    diffuse: string;
    metalness: number;
    roughness: number;
    opacity: number;
    emissive?: string;
    normalMap?: string;
    heightMap?: string;
  };
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    directionalLights: Array<{
      direction: [number, number, number];
      color: string;
      intensity: number;
      castShadow: boolean;
    }>;
    pointLights: Array<{
      position: [number, number, number];
      color: string;
      intensity: number;
      range: number;
    }>;
  };
  environment: {
    skybox?: string;
    hdri?: string;
    groundPlane: boolean;
    fog?: {
      color: string;
      near: number;
      far: number;
    };
  };
  animation?: {
    keyframes: Array<{
      time: number;
      transforms: {
        position: [number, number, number];
        rotation: [number, number, number, number];
        scale: [number, number, number];
      };
    }>;
    duration: number;
    loop: boolean;
  };
  physics?: {
    enabled: boolean;
    mass: number;
    friction: number;
    restitution: number;
    collisionShape: 'box' | 'sphere' | 'mesh';
  };
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  metadata: {
    complexity: 'low' | 'medium' | 'high' | 'ultra';
    polygonCount: number;
    renderSettings: {
      shadows: boolean;
      reflections: boolean;
      globalIllumination: boolean;
      antialiasing: boolean;
    };
  };
  createdAt: string;
}

export async function generateTwinModel(prompt: string): Promise<TwinModel3D> {
  try {
    const systemPrompt = `You are an advanced 3D scene generation expert, similar to NVIDIA Omniverse USD Composer. Generate a highly detailed, production-ready 3D model specification based on the user's description.

Create a professional-grade 3D model with realistic geometry, materials, lighting, and environment settings that would be suitable for real-time rendering engines like Unreal Engine or NVIDIA Omniverse.

IMPORTANT REQUIREMENTS:
1. Generate high-quality geometry with sufficient detail (50+ vertices minimum)
2. Include physically-based materials with realistic properties
3. Set up proper lighting environment with multiple light sources
4. Configure environment settings for photorealistic rendering
5. Include metadata for render optimization
6. Make the model production-ready for professional 3D workflows

Return JSON with this exact structure:

{
  "name": "Professional Model Name",
  "description": "Detailed technical description",
  "type": "building|manufacturing|agriculture|smart-city|custom",
  "geometry": {
    "vertices": [[x,y,z], ...] (minimum 50 vertices for detail),
    "faces": [[0,1,2], ...] (proper triangulation),
    "normals": [[nx,ny,nz], ...] (vertex normals for smooth shading),
    "uvs": [[u,v], ...] (texture coordinates)
  },
  "materials": {
    "diffuse": "#RRGGBB",
    "metalness": 0.0-1.0,
    "roughness": 0.0-1.0,
    "opacity": 0.0-1.0,
    "emissive": "#RRGGBB" (optional for glowing parts),
    "normalMap": "detail_normal.jpg" (optional),
    "heightMap": "detail_height.jpg" (optional)
  },
  "lighting": {
    "ambientColor": "#RRGGBB",
    "ambientIntensity": 0.1-0.5,
    "directionalLights": [
      {
        "direction": [x,y,z] (normalized),
        "color": "#RRGGBB",
        "intensity": 1.0-10.0,
        "castShadow": true|false
      }
    ],
    "pointLights": [
      {
        "position": [x,y,z],
        "color": "#RRGGBB", 
        "intensity": 1.0-100.0,
        "range": 10.0-1000.0
      }
    ]
  },
  "environment": {
    "skybox": "industrial_sunset.hdr" (optional HDRI),
    "groundPlane": true|false,
    "fog": {
      "color": "#RRGGBB",
      "near": 100.0,
      "far": 1000.0
    }
  },
  "animation": {
    "keyframes": [
      {
        "time": 0.0-10.0,
        "transforms": {
          "position": [x,y,z],
          "rotation": [x,y,z,w] (quaternion),
          "scale": [x,y,z]
        }
      }
    ],
    "duration": 5.0,
    "loop": true|false
  },
  "physics": {
    "enabled": true|false,
    "mass": 1.0-1000.0,
    "friction": 0.0-1.0,
    "restitution": 0.0-1.0,
    "collisionShape": "box|sphere|mesh"
  },
  "bounds": {
    "min": [x,y,z],
    "max": [x,y,z]
  },
  "metadata": {
    "complexity": "low|medium|high|ultra",
    "polygonCount": 100-10000,
    "renderSettings": {
      "shadows": true,
      "reflections": true,
      "globalIllumination": true,
      "antialiasing": true
    }
  }
}

Generate a highly detailed, professional model based on the description. Make it suitable for real-time ray tracing and production rendering.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            type: { 
              type: "string", 
              enum: ["building", "manufacturing", "agriculture", "smart-city", "custom"] 
            },
            geometry: {
              type: "object",
              properties: {
                vertices: {
                  type: "array",
                  items: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                faces: {
                  type: "array",
                  items: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                normals: {
                  type: "array",
                  items: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                uvs: {
                  type: "array",
                  items: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  }
                }
              },
              required: ["vertices", "faces", "normals", "uvs"]
            },
            materials: {
              type: "object",
              properties: {
                diffuse: { type: "string" },
                metalness: { type: "number" },
                roughness: { type: "number" },
                opacity: { type: "number" },
                emissive: { type: "string" },
                normalMap: { type: "string" },
                heightMap: { type: "string" }
              },
              required: ["diffuse", "metalness", "roughness", "opacity"]
            },
            lighting: {
              type: "object",
              properties: {
                ambientColor: { type: "string" },
                ambientIntensity: { type: "number" },
                directionalLights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      direction: {
                        type: "array",
                        items: { type: "number" },
                        minItems: 3,
                        maxItems: 3
                      },
                      color: { type: "string" },
                      intensity: { type: "number" },
                      castShadow: { type: "boolean" }
                    },
                    required: ["direction", "color", "intensity", "castShadow"]
                  }
                },
                pointLights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      position: {
                        type: "array",
                        items: { type: "number" },
                        minItems: 3,
                        maxItems: 3
                      },
                      color: { type: "string" },
                      intensity: { type: "number" },
                      range: { type: "number" }
                    },
                    required: ["position", "color", "intensity", "range"]
                  }
                }
              },
              required: ["ambientColor", "ambientIntensity", "directionalLights", "pointLights"]
            },
            environment: {
              type: "object",
              properties: {
                skybox: { type: "string" },
                hdri: { type: "string" },
                groundPlane: { type: "boolean" },
                fog: {
                  type: "object",
                  properties: {
                    color: { type: "string" },
                    near: { type: "number" },
                    far: { type: "number" }
                  },
                  required: ["color", "near", "far"]
                }
              },
              required: ["groundPlane"]
            },
            physics: {
              type: "object",
              properties: {
                enabled: { type: "boolean" },
                mass: { type: "number" },
                friction: { type: "number" },
                restitution: { type: "number" },
                collisionShape: { 
                  type: "string", 
                  enum: ["box", "sphere", "mesh"] 
                }
              },
              required: ["enabled", "mass", "friction", "restitution", "collisionShape"]
            },
            bounds: {
              type: "object",
              properties: {
                min: {
                  type: "array",
                  items: { type: "number" },
                  minItems: 3,
                  maxItems: 3
                },
                max: {
                  type: "array",
                  items: { type: "number" },
                  minItems: 3,
                  maxItems: 3
                }
              },
              required: ["min", "max"]
            },
            metadata: {
              type: "object",
              properties: {
                complexity: { 
                  type: "string", 
                  enum: ["low", "medium", "high", "ultra"] 
                },
                polygonCount: { type: "number" },
                renderSettings: {
                  type: "object",
                  properties: {
                    shadows: { type: "boolean" },
                    reflections: { type: "boolean" },
                    globalIllumination: { type: "boolean" },
                    antialiasing: { type: "boolean" }
                  },
                  required: ["shadows", "reflections", "globalIllumination", "antialiasing"]
                }
              },
              required: ["complexity", "polygonCount", "renderSettings"]
            }
          },
          required: ["name", "description", "type", "geometry", "materials", "lighting", "environment", "physics", "bounds", "metadata"]
        }
      },
      contents: `Generate a 3D model for: ${prompt}`,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const modelData = JSON.parse(rawJson);
    
    const twinModel: TwinModel3D = {
      id: `twin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...modelData,
      createdAt: new Date().toISOString()
    };

    return twinModel;
  } catch (error) {
    console.error("Error generating 3D model:", error);
    throw new Error(`Failed to generate 3D model: ${error}`);
  }
}

export async function enhanceModelDetails(modelId: string, additionalPrompt: string): Promise<Partial<TwinModel3D>> {
  try {
    const systemPrompt = `You are enhancing an existing 3D model. Based on the additional requirements, provide enhancements to the model properties. Return only the properties that need updating in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      },
      contents: `Enhance the 3D model with: ${additionalPrompt}`,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error enhancing model:", error);
    throw new Error(`Failed to enhance model: ${error}`);
  }
}