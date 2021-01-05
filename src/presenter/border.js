import {
  FilmListLimit,
  TOP_RATED,
  MOST_COMMENTED,
  SORT_BUTTON_CLASS,
  NAV_BUTTON_CLASS,
  FILMS_LIMIT,
  DEFAULT_RENDER_INDEX,
  PopupMode
} from '../const';

import {
  renderElement,
  RenderPosition
} from '../util';

import {
  sortByDate,
  sortFavourites,
  sortByRating,
  sortHistory,
  sortWatchlist,
  sortByComments
} from '../mocs/filter';

import {moviesAmount} from '../mocs/rating-and-stats';
import {generateFilmCards} from '../mocs/films';
import ListExtraView from '../view/list--extra';
import MenuView from '../view/menu';
import ProfileLevelView from '../view/profile-level';
import FilmCardView from '../view/card';
import ListView from '../view/list';
import PopupView from '../view/popup';
import ShowMoreButtonView from '../view/show-more-button';
import MoviesStatsView from '../view/movies-stats';
import FilmsView from '../view/films';

export default class BoardPresenter {
  constructor() {
    /**
     * массив с информацией о карточках с фильмами
     */
    this._generatedFilmCards = generateFilmCards(FILMS_LIMIT);

    /**
     * сохранение сгенерированного массива данных в отдельный блок, для сохранения информации при фильтрации
     */
    this._filteredFilmCards = [...this._generatedFilmCards];

    this._body = document.querySelector(`body`);
    this._header = document.querySelector(`.header`);
    this._main = document.querySelector(`.main`);
    this._footer = document.querySelector(`.footer`);

    this._filmList = new ListView(this._generatedFilmCards);
    this._topRated = new ListExtraView(TOP_RATED);
    this._mostCommented = new ListExtraView(MOST_COMMENTED);

    this._films = null;

    this._filmsList = null;
    this._extraFilmsList = null;

    this._navFilters = null;
    this._sortFilters = null;

    this._globalFilters = new Map();

    this._localFilters = new Map();

    this._popupMode = PopupMode.CLOSED;

    // переменная для сохранения в нее функции предыдущей фильтрации для локальных фильтров
    this._previousFilter = Array.from;

    this._filmListClickHandler = this._filmListClickHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init() {
    /**
     * рендер основной разметки
     */
    renderElement(this._main, new FilmsView().getElement(), RenderPosition.BEFOREEND);
    this._films = this._main.querySelector(`.films`);
    renderElement(this._header, new ProfileLevelView(sortHistory([...this._generatedFilmCards]).length).getElement(), RenderPosition.BEFOREEND);
    renderElement(this._main, new MenuView(this._filteredFilmCards).getElement(), RenderPosition.AFTERBEGIN);
    renderElement(this._films, this._filmList.getElement(), RenderPosition.AFTERBEGIN);

    if (this._generatedFilmCards.length) {
      renderElement(this._films, this._topRated.getElement(), RenderPosition.BEFOREEND);
      renderElement(this._films, this._mostCommented.getElement(), RenderPosition.BEFOREEND);
    }
    renderElement(this._footer, new MoviesStatsView(moviesAmount).getElement(), RenderPosition.BEFOREEND);

    this._filmsList = this._main.querySelector(`.films-list`);
    this._extraFilmsList = this._main.querySelectorAll(`.films-list--extra`);

    this._navFilters = document.querySelectorAll(`.main-navigation__item`);

    this._globalFilters.set(`all movies`, [this._navFilters[0], Array.from]);
    this._globalFilters.set(`watchlist`, [this._navFilters[1], sortWatchlist]);
    this._globalFilters.set(`history`, [this._navFilters[2], sortHistory]);
    this._globalFilters.set(`favourites`, [this._navFilters[3], sortFavourites]);

    this._sortFilters = document.querySelectorAll(`.sort__button`);

    this._localFilters.set(`default`, [this._sortFilters[0], Array.from]);
    this._localFilters.set(`date`, [this._sortFilters[1], sortByDate]);
    this._localFilters.set(`rating`, [this._sortFilters[2], sortByRating]);

    /**
     * рендер изначальных фильмов в разметку
     */
    this._renderFilmList(this._extraFilmsList[1], FilmListLimit.EXTRA, sortByComments([...this._generatedFilmCards]));
    this._renderFilmList(this._extraFilmsList[0], FilmListLimit.EXTRA, sortByRating([...this._generatedFilmCards]));
    this._renderFilmList(this._filmsList, FilmListLimit.DEFAULT, this._filteredFilmCards);

    this._filmList.setContainerClickHandler(this._filmListClickHandler);
    this._topRated.setContainerClickHandler(this._filmListClickHandler);
    this._mostCommented.setContainerClickHandler(this._filmListClickHandler);

    /**
     * добавление функционала фильтрации
     */
    this._setFilters(this._globalFilters.values(), [...this._generatedFilmCards]);
    this._setFilters(this._localFilters.values(), this._filteredFilmCards);

    this._checkNeedRenderShowMore(this._filteredFilmCards.length);
  }

  /**
   * рендер карточек фильмов в различных блоках
   * @param {Object} filmList - передаваемый блок
   * @param {Number} limit - лимит карточек
   * @param {Array} cardsList - массив отображаемых карточек
   * @param {Number} indexElement - передаваемое значение индекса с которого должен начинаться рендер
   */
  _renderFilmList(filmList, limit, cardsList, indexElement = 0) {
    for (let i = 0; i < limit && indexElement < cardsList.length; i++) {
      renderElement(filmList.querySelector(`.films-list__container`), new FilmCardView(cardsList[indexElement]).getElement(), RenderPosition.BEFOREEND);
      indexElement++;
    }
  }

  /**
   * удаление showMoreButton
   */
  _deleteShowMoreButton() {
    const showMoreButton = document.querySelector(`.films-list__show-more`);
    if (showMoreButton) {
      showMoreButton.remove();
    }
  }

  _showMoreButtonClickHandler(renderedCards, indexElement) {
    return () => {
      if (this._filteredFilmCards.length >= renderedCards) {
        this._renderFilmList(this._filmsList, FilmListLimit.DEFAULT, this._filteredFilmCards, indexElement);
        renderedCards += FilmListLimit.DEFAULT;
        indexElement += FilmListLimit.DEFAULT;
      }

      if (this._filteredFilmCards.length <= renderedCards) {
        document.querySelector(`.films-list__show-more`).remove();
        renderedCards = FilmListLimit.DEFAULT;
        indexElement = 0;
      }
    };
  }

  /**
   * рендер кнопки показа других объявлений, и навешивание на нее обработчика
   * @param {function} handler - handler для обработчика клика
   */
  _renderShowMoreButton() {

    this._deleteShowMoreButton();

    const showMore = new ShowMoreButtonView();

    renderElement(this._filmsList, showMore.getElement(), RenderPosition.BEFOREEND);

    showMore.setClickHandler(this._showMoreButtonClickHandler(FilmListLimit.DEFAULT, DEFAULT_RENDER_INDEX));
  }

  /**
   * проверяет необходимость рендера кнопки
   * @param {array} filmsListLength - кол-во карточек
   */
  _checkNeedRenderShowMore(filmsListLength) {
    if (filmsListLength > FilmListLimit.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      this._deleteShowMoreButton();
    }
  }

  /**
   * callback для удаления попапа
   * @param {event} evt
   */
  _closePopup(evt) {
    if (evt.button === 0 || evt.keyCode === 27) {
      const popup = this._footer.querySelector(`.film-details`);
      this._body.classList.remove(`hide-overflow`);
      popup.remove();
      document.removeEventListener(`keydown`, this._closePopup);
      this._popupMode = PopupMode.CLOSED;
    }
  }

  /**
   * callback для отлавливания нужной карточки и рендера попапа на ее основании
   * @param {Event} evt
   */
  _filmListClickHandler(evt) {
    if (this._popupMode) {
      this._footer.querySelector(`.film-details`).remove();
    }
    this._popupMode = PopupMode.OPEN;
    evt.preventDefault();
    this._body.classList.add(`hide-overflow`);
    const cardId = evt.target.parentNode.id;
    for (let card of this._generatedFilmCards) {
      if (card.id === cardId) {
        const popupComponent = new PopupView(card);
        renderElement(this._footer, popupComponent.getElement(), RenderPosition.BEFOREEND);
        popupComponent.setCloseButtonClickHandler(this._closePopup);
        document.addEventListener(`keydown`, this._closePopup);
        break;
      }
    }
  }

  /**
   * функция рендера и сортировки массива, в зависимости от фильтра
   * @param {function} sort - метод сортировки (дефолтный: Array.from())
   * @param {array} filmList
   */
  _renderFilteredFilmCards(sort, filmList) {
    this._filteredFilmCards = sort(filmList);
    this._checkNeedRenderShowMore(this._filteredFilmCards.length);
    this._filmsList.querySelector(`.films-list__container`).innerHTML = ``;
    for (let i = 0; i < FilmListLimit.DEFAULT && i < this._filteredFilmCards.length; i++) {
      renderElement(this._filmsList.querySelector(`.films-list__container`), new FilmCardView(this._filteredFilmCards[i]).getElement(), RenderPosition.BEFOREEND);
    }
  }

  // функция для сброса сортировки при глобальной фильтрации
  _resetDefaultSorting() {
    document.querySelector(`.${SORT_BUTTON_CLASS}--active`).classList.remove(`${SORT_BUTTON_CLASS}--active`);
    document.querySelector(`.${SORT_BUTTON_CLASS}`).classList.add(`${SORT_BUTTON_CLASS}--active`);
  }

  /**
   * функция навешивания обработчика на кнопки фильтрации с последующим рендером отфильтрованных карточек
   * @param {Object} filter - кнопка фильтрации
   * @param {function} sortFunc - функция сортировки
   * @param {array} filmList
   */
  _setFilterSortFunction(filter, sortFunc, filmList) {
    filter.addEventListener(`click`, (evt) => {
      document.querySelector(`.${filter.classList.item(0)}--active`).classList.remove(`${filter.classList.item(0)}--active`);
      filter.classList.add(`${filter.classList.item(0)}--active`);
      evt.preventDefault();
      if (`${filter.classList.item(0)}` === NAV_BUTTON_CLASS) {
        this._previousFilter = sortFunc;
        this._resetDefaultSorting();
      }
      if (`${filter.classList.item(0)}` === SORT_BUTTON_CLASS) {
        filmList = this._previousFilter([...this._generatedFilmCards]);
      }
      this._renderFilteredFilmCards(sortFunc, filmList);
    });
  }

  /**
   * функция добавляющяя возможность фильтровать карточки путем изменения способа фильтрации из меню
   * @param {array} arr - Map фильтров
   * @param {array} filmList
   */
  _setFilters(arr, filmList) {
    for (let filter of arr) {
      this._setFilterSortFunction(filter[0], filter[1], filmList);
    }
  }
}
