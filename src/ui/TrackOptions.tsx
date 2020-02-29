import React from "react";
import { TRACK_TYPE } from "./TrackType";
import { ITrack } from "./Tracks";

export function TrackOptions({ track }: TrackOptionsProps) {
  let Component = componentFactory(track.type);

  return (
    <div>
      <Component track={track} />
    </div>
  );
}

function componentFactory(type: keyof typeof TRACK_TYPE) {
  switch (type) {
    case "VECTOR":
      return VectorOptions;
    default:
      return VectorOptions;
  }
}

function VectorOptions({ track }: OptionsProps) {
  return <div>THIS BE VECTOR</div>;
}

interface OptionsProps {
  track: ITrack;
}

interface TrackOptionsProps {
  track: ITrack;
}
