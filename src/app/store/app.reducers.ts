import { PLAYER_A, PLAYER_B, GAME_OFF, GAME_ON } from "./../app.types";
import * as AppActions from "./app.actions";
import { AppState } from "./app-state.model";

const initialState = new AppState();

export function AppReducers(
  state = initialState,
  action: AppActions.AppActionsTypes
) {
  switch (action.type) {
    case AppActions.SET_CELL:
      const matrix = state.matrix;
      matrix[action.xPos][action.yPos] = state.currentPlayer;
      return {
        ...state,
        matrix: matrix
      };
    case AppActions.TOGGLE_PLAYER:
      if (state.status !== GAME_ON) {
        return state;
      }
      const nextUser = state.currentPlayer === PLAYER_A ? PLAYER_B : PLAYER_A;
      const turnStatement =
        nextUser === PLAYER_A ? "მოთამაშე 1-ის ჯერია!" : "მოთამაშე 2-ის ჯერია!";
      return {
        ...state,
        winnerStatement: turnStatement,
        currentPlayer: nextUser
      };
    case AppActions.SET_WINNER:
      const stats = state.stats[action.winner];
      const winnerStatement =
        "Player " + (action.winner === PLAYER_A ? "1-მა" : "2-მა") + " მოიგო!";
      stats.won = stats.won + 1;
      return {
        ...state,
        status: GAME_OFF,
        winnerStatement: winnerStatement,
        stats: {
          ...state.stats,
          [action.winner]: stats
        }
      };
    case AppActions.SET_DRAW:
      return {
        ...state,
        status: GAME_OFF,
        winnerStatement: "ეს ფრეა ძმაო!",
        stats: { ...state.stats, draw: state.stats.draw + 1 }
      };

    case AppActions.NEW_GAME:
      const newState = new AppState();
      const newMatrix = newState.matrix;
      return {
        ...state,
        currentPlayer: PLAYER_A,
        status: GAME_ON,
        matrix: newMatrix,
        winnerStatement: "პირველი მოთამაშის ჯერია, ასე რომ წარმატებები",
        stats: {
          ...state.stats,
          [PLAYER_A]: { ...state.stats[PLAYER_A], time: 0 },
          [PLAYER_B]: { ...state.stats[PLAYER_B], time: 0 }
        }
      };

    case AppActions.ADD_TIME:
      if (state.status !== GAME_ON) {
        return state;
      }
      return {
        ...state,
        stats: {
          ...state.stats,
          [state.currentPlayer]: {
            ...state.stats[state.currentPlayer],
            time: state.stats[state.currentPlayer].time + 1
          }
        }
      };
  }
  return state;
}
