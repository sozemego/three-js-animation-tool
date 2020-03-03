import React, { Dispatch, useEffect } from "react";
import { AnimationClip, AnimationLoader } from "three";
import { Button, Col, Input, Row, Select } from "antd";
import { Typography } from "antd";
import produce from "immer";
import { TRACK_TYPE } from "./TrackType";
import { TrackOptions } from "./TrackOptions";

let { Text } = Typography;
let { Option } = Select;

let initial = {
  name: "Hello",
  duration: 1,
  tracks: [
    {
      id: 1,
      name: ".scale",
      type: TRACK_TYPE.vector,
      timesStr: "0, 1",
      valuesStr: "0 0, 1 1",
      length: 2
    }
  ]
};

export function Tracks({ setClips }: TracksProps) {
  function findTrackById(tracks: ITrack[], id: number) {
    return tracks.find(track => track.id === id);
  }

  let reducer = produce((state, action) => {
    switch (action.type) {
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
          values: []
        });
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
      case "update_track_times": {
        let track = findTrackById(state.tracks, action.id)!;
        track.timesStr = action.times;
        break;
      }
      case "update_track_values": {
        let track = findTrackById(state.tracks, action.id)!;
        track.valuesStr = action.values;
        break;
      }
    }
  });

  let [state, dispatch] = React.useReducer(reducer, initial);

  useEffect(() => {
    try {
      let copy = JSON.parse(JSON.stringify(state));

      let { tracks } = copy;

      for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i];
        let times = turnTimesIntoNumbers(track.timesStr);
        let values = turnTimesIntoNumbers(track.valuesStr);
        if (areTimesAndValuesValid(times, values, track.length)) {
          track.times = times;
          track.values = values;
          track.duration = times[times.length - 1];
        }
      }

      let clips = new AnimationLoader().parse([copy]);
      setClips(clips);
    } catch (e) {
      setClips([]);
    }
  }, [state, setClips]);

  let { name, tracks } = state;

  return (
    <div style={{ padding: "6px" }}>
      <Input
        placeholder={"name"}
        value={name}
        onChange={e => dispatch({ type: "name", name: e.target.value })}
      />
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
  let { id, name, type } = track;
  return (
    <div>
      <div>
        <div>NAME</div>
        <Input
          placeholder={"name"}
          value={name}
          onChange={e =>
            dispatch({ type: "track_name_change", id, name: e.target.value })
          }
        />
      </div>
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
      <div>
        <TrackOptions track={track} dispatch={dispatch} />
      </div>
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
}

interface TrackProps {
  dispatch: Dispatch<any>;
  track: ITrack;
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

function areTimesAndValuesValid(
  times: number[],
  values: number[],
  length: number
) {
  let valuePackets = values.length / length;
  return valuePackets === times.length;
}

function getLength(type: keyof typeof TRACK_TYPE): number {
  return {
    [TRACK_TYPE.vector]: 1,
    [TRACK_TYPE.number]: 1,
    [TRACK_TYPE.quaternion]: 4,
    [TRACK_TYPE.color]: 1,
    [TRACK_TYPE.boolean]: 1,
    [TRACK_TYPE.string]: 1
  }[type];
}
