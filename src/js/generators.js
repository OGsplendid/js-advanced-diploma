import Team from './Team';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const index = Math.floor(Math.random() * allowedTypes.length);
  const level = Math.floor(Math.random() * maxLevel + 1);
  yield new (allowedTypes[index])(level);
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземп персонажей. Кол-во персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const actualCharacters = [];
  for (let i = 0; i < characterCount; i += 1) {
    const playerGenerator = characterGenerator(allowedTypes, maxLevel);
    const newChar = playerGenerator.next().value;
    actualCharacters.push(newChar);
  }
  actualCharacters.forEach((char) => {
    if (char.level > 1) {
      char.levelUp(char.level);
    }
  });
  return new Team(actualCharacters);
}
