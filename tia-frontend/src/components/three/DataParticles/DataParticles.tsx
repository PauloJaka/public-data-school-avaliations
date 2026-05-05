'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DataParticles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const palette = [
      [0.376, 0.647, 0.980],
      [0.576, 0.772, 0.992],
      [0.976, 0.451, 0.086],
    ];
    for (let i = 0; i < count; i++) {
      p[i*3]   = (Math.random() - 0.5) * 8;
      p[i*3+1] = -3 + Math.random() * 6;
      p[i*3+2] = (Math.random() - 0.5) * 8;
      const r = Math.random();
      const col = r < 0.7 ? palette[0] : r < 0.95 ? palette[1] : palette[2];
      c[i*3] = col[0]; c[i*3+1] = col[1]; c[i*3+2] = col[2];
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(c, 3));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += dt * 0.25;
      if (arr[i] > 3) arr[i] = -3;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} />
    </points>
  );
}
