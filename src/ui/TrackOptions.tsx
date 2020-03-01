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
  let { timesStr, valuesStr } = track;

  return (
    <div>
      <Input
        value={timesStr}
        onChange={e => {
          dispatch({});
          let array = turnTimesIntoNumbers(e.target.value);
          console.log(array);
        }}
      />
      <Input value={valuesStr} />
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

export function turnTimesIntoNumbers(str: string): number[] {
  let strings = str.split(/\D/gi);
  return strings.filter(Boolean).map(Number);
}

export function turnNumbersIntoString(arr: number[], length: number) {
  let str = "";
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    ++counter;
    str += `${arr[i]}`;
    if (counter !== length) {
      str += " ";
    } else {
      str += ", ";
      counter = 0;
    }
  }
  str = str.trim();
  if (str.charAt(str.length - 1) === ",") {
    str = str.slice(0, str.length - 1);
  }
  return str.trim();
}
