import {createMenuTemplate} from './view/menu';
import {createProfileLevelTemplate} from './view/profile-level';
import {createFilmCardTemplate} from './view/film-card';
import {createFilmListTemplate} from './view/film-list';
import {createFilmPopupTemplate} from './view/film-popup';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createStatsTemplate} from './view/stats';

const FilmListLimit = {
  DEFAULT: 5,
  EXTRA: 2
};

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

const films = document.createElement(`section`);
films.classList.add(`films`);
main.append(films);

render(header, createProfileLevelTemplate(), `beforeend`);
render(main, createMenuTemplate(), `afterbegin`);
render(films, createFilmListTemplate(), `afterbegin`);
render(films, createFilmListTemplate(true, true), `beforeend`);
render(films, createFilmListTemplate(true), `beforeend`);
render(footer, createStatsTemplate(), `beforeend`);

const filmsList = main.querySelector(`.films-list`);
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
const topRatedFilmsList = main.querySelector(`.films-list--top-rated`);
const mostCommentedFilmsList = main.querySelector(`.films-list--most-commented`);

/**
 * рендер карточек фильмов в различных блоках
 * @param {Object} filmList - передаваемый блок
 * @param {Number} limit - лимит карточек
 */
const renderFilmList = (filmList, limit) => {
  for (let i = 0; i < limit; i++) {
    render(filmList.querySelector(`.films-list__container`), createFilmCardTemplate(), `afterbegin`);
  }
};

renderFilmList(filmsList, FilmListLimit.DEFAULT);
renderFilmList(topRatedFilmsList, FilmListLimit.EXTRA);
renderFilmList(mostCommentedFilmsList, FilmListLimit.EXTRA);
