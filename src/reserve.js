import {
  FilmListLimit,
  TOP_RATED,
  MOST_COMMENTED,
  SORT_BUTTON_CLASS,
  NAV_BUTTON_CLASS,
  FILMS_LIMIT,
  DEFAULT_RENDER_INDEX
} from './const';

import {
  renderElement,
  RenderPosition
} from './util';

import {
  sortByDate,
  sortFavourites,
  sortByRating,
  sortHistory,
  sortWatchlist,
  sortByComments
} from './mocs/filter';

import {moviesAmount} from './mocs/rating-and-stats';
import {generateFilmCards} from './mocs/films';
import ListExtraView from './view/list--extra';
import MenuView from './view/menu';
import ProfileLevelView from './view/profile-level';
import FilmCardView from './view/card';
import ListView from './view/list';
import PopupView from './view/popup';
import ShowMoreButtonView from './view/show-more-button';
import MoviesStatsView from './view/movies-stats';
import FilmsView from './view/films';

import BoardPresenter from './presenter/border';

const board = new BoardPresenter();

board.init();

/**
 * массив с информацией о карточках с фильмами
 */
const GENERATED_FILM_CARDS = generateFilmCards(FILMS_LIMIT);

/**
 * сохранение сгенерированного массива данных в отдельный блок, для сохранения информации при фильтрации
 */
let filmCards = [...GENERATED_FILM_CARDS];

const body = document.querySelector(`body`);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const FilmList = new ListView(GENERATED_FILM_CARDS);
const TopRated = new ListExtraView(TOP_RATED);
const MostCommented = new ListExtraView(MOST_COMMENTED);

/**
 * рендер основной разметки
 */
renderElement(main, new FilmsView().getElement(), RenderPosition.BEFOREEND);
const films = main.querySelector(`.films`);
renderElement(header, new ProfileLevelView(sortHistory([...GENERATED_FILM_CARDS]).length).getElement(), RenderPosition.BEFOREEND);
renderElement(main, new MenuView(filmCards).getElement(), RenderPosition.AFTERBEGIN);
renderElement(films, FilmList.getElement(), RenderPosition.AFTERBEGIN);
if (GENERATED_FILM_CARDS.length) {
  renderElement(films, TopRated.getElement(), RenderPosition.BEFOREEND);
  renderElement(films, MostCommented.getElement(), RenderPosition.BEFOREEND);
}
renderElement(footer, new MoviesStatsView(moviesAmount).getElement(), RenderPosition.BEFOREEND);

const filmsList = main.querySelector(`.films-list`);
const extraFilmsList = main.querySelectorAll(`.films-list--extra`);

const navFilters = document.querySelectorAll(`.main-navigation__item`);
const sortFilters = document.querySelectorAll(`.sort__button`);

/**
 * рендер карточек фильмов в различных блоках
 * @param {Object} filmList - передаваемый блок
 * @param {Number} limit - лимит карточек
 * @param {Array} cardsList - массив отображаемых карточек
 * @param {Number} indexElement - передаваемое значение индекса с которого должен начинаться рендер
 */
const renderFilmList = (filmList, limit, cardsList, indexElement = 0) => {
  for (let i = 0; i < limit && indexElement < cardsList.length; i++) {
    renderElement(filmList.querySelector(`.films-list__container`), new FilmCardView(cardsList[indexElement]).getElement(), RenderPosition.BEFOREEND);
    indexElement++;
  }
};

/**
 * удаление showMoreButton
 */
const deleteShowMoreButton = () => {
  const showMoreButton = document.querySelector(`.films-list__show-more`);
  if (showMoreButton) {
    showMoreButton.remove();
  }
};

const showMoreButtonClickHandlerWrapper = (renderedCards, indexElement) => () => {

  if (filmCards.length >= renderedCards) {
    renderFilmList(filmsList, FilmListLimit.DEFAULT, filmCards, indexElement);
    renderedCards += FilmListLimit.DEFAULT;
    indexElement += FilmListLimit.DEFAULT;
  }

  if (filmCards.length <= renderedCards) {
    document.querySelector(`.films-list__show-more`).remove();
    renderedCards = FilmListLimit.DEFAULT;
    indexElement = 0;
  }
};

/**
 * рендер кнопки показа других объявлений, и навешивание на нее обработчика
 * @param {function} handler - handler для обработчика клика
 */
const renderShowMoreButton = () => {

  deleteShowMoreButton();

  const showMore = new ShowMoreButtonView();

  renderElement(filmsList, showMore.getElement(), RenderPosition.BEFOREEND);

  showMore.setClickHandler(showMoreButtonClickHandlerWrapper(FilmListLimit.DEFAULT, DEFAULT_RENDER_INDEX));
};

/**
 * проверяет необходимость рендера кнопки
 * @param {array} filmsListLength - кол-во карточек
 */
const checkNeedRenderShowMore = (filmsListLength) => {
  if (filmsListLength > FilmListLimit.DEFAULT) {
    renderShowMoreButton();
  } else {
    deleteShowMoreButton();
  }
};

checkNeedRenderShowMore(filmCards.length);

/**
 * рендер изначальных фильмов в разметку
 */
renderFilmList(extraFilmsList[1], FilmListLimit.EXTRA, sortByComments([...GENERATED_FILM_CARDS]));
renderFilmList(extraFilmsList[0], FilmListLimit.EXTRA, sortByRating([...GENERATED_FILM_CARDS]));
renderFilmList(filmsList, FilmListLimit.DEFAULT, filmCards);

/**
 * callback для удаления попапа
 * @param {event} evt
 */
const сlosePopup = (evt) => {
  if (evt.button === 0 || evt.keyCode === 27) {
    const popup = footer.querySelector(`.film-details`);
    body.classList.toggle(`hide-overflow`);
    popup.remove();
    document.removeEventListener(`keydown`, сlosePopup);
  }
};

/**
 * callback для отлавливания нужной карточки и рендера попапа на ее основании
 * @param {Event} evt
 */
const filmListClickHandler = (evt) => {
  evt.preventDefault();
  body.classList.toggle(`hide-overflow`);
  const cardId = evt.target.parentNode.id;
  for (let card of GENERATED_FILM_CARDS) {
    if (card.id === cardId) {
      const popupComponent = new PopupView(card);
      renderElement(footer, popupComponent.getElement(), RenderPosition.BEFOREEND);
      popupComponent.setCloseButtonClickHandler(сlosePopup);
      document.addEventListener(`keydown`, сlosePopup);
      break;
    }
  }
};

FilmList.setContainerClickHandler(filmListClickHandler);
TopRated.setContainerClickHandler(filmListClickHandler);
MostCommented.setContainerClickHandler(filmListClickHandler);

/**
 * функция рендера и сортировки массива, в зависимости от фильтра
 * @param {function} sort - метод сортировки (дефолтный: Array.from())
 * @param {array} filmList
 */
const renderFilteredFilmCards = (sort, filmList) => {
  filmCards = sort(filmList);
  checkNeedRenderShowMore(filmCards.length);
  filmsList.querySelector(`.films-list__container`).innerHTML = ``;
  for (let i = 0; i < FilmListLimit.DEFAULT && i < filmCards.length; i++) {
    renderElement(filmsList.querySelector(`.films-list__container`), new FilmCardView(filmCards[i]).getElement(), RenderPosition.BEFOREEND);
  }
};

const globalFilters = new Map();
globalFilters.set(`all movies`, [navFilters[0], Array.from]);
globalFilters.set(`watchlist`, [navFilters[1], sortWatchlist]);
globalFilters.set(`history`, [navFilters[2], sortHistory]);
globalFilters.set(`favourites`, [navFilters[3], sortFavourites]);

const localFilters = new Map();
localFilters.set(`default`, [sortFilters[0], Array.from]);
localFilters.set(`date`, [sortFilters[1], sortByDate]);
localFilters.set(`rating`, [sortFilters[2], sortByRating]);

// переменная для сохранения в нее функции предыдущей фильтрации для локальных фильтров
let previousFilter = Array.from;

// функция для сброса сортировки при глобальной фильтрации
const resetDefaultSorting = () => {
  document.querySelector(`.${SORT_BUTTON_CLASS}--active`).classList.remove(`${SORT_BUTTON_CLASS}--active`);
  document.querySelector(`.${SORT_BUTTON_CLASS}`).classList.add(`${SORT_BUTTON_CLASS}--active`);
};

/**
 * функция навешивания обработчика на кнопки фильтрации с последующим рендером отфильтрованных карточек
 * @param {Object} filter - кнопка фильтрации
 * @param {function} sortFunc - функция сортировки
 * @param {array} filmList
 */
const setFilterSortFunction = (filter, sortFunc, filmList) => {
  filter.addEventListener(`click`, (evt) => {
    document.querySelector(`.${filter.classList.item(0)}--active`).classList.remove(`${filter.classList.item(0)}--active`);
    filter.classList.add(`${filter.classList.item(0)}--active`);
    evt.preventDefault();
    if (`${filter.classList.item(0)}` === NAV_BUTTON_CLASS) {
      previousFilter = sortFunc;
      resetDefaultSorting();
    }
    if (`${filter.classList.item(0)}` === SORT_BUTTON_CLASS) {
      filmList = previousFilter([...GENERATED_FILM_CARDS]);
    }
    renderFilteredFilmCards(sortFunc, filmList);
  });
};

/**
 * функция добавляющяя возможность фильтровать карточки путем изменения способа фильтрации из меню
 * @param {array} arr - Map фильтров
 * @param {array} filmList
 */
const setFilters = (arr, filmList) => {
  for (let filter of arr) {
    setFilterSortFunction(filter[0], filter[1], filmList);
  }
};

/**
 * добавление функционала фильтрации
 */
setFilters(globalFilters.values(), [...GENERATED_FILM_CARDS]);
setFilters(localFilters.values(), filmCards);
