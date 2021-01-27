const AUTHORS = [`Sherlock`, `Troll228`, `Tenderlybae`, `Hesus`, `Topa`];

const getRandomElementFromArray = (filmsList) => {
  return filmsList[getRandomInteger(0, filmsList.length - 1)];
};

const createCommentMocInfo = () => {
  const comment = {
    author: getRandomElementFromArray(AUTHORS),
  };
  return comment;
};


const RenderPosition = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`
};

/**
 * случайное число
 * @param {number} min
 * @param {number} max
 * @return {number} rand
 */
const getRandomInteger = (min = 0, max = 1) => {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;

    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
  }
};

/**
 * функция рендера верстки в заданный элемент(контейнер)
 * @param {DomElement} container
 * @param {String} template - `<template>...</template>`
 * @param {String} place - beforeEnd/AfterEnd/etc
 */
const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const parseRuntimeToString = (duration) => {
  const minutes = duration % 60;
  const hours = (duration - minutes) / 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const capitalizeWord = (str) => {

  return str[0].toUpperCase() + str.slice(1);
};

export {
  getRandomInteger,
  renderTemplate,
  renderElement,
  createElement,
  RenderPosition,
  parseRuntimeToString,
  capitalizeWord,
  createCommentMocInfo
};
