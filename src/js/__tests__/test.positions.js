import Character from '../Character';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator, generateTeam } from '../generators';

test('should identify if constructor is an exception and throw an error', () => {
  expect(() => { const char = new Character(2); }).toThrow('Invalid action');
});

test('should return a character with proper values', () => {
  const char = new Daemon(1);
  expect(char.type).toBe('daemon');
  expect(char.attack).toBe(10);
  expect(char.defence).toBe(10);
  expect(char.health).toBe(50);
});

// test('should always return a new character', () => {
//   const allowedTypes = [Daemon, Undead, Vampire];
//   const maxLevel = 3;
//   const arr = [];
//   const generator = characterGenerator(allowedTypes, maxLevel);
//   for (let i = 0; i < 100; i += 1) {
//     arr.push(generator.next().value);
//   }
//   console.log(arr);
//   expect(arr).contain();
// });
