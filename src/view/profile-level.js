import {MOVIE_BUFF_RANK, FAN_RANK} from '../const';
import Smart from './smart';
import {createElement} from '../util';

const createProfileLevelTemplate = (movies, rank) => {

  let template = ``;

  if (movies > 0) {
    template = `
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
    `;
  } else {
    template = `
    <section class="header__profile profile">
    </section>
    `;
  }

  return template;
};

export default class ProfileLevelView extends Smart {

  constructor(moviesAmount) {
    super();
    this._moviesAmount = moviesAmount;
    this._rank = `novice`;
  }

  getTemplate() {
    return createProfileLevelTemplate(this._moviesAmount, this.getRank());
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  setMoviesAmount(moviesAmount) {
    this._moviesAmount = moviesAmount;
  }

  getRank() {
    if (this._moviesAmount > FAN_RANK && this._moviesAmount < MOVIE_BUFF_RANK) {
      this._rank = `fan`;
    } else if (this._moviesAmount >= MOVIE_BUFF_RANK) {
      this._rank = `movie buff`;
    } else {
      this._rank = `novice`;
    }

    return this._rank;
  }

  restoreHandlers() {
    return;
  }
}
