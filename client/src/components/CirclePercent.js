import React from "react";
import "./CirclePercent.css";

export default function CirclePercent(props) {
  const strokeSize = 2 * Math.PI * props.size;
  return (
    <div className="circle-percent">
      <svg
        width={2 * props.size + 15}
        height={2 * props.size + 15 /* 15 is the stroke size */}
      >
        <circle cx={props.size} cy={props.size} r={props.size}></circle>
        <circle
          cx={props.size}
          cy={props.size}
          r={props.size}
          style={{
            strokeDashoffset:
              strokeSize -
              (strokeSize *
                ((props.wins / (props.losses + props.wins)) * 100)) /
                100,
            strokeDasharray: strokeSize,
          }}
        ></circle>
      </svg>
      <div className="circle-percent__stats">
        <div
          className="circle-percent__percent"
          style={{ fontSize: props.fontSize }}
        >
          {Math.round((props.wins / (props.losses + props.wins)) * 100 * 100) /
            100 +
            "%"}
        </div>
        <div className="wins-losses" style={{ fontSize: props.fontSize / 2 }}>
          {props.wins} W / {props.losses} L
        </div>
      </div>
    </div>
  );
}
