import {sortByDate, sortFavourites, sortByRating, sortHistory, sortWatchlist, sortByComments} from './mocs/filter.js';
import {createFilmListExtraTemplate} from './view/film-list--extra.js';
import {generateFilmCard} from './mocs/films.js';
import {createMenuTemplate} from './view/menu';
import {createProfileLevelTemplate} from './view/profile-level';
import {createFilmCardTemplate} from './view/film-card';
import {createFilmListTemplate} from './view/film-list';
import {createFilmPopupTemplate} from './view/film-popup.js';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createStatsTemplate} from './view/stats';
import {createFilmsTemplate} from './view/films';

/**
 * массив с информацией о карточках с фильмами
 */
const GENERATED_FILM_CARDS = [];

/**
 * ограничение по максимальному кол-ву карточек из моков
 */
const FILMS_LIMIT = 17;

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
 * генерация моков
 */
for (let i = 0; i < FILMS_LIMIT; i++) {
  GENERATED_FILM_CARDS.push(generateFilmCard());
}

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
render(header, createProfileLevelTemplate(), `beforeend`);
render(main, createMenuTemplate(filmCards), `afterbegin`);
render(films, createFilmListTemplate(GENERATED_FILM_CARDS), `afterbegin`);
render(films, createFilmListExtraTemplate(true), `beforeend`);
render(films, createFilmListExtraTemplate(), `beforeend`);
render(footer, createStatsTemplate(), `beforeend`);

/**
 * рендер кнопки показа других объявлений, и навешивание на нее обработчика
 */
const renderShowMoreButton = () => {

  if (!document.querySelector(`.films-list__show-more`)) {
    render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
  }

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

  const showMoreButtonHandler = () => {
    if (filmCards.length >= renderedCards) {
      renderFilmList(filmsList, FilmListLimit.DEFAULT, filmCards, indexElement);
      renderedCards += 5;
      indexElement += 5;
    }

    if (filmCards.length <= renderedCards) {
      showMoreButton.remove();
      renderedCards = FilmListLimit.DEFAULT;
      indexElement = 0;
    }
  };

  showMoreButton.addEventListener(`click`, showMoreButtonHandler);
};


const filmsList = main.querySelector(`.films-list`);
const extraFilmsList = main.querySelectorAll(`.films-list--extra`);
if (filmCards.length > FilmListLimit.DEFAULT) {
  renderShowMoreButton();
}

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
};

/**
 * рендер изначальных фильмов в разметку
 */
renderFilmList(extraFilmsList[0], FilmListLimit.EXTRA, sortByRating([...GENERATED_FILM_CARDS]));
renderFilmList(extraFilmsList[1], FilmListLimit.EXTRA, sortByComments([...GENERATED_FILM_CARDS]));
renderFilmList(filmsList, FilmListLimit.DEFAULT, filmCards);

const filmCard = document.querySelector(`.film-card`);

/**
 * навешивание обработчика на кнопку закрытия попапа
 */
filmCard.addEventListener(`click`, () => {
  render(footer, createFilmPopupTemplate(GENERATED_FILM_CARDS[0]), `afterend`);
  const closePopupButton = document.querySelector(`.film-details__close-btn`);
  closePopupButton.addEventListener(`click`, () => {
    const popup = document.querySelector(`.film-details`);
    popup.remove();
  });
});

const navFilters = document.querySelectorAll(`.main-navigation__item`);
const sortFilters = document.querySelectorAll(`.sort__button`);

/**
 * функция рендера и сортировки массива, в зависимости от фильтра
 * @param {function} sort - метод сортировки (дефолтный: Array.from())
 */
const renderFilteredFilmCards = (sort) => {
  filmCards = sort([...GENERATED_FILM_CARDS]);
  if (filmCards.length > FilmListLimit.DEFAULT) {
    renderShowMoreButton();
  }
  filmsList.querySelector(`.films-list__container`).innerHTML = ``;
  for (let i = 0; i < FilmListLimit.DEFAULT && i < filmCards.length; i++) {
    render(filmsList.querySelector(`.films-list__container`), createFilmCardTemplate(filmCards[i]), `beforeend`);
  }
};

const filters = new Map();
filters.set(`watchlist`, [navFilters[1], sortWatchlist]);
filters.set(`history`, [navFilters[2], sortHistory]);
filters.set(`favourites`, [navFilters[3], sortFavourites]);
filters.set(`default`, [sortFilters[0], Array.from]);
filters.set(`date`, [sortFilters[1], sortByDate]);
filters.set(`rating`, [sortFilters[2], sortByRating]);

const setFilterSortFunction = (filter, sortFunc) => {
  filter.addEventListener(`click`, () => {
    renderFilteredFilmCards(sortFunc);
  });
};

const setFilters = (arr) => {
  for (let filter of arr) {
    setFilterSortFunction(filter[0], filter[1]);
  }
};

setFilters(filters.values());
