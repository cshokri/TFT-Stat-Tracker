const fetch = require("node-fetch");
const fs = require("fs");

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

    this.matchHistory;
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
    return this.iconId;
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

    this.matchHistory = [];
    let matches = [];
    for (const matchId of matchIds) {
      let matchData = await this.getMatchData(matchId);
      matches.push(matchData);
      if (matchData["match_type"] == "Ranked" || true) {
        this.matchHistory.push([matchData.units, matchData.placement]);
      }
    }

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

    let playerMatchInfo;

    const participants = matchData.info.participants;
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].puuid == this.puuid){
        // Get match type
        let matchType = "Normal";
        let queue_id = matchData.info.queue_id;
        if (queue_id == 1100) {
          matchType = "Ranked";
        }

        // Get date match was played
        let unixTime = matchData.info.game_datetime;
        let date = new Date(unixTime);

        let datePlayed = date.toLocaleDateString();
        participants[i].units = this.sortUnits(participants[i].units).reverse();
        playerMatchInfo = participants[i];
        playerMatchInfo["match_type"] = matchType;
        playerMatchInfo["date"] = datePlayed;
      }
    }

    return playerMatchInfo ? playerMatchInfo : null;
  }

  // Find the most played comps then returns the carries of those comps
  getMostPlayed(maxComps = 1) {
    const compMatchThreshold = 0.7;
    let comps = [];

    for (const match of this.matchHistory) {
      const matchUnits = match[0];
      const matchPlacement = match[1];
      if (comps.length < 1) {
        comps.push([this.getUnitsFromMatch(matchUnits), [[matchPlacement], 1]]);
        continue;
      }

      // Percentage of units that match a recorded comp
      let closestCompMatch = 0;
      // Index of the comp in the comp array
      let currentCompIndex = -1;
      // {Name: [itemId, etc.], etc.} info on all the units in the current closest comp
      let unitData = {};

      // Go through all currently found comps and compare
      // the current match to those comps and if they are
      // a close match then record their items and the units that didn't match
      for (let i = 0; i < comps.length; i++) {
        let currentCompCount = 0;
        let tempUnitData = {};

        for (const unit of matchUnits) {
          if (unit.character_id in comps[i][0]) {
            currentCompCount += 1;
          }
          tempUnitData[unit.character_id] = unit.items.slice();
        }

        const percentMatch = currentCompCount / matchUnits.length;
        if (percentMatch > compMatchThreshold && percentMatch > closestCompMatch) {
          closestCompMatch = percentMatch;
          unitData = tempUnitData;
          currentCompIndex = i;
        }
      }

      // If the comp is already know then
      // go through that comp and increment the repeating items
      // or if the item has never been built on that unit before, add it
      if (currentCompIndex != -1) { // Comp already exists
        comps[currentCompIndex][1][0].push(matchPlacement);
        comps[currentCompIndex][1][1] += 1;
        // Check every unit in the new matching comp
        for (const unitName in unitData) {
          // If the current unit is in the matching comp then check items
          if (unitName in comps[currentCompIndex][0]) {
            // Check every item on this current unit
            for (const itemId of unitData[unitName]) {
              // If the current unit has the item, increment, else add it
              if (itemId in comps[currentCompIndex][0][unitName]) {
                comps[currentCompIndex][0][unitName][itemId] += 1;
              } else {
                comps[currentCompIndex][0][unitName][itemId] = 0;
              }
            }
          } else { // If current unit is not in this comp then add it
            comps[currentCompIndex][0][unitName] = this.formatUnitItems(unitData[unitName]);
          }
        }
      } else { // New comp
        comps.push([this.getUnitsFromMatch(matchUnits), [[matchPlacement], 1]]);
      }
    }
    // Sort the comps by most played
    comps = this.sortComps(comps).reverse();

    let compCarries = [];
    // Find the carry in each identified comp
    for (let compIndex = 0; compIndex < comps.length; compIndex++) {
      if (compIndex < maxComps) {
        let topUnitName = "";
        let topUnitItems = [];
        let mostRepeatingItems = 0;

        let frequentUnit = "";
        let frequentUnitItems = [];
        let mostFrequentItems = 0;

        // Check each unit to see which one has the most items
        for (const unit in comps[compIndex][0]) {
          let numberOfItems = 0;
          let numberOfRepeatingItems = 0;
          for (const item in comps[compIndex][0][unit]) {
            numberOfItems += 1;
            numberOfRepeatingItems += comps[compIndex][0][unit][item];  
          }
          
          let currentItems = [];

          if (numberOfRepeatingItems > mostRepeatingItems || numberOfItems > mostFrequentItems) {
            for (let itemCount = 0; itemCount < 3; itemCount++) {
              let bestItemCount = 0;
              let bestItem = 0;
              for (const item in comps[compIndex][0][unit]) {
                if (!currentItems.includes(item)) {
                  if (comps[compIndex][0][unit][item] >= bestItemCount) {
                    bestItemCount = comps[compIndex][0][unit][item];
                    bestItem = item;
                  }
                }
              }
              currentItems.push(bestItem);
            }
          }
          
          if (numberOfRepeatingItems > mostRepeatingItems) {
            topUnitName = unit;
            topUnitItems = currentItems;
            mostRepeatingItems = numberOfRepeatingItems;
          }

          if (numberOfItems > mostFrequentItems) {
            frequentUnit = unit;
            frequentUnitItems = currentItems;
            mostFrequentItems = numberOfItems;
          }
        }

        if (topUnitName == "") {
          topUnitName = frequentUnit;
          topUnitItems = frequentUnitItems;
        }

        let wins = comps[compIndex][1][0].filter(placement => placement <= 4).length;
        let losses = comps[compIndex][1][0].length - wins;
  
        const carry = {
          name: topUnitName.split("_")[1],
          items: topUnitItems,
          wins: wins,
          losses: losses,
        }

        compCarries.push(carry);
      }
    }

    return compCarries;
  }

  // Takes an array of units and turns it into {unitName: {itemId: 0, etc.}, etc.}
  getUnitsFromMatch(match) {
    let units = {};
    for (const unit of match) {
      units[unit.character_id] = this.formatUnitItems(unit.items);
    }
    return units;
  }

  // Takes an array of item ids and turns it into {itemId: 0, etc.}
  formatUnitItems(items) {
    let itemCounts = {};
    for (const item of items) {
      itemCounts[item] = 0;
    }
    return itemCounts;
  }

  // Sorts comps by the number of times its been played
  sortComps(comps) {
    let len = comps.length - 1;
    let checked;
    do {
        checked = false;
        for (let i = 0; i < len; i++) {
            if (comps[i][1][1] > comps[i + 1][1][1]) {
                let tmp = comps[i];
                comps[i] = comps[i + 1];
                comps[i + 1] = tmp;
                checked = true;
            }
        }
    } while (checked);
    return comps;
  }

  // Sorts the given units by star rating
  sortUnits(units) {
    let len = units.length - 1;
    let checked;
    do {
        checked = false;
        for (let i = 0; i < len; i++) {
            if (units[i]["tier"] > units[i + 1]["tier"]) {
                let tmp = units[i];
                units[i] = units[i + 1];
                units[i + 1] = tmp;
                checked = true;
            }
        }
    } while (checked);
    return units;
  }

}

module.exports = riotAPI;
