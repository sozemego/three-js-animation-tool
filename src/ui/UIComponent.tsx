import React from "react";
import { Drawer } from "@material-ui/core";
import { Tracks } from "./Tracks";

export function UIComponent() {
  return (
    <Drawer anchor={"left"} open={true} variant={"permanent"}>
      <div style={{ width: "250px", padding: "8px" }}>
        <Tracks />
      </div>
    </Drawer>
  );
}
