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

import StatsView from '../view/stats';

export default class MenuPresenter {
  constructor(MoviesModel, updateFilms, userStats) {
    this._filmModel = MoviesModel;
    this._userStatsView = userStats;
    this._stats = new StatsView(this._userStatsView.getRank(), this._filmModel);
    this._filtersModel = new FiltersModel();
    this._globalFilters = new Map();
    this._localFilters = new Map();
    this._statsClickHandler = this._statsClickHandler.bind(this);
    this._menu = new MenuView(MoviesModel.getFilms(), this._stats, this._statsClickHandler);
    this._container = document.querySelector(`.main`);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._defaultFilmList = this._filmModel.getFilms();
    this._setFilterSortFunction = this._setFilterSortFunction.bind(this);
    this.renderFilmList = updateFilms;
    this._previousSort = ``;
    this._defaultSortClass = `main-navigation__item`;
  }

  init(filmsContainers) {
    renderElement(this._container, this._menu.getElement(), RenderPosition.AFTERBEGIN);
    this._navFilters = document.querySelectorAll(`.main-navigation__item`);
    this._sortFilters = document.querySelectorAll(`.sort__button`);

    const FiltersDictionary = {
      ALL: this._navFilters[0],
      WATCHLIST: this._navFilters[1],
      HISTORY: this._navFilters[2],
      FAVOURITES: this._navFilters[3],
      DEFAULT: this._sortFilters[0],
      DATE: this._sortFilters[1],
      RATING: this._sortFilters[2]
    };

    this._globalFilters.set(`all movies`, [FiltersDictionary.ALL, Array.from]);
    this._globalFilters.set(`watchlist`, [FiltersDictionary.WATCHLIST, FiltersList.sortWatchlist]);
    this._globalFilters.set(`history`, [FiltersDictionary.HISTORY, FiltersList.sortHistory]);
    this._globalFilters.set(`favourites`, [FiltersDictionary.FAVOURITES, FiltersList.sortFavourites]);

    this._localFilters.set(`default`, [FiltersDictionary.DEFAULT, Array.from]);
    this._localFilters.set(`date`, [FiltersDictionary.DATE, FiltersList.sortByDate]);
    this._localFilters.set(`rating`, [FiltersDictionary.RATING, FiltersList.sortByRating]);

    /**
     * добавление функционала фильтрации
     */
    this._setFilters(this._globalFilters.values());
    this._setFilters(this._localFilters.values());

    this._previousFilter = Array.from;

    this._filmModel.setSortedFilms(this._previousFilter);

    this._filmsContainers = filmsContainers;
  }

  getMenu() {
    return this._menu;
  }

  _handleModelEvent() {
    this.renderFilmList(this._filtersModel.getFilter(), this._filmModel.getSortedFilms());
  }

  _statsClickHandler() {
    this._defaultSortClass = `main-navigation__item`;
    this._menu._element.querySelector(`.sort`).classList.add(`visually-hidden`);
    renderElement(this._menu._element, this._stats.getElement(), RenderPosition.BEFOREEND);
    this._filmsContainers.forEach((container) => {
      container.classList.add(`visually-hidden`);
    });
    this._stats.setChart();
    document.querySelector(`.${this._defaultSortClass}--active`).classList.remove(`${this._defaultSortClass}--active`);
    this._menu._element.querySelector(`a[href="#stats"]`).classList.add(`main-navigation__additional--active`);
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

        if (this._previousSort) {
          this._previousSort.classList.remove(`${this._defaultSortClass}--active`);
        }

        filter.classList.add(`${this._defaultSortClass}--active`);

        if (`${this._defaultSortClass}` === NAV_BUTTON_CLASS) {

          this._previousFilter = sortFunc;
          this._filmModel.setSortedFilms(this._sortFunc);
          this._resetDefaultSorting();

          if (this._stats._element) {

            this._stats.destroy();

            this._filmsContainers.forEach((container) => {
              container.classList.remove(`visually-hidden`);
              document.querySelector(`a[href="#stats"]`).classList.remove(`main-navigation__additional--active`);
            });

            this._menu._element.querySelector(`.sort`).classList.remove(`visually-hidden`);
          }

        } else {
          this._filmModel.setSortedFilms(this._sortFunc);
        }
      }
      this._filtersModel.setFilter(this._sortFunc);
    });
  }

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
    for (const filter of filters) {
      this._setFilterSortFunction(filter[0], filter[1]);
    }
  }
}
