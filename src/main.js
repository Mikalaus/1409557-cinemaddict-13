// сделать переключение сортировки на default при смене глобальной фильтрации
import {moviesAmount} from './mocs/rating-and-stats';
import {sortByDate, sortFavourites, sortByRating, sortHistory, sortWatchlist, sortByComments} from './mocs/filter';
import {createFilmListExtraTemplate} from './view/list--extra';
import {generateFilmCards} from './mocs/films';
import {createMenuTemplate} from './view/menu';
import {createProfileLevelTemplate} from './view/profile-level';
import {createFilmCardTemplate} from './view/card';
import {createFilmListTemplate} from './view/list';
import {createFilmPopupTemplate} from './view/popup';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createStatsTemplate} from './view/stats';
import {createFilmsTemplate} from './view/films';

const TOP_RATED = `Top Rated`;
const MOST_COMMENTED = `Most Commented`;

const SORT_BUTTON_CLASS = `sort__button`;
const NAV_BUTTON_CLASS = `main-navigation__item`;

/**
 * ограничение по максимальному кол-ву карточек из моков
 */
const FILMS_LIMIT = 16;

/**
 * массив с информацией о карточках с фильмами
 */
const GENERATED_FILM_CARDS = generateFilmCards(FILMS_LIMIT);

/**
 * ограничение на вывод карточек в каждом блоке
 * default - основной блок
 * extra - topRated/mostCommented
 */
const FilmListLimit = {
  DEFAULT: 5,
  EXTRA: 2
};

/**
 * сохранение сгенерированного массива данных в отдельный блок, для сохранения информации при фильтрации
 */
let filmCards = [...GENERATED_FILM_CARDS];

/**
 * функция рендера верстки в заданный элемент(контейнер)
 * @param {DomElement} container
 * @param {String} template - `<template>...</template>`
 * @param {String} place - beforeEnd/AfterEnd/etc
 */
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

/**
 * рендер основной разметки
 */
render(main, createFilmsTemplate());
const films = main.querySelector(`.films`);
render(header, createProfileLevelTemplate(sortHistory([...GENERATED_FILM_CARDS]).length));
render(main, createMenuTemplate(filmCards), `afterbegin`);
render(films, createFilmListTemplate(GENERATED_FILM_CARDS), `afterbegin`);
render(films, createFilmListExtraTemplate(TOP_RATED));
render(films, createFilmListExtraTemplate(MOST_COMMENTED));
render(footer, createStatsTemplate(moviesAmount));

const filmsList = main.querySelector(`.films-list`);
const extraFilmsList = main.querySelectorAll(`.films-list--extra`);

const navFilters = document.querySelectorAll(`.main-navigation__item`);
const sortFilters = document.querySelectorAll(`.sort__button`);

/**
 * функция для передачи параметров в handler
 * @param {number} renderedCards - кол-во уже отрендеренных карточек
 * @param {number} indexElement - индекс с которого нужна рендерить массив карточек
 * @return {function} () => {}
 */
const showMoreButtonClickHandler = (renderedCards, indexElement) => () => {
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
 * удаление showMoreButton
 */
const deleteShowMoreButton = () => {
  const showMoreButton = document.querySelector(`.films-list__show-more`);
  if (showMoreButton) {
    showMoreButton.remove();
  }
};

/**
 * рендер кнопки показа других объявлений, и навешивание на нее обработчика
 * @param {function} handler - handler для обработчика клика
 */
const renderShowMoreButton = (handler) => {

  deleteShowMoreButton();

  render(filmsList, createShowMoreButtonTemplate(), `beforeend`);

  const showMoreButton = document.querySelector(`.films-list__show-more`);
  /**
   * отслеживание уже отрендеренных карточек в основном блоке
   */
  let renderedCards = FilmListLimit.DEFAULT;

  /**
   * отслеживание индекса рендерируемых объектов, для последовательного
     вывода фильтрованных массивов с информацией о карточках
   */
  let indexElement = FilmListLimit.DEFAULT;

  showMoreButton.addEventListener(`click`, handler(renderedCards, indexElement));
};

/**
 * проверяет необходимость рендера кнопки
 * @param {array} filmsListLength - кол-во карточек
 */
const checkNeedRenderShowMore = (filmsListLength) => {
  if (filmsListLength > FilmListLimit.DEFAULT) {
    renderShowMoreButton(showMoreButtonClickHandler);
  } else {
    deleteShowMoreButton();
  }
};

checkNeedRenderShowMore(filmCards.length);

/**
 * рендер карточек фильмов в различных блоках
 * @param {Object} filmList - передаваемый блок
 * @param {Number} limit - лимит карточек
 * @param {Array} cardsList - массив отображаемых карточек
 * @param {Number} indexElement - передаваемое значение индекса с которого должен начинаться рендер
 */
const renderFilmList = (filmList, limit, cardsList, indexElement = 0) => {
  for (let i = 0; i < limit && indexElement < cardsList.length; i++) {
    render(filmList.querySelector(`.films-list__container`), createFilmCardTemplate(cardsList[indexElement]), `beforeend`);
    indexElement++;
  }
};

/**
 * рендер изначальных фильмов в разметку
 */
renderFilmList(extraFilmsList[0], FilmListLimit.EXTRA, sortByRating([...GENERATED_FILM_CARDS]));
renderFilmList(extraFilmsList[1], FilmListLimit.EXTRA, sortByComments([...GENERATED_FILM_CARDS]));
renderFilmList(filmsList, FilmListLimit.DEFAULT, filmCards);

/**
 * callback для удаления попапа
 * @param {event} evt
 */
const сlosePopup = (evt) => {
  if (evt.keyCode === 27 || evt.игеещт === 1) {
    const popup = footer.querySelector(`.film-details`);
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
  const cardId = evt.target.parentNode.id;
  for (let card of GENERATED_FILM_CARDS) {
    if (card.id === cardId) {
      render(footer, createFilmPopupTemplate(card));
      const closeButton = footer.querySelector(`.film-details__close-btn`);
      closeButton.addEventListener(`mousedown`, сlosePopup);
      document.addEventListener(`keydown`, сlosePopup);
      break;
    }
  }
};

filmsList.addEventListener(`click`, filmListClickHandler);

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
    render(filmsList.querySelector(`.films-list__container`), createFilmCardTemplate(filmCards[i]), `beforeend`);
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
let previousFilter = () => Array.from;

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
