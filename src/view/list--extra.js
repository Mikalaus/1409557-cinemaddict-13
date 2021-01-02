import AbstractView from './abstract';

const createFilmListExtraTemplate = (title) => {
  return `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};

export default class ListExtraView extends AbstractView {
  constructor(title) {
    super();
    this._element = title;
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
    return createFilmListExtraTemplate(this._element);
  }
}
