import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.attack = 40;
    this.defence = 10;
    this.move = 4;
    this.attackRange = 1;
    this.health = 50;
    this.type = 'undead';
  }
}
