import React from "react";
import "./App.css";
import Header from "./components/Header.js";
import CompStats from "./components/CompStats.js";

function App() {
  const [name, setName] = React.useState(null);
  const [wins, setWins] = React.useState(0);
  const [losses, setLosses] = React.useState(0);
  const [icon, setIcon] = React.useState(null);
  const [rankEmblem, setrankEmblem] = React.useState(null);
  const [tag, setTag] = React.useState(null);
  const [tier, setTier] = React.useState(null);
  const [rank, setRank] = React.useState(null);
  const [lp, setLp] = React.useState(0);

  const compStats = [{ size: "50", wins: 3, losses: 3, fontSize: 20 }];

  const showMostPlayed = 3;
  const compStatsComponents = compStats.map((comp, key) => (
    <CompStats
      key={key}
      size={comp.size}
      wins={comp.wins}
      losses={comp.losses}
      fontSize={comp.fontSize}
    />
  ));

  React.useEffect(() => {
    fetch("/PlayerData")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setWins(data.wins);
        setLosses(data.losses);
        setTag(data.tag);
        setTier(data.tier);
        setRank(data.rank);
        setLp(data.lp);
      });
    fetch("/PlayerIcon")
      .then((res) => res.blob())
      .then((blob) => {
        setIcon(URL.createObjectURL(blob));
      });
    fetch("/RankEmblem")
      .then((res) => res.blob())
      .then((blob) => {
        setrankEmblem(URL.createObjectURL(blob));
      });
  }, []);

  return (
    <div className="App">
      <Header
        name={!name ? "N/A" : name}
        wins={!wins ? "N/A" : wins}
        losses={!losses ? "N/A" : losses}
        icon={!icon ? "N/A" : icon}
        rankEmblem={!rankEmblem ? "N/A" : rankEmblem}
        tag={!tag ? "N/A" : tag}
        tier={!tier ? "Unranked" : tier}
        rank={!rank ? "" : rank}
        lp={!lp ? "" : lp}
      />
      <div className="info-container">
        <div className="player__stats">
          <h1>Stats</h1>
          <div className="player-stats__most-played">
            <h2>Most Played</h2>
            <div className="player-stats__comps">{compStatsComponents}</div>
          </div>
        </div>
        <div className="player__match-history">
          <h1>Match History</h1>
          <div className="match-history">{}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
