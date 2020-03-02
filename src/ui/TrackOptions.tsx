import React, { Dispatch } from "react";
import { Input } from "antd";
import { TRACK_TYPE } from "./TrackType";
import { ITrack } from "./Tracks";

export function TrackOptions({ track, dispatch }: TrackOptionsProps) {
  let Component = componentFactory(track.type);

  return (
    <div>
      <Component track={track} dispatch={dispatch} />
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

function VectorOptions({ track, dispatch }: OptionsProps) {
  let { id, type, timesStr, valuesStr } = track;

  let length = 1;
  let lastChar = type.charAt(type.length - 1);
  let isDigit = /\d/gi.exec(lastChar);
  if (isDigit) {
    length = Number(lastChar);
  }

  return (
    <div>
      <Input
        value={timesStr}
        onChange={e => {
          dispatch({
            type: "update_track_times",
            id,
            times: e.target.value,
            length
          });
        }}
      />
      <Input
        value={valuesStr}
        onChange={e => {
          dispatch({
            type: "update_track_values",
            id,
            values: e.target.value,
            length
          });
        }}
      />
    </div>
  );
}

interface OptionsProps {
  track: ITrack;
  dispatch: Dispatch<any>;
}

interface TrackOptionsProps {
  track: ITrack;
  dispatch: Dispatch<any>;
}
