import React, { useRef, useEffect, useCallback } from 'react';

interface WebGLRendererProps {
  model: any | null;
  viewportSettings: {
    renderer: string;
    quality: string;
    shadows: boolean;
    reflections: boolean;
    wireframe: boolean;
    showGrid: boolean;
  };
  materialProps: {
    diffuse: string;
    metalness: number;
    roughness: number;
    opacity: number;
  };
  lightingSettings: {
    ambientIntensity: number;
    directionalIntensity: number;
  };
}

const WebGLRenderer: React.FC<WebGLRendererProps> = ({
  model,
  viewportSettings,
  materialProps,
  lightingSettings
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const animationRef = useRef<number>();

  // Shader sources for basic 3D rendering
  const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_normal;
    
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    uniform mat3 u_normalMatrix;
    
    varying vec3 v_normal;
    varying vec3 v_position;
    
    void main() {
      vec4 position = u_modelViewMatrix * vec4(a_position, 1.0);
      v_position = position.xyz;
      v_normal = u_normalMatrix * a_normal;
      gl_Position = u_projectionMatrix * position;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec3 u_diffuseColor;
    uniform float u_metalness;
    uniform float u_roughness;
    uniform float u_opacity;
    uniform vec3 u_lightDirection;
    uniform float u_lightIntensity;
    uniform float u_ambientIntensity;
    uniform bool u_wireframe;
    
    varying vec3 v_normal;
    varying vec3 v_position;
    
    void main() {
      if (u_wireframe) {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
        return;
      }
      
      vec3 normal = normalize(v_normal);
      vec3 lightDir = normalize(-u_lightDirection);
      
      // Basic lighting calculation
      float diffuse = max(dot(normal, lightDir), 0.0);
      vec3 ambient = u_diffuseColor * u_ambientIntensity;
      vec3 diffuseLight = u_diffuseColor * diffuse * u_lightIntensity;
      
      // Simple metalness/roughness approximation
      vec3 finalColor = mix(ambient + diffuseLight, u_diffuseColor * 0.8, u_metalness);
      finalColor = mix(finalColor, finalColor * 0.7, u_roughness * 0.5);
      
      gl_FragColor = vec4(finalColor, u_opacity);
    }
  `;

  const gridVertexShader = `
    attribute vec3 a_position;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    
    void main() {
      gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
    }
  `;

  const gridFragmentShader = `
    precision mediump float;
    uniform vec3 u_color;
    
    void main() {
      gl_FragColor = vec4(u_color, 0.5);
    }
  `;

  const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  };

  const createGridGeometry = () => {
    const vertices = [];
    const gridSize = 20;
    const step = 1;
    
    // Horizontal lines
    for (let i = -gridSize; i <= gridSize; i += step) {
      vertices.push(-gridSize, 0, i, gridSize, 0, i);
    }
    
    // Vertical lines
    for (let i = -gridSize; i <= gridSize; i += step) {
      vertices.push(i, 0, -gridSize, i, 0, gridSize);
    }
    
    return new Float32Array(vertices);
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0.5, 0.5, 0.5];
  };

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Create shaders and programs
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const gridVertShader = createShader(gl, gl.VERTEX_SHADER, gridVertexShader);
    const gridFragShader = createShader(gl, gl.FRAGMENT_SHADER, gridFragmentShader);

    if (!vertexShader || !fragmentShader || !gridVertShader || !gridFragShader) {
      console.error('Failed to create shaders');
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    const gridProgram = createProgram(gl, gridVertShader, gridFragShader);

    if (!program || !gridProgram) {
      console.error('Failed to create programs');
      return;
    }

    // Store programs for use in render loop
    (gl as any).program = program;
    (gl as any).gridProgram = gridProgram;

    // Create grid geometry
    const gridVertices = createGridGeometry();
    const gridBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, gridVertices, gl.STATIC_DRAW);
    (gl as any).gridBuffer = gridBuffer;
    (gl as any).gridVertexCount = gridVertices.length / 3;

    startRenderLoop();
  }, []);

  const createModelBuffers = (gl: WebGLRenderingContext, modelData: any) => {
    if (!modelData || !modelData.geometry) return null;

    const { vertices, faces, normals } = modelData.geometry;
    
    // Convert nested arrays to flat arrays
    const vertexArray = new Float32Array(vertices.flat());
    const normalArray = new Float32Array(normals ? normals.flat() : vertices.flat().map(() => 0));
    
    // Convert faces to indices
    const indexArray = new Uint16Array(faces.flat());

    // Create buffers
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

    return {
      vertexBuffer,
      normalBuffer,
      indexBuffer,
      indexCount: indexArray.length
    };
  };

  const render = useCallback(() => {
    const gl = glRef.current;
    if (!gl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Clear
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create view and projection matrices
    const aspect = canvas.width / canvas.height;
    const fov = Math.PI / 4;
    const near = 0.1;
    const far = 100.0;

    // Simple perspective projection matrix
    const f = 1.0 / Math.tan(fov / 2);
    const projectionMatrix = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0
    ]);

    // Simple view matrix (looking down at origin)
    const time = Date.now() * 0.001;
    const radius = 10;
    const x = Math.cos(time * 0.3) * radius;
    const z = Math.sin(time * 0.3) * radius;
    const y = 5;

    const modelViewMatrix = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -x, -y, -z, 1
    ]);

    // Render grid if enabled
    if (viewportSettings.showGrid && (gl as any).gridProgram) {
      gl.useProgram((gl as any).gridProgram);
      
      const u_modelViewMatrix = gl.getUniformLocation((gl as any).gridProgram, 'u_modelViewMatrix');
      const u_projectionMatrix = gl.getUniformLocation((gl as any).gridProgram, 'u_projectionMatrix');
      const u_color = gl.getUniformLocation((gl as any).gridProgram, 'u_color');
      
      gl.uniformMatrix4fv(u_modelViewMatrix, false, modelViewMatrix);
      gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix);
      gl.uniform3f(u_color, 0.3, 0.3, 0.3);

      if ((gl as any).gridBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, (gl as any).gridBuffer);
        const a_position = gl.getAttribLocation((gl as any).gridProgram, 'a_position');
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, (gl as any).gridVertexCount);
      }
    }

    // Render model if available
    if (model && (gl as any).program) {
      const modelBuffers = createModelBuffers(gl, model);
      if (modelBuffers) {
        gl.useProgram((gl as any).program);

        // Set uniforms
        const u_modelViewMatrix = gl.getUniformLocation((gl as any).program, 'u_modelViewMatrix');
        const u_projectionMatrix = gl.getUniformLocation((gl as any).program, 'u_projectionMatrix');
        const u_diffuseColor = gl.getUniformLocation((gl as any).program, 'u_diffuseColor');
        const u_metalness = gl.getUniformLocation((gl as any).program, 'u_metalness');
        const u_roughness = gl.getUniformLocation((gl as any).program, 'u_roughness');
        const u_opacity = gl.getUniformLocation((gl as any).program, 'u_opacity');
        const u_lightDirection = gl.getUniformLocation((gl as any).program, 'u_lightDirection');
        const u_lightIntensity = gl.getUniformLocation((gl as any).program, 'u_lightIntensity');
        const u_ambientIntensity = gl.getUniformLocation((gl as any).program, 'u_ambientIntensity');
        const u_wireframe = gl.getUniformLocation((gl as any).program, 'u_wireframe');

        gl.uniformMatrix4fv(u_modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix);
        
        const diffuseColor = hexToRgb(materialProps.diffuse);
        gl.uniform3f(u_diffuseColor, diffuseColor[0], diffuseColor[1], diffuseColor[2]);
        gl.uniform1f(u_metalness, materialProps.metalness);
        gl.uniform1f(u_roughness, materialProps.roughness);
        gl.uniform1f(u_opacity, materialProps.opacity);
        gl.uniform3f(u_lightDirection, 1, 1, 1);
        gl.uniform1f(u_lightIntensity, lightingSettings.directionalIntensity);
        gl.uniform1f(u_ambientIntensity, lightingSettings.ambientIntensity);
        gl.uniform1i(u_wireframe, viewportSettings.wireframe ? 1 : 0);

        // Bind attributes
        const a_position = gl.getAttribLocation((gl as any).program, 'a_position');
        const a_normal = gl.getAttribLocation((gl as any).program, 'a_normal');

        gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffers.vertexBuffer);
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffers.normalBuffer);
        gl.enableVertexAttribArray(a_normal);
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

        // Draw
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelBuffers.indexBuffer);
        
        if (viewportSettings.wireframe) {
          gl.drawElements(gl.LINES, modelBuffers.indexCount, gl.UNSIGNED_SHORT, 0);
        } else {
          gl.drawElements(gl.TRIANGLES, modelBuffers.indexCount, gl.UNSIGNED_SHORT, 0);
        }
      }
    }

    // Continue animation loop
    animationRef.current = requestAnimationFrame(render);
  }, [model, viewportSettings, materialProps, lightingSettings]);

  const startRenderLoop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    render();
  }, [render]);

  useEffect(() => {
    initWebGL();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gray-900"
      style={{ 
        minHeight: '400px',
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default WebGLRenderer;