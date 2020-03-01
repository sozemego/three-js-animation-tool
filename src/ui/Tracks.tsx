import React, { Dispatch, useEffect } from "react";
import { AnimationClip, AnimationLoader } from "three";
import { Button, Col, Input, Row, Select } from "antd";
import { Typography } from "antd";
import produce from "immer";
import { TRACK_TYPE } from "./TrackType";
import { TrackOptions, turnTimesIntoNumbers } from "./TrackOptions";

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
      times: turnTimesIntoNumbers("0, 1"),
      timesStr: "0, 1",
      values: turnTimesIntoNumbers("0 0, 1 1"),
      valuesStr: "0 0, 1 1"
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
      case "track_name_change":
        {
          let track = findTrackById(state.tracks, action.id);
          track!.name = action.name;
        }
        break;
      case "track_type_change": {
        let track = findTrackById(state.tracks, action.id);
        track!.type = action.nextType;
      }
    }
  });

  let [state, dispatch] = React.useReducer(reducer, initial);

  useEffect(() => {
    try {
      let clips = new AnimationLoader().parse([state]);
      console.log(clips);
      setClips(clips);
    } catch (e) {
      // console.error(e);
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
