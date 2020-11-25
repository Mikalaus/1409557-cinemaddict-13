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
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

/**
 * рендер основной разметки
 */
render(main, createFilmsTemplate(), `beforeend`);
const films = main.querySelector(`.films`);
render(header, createProfileLevelTemplate(sortHistory([...GENERATED_FILM_CARDS]).length), `beforeend`);
render(main, createMenuTemplate(filmCards), `afterbegin`);
render(films, createFilmListTemplate(GENERATED_FILM_CARDS), `afterbegin`);
render(films, createFilmListExtraTemplate(true), `beforeend`);
render(films, createFilmListExtraTemplate(), `beforeend`);
render(footer, createStatsTemplate(moviesAmount), `beforeend`);

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
    renderedCards += 5;
    indexElement += 5;
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
  if (document.querySelector(`.films-list__show-more`)) {
    document.querySelector(`.films-list__show-more`).remove();
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
  let indexElement = 5;

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
 * handler на карточку фильма
 * @param {number} i - номер рендерируемой карточки
 */
const filmCardClickHandler = (i) => {
  if (document.querySelector(`.film-details`)) {
    const popup = document.querySelector(`.film-details`);
    popup.remove();
  }

  render(footer, createFilmPopupTemplate(filmCards[i]), `afterend`);
  const closePopupButton = document.querySelector(`.film-details__close-btn`);
  closePopupButton.addEventListener(`click`, () => {
    const popup = document.querySelector(`.film-details`);
    popup.remove();
  });
};

/**
 * навешивание обработчиков на карточки для открытия попапа
 */
const addPopupOpen = () => {
  const filmCardList = filmsList.querySelectorAll(`.film-card`);
  for (let i = 0; i < filmCardList.length; i++) {
    filmCardList[i].addEventListener(`click`, () => filmCardClickHandler(i));
  }
};

/**
 * рендер карточек фильмов в различных блоках
 * @param {Object} filmList - передаваемый блок
 * @param {Number} limit - лимит карточек
 * @param {Array} arr - массив отображаемых карточек
 * @param {Number} indexElement - передаваемое значение индекса с которого должен начинаться рендер
 */
const renderFilmList = (filmList, limit, arr, indexElement = 0) => {
  for (let i = 0; i < limit && indexElement < arr.length; i++) {
    render(filmList.querySelector(`.films-list__container`), createFilmCardTemplate(arr[indexElement]), `beforeend`);
    indexElement++;
  }

  addPopupOpen();
};

/**
 * рендер изначальных фильмов в разметку
 */
renderFilmList(extraFilmsList[0], FilmListLimit.EXTRA, sortByRating([...GENERATED_FILM_CARDS]));
renderFilmList(extraFilmsList[1], FilmListLimit.EXTRA, sortByComments([...GENERATED_FILM_CARDS]));
renderFilmList(filmsList, FilmListLimit.DEFAULT, filmCards);

/**
 * функция рендера и сортировки массива, в зависимости от фильтра
 * @param {function} sort - метод сортировки (дефолтный: Array.from())
 * @param {array} filmList
 */
const renderFilteredFilmCards = (sort, filmList) => {
  filmCards = sort(filmList);
  checkNeedRenderShowMore(filmCards.length);
  setFilters(localFilters.values(), filmCards);
  filmsList.querySelector(`.films-list__container`).innerHTML = ``;
  for (let i = 0; i < FilmListLimit.DEFAULT && i < filmCards.length; i++) {
    render(filmsList.querySelector(`.films-list__container`), createFilmCardTemplate(filmCards[i]), `beforeend`);
  }
  addPopupOpen();
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
