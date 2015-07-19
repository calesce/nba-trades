import * as types from '../constants/ActionTypes';

export function handleFetch(teams) {
  return {
    type: types.FETCH_NBA_DATA,
    teams
  };
}

export function selectTeam(teamName, teamNumber) {
  return {
    type: types.SELECT_TEAM,
    teamName,
    teamNumber
  };
}

export function addTeam() {
  return {
    type: types.ADD_TEAM
  };
}

export function removeTeam(teamNumber) {
  return {
    type: types.REMOVE_TEAM,
    teamNumber
  };
}

export function addPlayer(player, teamName) {
  return {
    type: types.ADD_PLAYER,
    player,
    teamName
  };
}

export function removePlayer(player) {
  return {
    type: types.REMOVE_PLAYER,
    player
  };
}
