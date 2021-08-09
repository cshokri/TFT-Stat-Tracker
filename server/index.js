const riotAPI = require("./riotAPI");
require("dotenv").config();

const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const user = "WizardSteve";
const tag = "NA1";
const API_KEY = process.env.API_KEY;

let api = new riotAPI(API_KEY, user, tag);

let icon;
let rankedEmblem;
let wins;
let losses;
let matches;
let tier;
let rank;
let lp;

api
  .init(async function () {
    matches = await api.getPastMatches();
  })
  .then(() => {
    icon = api.getUserIcon();
    rankedEmblem = api.getRankedEmblem();
    wins = api.getWins();
    losses = api.getLosses();
    tier = api.getTier();
    rank = api.getRank();
    lp = api.getLp();
  });

//app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/MatchHistory", (req, res) => {
  res.json({ matchHistory: matches });
});

app.get("/PlayerData", (req, res) => {
  res.json({
    name: user,
    tag: tag,
    tier: tier,
    rank: rank,
    lp: lp,
    wins: wins,
    losses: losses,
  });
});

app.get("/PlayerIcon", (req, res) => {
  res.sendFile(icon, { root: "./server" });
});

app.get("/RankEmblem", (req, res) => {
  res.sendFile(rankedEmblem, { root: "./server" });
});
/*
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});
*/
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
