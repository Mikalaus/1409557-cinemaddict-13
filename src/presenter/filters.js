import MenuView from '../view/menu';
import FiltersModel from '../model/filters';

import {
  renderElement,
  RenderPosition
} from '../util';

import {
  SORT_BUTTON_CLASS,
  NAV_BUTTON_CLASS,
  FiltersList
} from '../const';

export default class FilterPresenter {
  constructor(MoviesModel, updateFilms) {
    this._filmModel = MoviesModel;
    this._filtersModel = new FiltersModel();
    this._globalFilters = new Map();
    this._localFilters = new Map();
    this._menu = new MenuView(MoviesModel.getFilms());
    this._container = document.querySelector(`.main`);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._defaultFilmList = this._filmModel.getFilms();
    this._setFilterSortFunction = this._setFilterSortFunction.bind(this);
    this.renderFilmList = updateFilms;
    this._previousSort = ``;
  }

  init() {
    renderElement(this._container, this._menu.getElement(), RenderPosition.AFTERBEGIN);
    this._navFilters = document.querySelectorAll(`.main-navigation__item`);

    this._globalFilters.set(`all movies`, [this._navFilters[0], Array.from]);
    this._globalFilters.set(`watchlist`, [this._navFilters[1], FiltersList.sortWatchlist]);
    this._globalFilters.set(`history`, [this._navFilters[2], FiltersList.sortHistory]);
    this._globalFilters.set(`favourites`, [this._navFilters[3], FiltersList.sortFavourites]);

    this._sortFilters = document.querySelectorAll(`.sort__button`);

    this._localFilters.set(`default`, [this._sortFilters[0], Array.from]);
    this._localFilters.set(`date`, [this._sortFilters[1], FiltersList.sortByDate]);
    this._localFilters.set(`rating`, [this._sortFilters[2], FiltersList.sortByRating]);

    /**
     * добавление функционала фильтрации
     */
    this._setFilters(this._globalFilters.values());
    this._setFilters(this._localFilters.values());

    this._previousFilter = Array.from;

    this._filmModel.setSortedFilms(this._previousFilter);
  }

  getMenu() {
    return this._menu;
  }

  _handleModelEvent() {
    this.renderFilmList(this._filtersModel.getFilter(), this._filmModel.getSortedFilms());
  }

  /**
   * функция навешивания обработчика на кнопки фильтрации с последующим рендером отфильтрованных карточек
   * @param {Object} filter - кнопка фильтрации
   * @param {function} sortFunc - функция сортировки
   * @param {array} filmList
   */
  _setFilterSortFunction(filter, sortFunc) {
    filter.addEventListener(`click`, (evt) => {
      this._sortFunc = sortFunc;
      evt.preventDefault();
      this._defaultSortClass = filter.classList.item(0);
      this._previousSort = document.querySelector(`.${this._defaultSortClass}--active`);
      if (this._previousSort !== filter) {
        document.querySelector(`.${this._defaultSortClass}--active`).classList.remove(`${this._defaultSortClass}--active`);
        filter.classList.add(`${this._defaultSortClass}--active`);
        if (`${this._defaultSortClass}` === NAV_BUTTON_CLASS) {
          this._previousFilter = sortFunc;
          this._filmModel.setSortedFilms(this._sortFunc);
          this._resetDefaultSorting();
        }
      }
      this._filtersModel.setFilter(sortFunc);
    });
  }

  // функция для сброса сортировки при глобальной фильтрации
  _resetDefaultSorting() {
    document.querySelector(`.${SORT_BUTTON_CLASS}--active`).classList.remove(`${SORT_BUTTON_CLASS}--active`);
    document.querySelector(`.${SORT_BUTTON_CLASS}`).classList.add(`${SORT_BUTTON_CLASS}--active`);
  }

  /**
   * функция добавляющяя возможность фильтровать карточки путем изменения способа фильтрации из меню
   * @param {array} filters - Map фильтров
   * @param {array} filmList
   */
  _setFilters(filters) {
    for (let filter of filters) {
      this._setFilterSortFunction(filter[0], filter[1]);
    }
  }
}
