const RenderPosition = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`
};

const getRandomElementFromArray = (arr) => {
  return arr[getRandomInteger(0, arr.length - 1)];
};

const getRandomElementsFromArray = (arr) => {
  const randWords = new Set();

  while (randWords.size <= getRandomInteger(0, arr.length - 1)) {
    randWords.add(arr[getRandomInteger(0, arr.length - 1)]);
  }
  return Array.from(randWords);
};

/**
 * случайное число
 * @param {number} min
 * @param {number} max
 * @return {number} rand
 */
const getRandomInteger = (min = 0, max = 1) => {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
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


export {
  getRandomElementFromArray,
  getRandomInteger,
  getRandomElementsFromArray,
  renderTemplate,
  renderElement,
  createElement,
  RenderPosition
};
