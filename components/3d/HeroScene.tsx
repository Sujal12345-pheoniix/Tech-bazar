"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Environment, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function PhoneModel() {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Floating movement
    const floatY = Math.sin(t * 0.7) * 0.15;
    const floatR = Math.cos(t * 0.3) * 0.04;
    
    // Mouse tracking tilt
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.35;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX + floatR, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY + 0.1, 0.08);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.08);
  });

  return (
    <group ref={groupRef}>
      {/* Phone chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 3.0, 0.12]} />
        <meshPhysicalMaterial
          color="#0f0f15"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Camera Bump */}
      <mesh position={[-0.35, 1.0, 0.07]}>
        <boxGeometry args={[0.5, 0.6, 0.04]} />
        <meshPhysicalMaterial color="#1a1a24" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Lenses */}
      <mesh position={[-0.35, 1.15, 0.09]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
        <meshStandardMaterial color="#000" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-0.35, 0.85, 0.09]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
        <meshStandardMaterial color="#000" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* Glowing Screen Front */}
      <mesh ref={screenRef} position={[0, 0, 0.065]}>
        <boxGeometry args={[1.38, 2.88, 0.005]} />
        <meshPhysicalMaterial
          color="#0052ff"
          emissive="#7c3aed"
          emissiveIntensity={1.2}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* Bezel border highlight */}
      <mesh position={[0, 0, 0.061]}>
        <boxGeometry args={[1.44, 2.94, 0.01]} />
        <meshStandardMaterial color="#000000" roughness={0.5} />
      </mesh>
    </group>
  );
}

function CaseModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow float with higher depth parallax
    const floatY = Math.sin(t * 0.5) * 0.18;
    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.45;
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY + 0.1, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, floatY, 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.6]}>
      {/* Outer translucent bumper shell */}
      <boxGeometry args={[1.65, 3.15, 0.22]} />
      <meshPhysicalMaterial
        color="#00ffff"
        transparent
        opacity={0.25}
        transmission={0.9}
        roughness={0.1}
        thickness={0.5}
        ior={1.5}
      />
    </mesh>
  );
}

function EarstickModel({ position, phase = 0 }: { position: [number, number, number]; phase?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Orbit rotation and float
    groupRef.current.position.y = position[1] + Math.sin(t * 1.1 + phase) * 0.25;
    groupRef.current.position.x = position[0] + Math.cos(t * 0.6 + phase) * 0.15 + state.pointer.x * 0.3;
    groupRef.current.position.z = position[2] + state.pointer.y * 0.3;
    
    groupRef.current.rotation.x = t * 0.5 + phase;
    groupRef.current.rotation.y = t * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* Earbud Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.12, 0.28, 8, 16]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.1} clearcoat={1.0} />
      </mesh>
      
      {/* Translucent stem */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshPhysicalMaterial
          color="#888888"
          transparent
          opacity={0.6}
          transmission={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Red/White Dot indicator */}
      <mesh position={[0.06, -0.15, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={phase === 0 ? "#ff0055" : "#ffffff"} />
      </mesh>
    </group>
  );
}

function ChargerModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Float below the phone
    meshRef.current.position.y = -1.6 + Math.sin(t * 0.8) * 0.1;
    meshRef.current.position.x = state.pointer.x * 0.2;
    meshRef.current.position.z = state.pointer.y * 0.2;
    
    meshRef.current.rotation.y = t * 0.25;
  });

  return (
    <mesh ref={meshRef} position={[0, -1.6, -0.2]} rotation={[Math.PI / 2.3, 0, 0]}>
      <torusGeometry args={[0.85, 0.08, 16, 100]} />
      <meshPhysicalMaterial
        color="#00f2ff"
        emissive="#00f2ff"
        emissiveIntensity={1.5}
        roughness={0.1}
      />
    </mesh>
  );
}

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.35;
    meshRef.current.position.x = position[0] + state.pointer.x * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <Sphere args={[0.6, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2.2}
          transparent
          opacity={0.45}
          metalness={0.2}
          roughness={0.3}
        />
      </Sphere>
    </mesh>
  );
}

function InteractiveLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, state.pointer.x * 6, 0.08);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, state.pointer.y * 6, 0.08);
  });
  return <pointLight ref={lightRef} position={[0, 0, 4]} intensity={5.5} color="#00ffff" decay={1.5} distance={15} castShadow />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={3.5} color="#0052ff" />
      <pointLight position={[-6, -4, 4]} intensity={2.5} color="#7c3aed" />
      <InteractiveLight />
      <directionalLight position={[0, 8, 2]} intensity={1.5} color="#ffffff" />
      
      <Stars radius={120} depth={50} count={3500} factor={4} fade speed={0.8} />
      <Environment preset="night" />

      {/* Main smartphone visual */}
      <PhoneModel />
      
      {/* Magnetic/Translucent case behind it */}
      <CaseModel />

      {/* Wireless charging pad glowing below */}
      <ChargerModel />
      
      {/* Floating high-tech earbuds */}
      <EarstickModel position={[2.2, 0.4, 0.4]} phase={0} />
      <EarstickModel position={[-2.4, -0.6, 0.6]} phase={Math.PI} />

      {/* Dynamic light distorted nodes */}
      <FloatingOrb position={[-3.2, 1.5, -1.5]} color="#0052ff" scale={0.7} />
      <FloatingOrb position={[3.6, -1.2, -2.0]} color="#7c3aed" scale={0.6} />
      <FloatingOrb position={[-3.8, -1.8, -1.0]} color="#00ffff" scale={0.5} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
