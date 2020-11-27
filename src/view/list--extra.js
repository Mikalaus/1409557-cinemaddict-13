import {createElement} from "../util";

const createFilmListExtraTemplate = (title) => {
  return `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};

export default class ListExtraView {
  constructor(title) {
    this._element = title;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._element);
  }

  getElement() {
    if (this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
