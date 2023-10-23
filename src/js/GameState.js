// import themes from './themes';

export default class GameState {
  constructor() {
    this.themes = ['prairie', 'desert', 'arctic', 'mountain'];
    this.count = 0;
    this.chars = [];
    this.theme = this.themes[this.count];
  }

  set chars(chars) {
    this._chars = chars;
  }

  get chars() {
    return this._chars;
  }

  set theme(theme) {
    this._theme = theme;
  }

  get theme() {
    return this._theme;
  }

  increaseLevel() {
    this.count += 1;
    if (this.count === this.themes.length) {
      this.count = 0;
    }
    this.theme = this.themes[this.count];
  }

  // switchTurn() {
  //   if (this.state.turn === true) {
  //     this.state.turn = false;
  //   } else {
  //     this.state.turn = true;
  //   }
  //   // this.state.turn === true ? this.state.turn = false : this.state.turn = true;
  // }

  // static from(object) {
  //   const state = {
  //     theme: object.theme,
  //     characters: object.characters,
  //     turn: object.turn,
  //   };
  //   this.gamePlay.drawUi(object.theme);
  //   this.gamePlay.redrawPositions(object.characters);
  //   return null;
  // }
}
