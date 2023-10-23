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
// import GameStateService from './GameStateService';
import Ai from './AiLogic';
import { getStartingIndexes, calcCellsRange } from './handlers';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gameState = new GameState();
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.cursors = cursors;
    this.selectedIndex = null;
    this.ai = new Ai(this.gamePlay);
  }

  init() {
    this.gamePlay.drawUi(this.gameState.theme);
    const allies = generateTeam([Bowman, Magician, Swordsman], 2, 3);
    const enemies = generateTeam([Daemon, Undead, Vampire], 2, 3);
    this.positionedCharacters = [];
    const { indexesForAllies: posForAl } = getStartingIndexes(this.gamePlay.boardSize);
    const { indexesForEnemies: posForEn } = getStartingIndexes(this.gamePlay.boardSize);
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
    this.gameState.chars = this.positionedCharacters;
    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.showTooltip = this.showTooltip.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.chooseCharacter = this.chooseCharacter.bind(this);
    this.moveCharacter = this.moveCharacter.bind(this);
    this.attackHandler = this.attackHandler.bind(this);
    this.startNewGame = this.startNewGame.bind(this);

    this.gamePlay.addCellEnterListener(this.showTooltip);
    this.gamePlay.addCellEnterListener(this.onCellEnter);

    this.gamePlay.addCellLeaveListener(this.hideTooltip);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);

    this.gamePlay.addCellClickListener(this.chooseCharacter);
    this.gamePlay.addCellClickListener(this.moveCharacter);
    this.gamePlay.addCellClickListener(this.attackHandler);

    this.gamePlay.addNewGameListener(this.startNewGame);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellEnter(index) {
    const activeCell = this.gamePlay.cells[index];
    const charInCell = activeCell.querySelector('.character');
    const allies = ['magician', 'bowman', 'swordsman'];
    const enemies = ['daemon', 'undead', 'vampire'];

    if (charInCell) {
      for (let i = 0; i < allies.length; i += 1) {
        if (charInCell.classList.contains(allies[i])) {
          this.gamePlay.setCursor(this.cursors.pointer);
        }
      }
    }

    if (!this.selectedIndex) return;

    const selectedChar = this.positionedCharacters.find((c) => c.position === this.selectedIndex);
    const moveRange = selectedChar.character.move;
    const attack = selectedChar.character.attackRange;

    const moveData = {
      boardSize: this.gamePlay.boardSize,
      index: this.selectedIndex,
      range: moveRange,
    };
    const attackData = {
      boardSize: this.gamePlay.boardSize,
      index: this.selectedIndex,
      range: attack,
    };

    const possibleMoves = calcCellsRange(moveData);
    const possibleAttack = calcCellsRange(attackData);

    for (const moveIndex of possibleMoves) {
      if (index === moveIndex && !charInCell) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(this.cursors.pointer);
      }
    }

    for (const attackIndex of possibleAttack) {
      if (index === attackIndex) {
        const char = this.gamePlay.cells[index].querySelector('.character');
        if (!char) return;
        const typeOfChar = char.classList[1];
        if (enemies.includes(typeOfChar)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(this.cursors.crosshair);
        }
      }
    }
  }

  onCellLeave(index) {
    const allies = ['magician', 'bowman', 'swordsman'];
    this.gamePlay.setCursor(this.cursors.auto);
    const char = this.gamePlay.cells[index].querySelector('.character');
    if (char) {
      const typeOfChar = char.classList[1];
      if (allies.includes(typeOfChar)) return;
    }
    this.gamePlay.deselectCell(index);
  }

  chooseCharacter(index) {
    const charInCell = this.gamePlay.cells[index].querySelector('.character');
    const playerTypes = ['magician', 'bowman', 'swordsman'];
    if (!charInCell) {
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
        if (this.selectedIndex) {
          this.gamePlay.deselectCell(this.selectedIndex);
        }
        this.gamePlay.selectCell(index);
        this.selectedIndex = index;
        return;
      }
    }
    if (!this.selectedIndex) {
      GamePlay.showError('Choose a character from your team');
    }
  }

  showTooltip(index) {
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

  hideTooltip(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  moveCharacter(index) {
    if (!this.gamePlay.cells[index].classList.contains('selected-green')) return;
    const activeChar = this.positionedCharacters.find((c) => c.position === this.selectedIndex);
    this.gamePlay.deselectCell(this.selectedIndex);
    activeChar.position = index;
    this.selectedIndex = index;
    this.gamePlay.selectCell(index);
    this.gameState.chars = this.positionedCharacters;
    this.gamePlay.redrawPositions(this.positionedCharacters);

    const renewedPositions = this.ai.act(this.positionedCharacters);
    this.positionedCharacters = renewedPositions;
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  attackHandler(index) {
    if (!this.gamePlay.cells[index].classList.contains('selected-red')) return;
    const enemies = ['daemon', 'undead', 'vampire'];
    const char = this.gamePlay.cells[index].querySelector('.character');
    if (!char) return;
    const typeOfChar = char.classList[1];
    if (!enemies.includes(typeOfChar)) return;
    const attacker = this.positionedCharacters.find((c) => c.position === this.selectedIndex);
    const { attack } = attacker.character;
    const target = this.positionedCharacters.find((c) => c.position === index);
    const targetInd = this.positionedCharacters.findIndex((c) => c.position === index);
    const { defence } = target.character;
    const damage = Math.max((attack - defence), attack * 0.1);
    this.gamePlay.showDamage(index, damage)
      .then(() => {
        target.character.health -= damage;
        if (target.character.health <= 0) {
          this.positionedCharacters.splice(targetInd, 1);
        }
        this.gamePlay.redrawPositions(this.positionedCharacters);
      });

    if (this.checkIfWon) {
      this.gameState.increaseLevel();
      this.gamePlay.drawUi(this.gameState.theme);
    }

    const renewedPositions = this.ai.act(this.positionedCharacters);
    if (this.checkIfLost()) {
      console.log('You lost');
    }
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  checkIfLost() {
    const allies = ['magician', 'bowman', 'swordsman'];
    for (const char of this.positionedCharacters) {
      if (!allies.includes(char.character.type)) {
        return true;
      }
    }
    return false;
  }

  checkIfWon() {
    const enemies = ['daemon', 'undead', 'vampire'];
    for (const char of this.positionedCharacters) {
      if (!enemies.includes(char.character.type)) {
        return true;
      }
    }
    return false;
  }

  startNewGame() {
    this.gameState.count = 0;
    this.init();
  }

  // saveGame() {
  //   this.game
  // }

  // loadGame() {

  // }
}
