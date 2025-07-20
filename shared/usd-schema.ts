// USD (Universal Scene Description) compatible schema for Omniverse integration

export interface USDStage {
  name: string;
  defaultPrim: string;
  timeCodesPerSecond: number;
  startTimeCode: number;
  endTimeCode: number;
  metadata: Record<string, any>;
  prims: USDPrim[];
}

export interface USDPrim {
  path: string;
  type: string;
  active: boolean;
  metadata: Record<string, any>;
  properties: USDProperty[];
  children: USDPrim[];
}

export interface USDProperty {
  name: string;
  type: string;
  value: any;
  interpolation?: string;
  timeSamples?: Record<number, any>;
}

export interface USDMesh extends USDPrim {
  faceVertexCounts: number[];
  faceVertexIndices: number[];
  points: [number, number, number][];
  normals?: [number, number, number][];
  primvars?: {
    st?: {
      values: [number, number][];
      interpolation: string;
    };
  };
}

export interface USDMaterial extends USDPrim {
  surface: {
    diffuseColor: [number, number, number];
    metallic: number;
    roughness: number;
    opacity: number;
    emissiveColor?: [number, number, number];
    normalTexture?: string;
    displacementTexture?: string;
  };
}

export interface USDXform extends USDPrim {
  transform: {
    translate: [number, number, number];
    rotate: [number, number, number, number]; // quaternion
    scale: [number, number, number];
  };
}

export interface USDLight extends USDPrim {
  lightType: 'distant' | 'dome' | 'sphere' | 'rect' | 'cylinder' | 'disk';
  color: [number, number, number];
  intensity: number;
  exposure: number;
  diffuse: number;
  specular: number;
  normalize: boolean;
  enableColorTemperature: boolean;
  colorTemperature: number;
  radius?: number;
  length?: number;
  width?: number;
  height?: number;
  treatAsPoint?: boolean;
  shaping?: {
    cone: {
      angle: number;
      softness: number;
    };
  };
}

export interface USDCamera extends USDPrim {
  projection: 'perspective' | 'orthographic';
  focalLength: number;
  focusDistance: number;
  fStop: number;
  horizontalAperture: number;
  verticalAperture: number;
  horizontalApertureOffset: number;
  verticalApertureOffset: number;
  clippingRange: [number, number];
}

export interface USDPhysics extends USDPrim {
  rigidBody: {
    kinematic: boolean;
    mass: number;
    density?: number;
    centerOfMass?: [number, number, number];
    inertiaDiagonal?: [number, number, number];
    principalAxes?: [number, number, number, number];
  };
  collider: {
    approximationShape: 'none' | 'convexHull' | 'convexDecomposition' | 'meshSimplification' | 'boundingCube' | 'boundingSphere';
    contactOffset: number;
    restOffset: number;
  };
  material: {
    staticFriction: number;
    dynamicFriction: number;
    restitution: number;
    density?: number;
  };
}

// Conversion utilities
export function convertToUSD(twinModel: any): USDStage {
  const stage: USDStage = {
    name: twinModel.name || 'StahikiTwin',
    defaultPrim: '/World',
    timeCodesPerSecond: 24,
    startTimeCode: 0,
    endTimeCode: 100,
    metadata: {
      creator: 'Stahiki Digital Twin Platform',
      version: '1.0',
      description: twinModel.description
    },
    prims: []
  };

  // Create world prim
  const worldPrim: USDXform = {
    path: '/World',
    type: 'Xform',
    active: true,
    metadata: {},
    properties: [],
    children: [],
    transform: {
      translate: [0, 0, 0],
      rotate: [0, 0, 0, 1],
      scale: [1, 1, 1]
    }
  };

  // Convert geometry to USD mesh
  if (twinModel.geometry || (twinModel.vertices && twinModel.faces)) {
    const vertices = twinModel.geometry?.vertices || twinModel.vertices || [];
    const faces = twinModel.geometry?.faces || twinModel.faces || [];
    const normals = twinModel.geometry?.normals;
    const uvs = twinModel.geometry?.uvs;

    const meshPrim: USDMesh = {
      path: '/World/Mesh',
      type: 'Mesh',
      active: true,
      metadata: {},
      properties: [],
      children: [],
      faceVertexCounts: faces.map(() => 3), // Assuming triangles
      faceVertexIndices: faces.flat(),
      points: vertices as [number, number, number][],
      normals: normals as [number, number, number][],
      primvars: uvs ? {
        st: {
          values: uvs as [number, number][],
          interpolation: 'vertex'
        }
      } : undefined
    };

    worldPrim.children.push(meshPrim);
  }

  // Convert materials
  if (twinModel.materials) {
    const materialPrim: USDMaterial = {
      path: '/World/Materials/Material',
      type: 'Material',
      active: true,
      metadata: {},
      properties: [],
      children: [],
      surface: {
        diffuseColor: hexToRgb(twinModel.materials.diffuse || twinModel.materials.color || '#808080'),
        metallic: twinModel.materials.metalness || 0,
        roughness: twinModel.materials.roughness || 0.5,
        opacity: twinModel.materials.opacity || 1,
        emissiveColor: twinModel.materials.emissive ? hexToRgb(twinModel.materials.emissive) : undefined
      }
    };

    worldPrim.children.push(materialPrim);
  }

  // Convert lighting
  if (twinModel.lighting) {
    // Add directional lights
    if (twinModel.lighting.directionalLights) {
      twinModel.lighting.directionalLights.forEach((light: any, index: number) => {
        const lightPrim: USDLight = {
          path: `/World/Lights/DirectionalLight${index}`,
          type: 'DistantLight',
          active: true,
          metadata: {},
          properties: [],
          children: [],
          lightType: 'distant',
          color: hexToRgb(light.color || '#ffffff'),
          intensity: light.intensity || 1,
          exposure: 0,
          diffuse: 1,
          specular: 1,
          normalize: true,
          enableColorTemperature: false,
          colorTemperature: 6500
        };

        worldPrim.children.push(lightPrim);
      });
    }

    // Add point lights
    if (twinModel.lighting.pointLights) {
      twinModel.lighting.pointLights.forEach((light: any, index: number) => {
        const lightPrim: USDLight = {
          path: `/World/Lights/PointLight${index}`,
          type: 'SphereLight',
          active: true,
          metadata: {},
          properties: [],
          children: [],
          lightType: 'sphere',
          color: hexToRgb(light.color || '#ffffff'),
          intensity: light.intensity || 1,
          exposure: 0,
          diffuse: 1,
          specular: 1,
          normalize: true,
          enableColorTemperature: false,
          colorTemperature: 6500,
          radius: 0.5,
          treatAsPoint: false
        };

        worldPrim.children.push(lightPrim);
      });
    }
  }

  // Add physics if enabled
  if (twinModel.physics?.enabled) {
    const physicsPrim: USDPhysics = {
      path: '/World/Physics',
      type: 'PhysicsScene',
      active: true,
      metadata: {},
      properties: [],
      children: [],
      rigidBody: {
        kinematic: false,
        mass: twinModel.physics.mass || 1
      },
      collider: {
        approximationShape: twinModel.physics.collisionShape === 'box' ? 'boundingCube' : 
                           twinModel.physics.collisionShape === 'sphere' ? 'boundingSphere' : 'convexHull',
        contactOffset: 0.02,
        restOffset: 0.0
      },
      material: {
        staticFriction: twinModel.physics.friction || 0.5,
        dynamicFriction: twinModel.physics.friction || 0.5,
        restitution: twinModel.physics.restitution || 0.0
      }
    };

    worldPrim.children.push(physicsPrim);
  }

  stage.prims.push(worldPrim);
  return stage;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [0.5, 0.5, 0.5];
}

export function exportUSDString(stage: USDStage): string {
  let usdContent = `#usda 1.0
(
    defaultPrim = "${stage.defaultPrim}"
    timeCodesPerSecond = ${stage.timeCodesPerSecond}
    upAxis = "Y"
    metersPerUnit = 1
)

`;

  function writePrim(prim: USDPrim, indent = ''): string {
    let content = `${indent}def ${prim.type} "${prim.path.split('/').pop()}" (\n`;
    
    if (!prim.active) {
      content += `${indent}    active = false\n`;
    }
    
    content += `${indent})\n${indent}{\n`;
    
    // Write properties specific to prim type
    if (prim.type === 'Mesh') {
      const mesh = prim as USDMesh;
      content += `${indent}    int[] faceVertexCounts = [${mesh.faceVertexCounts.join(', ')}]\n`;
      content += `${indent}    int[] faceVertexIndices = [${mesh.faceVertexIndices.join(', ')}]\n`;
      content += `${indent}    point3f[] points = [${mesh.points.map(p => `(${p.join(', ')})`).join(', ')}]\n`;
      
      if (mesh.normals) {
        content += `${indent}    normal3f[] normals = [${mesh.normals.map(n => `(${n.join(', ')})`).join(', ')}]\n`;
      }
      
      if (mesh.primvars?.st) {
        content += `${indent}    texCoord2f[] primvars:st = [${mesh.primvars.st.values.map(uv => `(${uv.join(', ')})`).join(', ')}] (\n`;
        content += `${indent}        interpolation = "${mesh.primvars.st.interpolation}"\n`;
        content += `${indent}    )\n`;
      }
    }
    
    if (prim.type === 'Material') {
      const material = prim as USDMaterial;
      content += `${indent}    token outputs:surface.connect = </World/Materials/Material/Surface.outputs:surface>\n`;
      content += `${indent}    \n`;
      content += `${indent}    def Shader "Surface"\n`;
      content += `${indent}    {\n`;
      content += `${indent}        uniform token info:id = "UsdPreviewSurface"\n`;
      content += `${indent}        color3f inputs:diffuseColor = (${material.surface.diffuseColor.join(', ')})\n`;
      content += `${indent}        float inputs:metallic = ${material.surface.metallic}\n`;
      content += `${indent}        float inputs:roughness = ${material.surface.roughness}\n`;
      content += `${indent}        float inputs:opacity = ${material.surface.opacity}\n`;
      if (material.surface.emissiveColor) {
        content += `${indent}        color3f inputs:emissiveColor = (${material.surface.emissiveColor.join(', ')})\n`;
      }
      content += `${indent}        token outputs:surface\n`;
      content += `${indent}    }\n`;
    }
    
    if (prim.type === 'Xform') {
      const xform = prim as USDXform;
      const matrix = createTransformMatrix(xform.transform);
      content += `${indent}    matrix4d xformOp:transform = ${matrix}\n`;
      content += `${indent}    uniform token[] xformOpOrder = ["xformOp:transform"]\n`;
    }
    
    // Write children
    prim.children.forEach(child => {
      content += '\n' + writePrim(child, indent + '    ');
    });
    
    content += `${indent}}\n`;
    return content;
  }

  stage.prims.forEach(prim => {
    usdContent += writePrim(prim);
  });

  return usdContent;
}

function createTransformMatrix(transform: USDXform['transform']): string {
  // Simple identity matrix for now - in production you'd calculate proper transform matrix
  return '( (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1) )';
}