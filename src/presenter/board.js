import {
  FilmListLimit,
  TOP_RATED,
  MOST_COMMENTED,
  DEFAULT_RENDER_INDEX,
  PopupMode,
  FiltersList,
  API
} from '../const';

import {
  renderElement,
  RenderPosition
} from '../util';

import MenuPresenter from './menu';

import ListExtraView from '../view/list--extra';
import ProfileLevelView from '../view/profile-level';
import FilmCardView from '../view/card';
import ListView from '../view/list';
import PopupView from '../view/popup';
import ShowMoreButtonView from '../view/show-more-button';
import MoviesStatsView from '../view/movies-stats';
import FilmsView from '../view/films';

import FiltersModel from '../model/filters';


// реализовать датабиндинг между TopRated/MostCommented с основным filmlist-ом

export default class BoardPresenter {
  constructor(filmModel) {

    this._filmModel = filmModel;

    this._profileLevel = new ProfileLevelView(FiltersList.sortHistory(this._filmModel.getFilms().slice()).length);

    this._menuPresenter = new MenuPresenter(this._filmModel, this._renderFilteredFilmCards, this._profileLevel);

    this._menuPresenter.renderFilmList = this._menuPresenter.renderFilmList.bind(this);

    this._filtersModel = new FiltersModel(this._filmModel.getFilms().slice());

    /**
     * сохранение сгенерированного массива данных в отдельный блок, для сохранения информации при фильтрации
     */
    this._filteredFilmCards = this._filmModel.getFilms().slice();

    this._body = document.querySelector(`body`);
    this._header = document.querySelector(`.header`);
    this._main = document.querySelector(`.main`);
    this._footer = document.querySelector(`.footer`);

    this._filmList = new ListView(this._filmModel.getFilms().slice());
    this._topRated = new ListExtraView(TOP_RATED);
    this._mostCommented = new ListExtraView(MOST_COMMENTED);
    this._menu = this._menuPresenter.getMenu();

    this._films = null;

    this._filmsList = null;
    this._extraFilmsList = null;

    this._navFilters = null;
    this._sortFilters = null;

    this._popupMode = PopupMode.CLOSED;

    // переменная для сохранения в нее функции предыдущей фильтрации для локальных фильтров
    this._previousFilter = Array.from;

    this._filmListClickHandler = this._filmListClickHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderFilteredFilmCards = this._renderFilteredFilmCards.bind(this);

    this._updateWatchlist = this._updateWatchlist.bind(this);
    this._updateHistoryList = this._updateHistoryList.bind(this);
    this._updateFavourites = this._updateFavourites.bind(this);

    this._api = API;
  }

  init() {
    /**
     * рендер основной разметки
     */
    renderElement(this._main, new FilmsView().getElement(), RenderPosition.BEFOREEND);
    this._films = this._main.querySelector(`.films`);
    renderElement(this._header, this._profileLevel.getElement(FiltersList.sortHistory(this._filmModel.getFilms().slice()).length), RenderPosition.BEFOREEND);
    renderElement(this._films, this._filmList.getElement(), RenderPosition.AFTERBEGIN);

    this._filmsListContainers = this._main.querySelectorAll(`.films-list`);

    if (this._filmModel.getFilms().slice().length) {
      renderElement(this._films, this._topRated.getElement(), RenderPosition.BEFOREEND);
      renderElement(this._films, this._mostCommented.getElement(), RenderPosition.BEFOREEND);
    }

    renderElement(this._footer, new MoviesStatsView(`${this._filmModel.getFilms().length}`).getElement(), RenderPosition.BEFOREEND);

    this._filmsList = this._main.querySelector(`.films-list`);
    this._extraFilmsList = this._main.querySelectorAll(`.films-list--extra`);

    /**
     * рендер изначальных фильмов в разметку
     */
    this._renderFilmList(this._filmsList, FilmListLimit.DEFAULT, this._filteredFilmCards);

    this._filmList.setContainerClickHandler(this._filmListClickHandler);

    this._checkNeedRenderShowMore(this._filteredFilmCards.length);

    this._renderFilmList(this._extraFilmsList[1], FilmListLimit.EXTRA, FiltersList.sortByComments(this._filmModel.getFilms().slice()));
    this._renderFilmList(this._extraFilmsList[0], FilmListLimit.EXTRA, FiltersList.sortByRating(this._filmModel.getFilms().slice()));
    this._topRated.setContainerClickHandler(this._filmListClickHandler);
    this._mostCommented.setContainerClickHandler(this._filmListClickHandler);

    this._menuPresenter.init(this._filmsListContainers);
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
      renderElement(filmList.querySelector(`.films-list__container`), new FilmCardView(
          cardsList[indexElement],
          this._menu,
          this._updateWatchlist,
          this._updateHistoryList,
          this._updateFavourites).getElement(), RenderPosition.BEFOREEND);
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
   * callback для удаления попапа
   * @param {event} evt
   */
  _closePopup(evt) {
    if (evt.button === 0 || evt.keyCode === 27) { // заменить на значения
      const popup = this._footer.querySelector(`.film-details`);
      this._body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keyup`, this._popupComponent._commentDispatchHandler);
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
    const activeFilmCard = evt.target.closest(`.film-card`);
    if (activeFilmCard && evt.target.tagName !== `BUTTON`) {

      this._cardId = activeFilmCard.id;

      if (this._popupMode === true) {
        this._footer.querySelector(`.film-details`).remove();
      }
      this._popupMode = PopupMode.OPENED;
      evt.preventDefault();
      this._body.classList.add(`hide-overflow`);

      for (let card of this._filmModel.getFilms().slice()) {
        if (card.id === this._cardId) {
          this._popupComponent = new PopupView(
              activeFilmCard,
              card,
              this._menu,
              this._updateWatchlist,
              this._updateHistoryList,
              this._updateFavourites);
          renderElement(this._footer, this._popupComponent.getElement(), RenderPosition.BEFOREEND);
          this._popupComponent.setCloseButtonClickHandler(this._closePopup);
          document.addEventListener(`keydown`, this._closePopup);
          break;
        }
      }
    }
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
   * функция рендера и сортировки массива, в зависимости от фильтра
   * @param {function} sort - метод сортировки (дефолтный: Array.from())
   * @param {array} filmList
   */
  _renderFilteredFilmCards(sort, filmList) {
    this._filteredFilmCards = sort(filmList);
    this._checkNeedRenderShowMore(this._filteredFilmCards.length);
    this._filmsList.querySelector(`.films-list__container`).innerHTML = ``;
    for (let i = 0; i < FilmListLimit.DEFAULT && i < this._filteredFilmCards.length; i++) {
      renderElement(this._filmsList.querySelector(`.films-list__container`),
          new FilmCardView(
              this._filteredFilmCards[i],
              this._menu,
              this._updateWatchlist,
              this._updateHistoryList,
              this._updateFavourites
          ).getElement(), RenderPosition.BEFOREEND);
    }
  }

  _updateWatchlist(movieInfo) {
    this._menu._addWatchlistButton.innerHTML = FiltersList.sortWatchlist(this._filmModel.getFilms().slice()).length;
    if (this._menu._addWatchlistButton.parentNode.classList.contains(this._menu._activeClass)) {
      this._renderFilteredFilmCards(FiltersList.sortWatchlist, this._filteredFilmCards);
    }
    this._api.updateMovie(movieInfo);
  }

  _updateHistoryList(movieInfo) {
    this._menu._addHistoryListButton.innerHTML = FiltersList.sortHistory(this._filmModel.getFilms().slice()).length;
    this._profileLevel.setMoviesAmount(FiltersList.sortHistory(this._filmModel.getFilms().slice()).length);
    this._profileLevel.updateElement();
    this._menuPresenter._stats.updateData({rank: this._profileLevel.getRank()}, true);
    renderElement(this._header, this._profileLevel.getElement(), RenderPosition.BEFOREEND);
    if (this._menu._addHistoryListButton.parentNode.classList.contains(this._menu._activeClass)) {
      this._renderFilteredFilmCards(FiltersList.sortHistory, this._filteredFilmCards);
    }
    this._api.updateMovie(movieInfo);
  }

  _updateFavourites(movieInfo) {
    this._menu._addFavouriteListButton.innerHTML = FiltersList.sortFavourites(this._filmModel.getFilms().slice()).length;
    if (this._menu._addFavouriteListButton.parentNode.classList.contains(this._menu._activeClass)) {
      this._renderFilteredFilmCards(FiltersList.sortFavourites, this._filteredFilmCards);
    }
    this._api.updateMovie(movieInfo);
  }
}
