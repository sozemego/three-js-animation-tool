import React from "react";
import { TRACK_TYPE } from "./TrackType";
import { ITrack } from "./Tracks";
import { Input } from "antd";

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
    case TRACK_TYPE.vector:
      return VectorOptions;
    default:
      return VectorOptions;
  }
}

function VectorOptions({ track }: OptionsProps) {
  let { times, values } = track;

  let timesValue = times.join(" ");
  let valuesValue = values.join(" ");
  return (
    <div>
      <Input value={timesValue} />
      <Input value={valuesValue} />
    </div>
  );
}

interface OptionsProps {
  track: ITrack;
}

interface TrackOptionsProps {
  track: ITrack;
}
