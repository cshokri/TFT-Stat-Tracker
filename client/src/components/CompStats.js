import React from "react";
import "./CompStats.css";
import CirclePercent from "./CirclePercent.js";

export default function CompStats(props) {
  const mostPlayed = props.mostPlayed;
  const carryItems = mostPlayed.items.length > 0 && mostPlayed.items.map((itemId, key) => (
    <img key={key} src={"/image/items/" + itemId + ".png"} alt={itemId}></img>
  ));

  return (
    <div className="most-played-comp">
      <div className="comp-info">
        <h3 className="comp-info__name">{mostPlayed.name + " Comp"}</h3>
        <div className="comp-info__core">
          <img className="comp-info__carry" src={"/image/champions/TFT5_" + mostPlayed.name + ".png"} alt={mostPlayed.name}></img>
          <div className="comp-info__items">
            {carryItems}
          </div>
        </div>

      </div>
      <CirclePercent
        size={props.size}
        wins={mostPlayed.wins}
        losses={mostPlayed.losses}
        fontSize={props.fontSize}
      />
    </div>
  );
}
