import {createElement} from '../util.js';

const createFilmsTemplate = () => {
  return `
  <section class="films"></section>
  `;
};

export default class FilmsView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsTemplate(this._element);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
