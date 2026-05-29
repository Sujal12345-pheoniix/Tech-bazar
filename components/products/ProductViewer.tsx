"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function PhonePlane({ texture, pointerRotation }: { texture: THREE.Texture | null; pointerRotation: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh | null>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    // Smoothly approach pointer rotation
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, pointerRotation.current, 0.08);
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, 0]}>
      <planeGeometry args={[1.6, 3.0, 32, 32]} />
      {texture ? (
        <meshStandardMaterial map={texture} metalness={0.15} roughness={0.35} />
      ) : (
        <meshStandardMaterial color="#111116" />
      )}
    </mesh>
  );
}

export default function ProductViewer({ images = [], selected = 0, onSwipe, }: { images?: string[]; selected?: number; onSwipe?: (dir: "left" | "right") => void }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const pointerRot = useRef<number>(0);
  const dragging = useRef(false);
  const lastX = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (images && images[selected]) {
      const loader = new THREE.TextureLoader();
      loader.load(images[selected], (t) => {
        // some three builds may not export sRGBEncoding symbol in certain bundles;
        // avoid forcing encoding here for broader compatibility
        setTex(t);
      });
    }
  }, [images, selected]);

  useEffect(() => {
    const mobile = typeof window !== "undefined" && (window.innerWidth < 768 || navigator.maxTouchPoints > 0);
    setIsMobile(Boolean(mobile));
    const onResize = () => setIsMobile(typeof window !== "undefined" && (window.innerWidth < 768 || navigator.maxTouchPoints > 0));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // inertial physics on release
  const velocity = useRef(0);
  useFrame(() => {
    if (!dragging.current) {
      pointerRot.current += velocity.current;
      velocity.current *= 0.95;
      if (Math.abs(velocity.current) < 0.0005) velocity.current = 0;
    }
  });

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || lastX.current === null) return;
    const dx = (e.clientX - lastX.current) / 200; // sensitivity
    pointerRot.current += dx;
    velocity.current = dx;
    lastX.current = e.clientX;
  };
  const onPointerUp = () => {
    dragging.current = false;
    lastX.current = null;
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (Math.abs(dx) > threshold) {
      if (dx < 0) onSwipe?.("left"); else onSwipe?.("right");
    }
    touchStartX.current = null;
  };

  if (isMobile) {
    return (
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass border border-white/8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img src={images[selected] ?? "/placeholder.jpg"} alt="product" className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-4 text-xs text-gray-300 bg-black/30 backdrop-blur rounded-full px-3 py-1 glass">Swipe to view • Tap thumbnails</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass border border-white/8" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }} shadows gl={{ antialias: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 5]} intensity={1.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} />
        <PhonePlane texture={tex} pointerRotation={pointerRot} />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>

      {/* Hint */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-300 bg-black/30 backdrop-blur rounded-full px-3 py-1 glass">Drag to rotate • 360° preview</div>
    </div>
  );
}
