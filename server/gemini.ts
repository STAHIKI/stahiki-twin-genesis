import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export interface TwinModel3D {
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

export async function generateTwinModel(prompt: string): Promise<TwinModel3D> {
  try {
    const systemPrompt = `You are a 3D model generation expert. Generate a detailed 3D model specification based on the user's description.

Create a realistic 3D model with proper geometry that can be rendered in a 3D viewer. Return JSON with this exact structure:

{
  "name": "Model Name",
  "description": "Detailed description of the generated model",
  "vertices": [[x,y,z], [x,y,z], ...] (array of 3D coordinates),
  "faces": [[0,1,2], [0,2,3], ...] (triangular faces using vertex indices),
  "materials": {
    "color": "#RRGGBB",
    "metalness": 0.0-1.0,
    "roughness": 0.0-1.0
  },
  "bounds": {
    "min": [x,y,z],
    "max": [x,y,z]
  }
}

Generate a model with at least 20 vertices and proper triangular faces. Make it realistic and detailed based on the description.`;

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
            materials: {
              type: "object",
              properties: {
                color: { type: "string" },
                metalness: { type: "number" },
                roughness: { type: "number" }
              },
              required: ["color", "metalness", "roughness"]
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
            }
          },
          required: ["name", "description", "vertices", "faces", "materials", "bounds"]
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