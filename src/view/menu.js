import AbstractView from './abstract';
import {sortFavourites, sortHistory, sortWatchlist} from '../mocs/filter.js';
import {createElement} from '../util';


const createMenuTemplate = (filmList) => {
  const watchlist = sortWatchlist([...filmList]).length;
  const history = sortHistory([...filmList]).length;
  const favourites = sortFavourites([...filmList]).length;

  return `
  <div>
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favourites}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>

    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>
  </div>
  `;
};

export default class MenuView extends AbstractView {
  constructor(filmList) {
    super();
    this._filmList = filmList;
    this._activeClass = `main-navigation__item--active`;
  }

  getTemplate() {
    return createMenuTemplate(this._filmList);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._addWatchlistButton = this._element.querySelector(`a[href="#watchlist"] span`);
      this._addHistoryListButton = this._element.querySelector(`a[href="#history"] span`);
      this._addFavouriteListButton = this._element.querySelector(`a[href="#favorites"] span`);
    }

    return this._element;
  }
}
