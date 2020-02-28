import React from "react";
import { AnimationLoader } from "three";

export function Tracks() {
  let json = [
    {
      name: "Hello",
      duration: 1,
      tracks: [
        {
          name: "track1",
          type: "vector2",
          times: [0, 1],
          values: [0, 0, 1, 1]
        }
      ]
    }
  ];
  let clips = new AnimationLoader().parse(json);

  return (
    <div>
      <div>TRACKS</div>
    </div>
  );
}
