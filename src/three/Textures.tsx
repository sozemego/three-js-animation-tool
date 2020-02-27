import React, { useMemo } from "react";
import { Texture, TextureLoader } from "three";

export function Textures() {
  let textures = useMemo(
    () =>
      [
        "textures/texture_1.png",
        "textures/texture_2.png",
        "textures/texture_3.png",
        "textures/texture_4.png",
        "textures/texture_5.png"
      ].map(texture => new TextureLoader().load(texture)),
    []
  );

  return (
    <>
      {textures.map((texture, index) => (
        <TextureComponent key={index} texture={texture} offset={index} />
      ))}
    </>
  );
}

function TextureComponent({ texture, offset }: TextureComponentProps) {
  return (
    <mesh position={[offset * 1.5, 0, 0]}>
      <planeBufferGeometry attach={"geometry"} args={[1, 1, 1]} />
      <meshBasicMaterial
        attach={"material"}
        map={texture}
        alphaTest={0.25}
        transparent={true}
      />
    </mesh>
  );
}

interface TextureComponentProps {
  texture: Texture;
  offset: number;
}
