import React, { Dispatch, useEffect } from "react";
import { AnimationClip, AnimationLoader } from "three";
import { Button, Col, Input, Row, Select } from "antd";
import { Typography } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";
import produce from "immer";
import { TRACK_TYPE } from "./TrackType";
import { TrackOptions } from "./TrackOptions";
import { getFromLocalStorage, persistToLocalStorage } from "./LocalStorage";

let { Text } = Typography;
let { Option } = Select;

let defaultState = {
  name: "Hello",
  duration: 1,
  tracks: [
    {
      id: 1,
      name: ".scale",
      type: TRACK_TYPE.vector,
      timesStr: "0, 1",
      valuesStr: "0 0, 1 1",
      length: 2,
      hidden: false
    }
  ]
};

let initial = getFromLocalStorage(defaultState);

export function Tracks({ setClips }: TracksProps) {
  function findTrackById(tracks: ITrack[], id: number) {
    return tracks.find(track => track.id === id);
  }

  let reducer = produce((state, action) => {
    switch (action.type) {
      case "reset": {
        return defaultState;
      }
      case "name":
        state.name = action.name;
        break;
      case "add_track": {
        let nextId = state.tracks.length + 1;
        state.tracks.push({
          name: `${nextId}`,
          type: TRACK_TYPE.vector,
          id: nextId,
          times: [],
          values: [],
          length: 2
        });
        break;
      }
      case "toggle_track_visibility": {
        let track = findTrackById(state.tracks, action.id)!;
        track.hidden = !track.hidden;
        break;
      }
      case "track_name_change": {
        let track = findTrackById(state.tracks, action.id)!;
        track.name = action.name;
        break;
      }
      case "track_type_change": {
        let track = findTrackById(state.tracks, action.id)!;
        track.type = action.nextType;
        track.valuesStr = "";
        track.timesStr = "";
        track.length = getLength(action.nextType);
        break;
      }
      case "update_track_length": {
        let track = findTrackById(state.tracks, action.id)!;
        track.length = action.length;
        let values = turnTimesIntoNumbers(track.valuesStr);
        track.valuesStr = turnNumbersIntoString(values, action.length);
        break;
      }
      case "update_track_times": {
        let track = findTrackById(state.tracks, action.id)!;
        track.timesStr = action.times;
        break;
      }
      case "update_track_values": {
        let track = findTrackById(state.tracks, action.id)!;
        if (
          track.type === TRACK_TYPE.number ||
          track.type === TRACK_TYPE.vector
        ) {
          track.valuesStr = stripValues(action.values);
        } else {
          track.valuesStr = action.values;
        }

        break;
      }
    }
    persistToLocalStorage(state);
  });

  let [state, dispatch] = React.useReducer(reducer, initial);

  useEffect(() => {
    try {
      let copy = JSON.parse(JSON.stringify(state));

      let { tracks } = copy;
      tracks = tracks.filter((track: ITrack) => !track.hidden);
      copy.tracks = tracks;

      let largestTime = Number.MIN_SAFE_INTEGER;

      for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i];
        let [times, values] = getTimesAndNumbers(track);
        track.times = times;
        track.values = values;
        let trackDuration = times[times.length - 1];
        if (trackDuration >= largestTime) {
          largestTime = trackDuration;
        }
      }

      copy.duration = largestTime;

      let clips = new AnimationLoader().parse([copy]);
      setClips(clips);
    } catch (e) {
      setClips([]);
    }
  }, [state, setClips]);

  let { name, tracks } = state;

  return (
    <div style={{ padding: "6px" }}>
      <Row align={"middle"} justify={"space-between"}>
        <Col>
          <Input
            placeholder={"name"}
            value={name}
            onChange={e => dispatch({ type: "name", name: e.target.value })}
          />
        </Col>
        <Col>
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => dispatch({ type: "reset" })}
          />
        </Col>
      </Row>
      <div style={{ height: "12px" }} />
      <Row align={"middle"} justify={"space-between"}>
        <Col>
          <Text>TRACKS</Text>
        </Col>
        <Col>
          <Button
            type={"primary"}
            onClick={() => dispatch({ type: "add_track" })}
          >
            ADD TRACK
          </Button>
        </Col>
      </Row>
      <hr />
      <div>
        <TrackList tracks={tracks} dispatch={dispatch} />
      </div>
    </div>
  );
}

interface TracksProps {
  setClips: (clips: AnimationClip[]) => void;
}

function TrackList({ tracks, dispatch }: TrackListProps) {
  return (
    <>
      {tracks.map((track, index) => (
        <React.Fragment key={track.id}>
          <Track key={track.id} track={track} dispatch={dispatch} />
          {index < tracks.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </>
  );
}

interface TrackListProps {
  tracks: ITrack[];
  dispatch: Dispatch<any>;
}

function Track({ track, dispatch }: TrackProps) {
  let { id, name, type, hidden } = track;
  return (
    <div>
      <div>
        <Row justify={"space-between"} align={"middle"}>
          <span>NAME</span>
          {!hidden && (
            <EyeOutlined
              onClick={() => dispatch({ type: "toggle_track_visibility", id })}
            />
          )}
          {hidden && (
            <EyeInvisibleOutlined
              onClick={() => dispatch({ type: "toggle_track_visibility", id })}
            />
          )}
        </Row>
        <Input
          placeholder={"name"}
          value={name}
          onChange={e =>
            dispatch({ type: "track_name_change", id, name: e.target.value })
          }
        />
      </div>
      {!hidden && (
        <div>
          <div>TYPE</div>
          <Select
            defaultValue={TRACK_TYPE.vector}
            value={type}
            style={{ width: "150px" }}
            onChange={value =>
              dispatch({ type: "track_type_change", nextType: value, id })
            }
          >
            {Object.values(TRACK_TYPE).map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </div>
      )}
      {!hidden && <TrackOptions track={track} dispatch={dispatch} />}
    </div>
  );
}

export interface ITrack {
  id: number;
  name: string;
  length: number;
  type: keyof typeof TRACK_TYPE;
  times: number[];
  timesStr: string;
  values: number[];
  valuesStr: string;
  hidden: boolean;
}

interface TrackProps {
  dispatch: Dispatch<any>;
  track: ITrack;
}

export function turnTimesIntoNumbers(str: string): number[] {
  if (!str) {
    return [];
  }
  let strings = str.split(/,|\s/gi);
  return strings.filter(Boolean).map(Number);
}

export function turnTimesIntoBooleans(str: string): boolean[] {
  if (!str) {
    return [];
  }
  let strings = str.split(/,|\s/gi);
  return strings.filter(Boolean).map(time => time === "true");
}

export function turnValuesIntoColors(str: string): number[] {
  if (!str) {
    return [];
  }

  let strings = str.split(/,|\s/gi);
  return strings
    .filter(Boolean)
    .map(turnStringIntoColor)
    .filter(number => number !== null) as number[];
}

function turnStringIntoColor(str: string): number | null {
  if (!str) {
    return null;
  }
  if (str.startsWith("0x")) {
    return parseInt(str, 16);
  }
  return Number(str);
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

function areTimesAndValuesValid(
  times: number[],
  values: any[],
  length: number
) {
  let valuePackets = values.length / length;
  return valuePackets === times.length;
}

/**
 * Removes all non digits and non periods from this string
 * @param str
 */
export function stripValues(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let char = str.charAt(i);
    if (char === "." || char === "," || char === " " || char.match(/\d/gi)) {
      result += char;
    }
  }
  return result;
}

function getLength(type: keyof typeof TRACK_TYPE): number {
  return {
    [TRACK_TYPE.vector]: 1,
    [TRACK_TYPE.number]: 1,
    [TRACK_TYPE.quaternion]: 4,
    [TRACK_TYPE.color]: 3,
    [TRACK_TYPE.boolean]: 1
  }[type];
}

function getTimesAndNumbers(track: ITrack): [number[], any[]] {
  let times = turnTimesIntoNumbers(track.timesStr);
  if (
    track.type === TRACK_TYPE.vector ||
    track.type === TRACK_TYPE.number ||
    track.type === TRACK_TYPE.quaternion
  ) {
    let values = turnTimesIntoNumbers(track.valuesStr);
    if (areTimesAndValuesValid(times, values, track.length)) {
      return [times, values];
    }
  }

  if (track.type === TRACK_TYPE.color) {
    let values = turnValuesIntoColors(track.valuesStr);
    if (areTimesAndValuesValid(times, values, getLength(track.type))) {
      return [times, values];
    }
  }

  if (track.type === TRACK_TYPE.boolean) {
    let values = turnTimesIntoBooleans(track.valuesStr);
    if (areTimesAndValuesValid(times, values, getLength(track.type))) {
      return [times, values];
    }
  }

  return [[], []];
}
