import { z } from "zod";

// USD (Universal Scene Description) Schema for Omniverse-like functionality
export const USDPrimSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Mesh', 'Sphere', 'Cube', 'Xform', 'Material', 'Light', 'Camera', 'Scope']),
  transform: z.object({
    translate: z.array(z.number()).length(3).default([0, 0, 0]),
    rotate: z.array(z.number()).length(4).default([0, 0, 0, 1]), // quaternion
    scale: z.array(z.number()).length(3).default([1, 1, 1]),
  }),
  attributes: z.record(z.any()).optional(),
  children: z.array(z.string()).default([]), // References to child prim IDs
  metadata: z.record(z.string()).optional(),
});

export const USDMeshSchema = USDPrimSchema.extend({
  type: z.literal('Mesh'),
  geometry: z.object({
    vertices: z.array(z.array(z.number().length(3))),
    faces: z.array(z.array(z.number())),
    normals: z.array(z.array(z.number().length(3))).optional(),
    uvs: z.array(z.array(z.number().length(2))).optional(),
    materials: z.array(z.string()).optional(), // Material prim references
  }),
});

export const USDMaterialSchema = USDPrimSchema.extend({
  type: z.literal('Material'),
  shader: z.object({
    diffuseColor: z.array(z.number()).length(3).default([0.8, 0.8, 0.8]),
    metallic: z.number().min(0).max(1).default(0),
    roughness: z.number().min(0).max(1).default(0.5),
    opacity: z.number().min(0).max(1).default(1.0),
    emissiveColor: z.array(z.number()).length(3).default([0, 0, 0]),
    normalMap: z.string().optional(),
    diffuseTexture: z.string().optional(),
  }),
});

export const USDLightSchema = USDPrimSchema.extend({
  type: z.literal('Light'),
  lightType: z.enum(['Directional', 'Point', 'Spot', 'Area', 'Dome']),
  intensity: z.number().default(1.0),
  color: z.array(z.number()).length(3).default([1, 1, 1]),
  exposure: z.number().default(0),
  cone: z.object({
    angle: z.number().default(90),
    softness: z.number().default(0),
  }).optional(),
});

export const USDCameraSchema = USDPrimSchema.extend({
  type: z.literal('Camera'),
  projection: z.enum(['perspective', 'orthographic']).default('perspective'),
  focalLength: z.number().default(50),
  horizontalAperture: z.number().default(36),
  verticalAperture: z.number().default(24),
  clippingRange: z.array(z.number()).length(2).default([0.1, 1000]),
});

export const USDStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  metadata: z.object({
    version: z.string().default("1.0"),
    creator: z.string(),
    createdAt: z.string(),
    modifiedAt: z.string(),
    upAxis: z.enum(['Y', 'Z']).default('Y'),
    metersPerUnit: z.number().default(1.0),
  }),
  defaultPrim: z.string().optional(),
  prims: z.record(z.union([
    USDPrimSchema,
    USDMeshSchema,
    USDMaterialSchema,
    USDLightSchema,
    USDCameraSchema
  ])),
  layers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    active: z.boolean().default(true),
    visible: z.boolean().default(true),
    locked: z.boolean().default(false),
  })).default([]),
});

export const CollaborationSessionSchema = z.object({
  id: z.string(),
  stageId: z.string(),
  participants: z.array(z.object({
    userId: z.string(),
    username: z.string(),
    cursor: z.object({
      position: z.array(z.number()).length(3),
      selection: z.array(z.string()).default([]),
    }).optional(),
    status: z.enum(['active', 'idle', 'editing']).default('active'),
  })),
  operations: z.array(z.object({
    id: z.string(),
    userId: z.string(),
    timestamp: z.string(),
    type: z.enum(['create', 'update', 'delete', 'transform']),
    primPath: z.string(),
    data: z.record(z.any()),
  })),
});

export const RenderSettingsSchema = z.object({
  renderer: z.enum(['RTX', 'Path-Traced', 'Real-time']).default('Real-time'),
  quality: z.enum(['Low', 'Medium', 'High', 'Ultra']).default('Medium'),
  samples: z.number().default(64),
  bounces: z.number().default(8),
  denoising: z.boolean().default(true),
  globalIllumination: z.boolean().default(true),
  shadows: z.boolean().default(true),
  reflections: z.boolean().default(true),
  environmentMap: z.string().optional(),
  exposure: z.number().default(0),
  gamma: z.number().default(2.2),
});

export type USDPrim = z.infer<typeof USDPrimSchema>;
export type USDMesh = z.infer<typeof USDMeshSchema>;
export type USDMaterial = z.infer<typeof USDMaterialSchema>;
export type USDLight = z.infer<typeof USDLightSchema>;
export type USDCamera = z.infer<typeof USDCameraSchema>;
export type USDStage = z.infer<typeof USDStageSchema>;
export type CollaborationSession = z.infer<typeof CollaborationSessionSchema>;
export type RenderSettings = z.infer<typeof RenderSettingsSchema>;