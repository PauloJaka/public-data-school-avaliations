'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export interface FloatingObjectProps {
  src: string;
  orbitRadius: number;
  tiltDeg: number;
  periodSec: number;
}

export function FloatingObject({ src, orbitRadius, tiltDeg, periodSec }: FloatingObjectProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(src);
  const tilt = (tiltDeg * Math.PI) / 180;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = (clock.elapsedTime / periodSec) * Math.PI * 2;
    group.current.position.set(
      Math.cos(t) * orbitRadius,
      Math.sin(t * 0.6) * 0.25,
      Math.sin(t) * orbitRadius
    );
    group.current.rotation.y = t * 0.6;
  });

  return (
    <group ref={group} rotation={[tilt, 0, 0]}>
      <primitive object={scene} scale={0.45} />
    </group>
  );
}

// Preload all GLBs at module level to avoid waterfall
useGLTF.preload('/models/book.glb');
useGLTF.preload('/models/cap.glb');
useGLTF.preload('/models/globe.glb');
