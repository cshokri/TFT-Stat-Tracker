import React from "react";
import "./Match.css";

export default function Match(props) {
  let units = props.units.map((unit, key) => (
    <div key={key} className="unit-container">
      {
        unit.tier > 1 ? <img className="unit-tier" src={"/image/" + unit.tier + "-star.png"} alt={unit.tier}></img> : <div className="tier-padding"></div>
      }
      <img className="unit-icon" src={"/image/champions/" + unit.character_id + ".png"} alt={unit.character_id}></img>
      <div className="items">
        {unit.items.map((item, key) => (
          <img key={key} src={"/image/items/" + item + ".png"} alt={item}></img>
        ))}
      </div>
    </div>
  ));

  const rootVariables = getComputedStyle(document.body);
  const firstPlaceColor = rootVariables.getPropertyValue("--first-place");
  const secondPlaceColor = rootVariables.getPropertyValue("--second-place");
  const thirdPlaceColor = rootVariables.getPropertyValue("--third-place");
  const fourthPlaceColor = rootVariables.getPropertyValue("--fourth-place");
  const lossColor = rootVariables.getPropertyValue("--loss-color");
  let placingColor = lossColor;
  let placingText = "th";
  switch (props.placement) {
    case 1:
      placingColor = firstPlaceColor;
      placingText = "st";
      break;
    case 2:
      placingColor = secondPlaceColor;
      placingText = "nd";
      break;
    case 3:
      placingColor = thirdPlaceColor;
      placingText = "rd";
      break;
    case 4:
      placingColor = fourthPlaceColor;
      placingText = "th";
      break;
    default:
      placingColor = lossColor;
      placingText = "th";
  }

  return (
    <div className="match">
      <div className="match_general-info">
        <div className="match__placings" style={{backgroundColor: placingColor}}>{props.placement + placingText}</div>
        <div className="match__specific-info">
          <div className="match__type">{props.match_type}</div>
          <div className="match__date">{props.date}</div>
        </div>
      </div>
      <div className="match__stats">
        <div>
          <div>Level</div>
          <div className="value">{props.level}</div>
        </div>
        <div>
          <div>Damage Dealt</div>
          <div className="value">{props.damage}</div>
        </div>
      </div>
      <div className="units">
        {units}
      </div>
    </div>
  );
}
