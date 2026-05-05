'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying float vNoise;
  float snoise(vec3 v) { return sin(v.x*1.3 + v.y*1.7 + v.z*2.1 + uTime*0.6); }
  void main() {
    vNormal = normalize(normalMatrix * normal);
    float n = snoise(position * 1.4);
    vNoise = n;
    vec3 displaced = position + normal * n * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying float vNoise;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.0);
    vec3 base = mix(vec3(0.23,0.51,0.96), vec3(0.38,0.65,0.98), 0.5 + 0.5*vNoise);
    vec3 rim  = vec3(0.38,0.65,0.98) * fresnel * (1.2 + 0.4*sin(uTime*1.4));
    gl_FragColor = vec4(base*0.6 + rim, 1.0);
  }
`;

export function KnowledgeSphere() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh>
      <icosahedronGeometry args={[1.0, 4]} />
      <shaderMaterial ref={matRef} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}
