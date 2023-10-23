import { findEnemyIndexes, calcCellsRange } from './handlers';

export default class Ai {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
  }

  act(positionedCharacters) {
    const allies = ['magician', 'bowman', 'swordsman'];
    const indexes = findEnemyIndexes(positionedCharacters);
    const tempIndex = Math.floor(Math.random() * indexes.length);
    const activeEnemyIndex = indexes[tempIndex];
    const activeEnemy = positionedCharacters.find((c) => c.position === activeEnemyIndex);
    const { attackRange } = activeEnemy.character;
    const attackData = {
      boardSize: this.gamePlay.boardSize,
      index: activeEnemyIndex,
      range: attackRange,
    };
    const moveRange = activeEnemy.character.move;
    const moveData = {
      boardSize: this.gamePlay.boardSize,
      index: activeEnemyIndex,
      range: moveRange,
    };

    const possibleAttackRange = calcCellsRange(attackData);
    const possibleMoveRange = calcCellsRange(moveData);

    for (let i = 0; i < possibleAttackRange.length; i += 1) {
      const ally = this.gamePlay.cells[possibleAttackRange[i]].querySelector('.character');

      if (ally && allies.includes(ally.classList[1])) {
        const allyIn = positionedCharacters.findIndex((c) => c.position === possibleAttackRange[i]);
        const activeAlly = positionedCharacters[allyIn];
        console.log(activeEnemy, activeAlly);
        const { attack } = activeEnemy.character;
        const { defence } = activeAlly.character;
        const damage = Math.max((attack - defence), attack * 0.1);
        this.gamePlay.showDamage(activeAlly.position, damage)
          .then(() => {
            activeAlly.character.health -= damage;
            if (activeAlly.character.health <= 0) {
              positionedCharacters.splice(allyIn, 1);
            }
            this.gamePlay.redrawPositions(positionedCharacters);
          });
        return positionedCharacters;
      }
    }

    const newPosition = this.findProperMoveIndex(possibleMoveRange);
    activeEnemy.position = possibleMoveRange[newPosition];

    return positionedCharacters;
  }

  findProperMoveIndex(range) {
    const newPositionIndex = Math.floor(Math.random() * range.length);
    const newPosition = range[newPositionIndex];
    if (this.gamePlay.cells[newPosition].querySelector('.character')) {
      this.findProperMoveIndex(range);
    }
    return newPositionIndex;
  }
}
