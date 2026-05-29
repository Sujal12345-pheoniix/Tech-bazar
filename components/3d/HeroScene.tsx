"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Environment, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function PhoneModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        {/* Phone body */}
        <boxGeometry args={[1.2, 2.5, 0.1]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      {/* Phone screen glow */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[1.05, 2.1, 0.01]} />
        <meshStandardMaterial
          color="#0052ff"
          emissive="#0052ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Camera bump */}
      <mesh position={[-0.25, 0.85, -0.08]}>
        <boxGeometry args={[0.5, 0.45, 0.05]} />
        <meshStandardMaterial color="#111118" metalness={0.95} roughness={0.05} />
      </mesh>
    </Float>
  );
}

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <Sphere args={[0.5, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </Sphere>
    </mesh>
  );
}

function EarbudModel({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#0052ff" />
      <pointLight position={[-5, -3, 3]} intensity={1.5} color="#7c3aed" />
      <pointLight position={[0, -5, 2]} intensity={1} color="#06b6d4" />
      <Stars radius={100} depth={50} count={3000} factor={2} fade speed={0.5} />
      <Environment preset="night" />

      <PhoneModel />
      <EarbudModel position={[2.5, 0.5, 0]} />
      <EarbudModel position={[2.8, -0.5, 0.2]} />
      <FloatingOrb position={[-2.5, 1, -1]} color="#0052ff" scale={0.8} />
      <FloatingOrb position={[3.5, -1.5, -2]} color="#7c3aed" scale={0.5} />
      <FloatingOrb position={[-3, -2, -1]} color="#06b6d4" scale={0.6} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
