"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// 3D Scene helper component to run frame updates inside Canvas
function InteractivePlane({
  texture,
  isDragging,
  dragOffset,
  velocity
}: {
  texture: THREE.Texture | null;
  isDragging: boolean;
  dragOffset: React.MutableRefObject<number>;
  velocity: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const targetRotation = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isDragging) {
      targetRotation.current = dragOffset.current;
    } else {
      // Passive continuous auto-rotation + inertia decay
      dragOffset.current += velocity.current;
      velocity.current *= 0.95; // friction
      if (Math.abs(velocity.current) < 0.0005) {
        velocity.current = 0;
        // Subtle constant rotation when idle
        dragOffset.current += 0.004;
      }
      targetRotation.current = dragOffset.current;
    }

    // Smooth lerping to target rotation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation.current,
      0.1
    );

    // Dynamic wave animation for floating look
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.7, 3.2, 32, 32]} />
      {texture ? (
        <meshStandardMaterial
          map={texture}
          metalness={0.25}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      ) : (
        <meshStandardMaterial color="#0f0f14" side={THREE.DoubleSide} />
      )}
    </mesh>
  );
}

export default function ProductViewer({
  images = [],
  selected = 0,
  onSwipe
}: {
  images?: string[];
  selected?: number;
  onSwipe?: (dir: "left" | "right") => void;
}) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Drag physics states
  const isDragging = useRef(false);
  const dragOffset = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef<number | null>(null);
  
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (images && images[selected]) {
      const loader = new THREE.TextureLoader();
      loader.load(images[selected], (t) => {
        setTex(t);
      });
    }
  }, [images, selected]);

  useEffect(() => {
    const check = () => {
      const mobile = typeof window !== "undefined" && (window.innerWidth < 768 || navigator.maxTouchPoints > 0);
      setIsMobile(Boolean(mobile));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || lastX.current === null) return;
    const dx = (e.clientX - lastX.current) * 0.007; // sensitivity
    dragOffset.current += dx;
    velocity.current = dx;
    lastX.current = e.clientX;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    lastX.current = null;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (Math.abs(dx) > threshold) {
      if (dx < 0) onSwipe?.("left");
      else onSwipe?.("right");
    }
    touchStartX.current = null;
  };

  if (isMobile) {
    return (
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden glass border border-white/8 flex items-center justify-center bg-black/20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[selected] ?? "/placeholder.jpg"}
          alt="product layout"
          className="w-[85%] h-[85%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase font-mono tracking-widest text-gray-400 bg-black/45 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/5">
          Swipe to Orbit Details
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden glass border border-white/8 bg-black/20 flex items-center justify-center cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-3, -3, -4]} intensity={0.7} color="#0052ff" />
        <pointLight position={[0, 4, 2]} intensity={1.0} color="#7c3aed" />

        <InteractivePlane
          texture={tex}
          isDragging={isDragging.current}
          dragOffset={dragOffset}
          velocity={velocity}
        />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase font-mono tracking-widest text-gray-400 bg-black/45 backdrop-blur-md rounded-full px-4 py-2 border border-white/5 pointer-events-none select-none">
        Drag mouse to rotate 360°
      </div>
    </div>
  );
}
