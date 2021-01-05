import AbstractView from './abstract';

const createFilmListTemplate = (films) => {

  return `
  <section class="films-list">
    <h2 class="films-list__title${films.length ? ` visually-hidden">All movies. Upcoming` : `">There are no movies in our database`}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};

export default class ListView extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
    this._filmsContainer = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _getContainer() {
    this._filmsContainer = this._element.querySelector(`.films-list__container`);
    return this._filmsContainer;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setContainerClickHandler(callback) {
    this._callback.click = callback;
    this._getContainer().addEventListener(`mousedown`, this._clickHandler);
  }

  getTemplate() {
    return createFilmListTemplate(this._films);
  }
}
