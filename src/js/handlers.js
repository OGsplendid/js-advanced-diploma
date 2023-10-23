export function getStartingIndexes(boardSize) {
  const indexesForAllies = [];
  const indexesForEnemies = [];
  let restIndexes = [];
  for (let i = 0; i <= boardSize ** 2 - boardSize + 1; i += boardSize) {
    indexesForAllies.push(i);
  }
  restIndexes = indexesForAllies.map((index) => index + 1);
  indexesForAllies.push(...restIndexes);
  restIndexes = indexesForAllies.map((index) => index + boardSize - 2);
  indexesForEnemies.push(...restIndexes);
  return { indexesForAllies, indexesForEnemies };
}

export function calculateDeadCells(boardSize) {
  const deadCells = {
    left: [],
    right: [],
    top: [],
    bottom: [],
  };
  let restIndexes = [];
  for (let i = 0; i <= boardSize ** 2 - boardSize + 1; i += boardSize) {
    deadCells.left.push(i);
  }
  restIndexes = deadCells.left.map((index) => index + boardSize - 1);
  deadCells.right.push(...restIndexes);
  for (let i = 0; i < boardSize; i += 1) {
    deadCells.top.push(i);
  }
  for (let i = boardSize ** 2 - 1; i >= boardSize ** 2 - boardSize; i -= 1) {
    deadCells.bottom.push(i);
  }
  return deadCells;
}

export function calcCellsRange(obj) {
  const arr = [];
  const { boardSize, index, range } = obj;
  const {
    left, right, top, bottom,
  } = calculateDeadCells(boardSize);
  let tempIndex = index;

  for (let i = 0; i < range; i += 1) {
    tempIndex -= 1;
    if (!right.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex += 1;
    if (!left.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex -= boardSize;
    if (!bottom.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex += boardSize;
    if (!top.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex -= (boardSize + 1);
    if (!bottom.includes(tempIndex) && !right.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex -= (boardSize - 1);
    if (!bottom.includes(tempIndex) && !left.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex += (boardSize - 1);
    if (!top.includes(tempIndex) && !right.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  tempIndex = index;
  for (let i = 0; i < range; i += 1) {
    tempIndex += (boardSize + 1);
    if (!top.includes(tempIndex) && !left.includes(tempIndex)) {
      arr.push(tempIndex);
    } else {
      break;
    }
  }
  const result = arr.filter((number) => number >= 0 && number < boardSize ** 2);
  return result;
}

export function findEnemyIndexes(positionedCharacters) {
  const enemies = ['daemon', 'undead', 'vampire'];
  const indexesWithEnemy = [];
  positionedCharacters.forEach((char) => {
    if (enemies.includes(char.character.type)) {
      indexesWithEnemy.push(char.position);
    }
  });
  return indexesWithEnemy;
}
