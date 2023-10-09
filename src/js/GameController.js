import themes from './themes';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import cursors from './cursors';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.cursors = cursors;

    // this.onCellEnter = this.onCellEnter.bind(this);
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    const allies = generateTeam([Bowman, Magician, Swordsman], 2, 3);
    const enemies = generateTeam([Daemon, Undead, Vampire], 2, 3);
    this.positionedCharacters = [];
    const posForAl = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const posForEn = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    for (let i = 0; i < allies.characters.length; i += 1) {
      const index = Math.floor(Math.random() * (16 - i));
      const index2 = Math.floor(Math.random() * (16 - i));
      this.positionedCharacters
        .push(new PositionedCharacter(allies.characters[i], posForAl[index]));
      this.positionedCharacters
        .push(new PositionedCharacter(enemies.characters[i], posForEn[index2]));
      posForAl.splice(index, 1);
      posForEn.splice(index2, 1);
    }
    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    // this.onMouseLeave = this.onMouseLeave.bind(this);

    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.cells.forEach((cell) => cell.addEventListener('mouseover', this.onMouseOver));
    // this.gamePlay.cells.forEach((cell) => cell.addEventListener('mouseover', this.onMouseLeave));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  // getAvailableIndexes(index) {
  //   const left = 
  // }

  onMouseOver(e) {
    const allies = ['magician', 'bowman', 'swordsman'];
    const enemies = ['daemon', 'undead', 'vampire'];
    for (let i = 0; i < allies.length; i += 1) {
      if (e.target.classList.contains(allies[i])) {
        this.gamePlay.setCursor(this.cursors.pointer);
      }
    }
    if (!e.target.classList.contains('character')) {
      this.gamePlay.setCursor(this.cursors.auto);
    }
  }

  onCellClick(index) {
    const playerTypes = ['magician', 'bowman', 'swordsman'];
    if (!this.gamePlay.cells[index].querySelector('.character')) {
      return;
    }
    let actualCharacterType;
    for (const character of this.positionedCharacters) {
      if (character.position === index) {
        actualCharacterType = character.character.type;
      }
    }
    for (let i = 0; i < playerTypes.length; i += 1) {
      if (actualCharacterType === playerTypes[i]) {
        this.gamePlay.selectCell(index);
        return;
      }
    }
    GamePlay.showError('Choose a character from your team');
  }

  onCellEnter(index) {
    if (!this.gamePlay.cells[index].querySelector('.character')) {
      return;
    }
    const message = this.getCharacterInfo(index);
    this.gamePlay.showCellTooltip(message, index);
  }

  getCharacterInfo(index) {
    let info;
    for (const character of this.positionedCharacters) {
      if (character.position === index) {
        info = `🎖${character.character.level}⚔${character.character.attack}🛡${character.character.defence}❤${character.character.health}`;
      }
    }
    return info;
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }
}
