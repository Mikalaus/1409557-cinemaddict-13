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
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._element);
  }
}
