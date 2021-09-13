import React from "react";
import Match from "./Match.js";
import "./MatchHistory.css";

export default function MatchHistory(props) {
  const matches = props.matches.length > 0 && props.matches.map((match, key) => (
    <Match 
      key={key}
      placement={match.placement}
      level={match.level}
      damage={match.total_damage_to_players}
      match_type={match.match_type}
      date={match.date}
      units={match.units}
    />
  ))

  return (
    <div className="matches">
      {matches}
    </div>
  );
}
