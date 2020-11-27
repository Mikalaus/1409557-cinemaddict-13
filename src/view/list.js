import {createElement} from '../util';

const createFilmListTemplate = (films) => {

  return `
  <section class="films-list">
    <h2 class="films-list__title${films.length ? ` visually-hidden">All movies. Upcoming` : `">There are no movies in our database`}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};

export default class ListView {
  constructor(films) {
    this._element = films;
  }

  getTemplate() {
    return createFilmListTemplate(this._element);
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
