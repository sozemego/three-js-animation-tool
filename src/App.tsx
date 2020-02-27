import React from "react";
import { ThreeCanvas } from "./three/ThreeCanvas";
import { UIComponent } from "./ui/UIComponent";

function App() {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <ThreeCanvas />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <UIComponent />
      </div>
    </div>
  );
}

export default App;
