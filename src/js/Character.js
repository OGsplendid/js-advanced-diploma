/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target === Character) {
      throw new Error('Invalid action');
    }
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }

  levelUp(level = 1) {
    for (let i = 1; i < level; i += 1) {
      this.improveAttack();
      this.improveDefence();
      this.heal();
    }
  }

  heal() {
    this.health += 80;
    if (this.health > 100) {
      this.health = 100;
    }
  }

  improveAttack() {
    this.attack = Math.max(this.attack, Math.floor(this.attack * ((80 + this.health) / 100)));
  }

  improveDefence() {
    this.defence = Math.max(this.defence, Math.floor(this.defence * ((80 + this.health) / 100)));
  }
}
