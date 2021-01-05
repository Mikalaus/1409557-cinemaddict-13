import AbstractView from './abstract';
import {createElement} from '../util';

const createFilmCardTemplate = (film) => {

  const {
    id,
    title,
    rating,
    yearOfProduction,
    duration,
    genre,
    posterURL,
    description,
    commentsAmount} = film;

  return `
  <article class="film-card" id="${id}">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${yearOfProduction}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre.join(`, `)}</span>
    </p>
    <img src=${posterURL} alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > 140 ? description.substr(0, 139) + `...` : description}</p>
    <a class="film-card__comments">${commentsAmount} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>
  `;
};

export default class FilmCardView extends AbstractView {
  constructor(filmInfo, menu, updateWatchlist, updateHistory, updateFavourites) {
    super();
    this._menu = menu;
    this._filmInfo = filmInfo;
    this._callback.watchlist = updateWatchlist;
    this._callback.history = updateHistory;
    this._callback.favourites = updateFavourites;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmInfo);
  }


  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    this._setSortButtonsClickHandler();
    return this._element;
  }

  _setSortButtonsClickHandler() {
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, () => {

      if (this._filmInfo.isAddedToWatchlist) {
        this._filmInfo.isAddedToWatchlist = false;
      } else {
        this._filmInfo.isAddedToWatchlist = true;
      }

      this._callback.watchlist();
    });

    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, () => {

      if (this._filmInfo.isWatched) {
        this._filmInfo.isWatched = false;
      } else {
        this._filmInfo.isWatched = true;
      }

      this._callback.history();
    });

    this._element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, () => {

      if (this._filmInfo.isFavourite) {
        this._filmInfo.isFavourite = false;
      } else {
        this._filmInfo.isFavourite = true;
      }

      this._callback.favourites();
    });
  }
}
