import themes from './themes';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    const allies = generateTeam(['Bowman', 'Magician', 'Swordsman'], 2, 3);
    const enemies = generateTeam(['Daemon', 'Undead', 'Vampire'], 2, 3);
    const positionedAllies = [];
    const positionedEnemies = [];
    for (let i = 0; i < allies.length; i += 1) {
      positionedAllies.push(PositionedCharacter(allies[i]));
      positionedEnemies.push(PositionedCharacter(enemies[i]));
    }
    this.gamePlay.redrawPositions(positionedAllies);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  // onCellClick(index) {
  //   // TODO: react to click
  // }

  // onCellEnter(index) {
  //   // TODO: react to mouse enter
  // }

  // onCellLeave(index) {
  //   // TODO: react to mouse leave
  // }
}
