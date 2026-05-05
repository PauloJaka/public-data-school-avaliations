'use client';
import { useEffect, useRef } from 'react';

export function useMouseParallax() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const target = { x: 0, y: 0.3 };
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = nx * 0.4;
      target.y = 0.3 + ny * 0.25;
    };
    let raf = 0;
    const tick = () => {
      const cnv = ref.current as unknown as { __r3f?: { fiber?: { camera?: THREE_Camera } } };
      const cam = cnv?.__r3f?.fiber?.camera;
      if (cam) {
        cam.position.x += (target.x - cam.position.x) * 0.04;
        cam.position.y += (target.y - cam.position.y) * 0.04;
        cam.position.z = 6;
        cam.lookAt(0, 0, 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);
  return ref;
}

// Minimal type for camera operations
interface THREE_Camera {
  position: { x: number; y: number; z: number };
  lookAt: (x: number, y: number, z: number) => void;
}
