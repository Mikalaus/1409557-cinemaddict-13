import AbstractView from './abstract';
import {createElement, parseRuntimeToString} from '../util';

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
    commentsAmount,
    isWatched,
    isAddedToWatchlist,
    isFavourite
  } = film;

  return `
  <article class="film-card" id="${id}">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${yearOfProduction}</span>
      <span class="film-card__duration">${parseRuntimeToString(duration)}</span>
      <span class="film-card__genre">${genre.join(`, `)}</span>
    </p>
    <img src=${posterURL} alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > 140 ? description.substr(0, 139) + `...` : description}</p>
    <a class="film-card__comments">${commentsAmount} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${isAddedToWatchlist ? `film-card__controls-item--active` : ``} button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${isWatched ? `film-card__controls-item--active` : ``} button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${isFavourite ? `film-card__controls-item--active` : ``} button film-card__controls-item--favorite" type="button">Mark as favorite</button>
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
    this._addToWatchButton = null;
    this._addToHistoryButton = null;
    this._addFavouritesButton = null;
    this._activeButtonClass = `film-card__controls-item--active`;
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

  _setSortButtons() {
    this._addToWatchButton = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
    this._addToHistoryButton = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
    this._addFavouritesButton = this._element.querySelector(`.film-card__controls-item--favorite`);
  }

  _setSortButtonsClickHandler() {
    this._setSortButtons();

    this._addToWatchButton.addEventListener(`click`, () => {

      this._filmInfo.isAddedToWatchlist = !this._filmInfo.isAddedToWatchlist;
      this._addToWatchButton.classList.toggle(this._activeButtonClass);
      this._callback.watchlist();
    });

    this._addToHistoryButton.addEventListener(`click`, () => {

      this._filmInfo.isWatched = !this._filmInfo.isWatched;
      this._addToHistoryButton.classList.toggle(this._activeButtonClass);
      this._callback.history();
    });

    this._addFavouritesButton.addEventListener(`click`, () => {

      this._filmInfo.isFavourite = !this._filmInfo.isFavourite;

      this._addFavouritesButton.classList.toggle(this._activeButtonClass);
      this._callback.favourites();
    });
  }
}
