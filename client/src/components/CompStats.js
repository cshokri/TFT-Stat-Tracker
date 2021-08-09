import React from "react";
import "./CompStats.css";
import CirclePercent from "./CirclePercent.js";

export default function CompStats(props) {
  return (
    <div className="match">
      <CirclePercent
        size={props.size}
        wins={props.wins}
        losses={props.losses}
        fontSize={props.fontSize}
      />
    </div>
  );
}
