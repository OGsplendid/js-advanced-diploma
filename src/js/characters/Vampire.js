import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.attack = 25;
    this.defence = 25;
    this.move = 2;
    this.attackRange = 2;
    this.health = 50;
    this.type = 'vampire';
  }
}
