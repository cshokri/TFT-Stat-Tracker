import React from "react";
import "./App.css";
import Header from "./components/Header.js";
import CompStats from "./components/CompStats.js";
import MatchHistory from "./components/MatchHistory";

function App() {
  const [name, setName] = React.useState(null);
  const [wins, setWins] = React.useState(0);
  const [losses, setLosses] = React.useState(0);
  const [icon, setIcon] = React.useState(0);
  const [tag, setTag] = React.useState(null);
  const [tier, setTier] = React.useState(null);
  const [rank, setRank] = React.useState(null);
  const [lp, setLp] = React.useState(0);

  const [mostPlayed, setMostPlayed] = React.useState([]);

  const [matchHistory, setMatchHistory] = React.useState([]);

  const compStatsComponents = mostPlayed.length > 0 && mostPlayed.map((comp, key) => (
    <CompStats
      key={key}
      mostPlayed={comp}
      size={"50"}
      fontSize={20}
    />
  ));

  function getData() {
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
        setIcon(data.icon);
      });
    fetch("/MostPlayed")
      .then((res) => res.json())
      .then((data) => {
        setMostPlayed(data);
      });
    fetch("/MatchHistory")
    .then((res) => res.json())
    .then((data) => {
      setMatchHistory(data.matches);
    });
  }

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <Header
        name={!name ? "N/A" : name}
        wins={!wins ? "N/A" : wins}
        losses={!losses ? "N/A" : losses}
        icon={!icon ? 0 : icon}
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
          <div className="match-history__header">
            <div className="center-adjust">Update</div>
            <h1>Match History</h1>
            <button className="player__refresh-button" onClick={getData}>Update</button>
          </div>
          <div className="match-history">
            <MatchHistory key="matches" matches={matchHistory}></MatchHistory>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
