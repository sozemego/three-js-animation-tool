import React from "react";
import { Canvas } from "react-three-fiber";
import { Textures } from "./Textures";

export function ThreeCanvas() {
  return (
    <Canvas style={{ background: "white" }} camera={{ position: [0, 0, 15] }}>
      <ambientLight />
      <Textures />
    </Canvas>
  );
}
