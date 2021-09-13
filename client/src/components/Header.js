import React from "react";
import "./Header.css";
import CirclePercent from "./CirclePercent.js";

export default function Header(props) {
  return (
    <div className="container">
      <div className="player-rank">
        <div className="header__title">Current Rank</div>
        <img
          className="player-rank__icon"
          src={"/profileImages/ranks/Emblem_" + props.tier + ".png"}
          alt="N/A"
          width="176"
          height="201"
        />
        <div className="player-rank__rank">
          {props.tier.toLowerCase() + " " + props.rank}
        </div>
        <div className="player-rank__lp">{props.lp + " LP"}</div>
      </div>
      <div className="player-info">
        <img
          className="player-info__icon"
          src={"/profileImages/profileicon/" + props.icon + ".png"}
          alt="N/A"
          width="200"
          height="200"
        />
        <div className="player-info__name">{props.name}</div>
      </div>
      <div className="player-winrate">
        <div className="header__title">Overall Win Rate</div>
        <CirclePercent
          size="90"
          wins={props.wins}
          losses={props.losses}
          fontSize={32}
        />
        {/*
        <div className="player-winrate__circle-percent">
          <svg>
            <circle cx="90" cy="90" r="90"></circle>
            <circle
              cx="90"
              cy="90"
              r="90"
              style={{
                strokeDashoffset:
                  565 - (565 * ((props.wins / props.losses) * 100)) / 100,
              }}
            ></circle>
          </svg>
          <div className="player_winrate__percent">
            {Math.round((props.wins / props.losses) * 100 * 100) / 100 + "%"}
            <div className="wins-losses">
              <div>
                {props.wins} W / {props.losses} L
              </div>
            </div>
          </div>
        </div>
            */}
        <div className="player_winrate__top-placings">
          <div className="player_winrate__first-second">
            <div>1st: {props.wins}</div>
            <div>2nd: {props.wins}</div>
          </div>
          <div className="player_winrate__third-fourth">
            <div>3rd: {props.wins}</div>
            <div>4th: {props.wins}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
