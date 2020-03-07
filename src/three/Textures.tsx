import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimationClip,
  AnimationMixer,
  Mesh,
  Texture,
  TextureLoader
} from "three";
import { useFrame } from "react-three-fiber";

export function Textures({ clips }: TexturesProps) {
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

  let offsets = [-2, -1, 0, 1, 2];

  return (
    <>
      {textures.map((texture, index) => (
        <TextureComponent
          key={index}
          texture={texture}
          offset={offsets[index]}
          clips={clips}
        />
      ))}
    </>
  );
}

interface TexturesProps {
  clips: AnimationClip[];
}

function TextureComponent({ texture, offset, clips }: TextureComponentProps) {
  let mesh = useRef<Mesh>();

  let [mixer, setMixer] = useState<AnimationMixer>();

  useEffect(() => {
    try {
      let mixer = new AnimationMixer(mesh.current!);
      let clipAction = mixer.clipAction(clips[0]);
      clipAction.play();
      setMixer(mixer);
    } catch (e) {
      setMixer(undefined);
    }
  }, [clips]);

  useFrame(() => {
    if (!mixer) {
      return;
    }
    mixer.update(1 / 60);
  });

  return (
    <mesh position={[offset * 1.5, 0, 0]} ref={mesh}>
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
  clips: AnimationClip[];
}
