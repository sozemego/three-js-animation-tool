import React from "react";
import { Canvas } from "react-three-fiber";
import { Textures } from "./Textures";
import { AnimationClip } from "three";

export function ThreeCanvas({ clips }: ThreeCanvasProps) {
  return (
    <Canvas style={{ background: "white" }} camera={{ position: [0, 0, 15] }}>
      <ambientLight />
      <Textures clips={clips} />
    </Canvas>
  );
}

interface ThreeCanvasProps {
  clips: AnimationClip[];
}
