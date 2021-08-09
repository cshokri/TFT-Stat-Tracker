const fetch = require("node-fetch");
const fs = require("fs");

const dataDragonLocation = "/data-dragon/";
const iconLocation = dataDragonLocation + "profileicon/";
const rankEmblemLocation = dataDragonLocation + "ranks/";

const endPoints = {
  requestSummoner:
    "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/",
  requestMatches:
    "https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/",
  getMatch: "https://americas.api.riotgames.com/tft/match/v1/matches/",
  requestRank:
    "https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/",
};

class riotAPI {
  constructor(apiKey, user, tag) {
    this.API_KEY = apiKey;
    this.user = user;
    this.tag = tag;

    this.puuid;
    this.summonerId;
    this.accountId;
    this.iconId;

    this.rank;
    this.tier;
    this.lp;
    this.wins;
    this.losses;
    this.rankId;
  }

  async init(callback) {
    await fetch(
      endPoints.requestSummoner + this.user + "?api_key=" + this.API_KEY
    )
      .then((res) => res.json())
      .then((data) => {
        this.puuid = data.puuid;
        this.summonerId = data.id;
        this.accountId = data.accountId;
        this.iconId = data.profileIconId;
      });

    await fetch(
      endPoints.requestRank + this.summonerId + "?api_key=" + this.API_KEY
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          data = data[0];
          this.rank = "rank" in data && data.rank ? data.rank : "Unranked";
          this.tier = "tier" in data && data.tier ? data.tier : "Unranked";
          this.lp = data.leaguePoints ? data.leaguePoints : 0;
          this.wins = data.wins;
          this.losses = data.losses;
          this.rankId = data.leagueId;
        } else {
          this.tier = "Unranked";
        }
      });

    callback.bind(this)();
  }

  evaluateResponse(response) {
    if (response && response.status && response.status.code >= 400) {
      console.log(response.status.code + " " + response.status.message);
    }
  }

  getRank() {
    return this.rank;
  }

  getTier() {
    return this.tier;
  }

  getLp() {
    return this.lp;
  }

  getWins() {
    return this.wins;
  }

  getLosses() {
    return this.losses;
  }

  getUserIcon() {
    return iconLocation + this.iconId + ".png";
  }

  getRankedEmblem() {
    return rankEmblemLocation + "Emblem_" + this.tier + ".png";
  }

  async getPastMatches(count = 3) {
    let matchIds;

    await fetch(
      endPoints.requestMatches +
        this.puuid +
        "/ids?count=" +
        count +
        "&api_key=" +
        this.API_KEY
    )
      .then((res) => res.json())
      .then((data) => {
        matchIds = data;
      });
    this.evaluateResponse(matchIds);

    let matches = [];
    matchIds.forEach(async (matchId) => {
      let matchData = await this.getMatchData(matchId);
      matches.push(matchData);
    });

    return matches ? matches : [];
  }

  async getMatchData(matchId) {
    let matchData;

    await fetch(endPoints.getMatch + matchId + "?api_key=" + this.API_KEY)
      .then((res) => res.json())
      .then((data) => {
        matchData = data;
      });
    this.evaluateResponse(matchData);
    return matchData ? matchData : null;
  }
}

module.exports = riotAPI;
