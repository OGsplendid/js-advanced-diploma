import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.attack = 10;
    this.defence = 40;
    this.move = 1;
    this.attackRange = 4;
    this.health = 50;
    this.type = 'magician';
  }
}
